# LAVREON

Public presentation site and client-portal prototype for LAVREON, a private intelligence office. Plain HTML, CSS and JavaScript with no build step. Published with GitHub Pages: https://mestarihannes.github.io/lavreon/

## Files
| File | Purpose |
|---|---|
| `index.html` | Public presentation page |
| `dashboard.html` | Client portal demo (fictional client Alex Morgan) |
| `styles.css`, `premium.css` | Public page styles; `premium.css` also holds shared gold accents |
| `dashboard.css` | Portal styles |
| `language.css`, `language.js`, `translations-fi.js` | EN/FI language switch and Finnish dictionary |
| `intro.js` | Opening logo reveal (2.4 s, once per browser session) |
| `site.js` | Mobile menu and collapsible retainer scope on the public page |
| `dashboard.js` | Portal module registry, routing, search, chart and balance masking |
| `intelligence-feed.js` | Fictional priority intelligence and opportunities (DATA → CONTEXT → INTELLIGENCE → ACTION) |
| `demo-dates.js` | Keeps fictional demo dates relative to today |
| `assets/` | Official symbol, favicon, touch icon and link-preview image |

## Local preview
Serve the folder with any static server and open `index.html` or `dashboard.html`. When a CSS or JS file changes, update its `?v=` query in both HTML files so returning visitors get the new version.

## Languages
English and Finnish. The language switch stores `lavreon-language` in localStorage. Translation works on visible text, `aria-label`, `placeholder`, the meta description and the page title. Finnish strings live in `translations-fi.js`; new visible text needs a Finnish entry there. In Finnish, standalone figures are shown in Finnish format (12 430 000 €, +6,8 %). Brand and tier names stay in English.

## Client portal demo
Client view is the default; `dashboard.html?mode=admin` shows the editor view. These modes are not authentication: all source and demo content is public.

The module registry in `dashboard.js` drives the sidebar, routes, search, cards and quick actions. The editor always sees all modules. Visibility choices are stored as `lavreon-modules-v1` in this browser only. Reset restores the 12 default client modules; Companies, Expenses and Tax & Legal start hidden.

All financial values, policies, companies, meetings and scenarios are fictional and labelled as such. Fictional dates are rendered relative to the visit date by `demo-dates.js`. Priority intelligence and opportunities derive only from the sample figures on the page and make no recommendation.

### Curated AI Signal Brief
Three manually selected developments from public sources, checked 15 September 2026. No live search, backend, API keys or automatic refresh. Publication dates are real and stay static; implications are editorial interpretations.

## Pricing
The public page shows illustrative launch retainers (Personal from €990, Signature €9,500 and Private Office €18,000 per month). They are not final and nothing can be purchased on the site.

## Production gaps
Not implemented: real authentication, server-enforced authorisation and row-level security, client provisioning, protected document storage, audit logging, live financial or policy integrations, licensed market data, a monitored news pipeline, a contact channel and a privacy notice. Local presentation preferences are not security. Never put real client information into these public files.

## Verification checklist
Desktop (1440 px) and mobile (375 px), English and Finnish: no console errors, no horizontal overflow, the intro plays once and never blocks the page, the mobile menu opens and closes, every anchor lands below the header, the language switch translates both pages, portal routes, editor toggles and reset work, balance masking hides amounts only, and chart periods redraw.
