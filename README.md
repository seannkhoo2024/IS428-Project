# IS428 Project Dashboard

A single-page website that presents our Tableau Public dashboards with the story around them: problem, key findings, dashboards, deep dive and recommendations.

No build step. It is plain HTML, CSS and JavaScript.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | All page content and the Tableau links |
| `styles.css` | Layout, colours and fonts |
| `script.js` | Loads Tableau embeds, dashboard tabs, nav |

## Preview locally

Open `index.html` in a browser, or run a small server from this folder:

```sh
python -m http.server 8000
```

Then go to http://localhost:8000.

## Add a Tableau chart

1. Publish the viz to Tableau Public, open it, click **Share** and copy the link.
2. In `index.html`, find the chart panel (`<article class="viz" ...>`) and paste the link into `data-tableau=""`.
3. Optional: change `data-height="600"` to fit the dashboard's height.

Any of these link formats work:

- `https://public.tableau.com/views/Workbook/Sheet?:language=en-US&...`
- `https://public.tableau.com/app/profile/your.name/viz/Workbook/Sheet`

A panel with no link shows a placeholder.

### Chart with a dropdown

For one panel that switches between several sheets, put each link in an `<option value="...">` inside the panel's `<select>`. Chart 2 in the first view is an example.

### Add or remove a chart

Copy or delete a whole `<article class="viz"> ... </article>` block.

## Edit content

Replace the placeholder text in `index.html`: title, team names, problem, findings, chart notes, deep dive, recommendations, footer and data sources. To rename the three dashboard views, edit the `.view-tab` buttons.

## Deploy

**Vercel:** import this GitHub repo at vercel.com/new. Leave the framework preset as "Other" and the build settings empty.

**GitHub Pages:** in the repo, go to Settings > Pages and deploy from the `main` branch, root folder.
