const ASSET = "assets/";
const categories = ["Alle", "Büro & Gebäude", "Zuhause", "Glas & Außen", "Spezialreinigung"];
const tintById = {
  buroreinigung: "blue", gebaudereinigung: "aqua", unterhaltsreinigung: "green", treppenreinigung: "lavender",
  wohnungsreinigung: "pink", grundreinigung: "green", fensterreinigung: "blue", fassadenreinigung: "aqua",
  grunraumpflege: "green", winterdienst: "blue", baureinigung: "yellow", brandreinigung: "pink"
};
const iconByCategory = { "Büro & Gebäude": "⌂", Zuhause: "✳", "Glas & Außen": "◌", Spezialreinigung: "✦" };
const screens = ["home", "services", "about", "contact"];
const serviceSheet = document.querySelector("#service-sheet");
const legalSheet = document.querySelector("#legal-sheet");
const toast = document.querySelector("#toast");
let siteContent = window.ALPINE_SAUBER_CONTENT || null;
let activeCategory = "Alle";
let activeHomeCategory = "Alle";
let previousFocus = null;
let toastTimer;
let activeServiceId = null;
let sheetProgressFrame = 0;
let sheetSwitchTimer;

const safe = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const cleanEditorialText = (value = "") => String(value)
  .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\uFE0E\uFE0F\u200D]/gu, "")
  .replace(/\s{2,}/g, " ")
  .trim();
const shortCategory = (category) => category === "Spezialreinigung" ? "Spezial" : category;
const serviceImage = (service) => `${ASSET}${service.asset || `cutouts/${service.id}.webp`}`;
const serviceDetailImage = (service) => `${ASSET}details/${service.id}.webp`;

