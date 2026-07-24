const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isCoarsePointer = window.matchMedia("(pointer: coarse)");

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNavigation = document.querySelector(".site-nav");
const mobileNavigation = window.matchMedia("(max-width: 52rem)");

function setNavigationOpen(isOpen, restoreFocus = false) {
  if (!navToggle || !primaryNavigation) return;

  primaryNavigation.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.textContent = isOpen ? "Close" : "Menu";
  if (restoreFocus) navToggle.focus();
}

navToggle?.addEventListener("click", () => {
  setNavigationOpen(!primaryNavigation.classList.contains("is-open"));
});

primaryNavigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavigationOpen(false);
});

document.addEventListener("click", (event) => {
  if (primaryNavigation?.classList.contains("is-open") && !siteHeader?.contains(event.target)) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && primaryNavigation?.classList.contains("is-open")) {
    setNavigationOpen(false, true);
  }
});

mobileNavigation.addEventListener("change", () => setNavigationOpen(false));

// ---------------------------------------------------------------------------
// Smooth scroll (Lenis) — fine-pointer devices only. Touch devices keep their
// already-good native momentum scroll, so Lenis (and its wiring below) simply
// never initializes there. Fully skipped under reduced motion.
// ---------------------------------------------------------------------------

let lenis = null;

function initLenis() {
  if (reducedMotion.matches || isCoarsePointer.matches || !window.Lenis || !window.gsap) return;

  lenis = new window.Lenis({ autoRaf: false });

  window.gsap.ticker.add((time) => lenis.raf(time * 1000));
  window.gsap.ticker.lagSmoothing(0);

  if (window.ScrollTrigger) {
    lenis.on("scroll", window.ScrollTrigger.update);
  }
}

function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0 });
    return;
  }
  target?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
}

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    let url;
    try {
      url = new URL(link.getAttribute("href"), window.location.href);
    } catch {
      return;
    }
    if (url.pathname !== window.location.pathname || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);
    history.pushState(null, "", url.hash);
  });
});

// ---------------------------------------------------------------------------
// Project filters (projects hub) — Flip-animated re-flow when available,
// instant show/hide otherwise (no GSAP/Flip, or reduced motion).
// ---------------------------------------------------------------------------

const filters = [...document.querySelectorAll(".filter-button")];
const projects = [...document.querySelectorAll(".project-card")];

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filters.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    const applyFilter = () => {
      projects.forEach((project) => {
        const categories = project.dataset.categories.split(" ");
        const isVisible = filter === "all" || categories.includes(filter);
        project.classList.toggle("is-hidden", !isVisible);
      });
    };

    if (reducedMotion.matches || !window.gsap || !window.Flip) {
      applyFilter();
      return;
    }

    const state = window.Flip.getState(projects);
    applyFilter();
    window.Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) =>
        window.gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }),
      onLeave: (els) => window.gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }),
    });
  });
});

// ---------------------------------------------------------------------------
// Evidence carousel (unchanged behavior)
// ---------------------------------------------------------------------------

const track = document.querySelector(".evidence-track");
const evidenceCards = [...document.querySelectorAll(".evidence-card")];
const previousButton = document.querySelector('[data-direction="previous"]');
const nextButton = document.querySelector('[data-direction="next"]');
const count = document.querySelector(".carousel-count b");
let activeCard = 0;

function updateCarousel() {
  if (!track || !evidenceCards.length) return;

  const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
  const cardWidth = evidenceCards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${activeCard * (cardWidth + gap)}px)`;
  previousButton.disabled = activeCard === 0;
  nextButton.disabled = activeCard === evidenceCards.length - 1;
  count.textContent = String(activeCard + 1).padStart(2, "0");

  evidenceCards.forEach((card, index) => {
    card.setAttribute("aria-hidden", String(index !== activeCard));
  });
}

previousButton?.addEventListener("click", () => {
  activeCard = Math.max(0, activeCard - 1);
  updateCarousel();
});

nextButton?.addEventListener("click", () => {
  activeCard = Math.min(evidenceCards.length - 1, activeCard + 1);
  updateCarousel();
});

window.addEventListener("resize", updateCarousel, { passive: true });
updateCarousel();

// ---------------------------------------------------------------------------
// Nav active-section tracking (unchanged behavior)
// ---------------------------------------------------------------------------

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${current.target.id}`;
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-28% 0px -66%" },
);

sections.forEach((section) => sectionObserver.observe(section));

// ---------------------------------------------------------------------------
// Evidence stat resolve — numbers count up / characters resolve into place
// the first time each card's section scrolls into view.
// ---------------------------------------------------------------------------

function animateEvidenceNumber(el, gsap) {
  const text = el.textContent.trim();
  const match = text.match(/^\d+(?:\.\d+)?/);
  if (!match) return;

  const suffix = text.slice(match[0].length);
  const endValue = Number.parseFloat(match[0]);
  const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;
  const proxy = { value: 0 };

  gsap.to(proxy, {
    value: endValue,
    duration: 1.1,
    ease: "power2.out",
    scrollTrigger: { trigger: ".evidence-section", start: "top 72%" },
    onUpdate: () => {
      el.textContent = proxy.value.toFixed(decimals) + suffix;
    },
    onComplete: () => {
      el.textContent = endValue.toFixed(decimals) + suffix;
    },
  });
}

