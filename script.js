// ---------- Tableau embeds ----------
// Accepts any Tableau Public link (Share link, /views/ link or /app/profile/.../viz/ link)
// and turns it into an embeddable URL.
function toEmbedUrl(link) {
  if (!link) return "";
  let url;
  try { url = new URL(link.trim()); } catch { return ""; }
  // /app/profile/<user>/viz/<Workbook>/<Sheet>  ->  /views/<Workbook>/<Sheet>
  const profile = url.pathname.match(/\/viz\/([^/]+)\/([^/]+)/);
  const path = profile ? `/views/${profile[1]}/${profile[2]}` : url.pathname;
  return `https://public.tableau.com${path}?:showVizHome=no&:embed=y&:toolbar=bottom&:tabs=n`;
}

function emptyState(height) {
  const box = document.createElement("div");
  box.className = "viz-empty";
  box.style.minHeight = `${Math.min(height, 360)}px`;
  box.innerHTML =
    "<div><strong>Tableau chart goes here</strong>" +
    "Paste the Tableau Public link into <code>data-tableau</code> in index.html</div>";
  return box;
}

function renderViz(panel, link) {
  const frame = panel.querySelector(".viz-frame");
  const height = Number(panel.dataset.height) || 600;
  const src = toEmbedUrl(link);
  frame.replaceChildren();
  if (!src) { frame.append(emptyState(height)); return; }
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.height = height;
  iframe.loading = "lazy";
  iframe.title = panel.querySelector("h3")?.textContent || "Tableau chart";
  iframe.allowFullscreen = true;
  frame.append(iframe);
}

function currentLink(panel) {
  const select = panel.querySelector(".viz-switch select");
  return select ? select.value : panel.dataset.tableau;
}

// Charts inside hidden tabs are loaded the first time their tab opens,
// because Tableau sizes itself wrongly when it loads inside a hidden element.
function loadVizIn(scope) {
  scope.querySelectorAll(".viz").forEach(panel => {
    if (panel.dataset.loaded) return;
    panel.dataset.loaded = "1";
    renderViz(panel, currentLink(panel));
  });
}

document.querySelectorAll(".viz-switch select").forEach(select => {
  select.addEventListener("change", () => renderViz(select.closest(".viz"), select.value));
});

document.querySelectorAll(".viz").forEach(panel => {
  if (!panel.closest("[hidden]")) loadVizIn(panel.parentElement);
});

// ---------- Dashboard tabs ----------
const tabs = [...document.querySelectorAll(".view-tab")];

function selectTab(tab, focus = false) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  const panel = document.getElementById(tab.getAttribute("aria-controls"));
  loadVizIn(panel);
  if (focus) tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", e => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) {
      e.preventDefault();
      selectTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
    }
  });
});

// ---------- Nav: mobile toggle + current section ----------
const nav = document.getElementById("site-nav");
const toggle = document.querySelector(".nav-toggle");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.matches("a")) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

const links = new Map([...nav.querySelectorAll("a")].map(a => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(a => a.classList.remove("is-active"));
    links.get(entry.target.id)?.classList.add("is-active");
  });
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

// ---------- Hero bars ----------
// Decorative bar chart; the two amber bars stand for the outliers the project is about.
(function drawBars() {
  const svg = document.querySelector(".hero-bars");
  if (!svg) return;
  const values = [62, 88, 74, 120, 96, 140, 58, 180, 132, 110, 210, 150, 84, 168];
  const highlight = new Set([7, 10]);
  const g = svg.querySelector(".bars");
  const w = 360 / values.length;
  values.forEach((v, i) => {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", (i * w + 3).toFixed(1));
    r.setAttribute("y", 250 - v);
    r.setAttribute("width", (w - 6).toFixed(1));
    r.setAttribute("height", v);
    if (highlight.has(i)) r.classList.add("hi");
    r.style.animationDelay = `${i * 45}ms`;
    g.append(r);
  });
  svg.classList.add("animate");
})();