const detailIconPaths = {
  building: '<path d="M4 21V5.5L12 3l8 2.5V21M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M10 21v-4h4v4"/>',
  sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  shield: '<path d="M12 3 20 6v5.2c0 4.7-3.4 8-8 9.8-4.6-1.8-8-5.1-8-9.8V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  leaf: '<path d="M20 4c-8.5.2-14 3.6-14 9.1a5 5 0 0 0 5 5C16.5 18.1 19.8 12.5 20 4Z"/><path d="M4 21c2.3-5.5 6-8.8 11-11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/>',
  glass: '<path d="M5 3h14v18H5z"/><path d="M9 3v18M15 3v18M5 9h14M5 15h14"/>',
  water: '<path d="M12 3S6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5M4.4 10.7l3.4-.9-.9-3.4M16.9 17.6l-.9-3.4 3.4-.9M4.4 13.3l3.4.9-.9 3.4M16.9 6.4l-.9 3.4 3.4.9"/>',
  tool: '<path d="M14.5 6.2a5 5 0 0 0-6.7 6.7L3 17.7 6.3 21l4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3.1-3.1 2.8-3.2Z"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 3.2-3.2 2.5 2.5L19 8"/><path d="M15 8h4v4"/>',
  coins: '<circle cx="9" cy="9" r="5.5"/><path d="M7 9h4M9 6.8v4.4"/><path d="M13.5 7.5a5.5 5.5 0 1 1-2 10.6"/><path d="M15.5 12h3.5M17.2 10.5v3"/>',
  sparkleShield: '<path d="M12 3 20 6v5.2c0 4.7-3.4 8-8 9.8-4.6-1.8-8-5.1-8-9.8V6l8-3Z"/><path d="m12 7 1 2.7 2.7 1-2.7.9-1 2.8-.9-2.8-2.8-.9 2.8-1L12 7Z"/>'
};
const serviceIconById = {
  buroreinigung: "building", gebaudereinigung: "building", unterhaltsreinigung: "sparkle", treppenreinigung: "tool",
  wohnungsreinigung: "home", grundreinigung: "water", fensterreinigung: "glass", fassadenreinigung: "building",
  grunraumpflege: "leaf", winterdienst: "snow", baureinigung: "tool", brandreinigung: "sparkleShield"
};
const serviceCardArt = {
  buroreinigung: {
    lines: ["M78 51h148v126H78z", "M115 51v126M152 51v126M189 51v126", "M78 92h148M78 135h148", "M91 190h122M103 177v13M201 177v13"],
    accent: ["M91 64h16M128 105h15M165 148h16"]
  },
  gebaudereinigung: {
    lines: ["M77 188V75l55-34v147M132 41h79v147", "M94 91h19v20H94zM94 132h19v20H94z", "M149 66h20v21h-20zM184 66h14v21h-14z", "M149 108h20v21h-20zM184 108h14v21h-14z", "M149 150h20v21h-20zM184 150h14v21h-14z", "M70 188h151"],
    accent: ["M132 41v147M102 69l30-19"]
  },
  unterhaltsreinigung: {
    lines: ["M72 157c22-28 44-28 66 0s44 28 66 0 31-20 47 0", "M75 177c21-23 41-23 62 0s42 23 63 0 33-19 49 0", "M85 198c17-17 33-17 50 0s35 17 53 0 37-15 53 0", "M128 79l8 22 22 8-22 8-8 22-8-22-22-8 22-8z"],
    accent: ["M128 79l8 22 22 8-22 8-8 22"]
  },
  treppenreinigung: {
    lines: ["M73 190h37v-29h37v-29h37v-29h43", "M76 112l128-78", "M97 98v23M126 80v22M155 63v22M184 45v22", "M83 190h150"],
    accent: ["M73 190h37v-29"]
  },
  wohnungsreinigung: {
    lines: ["M67 112l88-72 88 72", "M83 108v82h144v-82", "M139 190v-55h31v55", "M96 123h25v25H96zM188 123h22v25h-22z", "M75 190h161"],
    accent: ["M155 40l88 72", "M145 190v-55"]
  },
  grundreinigung: {
    lines: ["M154 48c-18 27-43 53-43 84a43 43 0 0 0 86 0c0-31-25-57-43-84Z", "M132 139a22 22 0 0 0 22 22", "M92 76a82 82 0 0 0-27 60M216 76a82 82 0 0 1 27 60", "M87 163a71 71 0 0 0 134 0"],
    accent: ["M132 139a22 22 0 0 0 22 22"]
  },
  fensterreinigung: {
    lines: ["M76 48h133v145H76z", "M142 48v145M76 120h133", "M183 63l39 39M178 67h48", "M196 102l-16 18"],
    accent: ["M183 63l39 39", "M168 54l5-10m34 14 10-6"]
  },
  fassadenreinigung: {
    lines: ["M76 187V78q0-28 28-28h104q28 0 28 28v109", "M76 105h160M76 145h160", "M97 78h20v18H97zM138 78h20v18h-20zM179 78h20v18h-20z", "M97 119h20v18H97zM138 119h20v18h-20zM179 119h20v18h-20z", "M97 159h20v28H97zM138 159h20v28h-20zM179 159h20v28h-20z", "M67 187h177"],
    accent: ["M76 105h160", "M138 159v28"]
  },
  grunraumpflege: {
    lines: ["M110 191c4-69 35-119 113-142-3 67-41 116-113 142Z", "M112 188c31-46 65-82 101-119", "M146 143c-1-20-9-35-25-48 21 1 36 11 43 31", "M168 118c20 0 37 7 50 22-21 3-38-3-50-22"],
    accent: ["M112 188c31-46 65-82 101-119"]
  },
  winterdienst: {
    lines: ["M154 48v146M91 84l126 73M91 157l126-73", "M143 59l11 11 11-11M143 183l11-11 11 11", "M99 86l15 2-2-15M211 155l-15-2 2 15", "M99 155l15-2-2 15M211 86l-15 2 2-15", "M72 207c25-13 51-13 77 0s52 13 78 0"],
    accent: ["M154 48v28M91 157l24-14M217 157l-24-14"]
  },
  baureinigung: {
    lines: ["M79 187V67h139v120", "M108 67v120M149 67v120M190 67v120", "M79 107h139M79 147h139", "M69 187h159", "M92 54l12-14 12 14M192 54l12-14 12 14"],
    accent: ["M92 54l12-14 12 14", "M192 54l12-14 12 14"]
  },
  brandreinigung: {
    lines: ["M154 43 211 64v47c0 39-24 66-57 85-33-19-57-46-57-85V64z", "M154 79c-13 18-26 31-26 48a26 26 0 0 0 52 0c0-17-13-30-26-48Z", "M141 130a13 13 0 0 0 13 13", "M76 195c22-12 42-12 64 0s43 12 65 0"],
    accent: ["M141 130a13 13 0 0 0 13 13", "M154 79c-5 8-10 15-15 22"]
  }
};

