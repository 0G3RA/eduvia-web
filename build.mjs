// Static site builder: renders content/*.md into dist/ with a shared layout.
// Routes mirror the URLs referenced inside the legal documents themselves:
//   /privacy/  /privacy/de/  /terms/  /terms/de/  /impressum/  /third-party-notices/
import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

// breaks:true keeps soft line breaks (postal address blocks) as <br>; paragraphs
// in the source documents are always separated by blank lines, so this is safe.
marked.setOptions({ gfm: true, breaks: true });

const SITE = 'https://geteduvia.com';

const pages = [
  {
    src: 'privacy.en.md',
    out: 'privacy/index.html',
    lang: 'en',
    description: 'Privacy Policy of Eduvia, the AI voice tutor app for practicing spoken German.',
    switch: { current: 'EN', links: [{ label: 'English', href: '/privacy/' }, { label: 'Deutsch', href: '/privacy/de/' }] },
  },
  {
    src: 'privacy.de.md',
    out: 'privacy/de/index.html',
    lang: 'de',
    description: 'Datenschutzerklärung von Eduvia, der App mit KI-Sprachtutor zum Üben von gesprochenem Deutsch.',
    switch: { current: 'DE', links: [{ label: 'English', href: '/privacy/' }, { label: 'Deutsch', href: '/privacy/de/' }] },
  },
  {
    src: 'terms.en.md',
    out: 'terms/index.html',
    lang: 'en',
    description: 'Terms of Use (EULA) of Eduvia, the AI voice tutor app for practicing spoken German.',
    switch: { current: 'EN', links: [{ label: 'English', href: '/terms/' }, { label: 'Deutsch', href: '/terms/de/' }] },
  },
  {
    src: 'terms.de.md',
    out: 'terms/de/index.html',
    lang: 'de',
    description: 'Nutzungsbedingungen (EULA) von Eduvia, der App mit KI-Sprachtutor zum Üben von gesprochenem Deutsch.',
    switch: { current: 'DE', links: [{ label: 'English', href: '/terms/' }, { label: 'Deutsch', href: '/terms/de/' }] },
  },
  {
    src: 'impressum.md',
    out: 'impressum/index.html',
    lang: 'de',
    description: 'Impressum der App Eduvia und der Website geteduvia.com.',
  },
  {
    src: 'third-party-notices.md',
    out: 'third-party-notices/index.html',
    lang: 'en',
    description: 'Open-source components used by the Eduvia app and its backend service.',
  },
];

function extractTitle(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Eduvia';
}

function layout({ lang, title, description, body, langSwitch, canonicalPath, depth = 0 }) {
  // Relative links so the site works both at the apex domain and under a
  // project-page prefix (0g3ra.github.io/eduvia-web/) before DNS is switched.
  const prefix = '../'.repeat(depth);
  const home = prefix || './';
  const u = (sitePath) => prefix + sitePath.replace(/^\//, '');
  const switchHtml = langSwitch
    ? `<nav class="lang" aria-label="Language">${langSwitch.links
        .map((l) => `<a href="${u(l.href)}"${l.label.slice(0, 2).toUpperCase() === langSwitch.current ? ' aria-current="page"' : ''}>${l.label}</a>`)
        .join('')}</nav>`
    : '';
  const impressumLabel = 'Impressum';
  const privacyLabel = lang === 'de' ? 'Datenschutz' : 'Privacy';
  const termsLabel = lang === 'de' ? 'Nutzungsbedingungen' : 'Terms';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Eduvia</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE}${canonicalPath}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%232563eb'/%3E%3Ctext x='50' y='71' font-size='62' font-family='Georgia,serif' fill='white' text-anchor='middle'%3EE%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${prefix}style.css">
</head>
<body>
<header class="site-header">
<a class="wordmark" href="${home}">Eduvia</a>
${switchHtml}
</header>
<main class="doc">
${body}
</main>
<footer class="site-footer">
<nav aria-label="Legal">
<a href="${u('/privacy/')}">${privacyLabel}</a>
<a href="${u('/terms/')}">${termsLabel}</a>
<a href="${u('/impressum/')}">${impressumLabel}</a>
<a href="${u('/third-party-notices/')}">Third-Party Notices</a>
</nav>
<p>&copy; 2026 Eduvia</p>
</footer>
</body>
</html>
`;
}

function landing() {
  const body = `
<section class="hero">
<h1>Eduvia</h1>
<p class="tagline">Practice speaking German with an AI voice tutor.<br>
<span lang="de">Gesprochenes Deutsch üben, mit einem KI-Sprachtutor.</span></p>
<ul class="doc-list">
<li><a href="privacy/">Privacy Policy</a> · <a href="privacy/de/" lang="de">Datenschutzerklärung</a></li>
<li><a href="terms/">Terms of Use</a> · <a href="terms/de/" lang="de">Nutzungsbedingungen</a></li>
<li><a href="impressum/" lang="de">Impressum</a></li>
<li><a href="third-party-notices/">Third-Party Notices</a></li>
</ul>
</section>`;
  return layout({
    lang: 'en',
    title: 'Eduvia',
    description: 'Eduvia is an app for practicing spoken German with an AI voice tutor.',
    body,
    canonicalPath: '/',
  }).replace('<title>Eduvia · Eduvia</title>', '<title>Eduvia</title>');
}

async function main() {
  if (existsSync(DIST)) await rm(DIST, { recursive: true });
  await mkdir(DIST, { recursive: true });

  for (const page of pages) {
    const md = await readFile(path.join(CONTENT, page.src), 'utf8');
    const title = extractTitle(md);
    const body = marked.parse(md);
    const canonicalPath = '/' + page.out.replace(/index\.html$/, '');
    const html = layout({
      lang: page.lang,
      title,
      description: page.description,
      body,
      langSwitch: page.switch,
      canonicalPath,
      depth: page.out.split('/').length - 1,
    });
    const outPath = path.join(DIST, page.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
    console.log('built', page.out);
  }

  await writeFile(path.join(DIST, 'index.html'), landing());
  console.log('built index.html');

  await cp(path.join(ROOT, 'assets', 'style.css'), path.join(DIST, 'style.css'));
  await writeFile(path.join(DIST, '.nojekyll'), '');
  await writeFile(
    path.join(DIST, '404.html'),
    layout({
      lang: 'en',
      title: 'Not found',
      description: 'Page not found.',
      body: '<h1>404</h1><p>This page does not exist. <a href="/">Back to the start.</a></p>',
      canonicalPath: '/',
    }),
  );
  console.log('done');
}

main();
