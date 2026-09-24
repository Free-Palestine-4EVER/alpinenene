import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import "./motion.css";

const scenes = [
  {
    id: "wohnungsreinigung",
    category: "Zuhause",
    title: "Wohnungsreinigung",
    summary: "Alpine Sauber – Wohnungsreinigung mit Perfektion & Vertrauen. Sauberkeit, auf die Sie sich verlassen können.",
    image: "/assets/stories/story-home-portrait.webp",
    alt: "Wohnungsreinigung in einem hellen Wohnraum",
  },
  {
    id: "buroreinigung",
    category: "Büro & Gebäude",
    title: "Büroreinigung",
    summary: "Sauberkeit, die Produktivität steigert. Ein sauberer und hygienischer Arbeitsplatz schafft nicht nur eine angenehme Atmosphäre, sondern fördert auch Gesundheit und Effizienz Ihrer Mitarbeiter. Wir bieten gründliche, zuverlässige und diskrete Reinigungsleistungen – individuell abgestimmt auf Ihre Anforderungen und Arbeitszeiten.",
    image: "/assets/stories/story-office-portrait.webp",
    alt: "Professionelle Reinigung eines Büros",
  },
  {
    id: "fensterreinigung",
    category: "Glas & Außen",
    title: "Fensterreinigung",
    summary: "Unsere Fensterreinigung sorgt für streifenfreie Sauberkeit und klare Sicht. Wir reinigen professionell Ihre Fenster, Rahmen und Fensterbänke und verleihen Ihrem Objekt ein makellos gepflegtes Erscheinungsbild. Mit hochwertigen Reinigungsmitteln und modernen Techniken entfernen wir selbst hartnäckige Verschmutzungen und sorgen für glänzende Ergebnisse – innen und außen.",
    image: "/assets/stories/story-windows-portrait.webp",
    alt: "Alpine Sauber bei der professionellen Fensterreinigung",
  },
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="motion-scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

function sceneOpacity(progress, index) {
  const ranges = [
    [0, 0.04, 0.28, 0.37],
    [0.28, 0.37, 0.62, 0.72],
    [0.62, 0.72, 0.96, 1],
  ];
  const values = index === 0 ? [1, 1, 1, 0] : index === 2 ? [0, 1, 1, 1] : [0, 1, 1, 0];
  return useTransform(progress, ranges[index], values);
}

function ScenePhoto({ scene, index, progress, reduced }) {
  const opacity = sceneOpacity(progress, index);
  const y = useTransform(progress, [0, 1], ["4%", "-4%"]);
  const scale = useTransform(progress, [0, 1], [1.045, 1.12]);

  return (
    <motion.figure
      className="journey-scene-image"
      aria-hidden="true"
      style={reduced ? { opacity: 1 } : { opacity, y, scale }}
    >
      <img className="journey-scene-photo" src={scene.image} alt="" width="1008" height="1792" loading={reduced ? "eager" : "lazy"} fetchPriority={reduced || index === 0 ? "high" : "low"} decoding="async" />
      <figcaption><span>0{index + 1} / 03</span><span>{scene.category}</span></figcaption>
    </motion.figure>
  );
}

function SceneCopy({ scene, index, reduced }) {
  return (
    <motion.article
      className="journey-scene-copy"
      aria-labelledby={`journey-title-${scene.id}`}
      initial={reduced ? false : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.27, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="journey-scene-kicker">0{index + 1} <span>—</span> {scene.category}</p>
      <h3 id={`journey-title-${scene.id}`}>{scene.title}</h3>
      <p className="journey-scene-summary">{scene.summary}</p>
      <button className="journey-scene-link" type="button" data-service-id={scene.id}>
        Leistung ansehen <span aria-hidden="true">↗</span>
      </button>
    </motion.article>
  );
}

function AlpineJourney() {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const staticJourney = reduced || isMobile;
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const syncViewport = () => setIsMobile(query.matches);
    query.addEventListener("change", syncViewport);
    return () => query.removeEventListener("change", syncViewport);
  }, []);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const routeLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (staticJourney) return;
    const next = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
    setActiveSceneIndex((current) => current === next ? current : next);
  });

  return (
    <section
      ref={trackRef}
      className="motion-journey"
      data-reduced={staticJourney ? "true" : "false"}
      aria-labelledby="journey-heading"
    >
      <div className="motion-journey-sticky">
        <div className="journey-grain" aria-hidden="true" />
        <div className="journey-topline">
          <span><i aria-hidden="true" /> Alpine Sauber · Graz</span>
          <span className="journey-scroll-hint">Weiter scrollen <b aria-hidden="true">↓</b></span>
        </div>

        <div className="journey-layout">
          <div className="journey-copy-column">
            <p className="journey-overline">Zwölf Leistungen · ein Anspruch</p>
            <h2 id="journey-heading">Sauberkeit.<br /><em>In jedem Raum.</em></h2>
            <p className="journey-lede">Zuhause, im Unternehmen und überall dort, wo Sorgfalt den Unterschied macht.</p>
            <div className="journey-scene-copy-stack" aria-live={staticJourney ? undefined : "polite"} aria-atomic="true">
              <AnimatePresence initial={false} mode="sync">
                {(staticJourney ? scenes.map((scene, index) => ({ scene, index })) : [{ scene: scenes[activeSceneIndex], index: activeSceneIndex }]).map(({ scene, index }) => (
      <SceneCopy key={scene.id} scene={scene} index={index} reduced={staticJourney} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="journey-visual-column">
            <div className="journey-route" aria-hidden="true">
              <svg viewBox="0 0 100 620" preserveAspectRatio="none">
                <path className="journey-route-base" d="M52 0 C18 76 83 112 50 184 C17 255 82 300 50 362 C19 428 84 470 50 528 C31 562 42 596 51 620" />
                <motion.path className="journey-route-live" d="M52 0 C18 76 83 112 50 184 C17 255 82 300 50 362 C19 428 84 470 50 528 C31 562 42 596 51 620" style={{ pathLength: routeLength }} />
              </svg>
              <span>ALPINE<br />FLOW</span>
            </div>
            <div className="journey-visual-frame">
              {scenes.map((scene, index) => (
                <ScenePhoto key={scene.id} scene={scene} index={index} progress={scrollYProgress} reduced={staticJourney} />
              ))}
            </div>
            <div className="journey-visual-caption"><span>Präzision, die man sieht.</span><span>Graz · Steiermark · Österreich</span></div>
          </div>
        </div>
        <div className="journey-mobile-heading">
          <p className="journey-overline">Zwölf Leistungen · ein Anspruch</p>
          <h2>Sauberkeit.<br /><em>In jedem Raum.</em></h2>
          <p className="journey-lede">Zuhause, im Unternehmen und überall dort, wo Sorgfalt den Unterschied macht.</p>
        </div>
        <div className="journey-mobile-stories">
          {scenes.map((scene, index) => (
            <article className="journey-mobile-story" key={scene.id}>
              <figure className="journey-mobile-photo">
                <img src={scene.image} alt={scene.alt} width="1008" height="1792" loading="eager" fetchPriority={index === 0 ? "high" : "low"} decoding="async" />
                <figcaption>0{index + 1} / 03 <span>·</span> {scene.category}</figcaption>
              </figure>
              <div className="journey-mobile-copy">
                <p className="journey-scene-kicker">0{index + 1} <span>—</span> {scene.category}</p>
                <h3>{scene.title}</h3>
                <p>{scene.summary}</p>
                <button className="journey-scene-link" type="button" data-service-id={scene.id}>
                  Leistung ansehen <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="journey-progress-track" aria-hidden="true">
          <motion.span style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

function ScrollRevealDirector() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const animated = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animated.has(entry.target)) return;
        animated.add(entry.target);
        observer.unobserve(entry.target);
        const element = entry.target;
        const delay = Number(element.dataset.motionDelay || 0);
        animate(element, { opacity: 1, y: 0, scale: 1 }, {
          duration: element.matches(".home-hero-art") ? 1.05 : 0.68,
          delay,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            element.style.removeProperty("transform");
            element.style.willChange = "auto";
          },
        });
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -9% 0px" });

    const selector = [
      ".home-hero-art",
      ".home-hero-copy > .eyebrow",
      ".home-hero-promise",
      ".home-hero h1",
      ".home-hero-original-title",
      ".home-hero .home-lede",
      ".home-hero .hero-actions",
      ".home-hero .home-facts",
      ".section-heading",
      ".home-services-intro",
      ".home-about-card",
      ".home-story-section",
      ".home-audience-grid",
      ".home-process-section",
      ".home-proof-section",
      ".home-contact-banner",
      ".about-feature",
      ".about-stats",
      ".benefit-grid",
      ".process-panel",
      ".contact-layout",
    ].join(",");

    const observe = (scope = document) => {
      const revealTargets = [...scope.querySelectorAll(selector)];
      if (scope.matches?.(selector)) revealTargets.unshift(scope);
      revealTargets.forEach((element, index) => {
        if (animated.has(element) || element.dataset.motionPrepared === "true") return;
        element.dataset.motionPrepared = "true";
        element.dataset.motionDelay = element.matches(".home-hero-copy > *") ? String(Math.min(index * 0.055, 0.28)) : "0";
        element.style.opacity = "0";
        element.style.transform = "translate3d(0, 22px, 0) scale(.99)";
        element.style.willChange = "transform, opacity";
        observer.observe(element);
      });

      const serviceCards = [...scope.querySelectorAll(".home-service-grid .service-card, #service-grid .service-card")];
      if (scope.matches?.(".service-card")) serviceCards.unshift(scope);
      serviceCards.forEach((element, index) => {
        if (animated.has(element) || element.dataset.motionPrepared === "true") return;
        element.dataset.motionPrepared = "true";
        element.dataset.motionDelay = String((index % 4) * 0.055);
        element.style.opacity = "0";
        element.style.transform = "translate3d(0, 20px, 0) scale(.985)";
        element.style.willChange = "transform, opacity";
        observer.observe(element);
      });
    };

    observe();
    const contentReady = () => observe();
    window.addEventListener("alpine:content-ready", contentReady);
    const mutation = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) observe(node);
      }));
    });
    const homeGrid = document.querySelector("#home-service-grid");
    const serviceGrid = document.querySelector("#service-grid");
    if (homeGrid) mutation.observe(homeGrid, { childList: true });
    if (serviceGrid) mutation.observe(serviceGrid, { childList: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("alpine:content-ready", contentReady);
    };
  }, [reduced]);

  return null;
}

function MotionProgressRoot() {
  return <>
    <ScrollProgress />
    <ScrollRevealDirector />
  </>;
}

const progressRoot = document.getElementById("motion-scroll-progress-root");
const journeyRoot = document.getElementById("home-motion-story-root");
const setLayoutViewportWidth = () => {
  document.documentElement.style.setProperty("--layout-viewport-width", `${document.documentElement.clientWidth}px`);
};
setLayoutViewportWidth();
window.addEventListener("resize", setLayoutViewportWidth, { passive: true });
if (progressRoot) createRoot(progressRoot).render(<MotionProgressRoot />);
if (journeyRoot) createRoot(journeyRoot).render(<AlpineJourney />);
