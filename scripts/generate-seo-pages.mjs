import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = join(projectRoot, "dist");
const publicRoot = join(projectRoot, "public");
const assetsOnly = process.argv.includes("--assets-only");
const content = JSON.parse(await readFile(join(projectRoot, "site-content.json"), "utf8"));
const seo = JSON.parse(await readFile(join(projectRoot, "seo-config.json"), "utf8"));
const appHtml = assetsOnly ? "" : await readFile(join(distRoot, "index.html"), "utf8");
const siteUrl = seo.siteUrl.replace(/\/$/, "");
const businessId = `${siteUrl}/#business`;
const siteId = `${siteUrl}/#website`;

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const cleanText = (value = "") => String(value)
  .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\uFE0E\uFE0F\u200D]/gu, "")
  .replace(/\s+/g, " ")
  .trim();
const absoluteUrl = (path) => `${siteUrl}${path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`}`;

function businessSchema() {
  const business = seo.business;
  return {
    "@type": "LocalBusiness",
    "@id": businessId,
    name: business.name,
    url: `${siteUrl}/`,
    description: business.description,
    telephone: business.telephone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress,
      postalCode: business.postalCode,
      addressLocality: business.addressLocality,
      addressCountry: business.addressCountry
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.hours.days.map((day) => `https://schema.org/${day}`),
      opens: business.hours.opens,
      closes: business.hours.closes
    }],
    logo: business.logo,
    image: business.image,
    areaServed: [
      { "@type": "City", name: "Graz" },
      { "@type": "AdministrativeArea", name: "Steiermark" },
      { "@type": "Country", name: "Österreich" }
    ]
  };
}

function breadcrumbSchema(path, label, isService) {
  const trail = [{ name: "Startseite", item: `${siteUrl}/` }];
  if (isService) {
    trail.push({ name: "Leistungen", item: absoluteUrl("leistungen") });
  }
  if (path !== "/") trail.push({ name: label, item: `${siteUrl}${path}` });
  if (trail.length < 2) return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

function pageSchema(page, service) {
  const canonical = `${siteUrl}${page.path}`;
  const pageNode = {
    "@type": page.kind === "screen" && page.screen === "contact" ? "ContactPage" : "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "de-AT",
    isPartOf: { "@id": siteId },
    about: { "@id": businessId }
  };
  if (service) pageNode.mainEntity = { "@id": `${canonical}#service` };

  const nodes = [businessSchema(), {
    "@type": "WebSite",
    "@id": siteId,
    url: `${siteUrl}/`,
    name: seo.business.brandName,
    inLanguage: "de-AT",
    publisher: { "@id": businessId }
  }, pageNode];
  if (service) {
    nodes.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: service.title,
      serviceType: service.title,
      description: cleanText(service.summary),
      url: canonical,
      provider: { "@id": businessId },
      areaServed: ["Graz", "Steiermark", "Österreich"]
    });
  }
  const breadcrumb = breadcrumbSchema(page.path, service?.title || page.title.split("|")[0].trim(), Boolean(service));
  if (breadcrumb) nodes.push(breadcrumb);
  return { "@context": "https://schema.org", "@graph": nodes };
}

function servicePage(service) {
  return {
    path: `/${service.id}/`,
    kind: "service",
    title: `${service.title} in Graz | Alpine Sauber`,
    description: cleanText(service.summary).length > 157
      ? `${cleanText(service.summary).slice(0, 154).replace(/[\s.,;:!?-]+$/g, "")}…`
      : cleanText(service.summary),
    service
  };
}

function replaceMeta(html, selector, markup) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(`<meta\\s+[^>]*${escapedSelector}[^>]*>`, "i");
  return expression.test(html) ? html.replace(expression, markup) : html.replace("</head>", `    ${markup}\n  </head>`);
}

function withPageMetadata(html, page) {
  const canonical = `${siteUrl}${page.path}`;
  const image = seo.business.image;
  const meta = [
    ['name="description"', `<meta name="description" content="${escapeHtml(page.description)}" />`],
    ['property="og:type"', '<meta property="og:type" content="website" />'],
    ['property="og:locale"', '<meta property="og:locale" content="de_AT" />'],
    ['property="og:title"', `<meta property="og:title" content="${escapeHtml(page.title)}" />`],
    ['property="og:description"', `<meta property="og:description" content="${escapeHtml(page.description)}" />`],
    ['property="og:url"', `<meta property="og:url" content="${canonical}" />`],
    ['property="og:image"', `<meta property="og:image" content="${image}" />`],
    ['name="twitter:card"', '<meta name="twitter:card" content="summary_large_image" />'],
    ['name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`],
    ['name="twitter:description"', `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`],
    ['name="twitter:image"', `<meta name="twitter:image" content="${image}" />`]
  ];
  for (const [selector, markup] of meta) html = replaceMeta(html, selector, markup);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(/<html\s+lang="[^"]+"/i, '<html lang="de-AT"');
  html = html.replace(/<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/i, "");
  const schema = JSON.stringify(pageSchema(page, page.service)).replace(/</g, "\\u003c");
  html = html.replace("</head>", `    <script type="application/ld+json" id="structured-data">${schema}</script>\n  </head>`);
  return html;
}

function routeHtml(page) {
  let html = withPageMetadata(appHtml, page);
  html = html.replace(/<head>/i, '<head>\n    <base href="/" />');
  if (page.screen) {
    html = html.replace('<html lang="de-AT" class="is-loading">', `<html lang="de-AT" class="is-loading" data-initial-screen="${page.screen}">`);
  } else if (page.kind === "service") {
    html = html.replace('<html lang="de-AT" class="is-loading">', `<html lang="de-AT" class="is-loading" data-service-route="${page.service.id}">`);
  } else if (page.legal) {
    html = html.replace('<html lang="de-AT" class="is-loading">', `<html lang="de-AT" class="is-loading" data-legal-route="${page.legal}">`);
  }
  return html;
}

const routes = [
  ...seo.pages,
  ...content.services.map(servicePage)
];
if (!assetsOnly) {
  for (const page of routes) {
    const relativeDirectory = page.path === "/" ? "" : page.path.replace(/^\/+|\/+$/g, "");
    const destination = join(distRoot, relativeDirectory, "index.html");
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, routeHtml(page));
  }
}

