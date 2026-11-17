// Which Degree Pays Off? – site behaviour
// 1. Mobile nav toggle   2. Scroll-spy   3. Tableau embed slots
// (lazy loading, "Open in Tableau Public", copy embed code)

(function () {
  "use strict";

  // ---------- 1. Mobile nav ----------
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { closeNav(); toggle.focus(); }
  });

  // ---------- 2. Scroll-spy ----------
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const targets = links
    .map((a) => ({ a, el: document.getElementById(a.hash.slice(1)) }))
    .filter((t) => t.el);

  function updateActive() {
    const line = window.innerHeight * 0.35;
    let current = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top <= line) current = t;
    }
    // At the very bottom of the page, the last section wins.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = targets[targets.length - 1];
    }
    links.forEach((a) => {
      const on = a === current.a;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();

  // ---------- 3. Tableau embed slots ----------
  // To embed a dashboard, paste its Tableau Public link into data-src="" on the
  // <figure class="viz-slot">. Both link styles work:
  //   https://public.tableau.com/views/<Workbook>/<Dashboard>
  //   https://public.tableau.com/app/profile/<name>/viz/<Workbook>/<Dashboard>
  //   https://public.tableau.com:9443/views/...?:redirect=auth&...  (the link Tableau
  //   shows right after publishing; the port and settings are stripped here)
  function toViewsUrl(link) {
    if (!link) return "";
    let url;
    try { url = new URL(link.trim()); } catch (_) { return ""; }
    const m = url.pathname.match(/\/(?:views|viz)\/([^/]+)\/([^/?#]+)/);
    if (m && /(^|\.)tableau\.com$/.test(url.hostname)) {
      return "https://public.tableau.com/views/" + m[1] + "/" + m[2];
    }
    return url.origin + url.pathname;
  }

  function snippetFor(src) {
    return '<tableau-viz src="' + (src || "PUBLIC_URL") +
      '" width="1200" height="870" toolbar="bottom" hide-tabs></tableau-viz>';
  }

  function mountViz(slot, src) {
    const canvas = slot.querySelector(".viz-canvas");
    if (canvas.querySelector("tableau-viz, iframe")) return;
    const viz = document.createElement("tableau-viz");
    viz.setAttribute("src", src);
    viz.setAttribute("width", "1200");
    viz.setAttribute("height", "870");
    viz.setAttribute("toolbar", "bottom");
    viz.setAttribute("hide-tabs", "");
    canvas.appendChild(viz);
    slot.classList.add("is-embedded");
  }

  const slots = [...document.querySelectorAll(".viz-slot")];
  const lazy = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slot = entry.target;
          obs.unobserve(slot);
          mountViz(slot, slot.dataset.resolvedSrc);
        });
      }, { rootMargin: "800px 0px" })
    : null;

  slots.forEach((slot) => {
    const src = toViewsUrl(slot.dataset.src);
    const name = slot.dataset.dashboard || "dashboard";
    const canvas = slot.querySelector(".viz-canvas");
    const open = slot.querySelector("[data-open-public]");
    const copy = slot.querySelector("[data-copy-embed]");

    // A <tableau-viz> or iframe pasted directly into the canvas also counts.
    const pasted = canvas.querySelector("tableau-viz, iframe, .tableauPlaceholder");
    if (pasted) slot.classList.add("is-embedded");
    const publicUrl = src || (pasted && toViewsUrl(pasted.getAttribute("src"))) || "";

    // "Open in Tableau Public" stays disabled until a link exists.
    if (open) {
      if (publicUrl) {
        open.href = publicUrl;
        open.removeAttribute("data-todo");
        open.removeAttribute("aria-disabled");
      } else {
        open.setAttribute("aria-disabled", "true");
        open.title = "Link not added yet: paste the Tableau Public URL into data-src";
        open.addEventListener("click", (e) => e.preventDefault());
      }
    }

    // Copy a ready-to-paste <tableau-viz> snippet for this dashboard.
    if (copy) {
      copy.setAttribute("aria-label", "Copy embed code for " + name);
      copy.addEventListener("click", () => {
        const text = snippetFor(publicUrl);
        const done = () => {
          const label = copy.textContent;
          copy.textContent = "Copied";
          setTimeout(() => { copy.textContent = label; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
        } else {
          fallbackCopy(text, done);
        }
      });
    }

    if (src && !pasted) {
      slot.dataset.resolvedSrc = src;
      if (lazy) lazy.observe(slot); else mountViz(slot, src);
    }
  });

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (_) { /* nothing else to try */ }
    ta.remove();
  }

  // Before printing, open every accordion so the methods text is included.
  window.addEventListener("beforeprint", () => {
    document.querySelectorAll(".accordions details").forEach((d) => {
      if (!d.open) { d.open = true; d.dataset.printOpened = "1"; }
    });
  });
  window.addEventListener("afterprint", () => {
    document.querySelectorAll('.accordions details[data-print-opened]').forEach((d) => {
      d.open = false; delete d.dataset.printOpened;
    });
  });
})();