function serviceCardArtMarkup(serviceId) {
  const art = serviceCardArt[serviceId] || serviceCardArt.unterhaltsreinigung;
  const lines = art.lines.map((path) => `<path d="${path}"/>`).join("");
  const accents = art.accent.map((path) => `<path d="${path}"/>`).join("");
  return `<svg class="card-line-art" viewBox="0 0 260 240" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><circle class="card-art-orbit" cx="154" cy="120" r="101"/><path class="card-art-orbit" d="M74 49a112 112 0 0 1 160 0M72 188a112 112 0 0 0 164 0"/><g class="card-art-drawing">${lines}</g><g class="card-art-accent">${accents}</g><circle class="card-art-node" cx="228" cy="62" r="3"/></svg>`;
}
function detailIcon(kind = "sparkle") {
  return `<span class="detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${detailIconPaths[kind] || detailIconPaths.sparkle}</svg></span>`;
}

function detailCopyMarkup(service) {
  const icon = serviceIconById[service.id] || "sparkle";
  const sections = [];
  let current = null;
  const newSection = (heading = "") => {
    current = { heading, content: [] };
    sections.push(current);
  };
  const isHeading = (text) => text.length <= 110 && !/[.!?]$/.test(text) && !/^(?:[•✅✓]|\d+\.)/.test(text);
  const addProse = (text) => {
    const clean = text.trim();
    if (!clean) return;
    if (isHeading(clean)) {
      newSection(clean.replace(/:$/, ""));
      return;
    }
    if (!current) newSection();
    current.content.push({ type: "paragraph", text: clean });
  };

  for (const raw of service.blocks.filter((block) => block !== service.title)) {
    const pieces = raw.split(/(?=[✅•✓]\s*|(?<!\d)\d\.\s)/g).map((part) => part.trim()).filter(Boolean);
    const labeledFeatures = pieces.length === 1 && !/^(?:[✅•✓]|\d+\.)/.test(pieces[0])
      ? [...pieces[0].matchAll(/(?:^|[.!?]\s+)([A-ZÄÖÜ][^:!?]{2,68}):\s*/g)]
      : [];
    if (labeledFeatures.length) {
      const text = pieces[0];
      const firstLabelAt = labeledFeatures[0].index + labeledFeatures[0][0].indexOf(labeledFeatures[0][1]);
      addProse(text.slice(0, firstLabelAt).trim());
      labeledFeatures.forEach((match, index) => {
        if (!current) newSection();
        const bodyAt = match.index + match[0].length;
        const next = labeledFeatures[index + 1];
        const bodyEnd = next ? next.index : text.length;
        let body = text.slice(bodyAt, bodyEnd).trim();
        if (next) body += text[next.index] || ".";
        const label = match[1].trim();
        current.content.push({ type: "feature", title: label, body, icon: /gesund|hygiene|sicher|schutz|gesundheit|qualit|zuverläss|erfahren/i.test(label) ? "shield" : /umwelt|nachhalt|grün|natur/i.test(label) ? "leaf" : /produktiv|konzentr|effiz/i.test(label) ? "chart" : /preis|kosten|erspar/i.test(label) ? "coins" : /zeit|flexib|termin/i.test(label) ? "clock" : icon });
      });
      continue;
    }
    if (pieces.length === 1 && !/^(?:[✅•✓]|\d+\.)/.test(pieces[0])) {
      addProse(pieces[0]);
      continue;
    }
    for (const piece of pieces) {
      if (/^(?:[✅•✓]|\d+\.)/.test(piece)) {
        if (!current) newSection();
        const text = piece.replace(/^(?:[✅•✓]\s*|\d+\.\s*)/, "").trim();
        const splitAt = text.indexOf(":");
        const title = splitAt > 0 && splitAt < 92 ? text.slice(0, splitAt).trim() : "";
        const body = title ? text.slice(splitAt + 1).trim() : text;
        current.content.push({ type: "feature", title, body, icon: /gesund|hygiene|sicher|schutz|gesundheit|qualit|zuverläss|erfahren/i.test(text) ? "shield" : /umwelt|nachhalt|grün|natur/i.test(text) ? "leaf" : /produktiv|konzentr|effiz/i.test(text) ? "chart" : /preis|kosten|erspar/i.test(text) ? "coins" : /zeit|flexib|termin/i.test(text) ? "clock" : icon });
      } else {
        addProse(piece);
      }
    }
  }

  return sections.map((section, index) => {
    const hasFeatures = section.content.some((block) => block.type === "feature");
    let pendingFeatures = [];
    let content = "";
    const flushFeatures = () => {
      if (!pendingFeatures.length) return;
      content += `<div class="detail-feature-grid">${pendingFeatures.map((feature) => `<article class="detail-feature">${detailIcon(feature.icon)}<div>${feature.title ? `<h4>${safe(feature.title)}</h4>` : ""}<p>${safe(feature.body)}</p></div></article>`).join("")}</div>`;
      pendingFeatures = [];
    };
    for (const block of section.content) {
      if (block.type === "feature") pendingFeatures.push(block);
      else {
        flushFeatures();
        content += `<p class="detail-copy-paragraph">${safe(block.text)}</p>`;
      }
    }
    flushFeatures();
    return `<section class="detail-copy-section${hasFeatures ? " detail-benefits" : ""}" id="service-section-${index}" data-section-index="${index}">
      ${section.heading ? `<h3>${detailIcon(index === 0 ? icon : (hasFeatures ? "sparkle" : icon))}<span>${safe(section.heading)}</span></h3>` : ""}
      ${content}
    </section>`;
  }).join("");
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function navigate(name, options = {}) {
  if (!screens.includes(name)) return;
  document.querySelectorAll(".screen").forEach((screen) => {
    const active = screen.dataset.screen === name;
    screen.hidden = !active;
    screen.classList.toggle("is-active", active);
  });
  document.querySelectorAll("[data-screen-link]").forEach((control) => {
    const active = control.dataset.screenLink === name;
    if (control.classList.contains("nav-tab") || control.classList.contains("tabbar-item")) {
      control.classList.toggle("is-active", active);
      if (active) control.setAttribute("aria-current", "page");
      else control.removeAttribute("aria-current");
    }
  });
  if (options.hash !== false) history.replaceState(null, "", `#${name}`);
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

function paragraphMarkup(paragraphs, className = "") {
  return paragraphs.map((paragraph) => `<p${className ? ` class="${className}"` : ""}>${safe(cleanEditorialText(paragraph))}</p>`).join("");
}

function cardMarkup(service, compact = false) {
  if (compact) {
    return `<article class="service-card service-card-home${compact ? " service-card-compact" : ""}" data-service-id="${safe(service.id)}" data-tint="${tintById[service.id] || "green"}">
      ${serviceCardArtMarkup(service.id)}
      <span class="card-category"><i aria-hidden="true"></i>${safe(shortCategory(service.category))}</span>
      <h3>${safe(service.title)}</h3>
      <p>${safe(service.summary || "Details gerne auf Anfrage.")}</p>
      <button class="card-link" type="button" data-service-id="${safe(service.id)}" aria-label="Mehr über ${safe(service.title)} erfahren">Mehr erfahren <span aria-hidden="true">↗</span></button>
      <img class="card-image" src="${safe(serviceImage(service))}" alt="" loading="${compact ? "eager" : "lazy"}" fetchpriority="${compact ? "low" : "auto"}" width="1280" height="1280" />
    </article>`;
  }
  return `<button class="service-card${compact ? " service-card-compact" : ""}" type="button" data-service-id="${safe(service.id)}" data-tint="${tintById[service.id] || "green"}" aria-label="Details zu ${safe(service.title)} ansehen">
    <span class="card-category"><i aria-hidden="true"></i>${safe(shortCategory(service.category))}</span>
    <h3>${safe(service.title)}</h3>
    <p>${safe(service.summary || "Details gerne auf Anfrage.")}</p>
    <span class="card-link">Mehr erfahren <span aria-hidden="true">↗</span></span>
    <img class="card-image" src="${safe(serviceImage(service))}" alt="" loading="${compact ? "eager" : "lazy"}" fetchpriority="${compact ? "low" : "auto"}" width="1280" height="1280" />
  </button>`;
}

function makeCategoryFilters(container, className, onSelect) {
  container.innerHTML = categories.map((category) => `<button type="button" class="${className}${category === activeCategory ? " is-active" : ""}" data-category="${safe(category)}" aria-pressed="${category === activeCategory}">${category === "Alle" ? "Alle" : `<span class="pill-dot" aria-hidden="true"></span>${safe(category)}`}</button>`).join("");
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    onSelect();
  });
}

