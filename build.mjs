// Static site builder for geteduvia.com.
//   /                      landing (Ukrainian), templates/landing.html + content/landing.<lang>.json
//   /privacy/ /terms/ ...  legal documents, content/*.md rendered into the legal shell
// Routes mirror the URLs referenced inside the legal documents themselves:
//   /privacy/  /privacy/de/  /terms/  /terms/de/  /impressum/  /third-party-notices/  /contact/  /contact/de/
//   /delete-account/  /delete-account/de/  and 404.html
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(ROOT, 'content');
const TEMPLATES = path.join(ROOT, 'templates');
const DIST = path.join(ROOT, 'dist');

// breaks:true keeps soft line breaks (postal address blocks) as <br>; paragraphs
// in the source documents are always separated by blank lines, so this is safe.
marked.setOptions({ gfm: true, breaks: true });

const SITE = 'https://geteduvia.com';

// The Meta Pixel ID. While it is '' the site sets no cookies and loads nothing from third
// parties: no consent banner, settings sheet, cookies.js, footer "Cookies" link or Meta code is
// emitted. With an ID set, the banner appears and the pixel script is injected only after the
// visitor accepts analytics (assets/cookies.js). The Privacy Policy (Section 3.11, Version 1.4)
// describes the pixel; keep it in step with cookies.js when anything here changes.
const META_PIXEL_ID = '4514933622077737';
const CONSENT_ENABLED = META_PIXEL_ID !== '';
// Bump when what we ask consent for changes: every stored choice is then asked again.
const CONSENT_VERSION = 1;

// Prices and trial in one place. The annual plan shows its yearly total as the price (PAngV) and
// the per-month equivalent (89,99 / 12) under it; strings reference them as {annualTotal},
// {perMonth}, {save} and {trialDays}.
const PRICES = { monthly: 9.99, annual: 89.99 };
const TRIAL_DAYS = 7;
// Saving of the annual plan against twelve monthly payments, for the "−25%" badge.
const SAVE_PCT = Math.round((1 - PRICES.annual / (PRICES.monthly * 12)) * 100);

// "What Pro unlocks": groups of rows, each the Free cell of that row (Pro always has it).
// F = included, - = not included, I = only in the intro conversation. Labels: pricing.g<n>, pricing.r<n>.
const COMPARE = [
  ['g1', [['r1', 'F'], ['r2', '-'], ['r3', '-'], ['r4', '-'], ['r5', '-']]],
  ['g2', [['r6', 'I'], ['r7', 'I'], ['r8', 'I']]],
  ['g3', [['r9', 'F'], ['r10', 'F'], ['r11', '-'], ['r12', '-']]],
  ['g4', [['r13', 'F'], ['r14', '-']]],
];
const CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

function compareTable(p) {
  const yes = (cls) => `<span class="cmp-ck ${cls}">${CHECK}<span class="sr">${esc(p.yes)}</span></span>`;
  const cell = (v) => (v === 'F' ? yes('free') : v === 'I' ? `<span class="cmp-intro">${esc(p.intro)}</span>` : `<span class="cmp-no" aria-hidden="true"></span><span class="sr">${esc(p.no)}</span>`);
  const body = COMPARE.map(([g, rows]) => `<tbody><tr class="cmp-g"><th colspan="3" scope="rowgroup">${esc(p[g])}</th></tr>${rows
    .map(([r, v]) => `<tr><th scope="row">${esc(p[r])}</th><td>${cell(v)}</td><td>${yes('pro')}</td></tr>`)
    .join('')}</tbody>`).join('');
  return `<div class="cmp">
<table><colgroup><col><col class="c"><col class="c"></colgroup>
<thead><tr><th scope="col"><h3 class="cmp-title">${esc(p.cmpTitle)}</h3></th><th scope="col"><span class="cmp-free">Free</span></th><th scope="col"><span class="cmp-pro">Pro</span></th></tr></thead>
${body}
</table>
</div>`;
}

const LINKS = {
  appStore: 'https://apps.apple.com/app/id6801907415',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.app.swarum.eduvia',
  threads: 'https://www.threads.com/@thevaltorna',
  mail: 'thevaltorna@gmail.com',
};

// Landing languages, in switcher order. A language is built only when content/landing.<code>.json
// exists; the switcher lists only built languages, so it never links to a missing page.
// The first entry is served at /. `legal` picks the EN or DE legal pages for its footer links.
const LANGS = [
  { code: 'uk', html: 'uk', chip: 'UA', name: 'Українська', og: 'uk_UA', legal: 'en' },
  { code: 'en', html: 'en', chip: 'EN', name: 'English', og: 'en_US', legal: 'en' },
  { code: 'de', html: 'de', chip: 'DE', name: 'Deutsch', og: 'de_DE', legal: 'de' },
  { code: 'ru', html: 'ru', chip: 'RU', name: 'Русский', og: 'ru_RU', legal: 'en' },
  { code: 'tr', html: 'tr', chip: 'TR', name: 'Türkçe', og: 'tr_TR', legal: 'en' },
  { code: 'it', html: 'it', chip: 'IT', name: 'Italiano', og: 'it_IT', legal: 'en' },
  { code: 'sq', html: 'sq', chip: 'SQ', name: 'Shqip', og: 'sq_AL', legal: 'en' },
  { code: 'pl', html: 'pl', chip: 'PL', name: 'Polski', og: 'pl_PL', legal: 'en' },
  { code: 'ro', html: 'ro', chip: 'RO', name: 'Română', og: 'ro_RO', legal: 'en' },
  { code: 'sr', html: 'sr-Latn', chip: 'SR', name: 'Srpski', og: 'sr_RS', legal: 'en' },
];
const langPath = (code) => (code === LANGS[0].code ? '/' : `/${code}/`);

