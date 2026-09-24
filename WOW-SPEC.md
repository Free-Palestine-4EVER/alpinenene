# App experience spec — Alpine Sauber

## Design premise

Build a website that behaves and feels like a small iOS service app. The screenshot reference informs the rounded pastel service cards, compact floating actions, and service detail sheet. It is not a literal phone mockup: the layout uses the full responsive browser viewport.

## Art direction

- **Atmosphere:** calm, hygienic, welcoming, confident.
- **Canvas:** warm near-white `#f6f6f2`.
- **Cards:** pastel green, sky, butter, aqua, pink, and lilac with generous corner radii and restrained shadows.
- **Typography:** locally bundled Manrope with the native iOS sans stack as fallback.
- **Brand:** original Alpine Sauber logo in black against light surfaces. The source has no verified brand guide.
- **Imagery:** twelve transparent worker cutouts for homepage service cards, plus twelve individual full-scene hero photographs in service details. Detail photographs retain their backgrounds. Uniform marks use the Alpine Sauber reference; people are illustrative rather than actual staff photographs.
- **Layout:** full-width responsive app surface, top segmented navigation on wider screens, four-tab translucent bottom navigation on mobile.

## Screens and content

### Start

- Editorial home headline and core cleaning description.
- Published tenure, Graz address, and published opening hours.
- Full-scene feature artwork and a direct offer-request action.
- All twelve services, visible by default, with on-page search and category filters.

### Leistungen

- Search across service name, category, and full source description.
- Filters: Büro & Gebäude, Zuhause, Glas & Außen, Spezialreinigung.
- Twelve service cards; selecting one opens a scrollable detail sheet with its individual full-background photograph, custom icon-led copy sections, and complete collected source text.
- Service prices and discounts remain absent because none were verified.

### Über uns

- Company description, benefits, and the three-step process.
- Existing home/about source copy remains accessible in the page’s expandable source-text section.
- Existing Insights and callback text is represented.

### Kontakt

- Click-to-call, email, map, and hours.
- Request form uses the published fields and opens a prefilled email draft. Photo attachments remain manual because `mailto:` cannot attach local files.

### Legal

- Existing Impressum and Datenschutz text opens in an accessible modal sheet.

## Motion and interaction

- Use short, interruptible fades and small translations for screen changes and service sheets.
- Use clear press/hover states; cards lift slightly on hover and buttons respond immediately.
- On mobile, the service sheet supports closing with a downward drag from its grabber, backdrop tap, close button, or Escape.
- Honor reduced-motion and reduced-transparency user preferences.
- Keep focus visible, restore focus after modal close, and preserve keyboard operation.

### Alpine Flow scroll chapter

- Keep the existing light iOS-like shell and all source content. Use one cinematic dark-green chapter as the signature moment.
- Three full-scene photos move in sequence through Zuhause, Büro & Gebäude, and Glas & Außen; each scene links to its existing service detail.
- A single Alpine-green contour route draws as the chapter scrolls. A thin page progress line and step buttons give orientation and direct control.
- Use Framer Motion `useScroll`/`useTransform` for scroll-linked scene transitions and `animate` for one-time section/card reveals. Keep movement on opacity and transforms.
- The chapter pins on scroll with reserved `300vh` desktop / `255svh` mobile tracks; no smooth-scroll hijacking.
- Keep mobile copy above the fixed app tab bar and reduce image, stagger, and parallax movement. Honor `prefers-reduced-motion` with a fully readable, unpinned stacked layout.
- Reveals run once, controls remain keyboard accessible, cards keep their hover states, and service detail sheets retain their existing behavior.

## Content integrity

- Do not add fake prices, sales, stars, staff names, service guarantees, or testimonials.
- The source site’s service-area statements conflict (nationwide on some pages, four named states on About); retain the source text and flag for owner confirmation.
- Keep the original “Seit über 25 Jahren” claim, marked in project notes for owner confirmation.
- Grünraumpflege has no source description; invite an inquiry without inventing details.

## Review checklist

- Inspect the start, catalogue, about, and contact screens at mobile and desktop widths.
- Open several service sheets and confirm search, category filtering, close button, backdrop, and Escape behavior.
- Check all twelve transparent service cutouts and twelve full-scene detail images.
- Check keyboard focus and reduced-motion styling.
- Confirm the service-area and tenure claims with the business before launch.