function renderServiceCatalog() {
  const search = document.querySelector("#service-search");
  const filterBox = document.querySelector("#service-filters");
  const grid = document.querySelector("#service-grid");
  const homeGrid = document.querySelector("#home-service-grid");
  const homeCategories = document.querySelector("#home-categories");
  const homeSearch = document.querySelector("#home-service-search");
  const homeCount = document.querySelector("#home-result-count");
  const count = document.querySelector("#result-count");

  function drawFilters() {
    filterBox.innerHTML = categories.map((category) => `<button class="filter-chip${category === activeCategory ? " is-active" : ""}" type="button" data-category="${safe(category)}" aria-pressed="${category === activeCategory}">${safe(category)}</button>`).join("");
    homeCategories.innerHTML = categories.map((category) => `<button class="category-pill${category === activeHomeCategory ? " is-active" : ""}" type="button" data-home-category="${safe(category)}" aria-pressed="${category === activeHomeCategory}">${category === "Alle" ? "Alle 12 Leistungen" : `<span class="pill-dot" aria-hidden="true"></span>${safe(category)}`}</button>`).join("");
  }

  function draw() {
    const query = search.value.trim().toLocaleLowerCase("de-AT");
    const filtered = siteContent.services.filter((service) => {
      const categoryMatch = activeCategory === "Alle" || service.category === activeCategory;
      const searchable = `${service.title} ${service.category} ${service.summary} ${service.blocks.join(" ")}`.toLocaleLowerCase("de-AT");
      return categoryMatch && (!query || searchable.includes(query));
    });
    grid.innerHTML = filtered.length ? filtered.map((service) => cardMarkup(service)).join("") : `<div class="empty-state"><span>⌕</span><h2>Keine passende Leistung gefunden.</h2><p>Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle“.</p></div>`;
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "Leistung" : "Leistungen"}`;
  }

  function drawHome() {
    const query = homeSearch.value.trim().toLocaleLowerCase("de-AT");
    const filtered = siteContent.services.filter((service) => {
      const categoryMatch = activeHomeCategory === "Alle" || service.category === activeHomeCategory;
      const searchable = `${service.title} ${service.category} ${service.summary}`.toLocaleLowerCase("de-AT");
      return categoryMatch && (!query || searchable.includes(query));
    });
    homeGrid.innerHTML = filtered.length ? filtered.map((service) => cardMarkup(service, true)).join("") : `<div class="empty-state home-empty-state"><span>⌕</span><h2>Keine passende Leistung gefunden.</h2><p>Ändern Sie Ihre Suche oder wählen Sie eine andere Kategorie.</p></div>`;
    homeCount.textContent = `${filtered.length} ${filtered.length === 1 ? "Leistung" : "Leistungen"}`;
  }

  drawFilters();
  draw();
  drawHome();
  search.addEventListener("input", draw);
  homeSearch.addEventListener("input", drawHome);
  filterBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    drawFilters();
    draw();
  });
  homeCategories.addEventListener("click", (event) => {
    const button = event.target.closest("[data-home-category]");
    if (!button) return;
    activeHomeCategory = button.dataset.homeCategory;
    drawFilters();
    drawHome();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      navigate("services");
      requestAnimationFrame(() => search.focus());
    }
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      navigate("services");
      requestAnimationFrame(() => search.focus());
    }
  });
}

function renderAbout() {
  const aboutBlocks = siteContent.aboutBlocks.map(cleanEditorialText);
  const benefitIcons = ["tool", "clock", "leaf", "shield"];
  const benefits = aboutBlocks.slice(6, 10).map((text, index) => {
    const [title, ...description] = text.split(/\s+[–—-]\s+/);
    return { icon: benefitIcons[index], title, description: description.join(" – ") };
  });
  document.querySelector("#about-origin-kicker").textContent = aboutBlocks[0];
  document.querySelector("#about-origin-title").textContent = aboutBlocks[4];
  document.querySelector("#about-origin-copy").innerHTML = paragraphMarkup(aboutBlocks.slice(1, 4), "about-origin-paragraph");
  document.querySelector("#benefit-grid").innerHTML = benefits.map(({ icon, title, description }, index) => `<article class="benefit-card"><div class="benefit-card-top"><span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${detailIconPaths[icon]}</svg></span><span class="benefit-index">0${index + 1}</span></div><h3>${safe(title)}</h3><p>${safe(description)}</p></article>`).join("");
  const supportingValues = [];
  for (let index = 10; index + 1 < aboutBlocks.length; index += 2) {
    supportingValues.push({ title: aboutBlocks[index], copy: aboutBlocks[index + 1] });
  }
  const supportingIcons = ["tool", "shield", "clock", "coins"];
  document.querySelector("#about-proof-grid").innerHTML = supportingValues.map(({ title, copy }, index) => `<article class="about-proof-card"><div class="about-proof-card-top"><span class="benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${detailIconPaths[supportingIcons[index]]}</svg></span><span class="benefit-index">0${index + 1}</span></div><h3>${safe(title)}</h3><p>${safe(copy)}</p></article>`).join("");
  document.querySelector("#full-home-copy").innerHTML = paragraphMarkup(siteContent.homeBlocks);
}

