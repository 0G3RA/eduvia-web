// Cookie consent and the Meta Pixel. Shipped only when build.mjs has a META_PIXEL_ID; without one
// this file is not copied to dist/ and no banner is shown.
// The pixel script is injected only after the visitor accepts analytics, never before and never
// on "necessary only". Withdrawing consent deletes the _fbp/_fbc cookies and reloads the page so
// an already loaded pixel stops.
(function () {
  "use strict";
  var me = document.currentScript;
  var PIXEL = me && me.getAttribute("data-pixel");
  var VERSION = Number(me && me.getAttribute("data-version")) || 1;
  var KEY = "eduvia.consent";
  var banner = document.getElementById("ck");
  var sheet = document.getElementById("ck-set");
  if (!PIXEL || !banner || !sheet) return;
  var toggle = document.getElementById("ck-analytics");
  var opener = null;

  function read() {
    try {
      var c = JSON.parse(window.localStorage.getItem(KEY) || "null");
      return c && c.v === VERSION ? c : null;
    } catch (e) { return null; }
  }
  function write(c) {
    try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage blocked: we ask again next visit */ }
  }
  function analyticsAllowed() {
    var c = read();
    return !!(c && c.analytics);
  }

  function loadPixel() {
    if (window.fbq) return;
    // Never on a page with a form (contact, account deletion): what people type there must not
    // reach Meta, and the Privacy Policy promises exactly that. build.mjs also marks those pages
    // and the 404 page (whose URL is whatever someone mistyped) with data-no-pixel on <body>.
    if (document.body.hasAttribute("data-no-pixel") || document.querySelector("form")) return;
    /* Meta's standard base code, run only here. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; t.id = "meta-pixel";
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    // autoConfig off: no automatic button/form event detection. Automatic Advanced Matching must
    // also stay OFF in Events Manager; the Privacy Policy does not cover hashed form data.
    window.fbq("set", "autoConfig", false, PIXEL);
    window.fbq("init", PIXEL);
    window.fbq("track", "PageView");
  }

  function deleteMetaCookies() {
    var host = window.location.hostname;
    var parts = host.split(".");
    var domains = [""];
    for (var i = 0; i < parts.length - 1; i++) {
      var d = parts.slice(i).join(".");
      domains.push("; domain=" + d, "; domain=." + d);
    }
    ["_fbp", "_fbc"].forEach(function (name) {
      domains.forEach(function (dom) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + dom;
      });
    });
  }

  // The banner is not modal, but it floats over the bottom of the page, where the footer links
  // to the Impressum and the Privacy Policy sit. While it is open, the footer gets extra bottom
  // padding equal to the banner's height (style.css: .ck-open .site-foot), so those links stay
  // reachable without deciding first.
  function showBanner() {
    banner.hidden = false;
    document.documentElement.classList.add("ck-open");
    fitFooter();
  }
  function hideBanner() {
    banner.hidden = true;
    document.documentElement.classList.remove("ck-open");
  }
  function fitFooter() {
    if (banner.hidden) return;
    document.documentElement.style.setProperty("--ck-h", banner.offsetHeight + "px");
  }
  window.addEventListener("resize", fitFooter);

  function decide(analytics) {
    var before = analyticsAllowed();
    write({ v: VERSION, analytics: !!analytics, at: new Date().toISOString() });
    hideBanner();
    closeSheet();
    if (analytics) loadPixel();
    else if (before || window.fbq) {
      deleteMetaCookies();
      window.location.reload();
    } else deleteMetaCookies();
  }

  function openSheet(e) {
    opener = e && e.currentTarget;
    toggle.checked = analyticsAllowed();
    sheet.hidden = false;
    sheet.querySelector("[data-ck=close]").focus();
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    if (opener && document.contains(opener) && !opener.closest("[hidden]")) opener.focus();
  }

  if (read()) {
    if (analyticsAllowed()) loadPixel();
  } else {
    showBanner();
  }

  function on(sel, fn) {
    document.querySelectorAll(sel).forEach(function (b) { b.addEventListener("click", fn); });
  }
  on("[data-ck=all]", function () { decide(true); });
  on("[data-ck=necessary]", function () { decide(false); });
  on("[data-ck=save]", function () { decide(toggle.checked); });
  on("[data-ck=settings]", openSheet);
  on("[data-ck=close]", closeSheet);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
  // The sheet is aria-modal, so Tab must stay inside it while it is open (WCAG 2.4.3).
  document.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") { closeSheet(); return; }
    if (e.key !== "Tab") return;
    var f = sheet.querySelectorAll("button:not([disabled]), input:not([disabled]), a[href]");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });

  // Store button clicks, only with consent and only once the pixel exists.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || !window.fbq || !analyticsAllowed()) return;
    var href = a.getAttribute("href");
    var store = href.indexOf("https://apps.apple.com/app/") === 0 ? "ios"
      : href.indexOf("https://play.google.com/store/apps/details") === 0 ? "android" : null;
    if (store) window.fbq("trackCustom", "StoreClick", { store: store });
  });
})();