// ---------------------------------------------------------------------------
// All scroll/load-driven motion. Registers whichever GSAP plugins this page
// actually loaded, then builds each effect defensively so the same script.js
// works whether a page has the full toolkit (home) or just the essentials
// (project pages).
// ---------------------------------------------------------------------------

function initializeMotion() {
  if (!window.gsap) return;

  const gsap = window.gsap;
  const plugins = [
    window.ScrollTrigger,
    window.DrawSVGPlugin,
    window.MotionPathPlugin,
    window.Flip,
    window.SplitText,
  ].filter(Boolean);
  if (plugins.length) gsap.registerPlugin(...plugins);

  if (!window.ScrollTrigger) return;

  if (reducedMotion.matches) {
    // Leave every animated element at its natural, fully-visible CSS state —
    // nothing to build. The hero SVG's dashed connectors and the discipline
    // marquee are unaffected since they never depend on JS for their resting
    // state.
    return;
  }

  buildHeroSequence(gsap);
  buildScrollReveals(gsap);
}

function buildHeroSequence(gsap) {
  const heroTitle = document.querySelector("#hero-title");
  const heroCopyRest = [...document.querySelectorAll(".hero-copy > *:not(#hero-title)")];
  const heroSystem = document.querySelector(".hero-system");
  if (!heroTitle && !heroSystem) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (window.SplitText && heroTitle) {
    const split = new window.SplitText(heroTitle, { type: "words" });
    tl.from(split.words, { y: 24, opacity: 0, duration: 0.7, stagger: 0.05 }, 0);
  } else if (heroTitle) {
    tl.from(heroTitle, { y: 24, opacity: 0, duration: 0.7 }, 0);
  }

  if (heroCopyRest.length) {
    tl.from(heroCopyRest, { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.1);
  }

  if (heroSystem) {
    tl.from(heroSystem, { x: 32, opacity: 0, duration: 0.8 }, 0.15);
  }

  const nodes = gsap.utils.toArray(".map-node");
  const links = gsap.utils.toArray(".map-link:not(.map-link-center)");
  const centerLink = document.querySelector(".map-link-center");
  const pulse = document.querySelector(".map-pulse");

  if (window.DrawSVGPlugin && nodes.length) {
    const rects = nodes.map((node) => node.querySelector("rect")).filter(Boolean);
    const labels = nodes.flatMap((node) => [...node.querySelectorAll("text")]);

    tl.from(rects, { drawSVG: "0%", fillOpacity: 0, duration: 0.5, stagger: 0.09, ease: "power2.out" }, 0.5);
    tl.from(labels, { opacity: 0, duration: 0.3, stagger: 0.045 }, 0.7);

    if (links.length) {
      // DrawSVG animates via stroke-dasharray/dashoffset, which overrides the
      // links' normal dashed hairline style (stroke-dasharray: 4 5) for the
      // duration of the draw. Clear the inline overrides the instant each
      // link finishes so the CSS dash pattern is back in control — the
      // settled state ends up pixel-identical to today's static diagram.
      tl.from(links, { drawSVG: "0%", duration: 0.5, stagger: 0.07, ease: "power2.inOut" }, 0.55).set(
        links,
        { clearProps: "strokeDasharray,strokeDashoffset" },
        ">",
      );
    }

    if (centerLink) {
      // Opacity is included here (not just drawSVG) because SVG markers
      // (the arrowhead) render at the path's endpoint regardless of the
      // stroke's dasharray-driven draw progress — without it, the arrowhead
      // would appear at full opacity well before the line reaches it.
      tl.from(centerLink, { drawSVG: "0%", opacity: 0, duration: 0.5, ease: "power2.inOut" }, 1.0);
    }
  }

  if (window.MotionPathPlugin && pulse && centerLink) {
    tl.fromTo(
      pulse,
      { opacity: 0 },
      {
        opacity: 1,
        motionPath: { path: centerLink },
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      1.5,
    );
  } else if (pulse) {
    gsap.to(pulse, {
      scale: 2,
      opacity: 0.15,
      transformOrigin: "center",
      repeat: -1,
      yoyo: true,
      duration: 1.1,
      ease: "sine.inOut",
    });
  }
}

function buildScrollReveals(gsap) {
  gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 54, scale: 0.965, opacity: 0.2 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 94%",
          end: "top 66%",
          scrub: 0.45,
        },
        delay: index * 0.02,
      },
    );
  });

  gsap.utils.toArray(".evidence-card").forEach((card, index) => {
    const trigger = { trigger: ".evidence-section", start: "top 72%" };

    gsap.from(card, {
      y: 38 + index * 12,
      rotate: index === 0 ? 0 : index % 2 ? 1.2 : -1.2,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { ...trigger },
    });

    const numberEl = card.querySelector(".evidence-number");
    if (numberEl) animateEvidenceNumber(numberEl, gsap);
  });

  const systemList = document.querySelector(".case-system-list");
  if (systemList) {
    gsap.from(systemList.querySelectorAll("li"), {
      opacity: 0,
      x: -16,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: systemList, start: "top 85%" },
    });
  }
}

function refreshAfterLoad() {
  if (!window.ScrollTrigger) return;
  window.ScrollTrigger.refresh();

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(() => window.ScrollTrigger.refresh());
}

window.addEventListener(
  "load",
  () => {
    initLenis();
    initializeMotion();
    refreshAfterLoad();
  },
  { once: true },
);