const xmlEscape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((page) => `  <url><loc>${xmlEscape(`${siteUrl}${page.path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
await mkdir(publicRoot, { recursive: true });
await writeFile(join(publicRoot, "sitemap.xml"), sitemap);
if (!assetsOnly) await writeFile(join(distRoot, "sitemap.xml"), sitemap);

const pagesByName = new Map(seo.pages.map((page) => [page.screen || page.legal || page.kind, page]));
const homePage = pagesByName.get("home");
const servicesPage = pagesByName.get("services");
const aboutPage = pagesByName.get("about");
const contactPage = pagesByName.get("contact");
const llmsLines = [
  `# ${seo.business.brandName}`,
  "",
  `> ${seo.business.description}`,
  "",
  "## Unternehmen",
  `- Name: ${seo.business.name}`,
  `- Standort: ${seo.business.streetAddress}, ${seo.business.postalCode} ${seo.business.addressLocality}, Österreich`,
  `- Telefon: ${seo.business.telephone}`,
  `- E-Mail: ${seo.business.email}`,
  `- Erreichbarkeit laut Website: Montag bis Samstag, ${seo.business.hours.opens}–${seo.business.hours.closes} Uhr`,
  "- Tätigkeitsgebiet laut Website: Graz, Steiermark und Österreich",
  "",
  "## Zentrale Seiten",
  `- [Startseite](${siteUrl}${homePage.path})` ,
  `- [Alle Leistungen](${siteUrl}${servicesPage.path})`,
  `- [Über Alpine Sauber](${siteUrl}${aboutPage.path})`,
  `- [Kontakt](${siteUrl}${contactPage.path})`,
  `- [Impressum](${siteUrl}${pagesByName.get("impressum").path})`,
  `- [Datenschutz](${siteUrl}${pagesByName.get("privacy").path})`,
  "",
  "## Reinigungsleistungen",
  ...content.services.map((service) => `- [${service.title}](${absoluteUrl(service.id)}): ${cleanText(service.summary)}`),
  "",
  "## Vollständige Leistungsübersicht",
  `- [llms-full.txt](${siteUrl}/llms-full.txt)`,
  ""
].join("\n");
await writeFile(join(publicRoot, "llms.txt"), llmsLines);
if (!assetsOnly) await writeFile(join(distRoot, "llms.txt"), llmsLines);

const fullLines = [
  `# ${seo.business.brandName} — Unternehmens- und Leistungsinformationen`,
  "",
  `## Unternehmen: ${seo.business.name}`,
  seo.business.description,
  `Standort: ${seo.business.streetAddress}, ${seo.business.postalCode} ${seo.business.addressLocality}, Österreich.`,
  `Telefon: ${seo.business.telephone}. E-Mail: ${seo.business.email}.`,
  `Erreichbarkeit laut Website: Montag bis Samstag, ${seo.business.hours.opens}–${seo.business.hours.closes} Uhr.`,
  "Tätigkeitsgebiet laut Website: Graz, Steiermark und Österreich.",
  "",
  "## Leistungen",
  ...content.services.flatMap((service) => [
    `### ${service.title}`,
    `Kategorie: ${cleanText(service.category)}.`,
    cleanText(service.summary),
    `Details: ${absoluteUrl(service.id)}`,
    ""
  ]),
  "## Primärquellen",
  `- Startseite: ${siteUrl}/`,
  `- Leistungen: ${siteUrl}${servicesPage.path}`,
  `- Über uns: ${siteUrl}${aboutPage.path}`,
  `- Kontakt: ${siteUrl}${contactPage.path}`,
  `- Impressum: ${siteUrl}${pagesByName.get("impressum").path}`,
  `- Datenschutz: ${siteUrl}${pagesByName.get("privacy").path}`,
  ""
].join("\n");
await writeFile(join(publicRoot, "llms-full.txt"), fullLines);
if (!assetsOnly) await writeFile(join(distRoot, "llms-full.txt"), fullLines);

console.log(assetsOnly
  ? `Generated sitemap.xml, llms.txt and llms-full.txt for the development server.`
  : `Generated ${routes.length} canonical pages, sitemap.xml, llms.txt and llms-full.txt.`);