const pages = [
  {
    src: 'privacy.en.md',
    out: 'privacy/index.html',
    lang: 'en',
    kind: 'doc',
    summary: true,
    nav: 'privacy',
    sub: 'How Eduvia handles your personal data, in plain language.',
    description: 'Privacy Policy of Eduvia, the AI voice tutor app for practicing spoken German.',
    switch: { en: '/privacy/', de: '/privacy/de/' },
  },
  {
    src: 'privacy.de.md',
    out: 'privacy/de/index.html',
    lang: 'de',
    kind: 'doc',
    summary: true,
    nav: 'privacy',
    sub: 'Wie Eduvia mit Ihren personenbezogenen Daten umgeht, in verständlicher Sprache.',
    description: 'Datenschutzerklärung von Eduvia, der App mit KI-Sprachtutor zum Üben von gesprochenem Deutsch.',
    switch: { en: '/privacy/', de: '/privacy/de/' },
  },
  {
    src: 'terms.en.md',
    out: 'terms/index.html',
    lang: 'en',
    kind: 'doc',
    nav: 'terms',
    description: 'Terms of Use (EULA) of Eduvia, the AI voice tutor app for practicing spoken German.',
    switch: { en: '/terms/', de: '/terms/de/' },
  },
  {
    src: 'terms.de.md',
    out: 'terms/de/index.html',
    lang: 'de',
    kind: 'doc',
    nav: 'terms',
    description: 'Nutzungsbedingungen (EULA) von Eduvia, der App mit KI-Sprachtutor zum Üben von gesprochenem Deutsch.',
    switch: { en: '/terms/', de: '/terms/de/' },
  },
  {
    // Google Play requires a URL where a user can request account deletion WITHOUT installing the
    // app, alongside the in-app path. The Data safety form has a field for it and the listing
    // cannot be submitted without one, so this route is a release blocker rather than a nicety.
    src: 'delete-account.en.md',
    out: 'delete-account/index.html',
    lang: 'en',
    kind: 'cards',
    nav: 'delete',
    sub: 'Two ways: in the App, immediately, or by email if you no longer have it.',
    description: 'How to delete your Eduvia account and everything stored with it, in the app or by email.',
    switch: { en: '/delete-account/', de: '/delete-account/de/' },
  },
  {
    src: 'delete-account.de.md',
    out: 'delete-account/de/index.html',
    lang: 'de',
    kind: 'cards',
    nav: 'delete',
    sub: 'Zwei Wege: in der App, sofort, oder per E-Mail, wenn Sie die App nicht mehr haben.',
    description: 'So löschen Sie Ihr Eduvia-Konto und alle damit gespeicherten Daten, in der App oder per E-Mail.',
    switch: { en: '/delete-account/', de: '/delete-account/de/' },
  },
  {
    // The Impressum's second fast contact channel next to the email address (§ 5 DDG). Posts to
    // POST /public/contact on the API; what it stores is in the Privacy Policy, Section 3.10.
    src: 'contact.en.md',
    out: 'contact/index.html',
    lang: 'en',
    kind: 'contact',
    nav: 'contact',
    sub: 'Questions, bugs, ideas. Write by email or through the form, and we reply to the address you give.',
    pill: 'Form or email · same inbox',
    description: 'Contact Eduvia by email or through a short form.',
    switch: { en: '/contact/', de: '/contact/de/' },
  },
  {
    src: 'contact.de.md',
    out: 'contact/de/index.html',
    lang: 'de',
    kind: 'contact',
    nav: 'contact',
    sub: 'Fragen, Fehler, Ideen. Schreiben Sie per E-Mail oder über das Formular, wir antworten an die Adresse, die Sie angeben.',
    pill: 'Formular oder E-Mail · dasselbe Postfach',
    description: 'Kontakt zu Eduvia per E-Mail oder über ein kurzes Formular.',
    switch: { en: '/contact/', de: '/contact/de/' },
  },
  {
    src: 'impressum.md',
    out: 'impressum/index.html',
    lang: 'de',
    kind: 'impressum',
    nav: 'impressum',
    description: 'Impressum der App Eduvia und der Website geteduvia.com.',
  },
  {
    src: 'third-party-notices.md',
    out: 'third-party-notices/index.html',
    lang: 'en',
    kind: 'doc',
    nav: 'notices',
    description: 'Open-source components used by the Eduvia app and its backend service.',
  },
];

// Shell strings of the legal pages. The documents themselves come from content/*.md.
const UI = {
  en: {
    product: 'Product', privacy: 'Privacy', terms: 'Terms', contact: 'Contact', delete: 'Delete account',
    impressum: 'Impressum', notices: 'Third-Party Notices', getApp: 'Get the app', legal: 'Legal',
    contents: 'Contents', sections: (n) => `${n} sections`, minRead: (n) => `${n} min read`, min: (n) => `${n} min`,
    other: '↗ Deutsche Fassung', tagline: 'Practice speaking German with an AI voice tutor.',
    menuOpen: 'Open menu', menuClose: 'Close menu', menu: 'Menu', skip: 'Skip to content', home: 'Eduvia, home',
    appleAlt: 'Download on the App Store', googleAlt: 'Get it on Google Play', legalNav: 'Legal documents and contact', mainNav: 'Main',
    country: 'Germany', writeToUs: 'Write to us', deleteHint: ['Want to delete your account? ', 'Use this page', ', it is faster.'],
    table: 'Table, scrolls sideways', langSwitch: 'Language',
  },
  de: {
    product: 'Produkt', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', contact: 'Kontakt', delete: 'Konto löschen',
    impressum: 'Impressum', notices: 'Third-Party Notices', getApp: 'App laden', legal: 'Rechtliches',
    contents: 'Inhalt', sections: (n) => `${n} Abschnitte`, minRead: (n) => `${n} Min. Lesezeit`, min: (n) => `${n} Min.`,
    other: '↗ English version', tagline: 'Gesprochenes Deutsch üben, mit einem KI-Sprachtutor.',
    menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', menu: 'Menü', skip: 'Zum Inhalt springen', home: 'Eduvia, Startseite',
    appleAlt: 'Laden im App Store', googleAlt: 'Jetzt bei Google Play', legalNav: 'Rechtliches und Kontakt', mainNav: 'Hauptnavigation',
    country: 'Deutschland', writeToUs: 'Schreiben Sie uns', deleteHint: ['Sie möchten Ihr Konto löschen? ', 'Diese Seite', ' ist schneller.'],
    table: 'Tabelle, seitlich scrollbar', langSwitch: 'Sprache',
  },
};

