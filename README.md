# Which Degree Pays Off?

Project website for IS428 Visual Analytics, Group 2: a decade of Singapore Graduate Employment Survey results (2013–2025) in real 2024 dollars, told in seven chapters with eight embedded Tableau Public dashboards.

Plain HTML, CSS and JavaScript. No build step, no dependencies besides the Tableau Embedding API.

## Files

| Path | What it holds |
| --- | --- |
| `index.html` | All page content, including the eight dashboard slots and the Data & Methods section |
| `css/styles.css` | Layout, colours, fonts, responsive and print styles |
| `js/main.js` | Mobile nav, scroll-spy, lazy-loading of embeds, "Copy embed code" and "Open in Tableau Public" buttons |
| `assets/` | Favicon, and the dashboard preview images (`dashboard-1.png` … `dashboard-8.png`) you add |
| `vercel.json` | Clean URLs on Vercel |

## Preview locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
```

Then go to http://localhost:8000.

## 1. Publish the workbook

1. In Tableau Desktop, open `Prrp_v2.twbx` and choose **File → Save to Tableau Public**. Publish once; every dashboard gets its own URL, `https://public.tableau.com/views/<WorkbookName>/<DashboardName>`.
2. On Tableau Public, turn off **Show Sheets as Tabs** so each embed shows one dashboard.
3. Parameter actions (clicking a field, a programme or a peer) work on Tableau Public.

## 2. Paste each embed

Each dashboard has one slot in `index.html`:

| Slot | Dashboard to embed | Section |
| --- | --- | --- |
| `viz-1` | `1 The Puzzle` | Chapter 1 |
| `viz-2` | `2 What You Study` | Chapter 2 |
| `viz-3` | `3 Where You Study` | Chapter 3 |
| `viz-4` | `4 Trade-offs` | Chapter 4 |
| `viz-5` | `5 What It Costs` | Chapter 5 |
| `viz-6` | `6 Does It Last` | Chapter 6 |
| `viz-7` | `7 Report Card` | Chapter 7 |
| `viz-8` | `8 Data Coverage` | Data & Methods |

Search `index.html` for `id="viz-1"` (etc.) and use **one** of these options.

**Option A (recommended): fill in `data-src`.**

```html
<figure class="viz-slot" id="viz-1" data-dashboard="1 The Puzzle" ... data-src="https://public.tableau.com/views/Prrp_v2/1ThePuzzle">
```

The script loads the dashboard only when the reader scrolls near it (eight vizzes on one page are heavy), hides the placeholder, and points the "Open in Tableau Public" button at the same link. Both `/views/...` links and `/app/profile/<name>/viz/...` links work. The link Tableau shows right after publishing (`https://public.tableau.com:9443/views/...?:redirect=auth...`) only works while you are signed in; the script removes the `:9443` and everything after `?`, but the cleanest value is just `https://public.tableau.com/views/Prrp_v2/<DashboardName>`, e.g. `https://public.tableau.com/views/Prrp_v2/1ThePuzzle`.

**Option B: uncomment the snippet.** Inside each slot there is:

```html
<!-- Replace PUBLIC_URL with the Tableau Public share link for this dashboard -->
<!-- <tableau-viz src="PUBLIC_URL" width="1200" height="870" toolbar="bottom" hide-tabs></tableau-viz> -->
```

Uncomment the second line and replace `PUBLIC_URL`. The placeholder hides itself. This loads immediately rather than lazily. Also add the link to `data-src` so the "Open in Tableau Public" button works.

**Option C: Tableau's own iframe embed code.** If you paste the code from Tableau Public's **Share → Embed Code** into the `viz-canvas` instead, you can delete the `tableau.embedding.3.latest.min.js` script tag in `<head>`.

The "Copy embed code" button on each slot copies a ready-made `<tableau-viz>` line for that dashboard.

Each slot is 1200 × 870: the 1200 × 820 dashboard plus about 50 px for Tableau's toolbar. Below 900 px wide it scrolls sideways and shows "Best viewed on a laptop".

## 3. Add preview images

Export each dashboard from Tableau (**Dashboard → Export Image**) as `assets/dashboard-1.png` … `assets/dashboard-8.png`. They are used when the page is printed (embeds are hidden in print) and `dashboard-1.png` is the social-sharing image. After deploying, change the `og:image` meta tag in `index.html` to the full URL, e.g. `https://your-site.vercel.app/assets/dashboard-1.png`.

## 4. Update copy

All text lives in `index.html`. Every figure comes from `context.md` (sections A11 and A12). If a dashboard number changes, update it in:

- the hero (stat cards and the two slope charts; the SVG coordinates are commented with their scales),
- the chapter lead and the "What this shows / Key insight / Why it matters" cards,
- Key takeaways.

Colours are tokens at the top of `css/styles.css`. University colours match the dashboards (NUS `#f28e2b`, NTU `#4e79a7`, SMU `#76b7b2`, SIT `#e15759`, SUSS `#59a14f`, SUTD `#edc948`).

## 5. Deploy to Vercel

**Git import:** push this repo to GitHub, then at vercel.com/new import it. Framework preset: **Other**. Leave build command and output directory empty.

**CLI:**

```sh
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

Each push to `main` redeploys automatically when the repo is imported.

## Note on cross-dashboard parameters

Each dashboard is embedded on its own, so a parameter set in one (for example the Field chosen by clicking the ranking in Chapter 2) does not carry into the next embed. Readers set Field, Year and Student group on each dashboard that has those controls.
