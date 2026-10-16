// Small progressive enhancements. Every page works without this file.
(function () {
  "use strict";
  var doc = document.documentElement;

  // Full-screen menu: real button, aria-expanded, Esc closes, body scroll lock, focus returns.
  var menu = document.getElementById("menu");
  var opener = null;
  function focusables() {
    return menu.querySelectorAll("a[href], button:not([disabled])");
  }
  function openMenu(btn) {
    opener = btn;
    menu.hidden = false;
    doc.classList.add("menu-open");
    document.querySelectorAll("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    var first = menu.querySelector(".menu-close");
    if (first) first.focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    doc.classList.remove("menu-open");
    document.querySelectorAll("[data-menu-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (opener) opener.focus();
  }
  if (menu) {
    document.querySelectorAll("[data-menu-open]").forEach(function (b) {
      b.addEventListener("click", function () { openMenu(b); });
    });
    menu.querySelectorAll("[data-menu-close]").forEach(function (b) { b.addEventListener("click", closeMenu); });
    menu.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 768) closeMenu(); });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Keyboard users get focus rings on summaries; a mouse click on one does not draw a box.
  document.addEventListener("keydown", function (e) { if (e.key === "Tab") doc.classList.add("kb"); });
  document.addEventListener("pointerdown", function () { doc.classList.remove("kb"); });

  // Sticky header: solid, blurred background once the page has left the top.
  var head = document.querySelector("[data-head]");
  if (head) {
    var onScroll = function () { head.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Carousels: centred scroll-snap rows with real dot buttons that follow the scroll.
  document.querySelectorAll("[data-carousel]").forEach(function (row) {
    var slides = [].slice.call(row.querySelectorAll(":scope > .slide"));
    if (slides.length < 2) return;
    var dots = document.createElement("div");
    dots.className = "dots";
    dots.setAttribute("role", "group");
    var region = row.closest("[aria-label]");
    if (region) dots.setAttribute("aria-label", region.getAttribute("aria-label"));
    var buttons = slides.map(function (slide, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      var label = slide.querySelector("figcaption, h3, b");
      b.setAttribute("aria-label", (i + 1) + " / " + slides.length + (label ? ": " + label.textContent.trim() : ""));
      b.addEventListener("click", function () { go(i); });
      dots.appendChild(b);
      return b;
    });
    row.insertAdjacentElement("afterend", dots);
    var current = -1;
    function offsetFor(i) {
      var s = slides[i];
      return s.offsetLeft - (row.clientWidth - s.offsetWidth) / 2;
    }
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      row.scrollTo({ left: offsetFor(i), behavior: reduceMotion ? "auto" : "smooth" });
      mark(i);
    }
    function mark(i) {
      if (i === current) return;
      current = i;
      buttons.forEach(function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
    }
    function nearest() {
      var mid = row.scrollLeft + row.clientWidth / 2, best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    // Dots and the keyboard stop exist only while the row actually scrolls (phones, tablets).
    function sync() {
      var scrolls = row.scrollWidth > row.clientWidth + 4;
      dots.hidden = !scrolls;
      if (scrolls) row.setAttribute("tabindex", "0"); else row.removeAttribute("tabindex");
      current = -1;
      mark(nearest());
    }
    var ticking = false;
    row.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; mark(nearest()); });
    }, { passive: true });
    row.addEventListener("keydown", function (e) {
      if (e.target !== row) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(nearest() + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(nearest() - 1); }
    });
    window.addEventListener("resize", sync);
    sync();
  });

  // FAQ: collapsed by default; opening and closing animate the height unless reduced motion is set.
  document.querySelectorAll(".faq-list details").forEach(function (d) {
    var summary = d.querySelector("summary");
    var body = d.querySelector(".faq-a");
    if (!summary || !body || !body.animate) return;
    var anim = null;
    summary.addEventListener("click", function (e) {
      if (reduceMotion) return;
      e.preventDefault();
      if (anim) anim.cancel();
      var opening = !d.open || d.classList.contains("closing");
      var from = d.open ? body.offsetHeight : 0;
      d.classList.toggle("closing", !opening);
      d.open = true;
      var to = opening ? body.scrollHeight : 0;
      anim = body.animate([{ height: from + "px" }, { height: to + "px" }], { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" });
      anim.onfinish = function () {
        anim = null;
        if (!opening) { d.open = false; d.classList.remove("closing"); }
      };
    });
  });

  // Cycle diagram: five cards on a ring whose radius is found from the measured cards, so no
  // language makes them touch each other, the arrows or the centre label. The ring is then scaled
  // to the column; when that would make it too small, the CSS grid stays instead.
  var cycle = document.querySelector("[data-cycle]");
  if (cycle) {
    var stage = cycle.querySelector(".cycle-stage");
    var cards = [].slice.call(cycle.querySelectorAll(".cyc"));
    var centre = cycle.querySelector(".cycle-center");
    var svg = cycle.querySelector(".cycle-arrows");
    var NS = "http://www.w3.org/2000/svg";
    var ANG = [-90, -18, 54, 126, 198].map(function (d) { return d * Math.PI / 180; });
    var STEP = 72 * Math.PI / 180, MARGIN = 14, MIN_ARC = 64;
    var layoutCycle = function () {
      cycle.classList.add("ring");
      stage.style.zoom = "";
      var avail = cycle.clientWidth;
      if (!avail) return;
      var w = cards[0].offsetWidth;
      var hs = cards.map(function (c) { return c.offsetHeight; });
      var cw = centre.offsetWidth, ch = centre.offsetHeight;
      var box = function (x, y, bw, bh, m) { return { l: x - bw / 2 - m, r: x + bw / 2 + m, t: y - bh / 2 - m, b: y + bh / 2 + m }; };
      var hit = function (a, b) { return a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b; };
      var inBox = function (x, y, r) { return x > r.l && x < r.r && y > r.t && y < r.b; };
      var R, rects, runs;
      for (R = 220; R < 900; R += 4) {
        rects = ANG.map(function (a, i) { return box(R * Math.cos(a), R * Math.sin(a), w, hs[i], MARGIN); });
        var ok = true;
        var mid = box(0, 0, cw, ch, MARGIN);
        for (var i = 0; i < 5 && ok; i++) {
          if (hit(rects[i], mid)) ok = false;
          for (var j = i + 1; j < 5 && ok; j++) if (hit(rects[i], rects[j])) ok = false;
        }
        if (!ok) continue;
        runs = [];
        for (i = 0; i < 5 && ok; i++) {
          var a0 = ANG[i], s0 = null, e0 = null, n = 160;
          for (var k = 0; k <= n; k++) {
            var a = a0 + STEP * k / n, x = R * Math.cos(a), y = R * Math.sin(a);
            var inside = inBox(x, y, rects[i]) || inBox(x, y, rects[(i + 1) % 5]);
            if (!inside) { if (s0 === null) s0 = a; e0 = a; } else if (s0 !== null) break;
          }
          if (s0 === null || R * (e0 - s0) < MIN_ARC) ok = false; else runs.push([s0, e0]);
        }
        if (ok) break;
      }
      // Bounding box of cards and arcs, in ring coordinates.
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      var grow = function (x, y) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };
      rects.forEach(function (r) { grow(r.l + MARGIN, r.t + MARGIN); grow(r.r - MARGIN, r.b - MARGIN); });
      runs.forEach(function (run) { for (var t = 0; t <= 8; t++) { var a = run[0] + (run[1] - run[0]) * t / 8; grow(R * Math.cos(a), R * Math.sin(a)); } });
      minX -= 8; minY -= 8; maxX += 8; maxY += 8;
      var sw = maxX - minX, sh = maxY - minY;
      var scale = Math.min(1, avail / sw);
      if (scale < 0.66) {
        cycle.classList.remove("ring");
        stage.removeAttribute("style");
        cards.forEach(function (c) { c.removeAttribute("style"); });
        centre.removeAttribute("style");
        return;
      }
      stage.style.width = sw + "px";
      stage.style.height = sh + "px";
      stage.style.setProperty("--cx", -minX + "px");
      stage.style.setProperty("--cy", -minY + "px");
      cards.forEach(function (c, i) {
        c.style.left = (R * Math.cos(ANG[i]) - w / 2 - minX) + "px";
        c.style.top = (R * Math.sin(ANG[i]) - hs[i] / 2 - minY) + "px";
      });
      centre.style.left = (-cw / 2 - minX) + "px";
      centre.style.top = (-ch / 2 - minY) + "px";
      svg.setAttribute("width", sw);
      svg.setAttribute("height", sh);
      svg.querySelectorAll("path.arc").forEach(function (p) { p.remove(); });
      runs.forEach(function (run) {
        var p = document.createElementNS(NS, "path");
        var x0 = R * Math.cos(run[0]) - minX, y0 = R * Math.sin(run[0]) - minY;
        var x1 = R * Math.cos(run[1]) - minX, y1 = R * Math.sin(run[1]) - minY;
        p.setAttribute("class", "arc");
        p.setAttribute("d", "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " A" + R + " " + R + " 0 0 1 " + x1.toFixed(1) + " " + y1.toFixed(1));
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "#0B0A0B");
        p.setAttribute("stroke-width", "2.5");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("marker-end", "url(#ah)");
        svg.appendChild(p);
      });
      if (scale < 1) stage.style.zoom = scale;
    };
    var cycleTimer = null;
    window.addEventListener("resize", function () { clearTimeout(cycleTimer); cycleTimer = setTimeout(layoutCycle, 120); });
    layoutCycle();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutCycle);
  }

  // Mobile plan switch (annual / monthly).
  var toggle = document.querySelector(".plan-toggle");
  var plans = document.querySelector(".plans");
  if (toggle && plans) {
    toggle.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-plan]");
      if (!b) return;
      plans.setAttribute("data-active", b.getAttribute("data-plan"));
      toggle.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
  }

  // Table of contents: highlight the section being read; close the mobile list after a jump.
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove("on"); a.removeAttribute("aria-current"); });
        var a = byId[en.target.id];
        if (a) { a.classList.add("on"); a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) obs.observe(el); });
  }
  var tocM = document.querySelector(".toc-m");
  if (tocM) tocM.addEventListener("click", function (e) { if (e.target.closest("a")) tocM.open = false; });

  // Store campaign attribution. The App Store counts installs per `ct` (App Store Connect →
  // App Analytics → Campaigns, provider token pt), Google Play per the `referrer` utm_campaign.
  // An ad that lands here with ?ct=… (or utm_campaign=…) passes its campaign through, so an install
  // from a Meta ad shows up under that ad's campaign; a plain visit counts as site_<lang>.
  // Nothing is stored: the value lives only in this page's URL and the outgoing link.
  var PT = "128637089";
  var q = new URLSearchParams(location.search);
  var clean = function (v) { return v && /^[A-Za-z0-9_.-]{1,40}$/.test(v) ? v : null; };
  var lang = (doc.getAttribute("lang") || "uk").split("-")[0];
  var passed = clean(q.get("ct")) || clean(q.get("utm_campaign"));
  var ct = passed || "site_" + lang;
  document.querySelectorAll('a[href*="apps.apple.com/app/"]').forEach(function (a) {
    var m = a.getAttribute("href").match(/id(\d+)/);
    if (m) a.href = "https://apps.apple.com/app/apple-store/id" + m[1] + "?pt=" + PT + "&ct=" + encodeURIComponent(ct) + "&mt=8";
  });
  document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(function (a) {
    var u = new URL(a.getAttribute("href"));
    u.searchParams.set("referrer", "utm_source=geteduvia.com&utm_medium=website&utm_campaign=" + ct);
    a.href = u.toString();
  });
  // Keep the campaign when the visitor switches language, so the ad's ct is not lost on /de/ etc.
  if (passed) {
    document.querySelectorAll('a[hreflang]').forEach(function (a) {
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin) return;
      u.searchParams.set("ct", ct);
      a.href = u.toString();
    });
  }
})();