// Legal routes per language; the Impressum and the notices exist once.
const ROUTES = {
  en: { privacy: '/privacy/', terms: '/terms/', contact: '/contact/', delete: '/delete-account/', impressum: '/impressum/', notices: '/third-party-notices/' },
  de: { privacy: '/privacy/de/', terms: '/terms/de/', contact: '/contact/de/', delete: '/delete-account/de/', impressum: '/impressum/', notices: '/third-party-notices/' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const words = (s) => stripTags(s).split(/\s+/).filter(Boolean).length;
const readMin = (s) => Math.max(1, Math.round(words(s) / 200));

// "9,99 €" everywhere except English ("€9.99").
function formatPrice(value, code) {
  const n = value.toFixed(2);
  return code === 'en' ? `€${n}` : `${n.replace('.', ',')} €`;
}
const round2 = (v) => Math.round(v * 100) / 100;

// Official store badges, self-hosted in assets/img/badges/ (one file per page language; sq and
// sr use the English Apple badge, sr also the English Google one, since Google's is Cyrillic).
// The Google PNGs are trimmed to the badge edge so both render at the same visible height.
const badges = (prefix, code) => ({
  badgeApple: `${prefix}assets/img/badges/apple-${code}.svg`,
  badgeGoogle: `${prefix}assets/img/badges/google-${code}.png`,
});

// ---------- tiny template engine: {{key.path}} from the dictionary, {{$.name}} from the
// build context, {{> partial}} from templates/partials. {name} inside a dictionary string is
// filled from `vars` (prices, trial length). A missing key fails the build. ----------
function lookup(dict, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}
function fill(tpl, dict, ctx, partials, vars = {}) {
  let out = tpl;
  for (let i = 0; i < 5 && /\{\{>/.test(out); i++) {
    out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (m, name) => {
      if (!(name in partials)) throw new Error(`unknown partial ${m}`);
      return partials[name].trim();
    });
  }
  return out.replace(/\{\{(\$\.)?([\w.]+)\}\}/g, (m, isCtx, key) => {
    let v = isCtx ? ctx[key] : lookup(dict, key);
    if (v === undefined || (v !== null && typeof v === 'object')) throw new Error(`missing template value ${m}`);
    if (!isCtx) v = v.replace(/\{(\w+)\}/g, (p, name) => (name in vars ? vars[name] : p));
    return v;
  });
}

async function loadPartials() {
  const dir = path.join(TEMPLATES, 'partials');
  const partials = {};
  for (const f of await readdir(dir)) {
    if (f.endsWith('.html')) partials[f.slice(0, -5)] = await readFile(path.join(dir, f), 'utf8');
  }
  return partials;
}

async function loadDict(code) {
  const file = path.join(CONTENT, `landing.${code}.json`);
  return existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : null;
}

// ---------- shared chrome ----------
function head({ lang, title, description, canonicalPath, prefix, og, fonts, alternates = [], langRedirect = '' }) {
  const asset = (p) => `${prefix}assets/${p}`;
  const ogTags = og
    ? `
<meta property="og:type" content="website">
<meta property="og:site_name" content="Eduvia">
<meta property="og:url" content="${SITE}${canonicalPath}">
<meta property="og:title" content="${esc(og.title)}">
<meta property="og:description" content="${esc(og.description)}">
<meta property="og:locale" content="${og.locale}">
<meta property="og:image" content="${og.image || `${SITE}/assets/img/uk/screen-quick-fix.jpg`}">
<meta property="og:image:width" content="600">
<meta property="og:image:height" content="1304">
<meta property="og:image:alt" content="${esc(og.imageAlt)}">
<meta name="twitter:card" content="summary">`
    : '';
  const alt = alternates.map((a) => `\n<link rel="alternate" hreflang="${a.hreflang}" href="${SITE}${a.path}">`).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${langRedirect}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${canonicalPath}">${alt}${ogTags}
<meta name="theme-color" content="#E4B7F3">
<link rel="icon" type="image/png" href="${asset('img/favicon.png')}">
<link rel="apple-touch-icon" href="${asset('img/apple-touch-icon.png')}">
${fonts.map((f) => `<link rel="preload" href="${asset(`fonts/manrope-${f}.woff2`)}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="${asset('style.css')}">
<script>document.documentElement.classList.add('js')</script>
<script src="${asset('site.js')}" defer></script>${CONSENT_ENABLED ? `\n<script src="${asset('cookies.js')}" data-pixel="${META_PIXEL_ID}" data-version="${CONSENT_VERSION}" defer></script>` : ''}
</head>`;
}

// Root page only: send a first-time visitor to the landing in their browser language. Nothing is
// stored on the device (no consent needed): a visitor who came from another page of this site (e.g.
// chose UA in the switcher) stays here, a language we don't have goes to English; crawlers are never
// redirected so / stays indexable; the query (?ct=…) travels along so the campaign survives.
function langRedirectScript(codes) {
  const map = JSON.stringify(Object.fromEntries(codes.map((c) => [c, c === 'uk' ? '' : `${c}/`])));
  return `\n<script>(function(){try{if(/bot|crawl|spider|slurp|lighthouse|facebookexternalhit|preview/i.test(navigator.userAgent))return;var r=document.referrer;if(r&&r.indexOf(location.host)>-1)return;var m=${map},l=navigator.languages||[navigator.language];for(var i=0;i<l.length;i++){var c=String(l[i]||'').toLowerCase().split('-')[0];if(c in m){if(m[c])location.replace(m[c]+location.search+location.hash);return}}if(m.en)location.replace(m.en+location.search+location.hash)}catch(e){}})();</script>`;
}

const CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const BURGER_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 8h14M5 12h14M5 16h9"/></svg>';
const CLOSE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Full-screen menu used below 768px on every page.
function menuHtml({ logoSrc, homeHref, homeLabel, label, closeLabel, items, langs, langLabel, stores, small }) {
  const langBlock = langs && langs.length > 1
    ? `<div class="menu-langs"><div>${esc(langLabel)}</div><nav aria-label="${esc(langLabel)}">${langs
        .map((l) => `<a href="${l.href}" hreflang="${l.hreflang}" lang="${l.hreflang}" title="${esc(l.name)}"${l.current ? ' aria-current="page"' : ''}>${l.chip}</a>`)
        .join('')}</nav></div>`
    : '';
  return `<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(label)}" hidden>
<div class="menu-top"><a href="${homeHref}" aria-label="${esc(homeLabel)}"><img src="${logoSrc}" alt="eduvia" width="720" height="140"></a><button class="menu-close" type="button" aria-label="${esc(closeLabel)}" data-menu-close>${CLOSE_ICON}</button></div>
<nav class="menu-list" aria-label="${esc(label)}">${items.map((i) => `<a href="${i.href}">${esc(i.label)}${CHEVRON}</a>`).join('')}</nav>
${langBlock}
<div class="menu-foot"><div class="menu-deco" aria-hidden="true"></div>${stores}<div class="menu-small">${small.join('')}</div></div>
</div>`;
}

// The one sticky header of every page. `extra` is the language control (landing dropdown or the
// EN/DE switch of a legal page); site.js adds .scrolled once the page leaves the top.
function siteHeader({ homeHref, homeLabel, logoSrc, navLabel, nav, extra = '', cta, menuOpenLabel }) {
  return `<header class="site-head" data-head>
<div class="sh-in">
<a class="logo" href="${homeHref}" aria-label="${esc(homeLabel)}"><img src="${logoSrc}" alt="eduvia" width="720" height="140"></a>
<nav class="sh-nav" aria-label="${esc(navLabel)}">${nav.map((n) => `<a href="${n.href}"${n.current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}</nav>
${extra}
<a class="btn-dark sh-cta" href="${cta.href}">${esc(cta.label)}</a>
<button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${esc(menuOpenLabel)}" data-menu-open>${BURGER_ICON}</button>
</div>
</header>`;
}

// Trademark credit for the store badges (Apple App Store Marketing Guidelines and Google Play
// badge guidelines both require it where the badges appear). Kept in English on every page.
const TM_CREDIT = 'Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries and regions. App Store is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.';

// The one footer of every page (landing in all languages, legal pages, 404).
function siteFooter({ logoSrc, tagline, navLabel, links, cookies, mail, langs, langLabel }) {
  const langNav = langs && langs.length > 1
    ? `<nav class="sf-langs" aria-label="${esc(langLabel)}">${langs
        .map((l) => `<a href="${l.href}" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.current ? ' aria-current="page"' : ''}>${esc(l.name)}</a>`)
        .join('')}</nav>`
    : '';
  return `<footer class="site-foot">
<div class="sf-grid">
<div class="sf-brand"><img src="${logoSrc}" alt="eduvia" width="720" height="140"><p>${esc(tagline)}</p><a class="sf-mail" href="mailto:${mail}">${mail}</a></div>
<nav class="sf-links" aria-label="${esc(navLabel)}">${links
    .map((l) => `<a href="${l.href}"${l.current ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`)
    .join('')}${cookies}</nav>
</div>
<div class="sf-bottom"><span>© 2026 Eduvia</span>${langNav}</div>
<p class="sf-tm">${TM_CREDIT}</p>
</footer>`;
}

// Consent banner + settings sheet; only emitted when META_PIXEL_ID is set. `c` = dictionary.cookies.
// "Accept all" and "Necessary only" share one style on purpose: a reject option that is smaller,
// paler or one layer deeper is the pattern the DSK, the EDPB cookie-banner report (2023) and German
// courts treat as nudging, and then the consent is not freely given.
function cookieMarkup(c, privacyHref) {
  if (!CONSENT_ENABLED) return '';
  return `<div class="ck" id="ck" role="region" aria-labelledby="ck-title" hidden>
<h2 id="ck-title"><i aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-5-4 4 4 0 0 1-4-5z"/><circle cx="8.5" cy="11.5" r="1" fill="#0B0A0B"/><circle cx="12" cy="16" r="1" fill="#0B0A0B"/><circle cx="15.5" cy="13" r="1" fill="#0B0A0B"/></svg></i>${c.title}</h2>
<p>${c.text} <a href="${privacyHref}">${c.policy}</a></p>
<div class="ck-btns"><button type="button" data-ck="all">${c.acceptAll}</button><button type="button" data-ck="necessary">${c.necessaryOnly}</button></div>
<button type="button" class="ck-link" data-ck="settings">${c.configure}</button>
</div>
<div class="ck-set" id="ck-set" role="dialog" aria-modal="true" aria-labelledby="ck-set-title" hidden>
<div class="ck-panel">
<div class="ck-head"><h2 id="ck-set-title">${c.settingsTitle}</h2><button type="button" class="menu-close" data-ck="close" aria-label="${esc(c.close)}">${CLOSE_ICON}</button></div>
<div class="ck-row"><div><b id="ck-n">${c.necessary}</b><p>${c.necessaryDesc}</p></div><input class="sw" type="checkbox" role="switch" checked disabled aria-labelledby="ck-n"></div>
<div class="ck-row"><div><b id="ck-a">${c.analytics}</b><p>${c.analyticsDesc}</p></div><input class="sw" type="checkbox" role="switch" id="ck-analytics" aria-labelledby="ck-a"></div>
<div class="ck-btns"><button type="button" data-ck="save">${c.save}</button><button type="button" data-ck="all">${c.acceptAll}</button></div>
</div>
</div>`;
}
const cookiesButton = (label) => (CONSENT_ENABLED ? `<button type="button" data-ck="settings">${esc(label)}</button>` : '');

// ---------- landing ----------
let BUILT_LANGS = [];

async function buildLanding(partials) {
  const tpl = await readFile(path.join(TEMPLATES, 'landing.html'), 'utf8');
  const dicts = {};
  const keysOf = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keysOf(v, `${p}${k}.`) : [`${p}${k}`]));
  const baseKeys = keysOf((await loadDict(LANGS[0].code)) || {});
  for (const l of LANGS) {
    const d = await loadDict(l.code);
    if (!d) {
      console.log(`skip landing ${l.code}: no content/landing.${l.code}.json`);
      continue;
    }
    const have = new Set(keysOf(d));
    const missing = baseKeys.filter((k) => !have.has(k));
    if (missing.length) {
      // A half-translated page is worse than none: skip it, so the switcher never links to it.
      console.log(`skip landing ${l.code}: ${missing.length} keys missing, e.g. ${missing.slice(0, 3).join(', ')}`);
      continue;
    }
    dicts[l.code] = d;
  }
  BUILT_LANGS = LANGS.filter((l) => dicts[l.code]);
  if (!BUILT_LANGS.length || BUILT_LANGS[0].code !== LANGS[0].code) throw new Error(`content/landing.${LANGS[0].code}.json is required`);
  const alternates = [
    ...BUILT_LANGS.map((l) => ({ hreflang: l.html, path: langPath(l.code) })),
    { hreflang: 'x-default', path: '/' },
  ];

  for (const lang of BUILT_LANGS) {
    const t = dicts[lang.code];
    const canonicalPath = langPath(lang.code);
    const out = canonicalPath === '/' ? 'index.html' : `${lang.code}/index.html`;
    const prefix = canonicalPath === '/' ? '' : '../';
    const legal = ROUTES[lang.legal];
    const u = (sitePath) => prefix + sitePath.replace(/^\//, '');
    const langs = BUILT_LANGS.map((l) => ({
      hreflang: l.html,
      chip: l.chip,
      name: l.name,
      href: u(langPath(l.code)) || './',
      current: l.code === lang.code,
    }));
    const langSwitch = langs.length > 1
      ? `<details class="lang-dd"><summary aria-label="${esc(t.nav.siteLanguage)}: ${esc(lang.name)}">${lang.chip} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="#0B0A0B" stroke-width="3" stroke-linecap="round"/></svg></summary><div>${langs
          .map((l) => `<a href="${l.href}" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.current ? ' aria-current="page"' : ''}><b>${l.chip}</b> ${esc(l.name)}</a>`)
          .join('')}</div></details>`
      : '';
    const vars = {
      annualTotal: formatPrice(PRICES.annual, lang.code),
      perMonth: formatPrice(round2(PRICES.annual / 12), lang.code),
      save: `\u2212${SAVE_PCT}%`,
      trialDays: String(TRIAL_DAYS),
    };
    const ctx = {
      root: prefix,
      // App screenshots are shot per language (assets/img/<code>/); see README.
      shots: `${prefix}assets/img/${lang.code}`,
      home: prefix || './',
      appStore: LINKS.appStore,
      googlePlay: LINKS.googlePlay,
      ...badges(prefix, lang.code),
      threads: LINKS.threads,
      mail: LINKS.mail,
      langSwitch,
      priceAnnualTotal: formatPrice(PRICES.annual, lang.code),
      priceMonthly: formatPrice(PRICES.monthly, lang.code),
      save: `\u2212${SAVE_PCT}%`,
      compare: compareTable(t.pricing),
      privacy: u(legal.privacy),
      terms: u(legal.terms),
      impressum: u(legal.impressum),
      contact: u(legal.contact),
    };
    ctx.header = siteHeader({
      homeHref: '#top',
      homeLabel: t.nav.home,
      logoSrc: `${prefix}assets/img/logo-dark.png`,
      navLabel: t.nav.label,
      nav: [
        { href: '#how', label: t.nav.how },
        { href: '#conversation', label: t.nav.conversation },
        { href: '#pricing', label: t.nav.pricing },
        { href: '#errors', label: t.nav.errors },
      ],
      extra: langSwitch,
      cta: { href: '#download', label: t.nav.download },
      menuOpenLabel: t.nav.menuOpen,
    });
    ctx.footer = siteFooter({
      logoSrc: `${prefix}assets/img/logo-light.png`,
      tagline: t.footer.tagline,
      navLabel: t.footer.navLabel,
      links: [
        { href: ctx.privacy, label: t.footer.privacy },
        { href: ctx.terms, label: t.footer.terms },
        { href: u(legal.delete), label: t.footer.delete },
        { href: ctx.contact, label: t.footer.support },
        { href: ctx.impressum, label: t.footer.impressum },
        { href: u(legal.notices), label: t.footer.notices },
      ],
      cookies: cookiesButton(t.footer.cookies),
      mail: LINKS.mail,
      langs,
      langLabel: t.nav.siteLanguage,
    });
    const body = fill(tpl, t, ctx, partials, vars);
    const stores = fill(partials.stores, t, ctx, partials, vars);
    const small = [
      `<a href="${ctx.privacy}">${esc(t.footer.privacy)}</a>`,
      `<a href="${ctx.impressum}">${esc(t.footer.impressum)}</a>`,
      cookiesButton(t.footer.cookies),
    ].filter(Boolean);
    const menu = menuHtml({
      logoSrc: `${prefix}assets/img/logo-dark.png`,
      homeHref: '#top',
      homeLabel: t.nav.home,
      label: t.nav.menu,
      closeLabel: t.nav.menuClose,
      items: [
        { label: t.nav.how, href: '#how' },
        { label: t.nav.conversation, href: '#conversation' },
        { label: t.nav.errors, href: '#errors' },
        { label: t.nav.words, href: '#words' },
        { label: t.nav.pricing, href: '#pricing' },
        { label: t.nav.faq, href: '#faq' },
      ],
      langs,
      langLabel: t.nav.siteLanguage,
      stores,
      small,
    });
    const fonts = ['latin', ...(['uk', 'ru'].includes(lang.code) ? ['cyrillic'] : []), ...(['tr', 'pl', 'ro', 'sq', 'sr'].includes(lang.code) ? ['latin-ext'] : [])];
    const html = `${head({
      langRedirect: canonicalPath === '/' ? langRedirectScript(BUILT_LANGS.map((l) => l.code)) : '',
      lang: lang.html,
      title: t.meta.title,
      description: t.meta.description,
      canonicalPath,
      prefix,
      fonts,
      alternates,
      og: { title: t.meta.title, description: t.meta.description, imageAlt: t.meta.ogImageAlt, locale: lang.og, image: `${SITE}/assets/img/${lang.code}/screen-quick-fix.jpg` },
    })}
<body class="landing">
${body}
${menu}
${cookieMarkup(t.cookies, ctx.privacy)}
</body>
</html>
`;
    const outPath = path.join(DIST, out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
    console.log('built', out);
  }
}

// ---------- legal shell ----------
// Banner strings for the EN/DE legal pages come from the landing dictionaries of the same
// language (en falls back to the default language, de to en, while those files are missing).
const LEGAL_COOKIES = {};
async function loadLegalCookies() {
  const base = await loadDict(LANGS[0].code);
  const en = (await loadDict('en')) || base;
  const de = (await loadDict('de')) || en;
  for (const [code, d] of [['en', en], ['de', de]]) LEGAL_COOKIES[code] = { c: d.cookies, footer: d.footer.cookies };
}

function legalStores(lang, partials, prefix) {
  const ui = UI[lang];
  return fill(partials.stores, { store: { appleAlt: ui.appleAlt, googleAlt: ui.googleAlt } }, { appStore: LINKS.appStore, googlePlay: LINKS.googlePlay, ...badges(prefix, lang) }, partials);
}

function legalLayout({ page, title, heroTitle, pills, body, depth, partials, absolute = false }) {
  const { lang } = page;
  const ui = UI[lang];
  const cookieText = LEGAL_COOKIES[lang];
  // Pages where the pixel must never load even with consent: the two forms (what people type
  // there must not reach Meta) and the 404 page, whose URL is whatever a visitor mistyped.
  // cookies.js checks this attribute first and the presence of a <form> second.
  const noPixel = page.kind === 'contact' || page.kind === 'cards' || Boolean(page.nfClass);
  // Relative links so the site works both at the apex domain and under a
  // project-page prefix (0g3ra.github.io/eduvia-web/) before DNS is switched.
  // 404.html is served for any missing path, so it alone uses root-absolute links.
  const prefix = absolute ? '/' : '../'.repeat(depth);
  const u = (sitePath) => prefix + sitePath.replace(/^\//, '');
  // "Product" goes to the landing in the page's language when it is built, else to /.
  const landingPath = BUILT_LANGS.some((l) => l.code === lang) ? langPath(lang) : '/';
  const home = absolute ? landingPath : u(landingPath) || './';
  const routes = ROUTES[lang];
  const canonicalPath = page.canonicalPath;
  const navItems = [
    { key: 'product', href: home, label: ui.product },
    { key: 'privacy', href: u(routes.privacy), label: ui.privacy },
    { key: 'terms', href: u(routes.terms), label: ui.terms },
    { key: 'contact', href: u(routes.contact), label: ui.contact },
  ];
  const sw = page.switch
    ? `<nav class="pill-switch" aria-label="${ui.langSwitch}"><a href="${u(page.switch.en)}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a><a href="${u(page.switch.de)}" hreflang="de" lang="de"${lang === 'de' ? ' aria-current="page"' : ''}>DE</a></nav>`
    : '';
  const crumb = heroTitle == null ? '' : `<div class="crumb">${ui.legal}&nbsp;&nbsp;/&nbsp;&nbsp;${esc(title)}</div>`;
  const hero = heroTitle == null
    ? ''
    : `<div class="lhero-in" id="main">
${crumb}
<h1>${esc(heroTitle)}</h1>
${page.sub ? `<p class="lsub">${esc(page.sub)}</p>` : ''}
${pills.length ? `<div class="lpills">${pills.map((p) => `<span>${esc(p)}</span>`).join('')}</div>` : ''}
</div>`;
  const stores = legalStores(lang, partials, prefix);
  const menu = menuHtml({
    logoSrc: u('/assets/img/logo-dark.png'),
    homeHref: home,
    homeLabel: ui.home,
    label: ui.menu,
    closeLabel: ui.menuClose,
    items: [
      { label: ui.product, href: home },
      { label: ui.privacy, href: u(routes.privacy) },
      { label: ui.terms, href: u(routes.terms) },
      { label: ui.delete, href: u(routes.delete) },
      { label: ui.contact, href: u(routes.contact) },
    ],
    langs: null,
    stores,
    small: [`<a href="${u(routes.impressum)}">${ui.impressum}</a>`, `<a href="${u(routes.notices)}">${ui.notices}</a>`, cookiesButton(cookieText.footer)].filter(Boolean),
  });
  const footLink = (key, label) => ({ href: u(routes[key]), label, current: page.nav === key });
  // Language links: the EN/DE versions of this document, or the landing languages on pages that
  // exist once (Impressum, notices, 404).
  const footLangs = page.switch
    ? [
        { href: u(page.switch.en), hreflang: 'en', name: 'English', current: lang === 'en' },
        { href: u(page.switch.de), hreflang: 'de', name: 'Deutsch', current: lang === 'de' },
      ]
    : BUILT_LANGS.map((l) => ({ href: absolute ? langPath(l.code) : u(langPath(l.code)) || './', hreflang: l.html, name: l.name }));
  const header = siteHeader({
    homeHref: home,
    homeLabel: ui.home,
    logoSrc: u('/assets/img/logo-dark.png'),
    navLabel: ui.mainNav,
    nav: navItems.map((n) => ({ href: n.href, label: n.label, current: page.nav === n.key })),
    extra: sw,
    cta: { href: `${home}#download`, label: ui.getApp },
    menuOpenLabel: ui.menuOpen,
  });
  const footer = siteFooter({
    logoSrc: u('/assets/img/logo-light.png'),
    tagline: ui.tagline,
    navLabel: ui.legalNav,
    links: [footLink('privacy', ui.privacy), footLink('terms', ui.terms), footLink('delete', ui.delete), footLink('contact', ui.contact), footLink('impressum', ui.impressum), footLink('notices', ui.notices)],
    cookies: cookiesButton(cookieText.footer),
    mail: LINKS.mail,
    langs: footLangs,
    langLabel: ui.langSwitch,
  });
  return `${head({
    lang,
    title: heroTitle == null ? title : `${title} · Eduvia`,
    description: page.description,
    canonicalPath,
    prefix,
    fonts: ['latin'],
    og: { title: `${title} · Eduvia`, description: page.description, imageAlt: '', locale: lang === 'de' ? 'de_DE' : 'en_US' },
  }).replace(/\n<meta property="og:image[^>]*>/g, '')}
<body class="legal"${noPixel ? ' data-no-pixel' : ''}>
<a class="skip" href="#main">${ui.skip}</a>
${header}
<div class="${page.nfClass || 'lhero'}">
<div class="deco d1" aria-hidden="true"></div><div class="deco d2" aria-hidden="true"></div><div class="deco d3" aria-hidden="true"></div>
${hero}
${page.nfBody || ''}
</div>
${body ? `<main class="lbody">\n${body}\n</main>` : ''}
${footer}
${menu}
${cookieMarkup(cookieText.c, u(routes.privacy))}
</body>
</html>
`;
}

// Pulls the "Effective Date: … · Version …" line (or "Last updated: …", "Angaben gemäß …")
// out of the body so it can sit in the hero as pills, unchanged in wording.
function takeMetaLine(md) {
  const m = md.match(/^(?:Effective Date|Gültig ab|Last updated|Angaben gemäß)[^\n]*$/m);
  if (!m) return { md, pills: [] };
  return { md: md.replace(m[0], ''), pills: m[0].split(' · ').map((s) => s.trim()) };
}

function splitH2(html) {
  const parts = html.split(/(?=<h2>)/);
  const intro = parts.length && !parts[0].startsWith('<h2>') ? parts.shift() : '';
  return {
    intro,
    sections: parts.map((p) => {
      const m = p.match(/^<h2>([\s\S]*?)<\/h2>/);
      return { title: m[1], body: p.slice(m[0].length) };
    }),
  };
}

const wrapTables = (html, ui) =>
  html.replace(/<table>/g, `<div class="table-wrap" tabindex="0" role="region" aria-label="${ui.table}"><table>`).replace(/<\/table>/g, '</table></div>');

function docBody(page, md, ui, depth) {
  const html = wrapTables(marked.parse(md), ui);
  const { intro, sections } = splitH2(html);
  const toc = [];
  const secHtml = sections.map((s, i) => {
    const text = stripTags(s.title).trim();
    const num = text.match(/^(\d+)\.\s+(.*)$/);
    if (page.summary && i === 0 && !num) {
      toc.push({ id: 'summary', n: '·', label: text });
      return `<section class="short" id="summary" aria-labelledby="summary-h"><div class="short-head"><h2 id="summary-h">${s.title}</h2><span>${ui.minRead(readMin(s.body))}</span></div>${s.body}</section>`;
    }
    const id = num ? `section-${num[1]}` : `section-${i + 1}`;
    toc.push({ id, n: num ? num[1] : '·', label: num ? num[2] : text });
    const isLog = /^\s*<p><strong>(Version|Versión)/.test(s.body);
    const label = num ? `<span class="num">${num[1]}</span>${esc(num[2])}` : s.title;
    const body = isLog ? s.body.replace(/<p><strong>/g, '<p class="ver"><strong>') : s.body;
    return `<section class="doc-sec${isLog ? ' changelog' : ''}" id="${id}"><h2>${label}</h2><div class="sec-body">${body}</div></section>`;
  });
  const tocLinks = toc.map((e) => `<a href="#${e.id}"><span>${e.n}</span>${esc(e.label)}</a>`).join('');
  const other = page.switch
    ? `<div class="toc-alt"><a href="${'../'.repeat(depth)}${(page.lang === 'en' ? page.switch.de : page.switch.en).replace(/^\//, '')}" hreflang="${page.lang === 'en' ? 'de' : 'en'}">${ui.other}</a></div>`
    : '';
  const total = readMin(html);
  return `<div class="lgrid">
<aside class="toc" aria-label="${ui.contents}"><div class="toc-cap">${ui.contents}</div><nav>${tocLinks}</nav>${other}</aside>
<article class="doc">
<details class="toc-m"><summary><i aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0A0B" stroke-width="2.2" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h9"/></svg></i><span><b>${ui.contents}</b><small>${ui.sections(toc.filter((e) => e.n !== '·').length || toc.length)} · ${ui.min(total)}</small></span></summary><nav aria-label="${ui.contents}">${tocLinks}</nav></details>
${intro.trim() ? `<div class="doc-intro">${intro}</div>` : ''}
${secHtml.join('\n')}
</article>
</div>`;
}

// Delete-account page: every H2 section becomes a card; the layout follows the design.
const DELETE_CARDS = ['card-white span2', 'card-white', 'card-white', 'card-mint', 'card-cream', 'card-pink card-wide', 'card-plain'];
function cardsBody(md, ui) {
  const { intro, sections } = splitH2(wrapTables(marked.parse(md), ui));
  const styles = sections.length === DELETE_CARDS.length ? DELETE_CARDS : sections.map(() => 'card-white');
  return `${intro.trim() ? `<div class="cards-intro doc">${intro}</div>` : ''}
<div class="cards">
${sections.map((s, i) => `<section class="card doc ${styles[i]}"><h2>${s.title}</h2>${s.body}</section>`).join('\n')}
</div>`;
}

// Contact page: the form (and its script, unchanged) in one card, the rest beside it.
function contactBody(page, md, ui, depth) {
  const html = marked.parse(md);
  const fStart = html.indexOf('<form');
  const sEnd = html.indexOf('</script>');
  if (fStart < 0 || sEnd < 0) throw new Error(`${page.src}: expected a <form> followed by a <script>`);
  const before = html.slice(0, fStart);
  const formAndScript = html.slice(fStart, sEnd + '</script>'.length);
  const after = html.slice(sEnd + '</script>'.length);
  const paras = after.split(/(?=<p>)/).map((p) => p.trim()).filter(Boolean);
  const controller = paras.filter((p) => /^<p>(Controller|Verantwortlich)/.test(p));
  const rest = paras.filter((p) => !controller.includes(p));
  const del = `${'../'.repeat(depth)}${ROUTES[page.lang].delete.replace(/^\//, '')}`;
  return `<div class="contact-grid">
<section class="card card-white doc" aria-labelledby="write-h"><h2 id="write-h">${ui.writeToUs}</h2>
${formAndScript}
${rest.length ? `<div class="small-print">${rest.join('\n')}</div>` : ''}
</section>
<div class="side-col">
${before.trim() ? `<div class="card card-cream doc">${before}</div>` : ''}
${controller.length ? `<div class="card card-grey doc">${controller.join('\n')}</div>` : ''}
<p class="side-note">${ui.deleteHint[0]}<a href="${del}">${ui.deleteHint[1]}</a>${ui.deleteHint[2]}</p>
</div>
</div>`;
}

// Impressum: "Label:" blocks and H2 sections become labelled cards; the wording is unchanged.
function impressumBody(md, depth) {
  const [pre, ...h2parts] = md.split(/^## /m);
  const blocks = pre.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const lead = [];
  const labelled = [];
  let scope = null;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const lines = b.split('\n');
    const next = blocks[i + 1] || '';
    if (lines.length === 1 && b.endsWith(':') && next.startsWith('- ')) {
      scope = `${b}\n\n${next}`;
      i++;
    } else if (lines.length === 1 && b.endsWith(':') && b.length < 40) {
      labelled.push({ label: b.slice(0, -1), md: next });
      i++;
    } else if (lines.length > 1 && lines[0].endsWith(':')) {
      labelled.push({ label: lines[0].slice(0, -1), md: lines.slice(1).join('\n') });
    } else {
      lead.push(b);
    }
  }
  const sections = h2parts.map((p) => {
    const nl = p.indexOf('\n');
    return { label: p.slice(0, nl).trim(), md: p.slice(nl + 1).trim() };
  });
  const card = (cls, label, inner) =>
    `<section class="card doc ${cls}">${label ? `<h2 class="label">${esc(label)}</h2>` : ''}${marked.parse(inner)}</section>`;
  const colors = ['card-cream card-wide', 'card-mint', 'card-grey'];
  const p = '../'.repeat(depth);
  return `${lead.length ? `<div class="imp-lead doc">${marked.parse(lead.join('\n\n'))}</div>` : ''}
<div class="cards">
${labelled.map((c, i) => card(colors[i] || 'card-grey', c.label, c.md)).join('\n')}
${sections.map((s) => card('card-grey', s.label, s.md)).join('\n')}
${scope ? card('card-blue', '', scope) : ''}
</div>
<nav class="links-row" aria-label="Rechtliches"><a href="${p}privacy/de/">Datenschutz →</a><a href="${p}terms/de/">Nutzungsbedingungen →</a><a href="${p}third-party-notices/">Third-Party Notices →</a></nav>`;
}

async function buildLegal(partials) {
  for (const page of pages) {
    const raw = await readFile(path.join(CONTENT, page.src), 'utf8');
    const h1 = raw.match(/^#\s+(.+)$/m);
    const title = h1 ? h1[1].trim() : 'Eduvia';
    const withoutH1 = h1 ? raw.replace(h1[0], '') : raw;
    const { md, pills } = takeMetaLine(withoutH1);
    const depth = page.out.split('/').length - 1;
    page.canonicalPath = '/' + page.out.replace(/index\.html$/, '');
    const ui = UI[page.lang];
    let body;
    let heroPills = [...pills];
    if (page.kind === 'doc') {
      body = docBody(page, md, ui, depth);
      heroPills.push(ui.minRead(readMin(marked.parse(md))));
    } else if (page.kind === 'cards') body = cardsBody(md, ui);
    else if (page.kind === 'contact') {
      body = contactBody(page, md, ui, depth);
      if (page.pill) heroPills.push(page.pill);
    } else if (page.kind === 'impressum') body = impressumBody(md, depth);
    const html = legalLayout({ page, title, heroTitle: title, pills: heroPills, body, depth, partials });
    const outPath = path.join(DIST, page.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
    console.log('built', page.out);
  }
}

async function build404(partials) {
  const page = {
    lang: 'en',
    nav: '',
    canonicalPath: '/',
    description: 'Page not found.',
    nfClass: 'nf',
    nfBody: `<main class="nf-in" id="main">
<div class="nf-circle" aria-hidden="true"></div><div class="nf-dot" aria-hidden="true"></div>
<div class="nf-code" aria-hidden="true">404</div>
<h1 lang="de">Hoppla! Diese Seite gibt es nicht.</h1>
<p>This page took a wrong turn.</p>
<a class="btn-dark" href="/">Back to Eduvia</a>
</main>`,
  };
  const html = legalLayout({ page, title: 'Not found · Eduvia', heroTitle: null, pills: [], body: '', depth: 0, partials, absolute: true })
    .replace('<div class="deco d1" aria-hidden="true"></div><div class="deco d2" aria-hidden="true"></div><div class="deco d3" aria-hidden="true"></div>\n', '');
  await writeFile(path.join(DIST, '404.html'), html);
  console.log('built 404.html');
}

async function main() {
  if (existsSync(DIST)) await rm(DIST, { recursive: true });
  await mkdir(DIST, { recursive: true });
  const partials = await loadPartials();

  await buildLanding(partials);
  await loadLegalCookies();
  await buildLegal(partials);
  await build404(partials);

  await cp(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), {
    recursive: true,
    filter: (src) => CONSENT_ENABLED || path.basename(src) !== 'cookies.js',
  });
  await writeFile(path.join(DIST, '.nojekyll'), '');
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
