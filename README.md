# Alpine Sauber — iOS-inspired web app

Responsive Alpine Sauber website with a calm native iOS feel, full original German copy, all twelve services, and a Framer Motion scroll-story built around the existing service photography.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The production bundle can be generated with `npm run build`.

## Project files

- `index.html`, `styles.css`, and `script.js` — responsive app shell, iOS-inspired controls, navigation, service sheets, filters, and contact flow.
- `src/motion-entry.jsx` and `src/motion.css` — Framer Motion scroll progress, one-time section reveals, and the pinned Alpine Flow story scene. Reduced-motion users get the same content in a static layout.
- `package.json` — Vite, React, and Framer Motion app tooling.
- `site-content.json` — copy transcribed from the existing home, service, about, contact, imprint, and privacy pages.
- `source-content/` — captured source text by original URL for traceability.
- `assets/cutouts/` — transparent generated worker cutouts used in the homepage cards and feature artwork.
- `assets/details/` — generated full-scene photographs used in the service detail sheets; their backgrounds remain intact.
- `assets/alpine-sauber-logo-color.png` — official full-color header logo from the original site.
- `assets/alpine-sauber-logo.png` — official transparent white logo mark used on uniform patches.
- `assets/about/`, `assets/home/`, and `assets/stories/` — unique generated photographs for About, the home brand bridge, and each Alpine Flow scene.
- Generated workers are illustrative people, not identified Alpine Sauber staff photographs.

## Owner review before launch

- The current site says “Graz und ganz Österreich” on the home and service pages, but the about page lists Styria, Burgenland, Lower Austria, and Vienna. Both source claims are retained; Alpine Sauber should confirm its actual service area.
- The current home page says “Seit über 25 Jahren.” Confirm the wording and the date before publishing.
- `Grünraumpflege` currently has only a title on its service page; the prototype does not invent a service description.
- The copied privacy notice is dated October 2025 and the imprint/privacy text should be checked by the business before launch.
- No quote submission endpoint was verified. The request form opens a prefilled email draft on the visitor’s device; a selected photo must be attached manually in that email app.
- No prices, promotions, star ratings, named cleaners, or new testimonials have been invented.
