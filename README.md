# LAVREON presentation V1

The existing plain HTML/CSS/JS site is preserved. Start a static server in this folder and open index.html or dashboard.html.

## Preview modes
Client is the default. Use the labelled buttons or dashboard.html?mode=admin for the editor. These modes are NOT authentication. All source and demo content is public. The fictional client is Alex Morgan, and financial/policy values are invented.

The single module registry in dashboard.js controls routes, sidebar, search, cards and quick actions. The editor always sees all 14 modules. Toggle settings are stored as lavreon-modules-v1 in localStorage on this browser/origin; they do not sync to a server or another device. If storage is unavailable, changes last for the current page visit. Reset restores 10 default client modules. Empty selections get an explicit empty state; hidden routes fall back to an available module. Companies, Expenses and Tax & Legal start hidden and appear under Your World when selected for a client; configuration controls remain editor-only.

## Curated AI Signal Brief
Exactly three manually selected developments, checked 15 September 2026. No live AI search, backend fetch, API keys or automatic refresh. Publication dates are separate from the editorial update date. Primary-source links are embedded in each item. Implications are editorial interpretations.

1. Google DeepMind WeatherNext 3 — 3 September 2026.
2. Google Android: item-location memory and Guided vision — 1 September 2026; announced/coming soon, device and country limits apply.
3. Anthropic: alignment and agent-containment changes — 31 August 2026; incidents concerned evaluation models with reduced safeguards.

Future architecture: server-side search/fetch -> rank -> summarise -> editorial checks -> cache -> client feed. Keep keys on the server. Store source URL, publication time, verification/update time, provenance and stale/error state. Never fabricate headlines while a source is unavailable.

## Languages
The existing translation engine and lavreon-language key are retained. English, Finnish, Spanish, Chinese, Hindi, Arabic, French, Bengali, Portuguese, Russian, Urdu and Indonesian. Finnish retains the existing broader dictionary; other languages cover core navigation, main headings and actions with English fallback for body/demo text. The dropdown supports Tab, arrows, Home/End, Enter/Space, Escape, outside click and focus leaving. Arabic and Urdu use RTL layout. Brand names remain unchanged.

## Production gaps
Real authentication, server-enforced authorisation and row-level security (RLS), client provisioning, protected document storage, audit logging, live financial/policy integrations, licensed market feeds and a monitored news pipeline are not implemented. Local presentation preferences are not security. Do not insert real client information into these public files.

## Verification
Use desktop 1440px and mobile 390px, check all routes and preview modes, toggle persistence/reset, empty selection, search filtering, chart periods, balance masking, document/report disclosure and language keyboard controls. Check both pages and RTL for overflow. Intro and symbol assets are unchanged. Reduced motion disables lift and preserves the existing intro bypass.

### V1 verification completed — 15 September 2026
Browser checks at 1440 × 1000 and 390 × 844: homepage, intro completion, portal link, client/editor modes and visual review passed with no horizontal overflow. Verified module persistence after reload, search/link/card filtering, enabling Companies for the client, all-off empty state and restoring defaults. Checked existing chart period and balance masking, document/report disclosures, internal routes, all 12 language selections, Finnish persistence, Arabic/Urdu direction, keyboard language selection, Escape/outside close and mobile navigation. No browser error/warning logs were recorded. JavaScript syntax and git diff checks passed. Reduced-motion behaviour was reviewed in CSS and the preserved intro source; it was not separately emulated in the browser.
