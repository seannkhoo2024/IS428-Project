# Which Degree Pays Off?

**Live site:** https://whichdegreepaysoff.vercel.app/

An interactive website for comparing graduate outcomes across Singapore's six autonomous universities (NUS, NTU, SMU, SIT, SUTD and SUSS). It turns 13 years of Graduate Employment Survey (GES) results, 2013 to 2025, into a guided story with nine embedded Tableau Public dashboards. Pay and tuition fees are shown in 2024 dollars, so years can be compared without inflation getting in the way.

Built for IS428 Visual Analytics (Singapore Management University) by Group 2: Angel Tan, Jerald Lai, Seann Khoo, Shernice Oh and Wesley Tan.

## What the site answers

Students pick degrees with little hard data. The GES is published every year as long tables, one per university, in nominal dollars, which makes it hard to compare the same course across universities or across years. The site lets a reader:

- compare the same course at different universities on one basis;
- weigh pay against job security and how predictable pay is;
- see what a degree costs each of five student groups and how long it takes to earn back the fees;
- check whether a programme's lead lasts, in real terms; and
- look up one programme on a single screen.

## How the site tells the story

The page reads top to bottom as a story. The navigation bar jumps to any part.

| Order | Section | Anchor | What it does |
| --- | --- | --- | --- |
| 1 | Home | `#home` | Title, team, headline figures and the question the site answers |
| 2 | The problem | `#overview` | Why it is hard to tell whether a degree is worth it, who needs the answer and why it matters |
| 3 | Explore the dashboards | `#explore` | Three ways in: read the story (Chapters 1–7), look up a programme (Chapter 8), or check the data (Chapter 9) |
| 4 | Chapter 1: The Puzzle | `#puzzle` | Graduates earn more, but fewer land permanent jobs |
| 5 | Chapter 2: What You Study | `#what-you-study` | Field sets the floor, but not the ceiling |
| 6 | Chapter 3: Where You Study | `#where-you-study` | The same degree can pay very differently |
| 7 | Chapter 4: Trade-offs | `#trade-offs` | High pay, job security and predictable pay rarely come together |
| 8 | Chapter 5: What It Costs | `#cost` | The same degree has five price tags |
| 9 | Chapter 6: Paying It Back | `#payback` | Who you are changes the payback more than what you study |
| 10 | Chapter 7: Does It Last? | `#does-it-last` | Leaders persist, and supply is not destiny |
| 11 | Chapter 8: Report Card | `#report-card` | Your programme, in one screen |
| 12 | Key takeaways | `#takeaways` | The main findings in brief |
| 13 | Recommendations | `#recommendations` | What local students, international students, parents, policymakers, and universities and MOE can do, plus future work |
| 14 | Chapter 9: Data & Methods | `#data-methods` | Sources, cleaning, inflation adjustment, assumptions, limitations and the data coverage dashboard |
| – | Team | `#team` | Group members, shown in the Home section and linked from the navigation bar |

Chapters 1 to 7 follow the same layout, so readers know where to look:

1. a heading that states the finding;
2. colour legends for the dashboard;
3. the embedded Tableau dashboard, with an "Open in Tableau Public" button;
4. a short "How to read each chart" note;
5. three cards: **What this shows**, **Key insight** and **Why it matters**; and
6. a row on how each stakeholder group can use the dashboard, followed by a "How to use" line.

Chapter 8 (Report Card) explains its controls and how to read its profile chart instead of the three cards. Chapter 9 (Data & Methods) adds a reliability table and collapsible notes on the method.

## Dashboards

All nine dashboards come from one Tableau workbook (`Project Workbook.twbx`), published to Tableau Public at 1600 × 900.

| Slot | Dashboard | Chapter | Tableau Public link |
| --- | --- | --- | --- |
| `viz-1` | 1 The Puzzle | 1 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/1ThePuzzle |
| `viz-2` | 2 What You Study | 2 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/2WhatYouStudy |
| `viz-3` | 3 Where You Study | 3 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/3WhereYouStudy |
| `viz-4` | 4 Trade-offs | 4 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/4Trade-offs |
| `viz-5` | 5 What It Costs | 5 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/5WhatItCosts |
| `viz-6` | 6 Paying It Back | 6 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/6PayingItBack |
| `viz-7` | 7 Does It Last | 7 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/7DoesItLast |
| `viz-8` | 8 Report Card | 8 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/8ReportCard |
| `viz-9` | 9 Data Coverage | 9 | https://public.tableau.com/views/ProjectWorkbook_17949097169680/9DataCoverage |

## Run it locally

No build step and no packages to install. The only external script is the Tableau Embedding API, loaded from Tableau's CDN, so you need an internet connection for the dashboards to appear.

