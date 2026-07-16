const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelector("#current-year").textContent = new Date().getFullYear();

const carousel = document.querySelector(".experience-track");
const cards = [...document.querySelectorAll(".experience-card")];
const previousButton = document.querySelector('[data-direction="previous"]');
const nextButton = document.querySelector('[data-direction="next"]');
let activeCard = 0;

function updateCarousel() {
  const gap = Number.parseFloat(getComputedStyle(carousel).gap) || 0;
  const cardWidth = cards[0].getBoundingClientRect().width;
  carousel.style.transform = `translateX(-${activeCard * (cardWidth + gap)}px)`;
  previousButton.disabled = activeCard === 0;
  nextButton.disabled = activeCard === cards.length - 1;
  cards.forEach((card, index) => card.setAttribute("aria-hidden", index === activeCard ? "false" : "true"));
}

previousButton.addEventListener("click", () => {
  activeCard = Math.max(0, activeCard - 1);
  updateCarousel();
});

nextButton.addEventListener("click", () => {
  activeCard = Math.min(cards.length - 1, activeCard + 1);
  updateCarousel();
});

window.addEventListener("resize", updateCarousel, { passive: true });
updateCarousel();

const pageSections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);
    if (!visibleSection) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-30% 0px -65%" },
);

pageSections.forEach((section) => sectionObserver.observe(section));

function splitStatement() {
  const statement = document.querySelector(".approach-statement");
  const words = statement.textContent.trim().split(/\s+/);
  statement.replaceChildren(
    ...words.flatMap((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      return index === words.length - 1 ? [span] : [span, document.createTextNode(" ")];
    }),
  );
}

function initializeMotion() {
  if (prefersReducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  splitStatement();

  window.gsap.to(".approach-statement .word", {
    opacity: 1,
    stagger: 0.08,
    ease: "none",
    scrollTrigger: {
      trigger: ".approach-section",
      start: "top 72%",
      end: "bottom 55%",
      scrub: true,
    },
  });

  window.gsap.utils.toArray(".project-card").forEach((card, index) => {
    window.gsap.fromTo(
      card,
      { y: 48, scale: 0.96 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 62%",
          scrub: 0.5,
        },
        delay: index * 0.03,
      },
    );
  });

  window.gsap.to(".signal-pulse", {
    scale: 1.8,
    opacity: 0.25,
    transformOrigin: "center",
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

window.addEventListener("load", initializeMotion, { once: true });
