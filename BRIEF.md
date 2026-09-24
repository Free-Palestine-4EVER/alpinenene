# Alpine Sauber — product brief

## Goal

Turn the current Alpine Sauber website into a polished, mobile-first website that feels like an iOS cleaning-services app. Keep the complete existing German service copy, company information, contact details, and legal text. Make it easy for a visitor to find a service, understand what is included, and contact the business.

## Audience and language

- Private households and business customers looking for cleaning services.
- Primary language: German, matching the source website.
- Business address: Eggenberger Gürtel 56b, 8020 Graz, Austria.
- Contact: +43 664 301 9017, office@alpinesauber.at.
- Published hours: Monday–Saturday, 08:00–18:00.

## Content inventory

The 12 service pages are: Büroreinigung, Gebäudereinigung, Unterhaltsreinigung, Treppenreinigung, Wohnungsreinigung, Grundreinigung, Fensterreinigung, Fassadenreinigung, Grünraumpflege, Winterdienst, Baureinigung, and Brandreinigung. Their source paragraphs appear in service detail sheets and remain in `site-content.json` and `source-content/`.

Home and about copy covers residential/commercial cleaning, the three-step work process, callback service, company benefits, company profile, and Insights. Contact details, source form labels, Impressum, and Datenschutz are also retained. Contact/legal copy is accessible in the app. The source pages remain available as Markdown for review.

## Visual direction

Use the supplied service-app screenshot as the reference: an iPhone-like interface adapted to a normal responsive website. The visual language is light, rounded, soft, and carefully spaced, with pale service-color cards, a clean system-sans hierarchy, compact filter chips, subtle translucent chrome, and a floating bottom navigation on small screens. The page should still use the full browser viewport and expand naturally on desktop.

The homepage uses twelve transparent generated worker cutouts, one per service. Each service detail sheet uses its own generated full-scene photograph with the background intact. The people are illustrative, not photographs of the actual team.

## Main visitor flow

1. Open the home screen and see Alpine Sauber’s published offer, contact information, and all twelve services.
2. Search or filter the complete service list directly on the home screen, or open the dedicated catalogue.
3. Open a native-feeling service detail sheet with the complete original page text.
4. Call directly or continue to the request screen.
5. Read company, legal, or privacy information without leaving the prototype.

## Source claims to confirm

The source site states “Graz und ganz Österreich” on its home and service pages, while its about page lists Styria, Burgenland, Lower Austria, and Vienna. Both statements remain available pending the owner’s confirmation. The “Seit über 25 Jahren” claim is retained as published and should also be confirmed. Grünraumpflege has a title-only service page, so the prototype does not add a description. The privacy notice says it was updated in October 2025; both legal pages need an owner review before launch.

## Contact behavior

Phone and email links use published contact details. The request form builds a prefilled `mailto:` draft because the existing submission endpoint could not be verified; a selected photo must be attached manually by the visitor after the email app opens.