Open `index.html` in a browser, or serve the folder:

    python -m http.server 8000

Then go to http://localhost:8000.

## Repository contents

| Path | What it holds |
| --- | --- |
| `index.html` | All page content: the story sections, the nine dashboard slots with their colour legends and reading notes, key takeaways, recommendations and Data & Methods |
| `css/styles.css` | Layout, colours, fonts, responsive and print styles |
| `js/main.js` | Mobile navigation, scroll-spy, lazy-loading and sizing of the dashboards, and the "Open in Tableau Public" buttons |
| `assets/favicon.svg` | Favicon |
| `vercel.json` | Clean URLs on Vercel |
| `README.md` | This file |

## Built with

- HTML, CSS and plain JavaScript
- Tableau Desktop and Tableau Public, with the Tableau Embedding API v3
- Vercel for hosting

## Data sources

- **Graduate Employment Survey, 2013–2024** – Ministry of Education, on Data.gov.sg: https://data.gov.sg/datasets/d_3c55210de27fcccda2ed0c63fdd2b352/view
- **Graduate Employment Survey 2025 (Table T15)** – Ministry of Manpower
- **Graduates from Institutions of Higher Learning by Institution and Course** – Ministry of Manpower
- **Undergraduate tuition fee schedules, AY2026/27** – published by each of the six universities
- **Consumer Price Index, 2024 = 100 (monthly)** – Singapore Department of Statistics: https://tablebuilder.singstat.gov.sg/table/TS/M213751

The Data & Methods section of the site explains how the data was cleaned, how the 458 raw degree titles were mapped to 183 programmes, how pay and fees were adjusted for inflation, and what the data cannot tell you.

## How the page works

- **Lazy loading:** each dashboard loads only when the reader scrolls near it, because nine dashboards on one page are heavy. The placeholder is hidden once it loads.
- **Links:** each slot's `data-src` holds its Tableau Public link, and the "Open in Tableau Public" button uses the same link. Both `/views/...` and `/app/profile/<name>/viz/...` links work. The link Tableau shows right after publishing (`https://public.tableau.com:9443/views/...?:redirect=auth...`) only works while signed in; the script removes the `:9443` and everything after `?`.
- **Sizing:** the script reads each dashboard's real size from Tableau when it loads and scales the frame to fit its card, at full size on screens about 1700 px wide or more. Below 700 px wide, the frame keeps a 900 px minimum, scrolls sideways and shows "Best viewed on a laptop".
- **Navigation:** on wide screens the navigation bar shows Chapters 1–7 as numbered steps, marking the chapter being read and the ones already passed; Report Card and Data & Methods sit apart as separate links. On small screens it collapses into a menu.
- **Colour legends:** the dashboards do not carry their own colour legends; each slot has a legend just above it (`<div class="legends">`). The only legend kept inside Tableau is the Report Card pay-trend legend, because it changes with the selected programme. University colours match the dashboards: NUS `#f28e2b`, NTU `#4e79a7`, SMU `#76b7b2`, SIT `#e15759`, SUSS `#59a14f`, SUTD `#edc948`. Other colours are tokens at the top of `css/styles.css`.

## Updating the site

**Dashboards.** Republishing the workbook to the same Tableau Public workbook updates every embed; `index.html` only needs changing if a dashboard is renamed. To republish: in Tableau Desktop, open `Project Workbook.twbx`, choose **File → Save to Tableau Public**, and keep **Show Sheets as Tabs** turned off so each embed shows one dashboard. If a dashboard is renamed, update its `data-src`.

**Text and figures.** All text lives in `index.html`. If a dashboard figure changes, update it in the hero (stat cards and the two slope charts; the SVG coordinates are commented with their scales), the chapter lead and its three cards, and Key takeaways.

**Legend colours.** If a colour changes in Tableau, change the matching `--c:#xxxxxx` value in that slot's legend.

## Deploy to Vercel

**Git import:** push this repository to GitHub, then import it at vercel.com/new. Framework preset: **Other**. Leave the build command and output directory empty. Each push to `main` redeploys automatically.

**CLI:**

    npm i -g vercel
    vercel        # preview deploy
    vercel --prod # production deploy

## Known limitations

- Each dashboard is embedded on its own, so a filter set in one (for example the field chosen in Chapter 2) does not carry into the next. Readers set field, year and student group on each dashboard that has those controls.
- The dashboards are designed for a laptop screen. On a phone they scroll sideways; rotating the phone or opening the dashboard in Tableau Public works better.
- Figures describe graduates about six months after graduation and show association, not cause and effect. See Data & Methods on the site for the full list of limitations.