function renderServiceDetail(service, trigger, options = {}) {
  if (trigger) previousFocus = trigger;
  const wasOpen = serviceSheet.open;
  const animateSwitch = wasOpen && options.focusHeading;
  if (animateSwitch) {
    window.clearTimeout(sheetSwitchTimer);
    serviceSheet.classList.add("is-switching");
    serviceSheet.getBoundingClientRect();
  }
  activeServiceId = service.id;
  const serviceIndex = siteContent.services.findIndex((item) => item.id === service.id);
  document.querySelector("#sheet-title").textContent = service.title;
  document.querySelector("#sheet-summary").textContent = service.summary || "Für Details zu dieser Leistung berät Sie Alpine Sauber gerne persönlich.";
  document.querySelector("#sheet-category").textContent = service.category;
  document.querySelector("#sheet-category-icon").innerHTML = detailIcon(serviceIconById[service.id] || "sparkle");
  const image = document.querySelector("#sheet-image");
  image.loading = "eager";
  image.fetchPriority = "high";
  image.decoding = "async";
  image.src = serviceDetailImage(service);
  image.alt = `Alpine Sauber bei der ${service.title} in einem passenden Einsatzumfeld`;
  document.querySelector("#sheet-copy").innerHTML = detailCopyMarkup(service);
  const detailSections = [...document.querySelectorAll("#sheet-copy .detail-copy-section")];
  const titledSections = detailSections.filter((section) => section.querySelector("h3"));
  const sectionNav = document.querySelector("#sheet-section-nav");
  const sectionTrack = document.querySelector("#sheet-section-track");
  sectionNav.hidden = titledSections.length === 0;
  document.querySelector("#sheet-section-count").textContent = titledSections.length ? `01 / ${String(titledSections.length).padStart(2, "0")}` : "";
  sectionTrack.innerHTML = titledSections.map((section, index) => {
    const label = section.querySelector("h3").textContent.trim();
    return `<button class="sheet-section-chip${index === 0 ? " is-current" : ""}" type="button" data-section-target="${section.id}" aria-label="Zu Abschnitt ${index + 1}: ${safe(label)}"${index === 0 ? ' aria-current="location"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><b>${safe(label)}</b></button>`;
  }).join("");
  document.querySelector("#sheet-neighbor-grid").innerHTML = [
    { direction: "previous", service: siteContent.services[serviceIndex - 1], label: "VORHERIGE LEISTUNG", icon: "↖" },
    { direction: "next", service: siteContent.services[serviceIndex + 1], label: "NÄCHSTE LEISTUNG", icon: "↗" }
  ].map(({ direction, service: neighbor, label, icon }) => {
    const disabled = !neighbor;
    return `<button class="sheet-neighbor-card${direction === "previous" ? " is-previous" : " is-next"}" type="button" data-detail-navigation="${direction}"${disabled ? " disabled" : ""} aria-label="${disabled ? "Keine weitere Leistung" : `${label === "NÄCHSTE LEISTUNG" ? "Nächste" : "Vorherige"} Leistung: ${safe(neighbor.title)}`}"${neighbor ? ` data-neighbor-id="${safe(neighbor.id)}"` : ""}>
      <span class="sheet-neighbor-top"><span>${label}</span><span aria-hidden="true">${icon}</span></span>
      <strong>${neighbor ? safe(neighbor.title) : (direction === "previous" ? "Erste Leistung" : "Alle 12 angesehen")}</strong>
      ${neighbor ? `<img src="${safe(serviceDetailImage(neighbor))}" alt="" loading="lazy" />` : `<span class="sheet-neighbor-endmark" aria-hidden="true">✓</span>`}
    </button>`;
  }).join("");
  document.querySelector("#request-service").value = service.title;
  if (!wasOpen) serviceSheet.showModal();
  const sheetScroll = document.querySelector("#sheet-scroll");
  if (!wasOpen || options.focusHeading) sheetScroll.scrollTop = 0;
  if (animateSwitch) sheetSwitchTimer = window.setTimeout(() => serviceSheet.classList.remove("is-switching"), 72);
  requestAnimationFrame(() => {
    if (options.focusHeading) document.querySelector("#sheet-title").focus({ preventScroll: true });
    else if (!wasOpen) document.querySelector(".sheet-close").focus();
    updateSheetReadingState();
  });
}

