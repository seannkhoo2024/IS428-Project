# Which Degree Pays Off?

Project website for IS428 Visual Analytics, Group 2: a decade of Singapore Graduate Employment Survey results (2013–2025) in real 2024 dollars, told in nine chapters with nine embedded Tableau Public dashboards.

Plain HTML, CSS and JavaScript. No build step, no dependencies besides the Tableau Embedding API.

## Files

| Path | What it holds |
| --- | --- |
| `index.html` | All page content, including the nine dashboard slots, their colour legends and the Data & Methods section |
| `css/styles.css` | Layout, colours, fonts, responsive and print styles |
| `js/main.js` | Mobile nav, scroll-spy, lazy-loading of embeds, "Copy embed code" and "Open in Tableau Public" buttons |
| `assets/` | Favicon |
| `vercel.json` | Clean URLs on Vercel |

## Preview locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
```

Then go to http://localhost:8000.

## 1. Publish the workbook

1. In Tableau Desktop, open `Project Workbook.twbx` and choose **File → Save to Tableau Public**. Publish once; every dashboard gets its own URL, `https://public.tableau.com/views/<WorkbookName>/<DashboardName>`.
2. On Tableau Public, turn off **Show Sheets as Tabs** so each embed shows one dashboard.
3. Parameter actions (clicking a field, a programme or a peer) work on Tableau Public.

## 2. Paste each embed

Each dashboard has one slot in `index.html`:

| Slot | Dashboard to embed | Section | Anchor |
| --- | --- | --- | --- |
| `viz-1` | `1 The Puzzle` | Chapter 1 | `#puzzle` |
| `viz-2` | `2 What You Study` | Chapter 2 | `#what-you-study` |
| `viz-3` | `3 Where You Study` | Chapter 3 | `#where-you-study` |
| `viz-4` | `4 Trade-offs` | Chapter 4 | `#trade-offs` |
| `viz-5` | `5 What It Costs` | Chapter 5 | `#cost` |
| `viz-6` | `6 Paying It Back` | Chapter 6 | `#payback` |
| `viz-7` | `7 Does It Last` | Chapter 7 | `#does-it-last` |
| `viz-8` | `8 Report Card` | Chapter 8 | `#report-card` |
| `viz-9` | `9 Data Coverage` | Chapter 9 (Data & Methods) | `#data-methods` |

Dashboard numbers match chapter numbers, and each `data-src` uses the dashboard name as published (`5WhatItCosts`, `6PayingItBack`, `7DoesItLast`, `8ReportCard`, `9DataCoverage`). If a dashboard is renamed in Tableau and republished, update its `data-src` to match.

Each slot's `data-src` holds its Tableau Public link, for example:

```html
<figure class="viz-slot" id="viz-1" data-dashboard="1 The Puzzle" data-src="https://public.tableau.com/views/ProjectWorkbook_17949097169680/1ThePuzzle">
```

The script loads the dashboard only when the reader scrolls near it (nine vizzes on one page are heavy), hides the placeholder, and points the "Open in Tableau Public" button at the same link. Both `/views/...` links and `/app/profile/<name>/viz/...` links work. The link Tableau shows right after publishing (`https://public.tableau.com:9443/views/...?:redirect=auth...`) only works while you are signed in; the script removes the `:9443` and everything after `?`, but the cleanest value is just `https://public.tableau.com/views/<Workbook>/<DashboardName>`.

Republishing the workbook to the same Tableau Public workbook updates every embed on the site; no change to `index.html` is needed unless a dashboard is renamed.

If you'd rather paste Tableau's own iframe code from **Share → Embed Code** into a slot's `viz-canvas`, you can delete the `tableau.embedding.3.latest.min.js` script tag in `<head>`.

The "Copy embed code" button on each slot copies a ready-made `<tableau-viz>` line for that dashboard.

The dashboards are published at a fixed 1600 × 900. Each frame adds about 50 px for Tableau's toolbar, and the script reads each dashboard's real size from Tableau when it loads, then scales the whole frame to fit its card (full size on screens about 1700 px wide or more). Dashboard cards are wider than the text column. Below 700 px wide the frame keeps a 900 px minimum, scrolls sideways and shows "Best viewed on a laptop".

## Colour legends

The dashboards no longer carry their own colour legends, so each slot has a legend just above it (`<div class="legends">` with one `<ul class="legend">` per key). If a colour changes in Tableau, change the matching `--c:#xxxxxx` value there. The only legend kept inside Tableau is the Report Card pay-trend legend, because it changes with the selected programme.

## 3. Update copy

All text lives in `index.html`. Every figure comes from `changes.md` or `context.md` (sections A11 and A12); where they disagree, `changes.md` wins. If a dashboard number changes, update it in:

- the hero (stat cards and the two slope charts; the SVG coordinates are commented with their scales),
- the chapter lead and the "What this shows / Key insight / Why it matters" cards,
- Key takeaways.

Colours are tokens at the top of `css/styles.css`. University colours match the dashboards (NUS `#f28e2b`, NTU `#4e79a7`, SMU `#76b7b2`, SIT `#e15759`, SUSS `#59a14f`, SUTD `#edc948`).

## 4. Deploy to Vercel

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
