# AJOURA — independent product and interactive prototype

## Existing concept and scope
The earlier implementation was a static concept illustration inside the LAVREON header and styles. Its established concept was a digital vehicle diary for private motorists: own vehicles, odometer readings, dated maintenance, tyre changes and inspections. The headline, development status, Finnish language, blue/cyan palette and DRONEX attribution are retained. The original illustration remains at `ajoura-vision.png` as reference material but is not loaded by the new pages.

## Structure
- `index.html`: standalone product page; the only LAVREON connection is its quiet return link.
- `ajoura.css`: independent shared typography, colours, layout and responsive rules.
- `app.html`: separate demo experience with a generic premium phone frame.
- `app.css`: phone hardware, scrollable screen, responsive demo shell and reduced-motion rules.
- `app.js`: five small view renderers, fictional seed data, hash navigation and in-memory event creation.
- `mark.svg`, `car.svg`: lightweight original vector interface assets with no manufacturer branding.

No frameworks, build step, external fonts or dependencies. Serve the repository with a static HTTP server. The existing `ajoura/` link supports the GitHub Pages `/lavreon/` prefix.

## Demo behaviour
Welcome -> vehicle list -> vehicle history -> new event / event detail. Browser Back and Forward follow hash history. Two fictional vehicles have independent histories. New entries update the selected vehicle's event count; its odometer remains the maximum recorded reading. Earlier historical entries are supported. Required type, date and odometer fields are validated; cost and note are optional. User text is escaped before rendering.

There is no server, authentication, payment, telemetry, personal data collection or persistent storage. Refresh restores the fictional data. Reset restores the welcome screen and initial data. Do not present the demo as a released application.

## Verification (8 October 2026)
Browser checked: landing at 320, 390, 768 and 1440 pixels; device at 320x568, 390x844, 768x1024 and desktop. No horizontal page/screen overflow; phone fits viewport. Tested welcome, both vehicle cards, required-field rejection, adding an event, changed odometer/count, event details (including literal `<testi>` user text), unaffected second vehicle, cancellation, reset, browser Back, product/demo return and LAVREON return/re-entry. No browser errors recorded. Reduced-motion rules reviewed in source. Syntax and whitespace checks run before publication.