function navigateServiceDetail(direction) {
  if (!siteContent || !activeServiceId) return;
  const currentIndex = siteContent.services.findIndex((service) => service.id === activeServiceId);
  const nextService = siteContent.services[currentIndex + (direction === "next" ? 1 : -1)];
  if (nextService) renderServiceDetail(nextService, null, { focusHeading: true });
}

function updateSheetReadingState() {
  if (!serviceSheet.open) return;
  const sheetScroll = document.querySelector("#sheet-scroll");
  const maxScroll = sheetScroll.scrollHeight - sheetScroll.clientHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((sheetScroll.scrollTop / maxScroll) * 100))) : 0;
  const progressTrack = document.querySelector(".sheet-reading-progress");
  progressTrack.setAttribute("aria-valuenow", String(progress));
  document.querySelector("#sheet-progress-value").style.transform = `scaleX(${progress / 100})`;

  const sections = [...document.querySelectorAll("#sheet-copy .detail-copy-section h3")];
  if (!sections.length) return;
  const scrollTop = sheetScroll.getBoundingClientRect().top;
  let current = sections[0].closest(".detail-copy-section");
  for (const heading of sections) {
    if (heading.getBoundingClientRect().top <= scrollTop + 175) current = heading.closest(".detail-copy-section");
  }
  const activeId = current.id;
  const chip = document.querySelector(`.sheet-section-chip[data-section-target="${activeId}"]`);
  if (chip && !chip.classList.contains("is-current")) {
    document.querySelectorAll(".sheet-section-chip").forEach((item) => {
      item.classList.remove("is-current");
      item.removeAttribute("aria-current");
    });
    chip.classList.add("is-current");
    chip.setAttribute("aria-current", "location");
    const currentIndex = sections.findIndex((heading) => heading.closest(".detail-copy-section") === current) + 1;
    document.querySelector("#sheet-section-count").textContent = `${String(currentIndex).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
  }
}

function renderLegal(kind) {
  const isPrivacy = kind === "privacy";
  document.querySelector("#legal-title").textContent = isPrivacy ? "Datenschutz" : "Impressum";
  document.querySelector("#legal-copy").innerHTML = paragraphMarkup(isPrivacy ? siteContent.privacyBlocks : siteContent.impressumBlocks);
  legalSheet.showModal();
  requestAnimationFrame(() => document.querySelector(".legal-close").focus());
}

function wireNavigation() {
  const sheetScroll = document.querySelector("#sheet-scroll");
  sheetScroll.addEventListener("scroll", () => {
    if (sheetProgressFrame) return;
    sheetProgressFrame = requestAnimationFrame(() => {
      sheetProgressFrame = 0;
      updateSheetReadingState();
    });
  }, { passive: true });

  let swipeStart = null;
  const sheetImageWrap = document.querySelector(".sheet-image-wrap");
  sheetImageWrap.addEventListener("touchstart", (event) => {
    if (!serviceSheet.open || event.touches.length !== 1) return;
    swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  sheetImageWrap.addEventListener("touchend", (event) => {
    if (!swipeStart || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - swipeStart.x;
    const deltaY = event.changedTouches[0].clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(deltaX) > 58 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      navigateServiceDetail(deltaX < 0 ? "next" : "previous");
    }
  }, { passive: true });
  sheetImageWrap.addEventListener("touchcancel", () => { swipeStart = null; }, { passive: true });

  document.addEventListener("click", (event) => {
    const sectionTarget = event.target.closest("[data-section-target]");
    if (sectionTarget) {
      const section = document.getElementById(sectionTarget.dataset.sectionTarget);
      if (section) {
        const top = section.getBoundingClientRect().top - sheetScroll.getBoundingClientRect().top + sheetScroll.scrollTop - 18;
        sheetScroll.scrollTo({ top, behavior: "smooth" });
      }
      return;
    }
    const detailNavigation = event.target.closest("[data-detail-navigation]");
    if (detailNavigation && !detailNavigation.disabled) {
      navigateServiceDetail(detailNavigation.dataset.detailNavigation);
      return;
    }
    const legalButton = event.target.closest("[data-legal]");
    if (legalButton) {
      renderLegal(legalButton.dataset.legal);
      return;
    }
    const screenControl = event.target.closest("[data-screen-link]");
    if (screenControl) {
      event.preventDefault();
      const selectedService = screenControl.dataset.servicePrefill || document.querySelector("#request-service").value;
      if (serviceSheet.open) serviceSheet.close();
      navigate(screenControl.dataset.screenLink);
      if (screenControl.dataset.screenLink === "contact" && selectedService) document.querySelector("#request-service").value = selectedService;
      return;
    }
    const serviceButton = event.target.closest("[data-service-id]");
    if (serviceButton) {
      const service = siteContent.services.find((item) => item.id === serviceButton.dataset.serviceId);
      if (service) renderServiceDetail(service, serviceButton);
      return;
    }
    if (event.target.closest(".sheet-close")) {
      if (event.target.closest("#legal-sheet")) legalSheet.close();
      else serviceSheet.close();
    }
  });

  serviceSheet.addEventListener("click", (event) => { if (event.target === serviceSheet) serviceSheet.close(); });
  legalSheet.addEventListener("click", (event) => { if (event.target === legalSheet) legalSheet.close(); });
  for (const dialog of [serviceSheet, legalSheet]) dialog.addEventListener("close", () => {
    if (dialog === serviceSheet) {
      activeServiceId = null;
      sheetScroll.scrollTop = 0;
      document.querySelector(".sheet-reading-progress").setAttribute("aria-valuenow", "0");
      document.querySelector("#sheet-progress-value").style.transform = "scaleX(0)";
    }
    if (previousFocus && previousFocus.isConnected && !previousFocus.closest("[hidden]")) previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  });
}

function enableSheetDrag() {
  const grabber = document.querySelector(".sheet-grabber");
  let startY = null;
  grabber.addEventListener("pointerdown", (event) => {
    if (window.innerWidth > 700 || !serviceSheet.open) return;
    startY = event.clientY;
    grabber.setPointerCapture(event.pointerId);
    serviceSheet.style.transition = "none";
  });
  grabber.addEventListener("pointermove", (event) => {
    if (startY === null) return;
    const delta = Math.max(0, event.clientY - startY);
    serviceSheet.style.translate = `0 ${delta}px`;
  });
  const finish = (event) => {
    if (startY === null) return;
    const delta = Math.max(0, event.clientY - startY);
    startY = null;
    serviceSheet.style.transition = "";
    serviceSheet.style.translate = "";
    if (delta > 90) serviceSheet.close();
  };
  grabber.addEventListener("pointerup", finish);
  grabber.addEventListener("pointercancel", finish);
}

function wireRequestForm() {
  const form = document.querySelector("#request-form");
  const serviceSelect = document.querySelector("#request-service");
  serviceSelect.insertAdjacentHTML("beforeend", siteContent.services.map((service) => `<option value="${safe(service.title)}">${safe(service.title)}</option>`).join(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const photo = data.get("photo");
    const lines = [
      `Reinigungsart: ${data.get("service") || "Keine Auswahl"}`,
      `Name: ${data.get("name")}`,
      `E-Mail: ${data.get("email")}`,
      `Betreff: ${data.get("subject")}`,
      "",
      String(data.get("message")),
      photo && photo.size ? "" : null,
      photo && photo.size ? `Foto ausgewählt: ${photo.name} (bitte nach dem Öffnen manuell anhängen)` : null
    ].filter((line) => line !== null);
    const subject = encodeURIComponent(String(data.get("subject") || "Anfrage zur Reinigung"));
    const body = encodeURIComponent(lines.join("\n"));
    announce("Ihre E-Mail-App wird mit der Anfrage geöffnet.");
    window.location.href = `mailto:office@alpinesauber.at?subject=${subject}&body=${body}`;
  });
}

async function init() {
  document.querySelector("#year").textContent = new Date().getFullYear();
  try {
    if (!siteContent) {
      const response = await fetch("site-content.json");
      if (!response.ok) throw new Error(`Content unavailable (${response.status})`);
      siteContent = await response.json();
    }
  } catch (error) {
    console.error(error);
    document.querySelector("#service-grid").innerHTML = `<div class="empty-state"><h2>Inhalte konnten nicht geladen werden.</h2><p>Bitte starten Sie die Website über den lokalen Server.</p></div>`;
    return;
  }
  renderServiceCatalog();
  renderAbout();
  window.dispatchEvent(new CustomEvent("alpine:content-ready"));
  wireNavigation();
  enableSheetDrag();
  wireRequestForm();
  const requestedScreen = location.hash.slice(1);
  navigate(screens.includes(requestedScreen) ? requestedScreen : "home", { scroll: false, hash: false });
}

init();
