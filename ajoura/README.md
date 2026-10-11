# AJOURA — independent product and interactive prototype

## Existing concept and scope
The earlier implementation was a static concept illustration inside the LAVREON header and styles. Its established concept was a digital vehicle diary for private motorists: own vehicles, odometer readings, dated maintenance, tyre changes and inspections. The headline, development status, Finnish language, blue/cyan palette and DRONEX attribution are retained. The original illustration remains at `ajoura-vision.png` as reference material but is not loaded by the new pages.

## Structure
- `index.html`: standalone product page; the only LAVREON connection is its quiet return link.
- `ajoura.css`: independent shared typography, colours, layout and responsive rules.
- `app.html`: separate demo experience with a generic premium phone frame.
- `app.css`: phone hardware, scrollable screen, responsive demo shell and reduced-motion rules.
- `app.js`: five small view renderers, fictional seed data, hash navigation and in-memory event creation.
- `logo.svg`: the AJOURA wordmark with its car-roof sweep, redrawn as vector from the original concept artwork (`ajoura-vision.png`). Used in the page header, footer, demo header and inside the phone.
- `mark.svg`: square app icon and favicon derived from the same wordmark (white A and sweep on the blue/cyan gradient).
- `car-render.js`: stylised side-view car renders (sedan, hatchback, wagon, SUV) built as SVG and shaded from one body colour, with no manufacturer branding. Used for every car on the landing page and in the demo.

No frameworks, build step, external fonts or dependencies. Serve the repository with a static HTTP server. The existing `ajoura/` link supports the GitHub Pages `/lavreon/` prefix.

## Demo behaviour
Welcome -> dashboard -> vehicle list -> vehicle history -> new event / event detail. A two-tab bar (Koti, Ajoneuvot) appears on browsing views. The dashboard shows vehicle, event and current-year cost totals, the three newest events across vehicles and an example service reminder. The reminder uses an illustrative 12 month / 15 000 km interval, labelled as the user's own setting rather than manufacturer guidance. Visitors can add a fictional vehicle (name, plate, model year, odometer). Each vehicle view shows total and current-year costs. Browser Back and Forward follow hash history. Two fictional vehicles have independent histories. New entries update the selected vehicle's event count; its odometer remains the maximum recorded reading. Earlier historical entries are supported. Required type, date and odometer fields are validated; cost and note are optional. An odometer reading that contradicts an earlier or later entry shows a warning; pressing "Tallenna silti" saves it anyway. User text is escaped before rendering.

There is no server, authentication, payment, telemetry, personal data collection or persistent storage. Refresh restores the fictional data. Reset restores the welcome screen and initial data. Do not present the demo as a released application.

## Verification (8 October 2026)
Browser checked: landing at 320, 390, 768 and 1440 pixels; device at 320x568, 390x844, 768x1024 and desktop. No horizontal page/screen overflow; phone fits viewport. Tested welcome, both vehicle cards, required-field rejection, adding an event, changed odometer/count, event details (including literal `<testi>` user text), unaffected second vehicle, cancellation, reset, browser Back, product/demo return and LAVREON return/re-entry. No browser errors recorded. Reduced-motion rules reviewed in source. Syntax and whitespace checks run before publication.

## Example vehicles
The primary demo vehicle is a fictional Volvo XC60 (2020) with eight history entries from 2024–2026, and the second is a Toyota Corolla (2018). Both are drawn with `car-render.js`. The earlier Wikimedia photo and its credits page were removed when the demo moved to rendered models.

## Dashboard update (11 October 2026)
Browser checked at 1440x900, 390x844 and 320x568: dashboard, vehicle tab bar, adding a vehicle (empty-field rejection, escaped `<b>` in the name), adding an event to it, cost totals, odometer conflict warning and override. No console errors and no overflow in the page or the phone screen.

## Original logo (11 October 2026)
The wordmark now follows the concept artwork: italic geometric capitals, a blue gradient first A, dark navy remaining letters and a blue-to-cyan car-roof sweep, with "by DRONEX" beneath. It is a hand-built SVG (no font dependency), so replace it with the master vector file if one turns up. The second demo vehicle is now named Toyota Corolla to match the concept artwork (XYZ-789, 2018, 92 450 km). Checked at 1440x900, 390x844 and 320x568 with no console errors, failed requests or overflow.

## Registration lookup and car renders (11 October 2026)
Adding a vehicle starts from the registration plate. The lookup is **simulated**: `app.js` holds a small fictional registry (LMN-456, KLM-482, FIN-202, MKV-310, EKO-500, RTX-118) and waits briefly to imitate a network call. No real register is queried, and the UI says so. Unknown plates fall back to manual entry. The details step pre-fills model, year, body type and fuel; the user adds the odometer reading and picks one of eight exterior colours, and the render updates live. A real lookup would need a verified legal and technical source (for example Traficom open data or a licensed commercial API), which has not been arranged. The landing page gained a "Tulossa" section that separates what the demo shows now from planned features.
Checked at 1440x900, 390x844 and 320x568: lookup hit, miss, invalid plate, example chips, manual entry, colour and body changes, required odometer, saving, vehicle list renders. No console errors, failed requests or overflow.

## Phone home screen and bigger device (11 October 2026)
The demo now starts on a phone home screen. Only the AJOURA icon works; the other icons are muted decoration. Tapping it plays a short launch (icon zoom, splash with the wordmark), then opens the app. The bar at the bottom of the phone returns to the home screen, and app state is kept. The status bar and home-screen clock show the visitor's current time. The phone now fills the viewport height (up to 880 px tall), and app content is scaled up 12 % when the screen is wide enough. The guide panel has six steps. Reduced-motion users get the launch without animation. Checked at 1440x900, 1920x1080, 390x844 and 320x568: no page or screen overflow and no console errors.
