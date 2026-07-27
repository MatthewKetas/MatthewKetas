# SYSTEM_DESIGN.md — Matthew Ketas Portfolio

A single-page personal portfolio for Matthew Ketas (Computer Engineering, University of Pittsburgh), statically exported and hosted on GitHub Pages. It showcases academics, research, experience, and projects, and makes contact effortless. Visual direction follows the approved reference screenshots (`designdocs/HERO_REFERENCE_IMAGE.png`): a dark navy "powered-on PCB" aesthetic with glowing circuit traces — with an audited, accessible color system.

---

## 1. Goals & Non-Goals

**Goals**
- Professional first impression for recruiters, faculty, and collaborators within 5 seconds.
- Present education, experience, research/projects, and leadership from the resume as structured content.
- Contact form that hands off to the visitor's own mail client, plus a resume download — no backend required.
- Distinctive identity: circuit-trace timeline and PCB "silkscreen" design language.
- Fast (static-first), accessible (WCAG AA), responsive down to 360px.

**Non-Goals**
- No CMS, no database, no auth, no server. Fully static export; content lives in typed TypeScript files.
- No blog (structure allows adding one later).
- No analytics.

---

## 2. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript), `output: "export"` | Static HTML/CSS/JS output, no server required — deployable to GitHub Pages. |
| Styling | Tailwind CSS v4 + CSS custom properties | Tokens defined once as CSS variables, consumed by Tailwind theme. |
| Motion | CSS transitions + `motion` (Framer Motion successor) for SVG trace drawing and scroll reveals | Only two orchestrated moments; everything else CSS. |
| Forms/Email | `mailto:` handoff, built client-side | No backend to host, no per-message cost, no abuse surface. |
| Validation | Zod on the contact payload | Client-side field validation before building the mailto link. |
| Fonts | `next/font` (self-hosted Google fonts) | Zero layout shift, no third-party requests. |
| Lint/Format | ESLint (next config) + Prettier | Defaults, no bikeshedding. |
| Tests | Playwright smoke suite (nav, section render, form validation) | Matches prior Playwright experience; runs in CI. |

---

## 3. Information Architecture

Single page, six sections, sticky pill navigation (matches reference nav bar). Each section is framed as a "board" with a mono silkscreen label — reference designators encode real meaning (they are the section index in board-order).

| Order | Section | Silkscreen label | Content source |
|---|---|---|---|
| 1 | Hero | `PWR` | Name, title ("Computer Engineering @ Pitt"), one-line thesis, CTA buttons (View Work / Contact), animated trace background. |
| 2 | Academics | `EDU` | Pitt / Swanson / Frederick Honors College, BS CompE (Apr 2027), Econ minor, GPA 3.9, coursework chips, international study (South Korea '24, Czech Republic '25, Brazil '26). |
| 3 | Experience | `XP` | Circuit-trace timeline: Aerotech (SWE Intern 2025), Own Company/Salesforce (SWE Intern 2024), Own Company (Corp Dev 2022–23). |
| 4 | Research & Projects | `LAB` | Cards: HearSmart Hearing Aid (EEG, Python, closed-loop), SaveIt! (ESP32, BLE, Altium, enclosure), IEEE chapter website. |
| 5 | Leadership | `ORG` | IEEE Pitt VP, Triangle Fraternity VP of Recruitment. |
| 6 | Contact | `IO` | Form (name, email, subject, message), connect links (LinkedIn, GitHub), "Download Resume" CTA. |

**Resume policy (user-confirmed):** the resume PDF is publicly downloadable from the site (`public/MatthewKetas-Resume.pdf`, copied from `personalcredentials/` at content-update time). Public contact email is `matt.ketas@gmail.com`.

---

## 4. Design System

### 4.1 Color (audited)

Reference screenshots use saturated cyan glow on navy. Audit outcome: keep the identity, fix contrast and glow discipline.

| Token | Hex | Role |
|---|---|---|
| `--bg-abyss` | `#05090F` | Page background |
| `--bg-board` | `#0A121F` | Section boards |
| `--bg-raised` | `#101B2E` | Cards, form fields |
| `--line` | `#1B2B44` | Borders, hairlines |
| `--trace` | `#35C4F2` | Primary accent: traces, links, interactive |
| `--trace-hot` | `#7EE0FF` | Hover states, node pulses |
| `--violet` | `#8F7BF2` | Trace gradient terminus only (timeline bottom) |
| `--text` | `#E8F0FA` | Primary text (~16:1 on abyss) |
| `--muted` | `#93A7C4` | Secondary text (~7:1 on abyss) |
| `--on-accent` | `#04121C` | Text on cyan buttons |

Audit rules:
- Cyan is never body-text color; accent and interactive only.
- Glows are `box-shadow` with ≤ 35% alpha of `--trace`; no pure `#00FFFF`, no stacked glows.
- All text pairs meet WCAG AA (body ≥ 4.5:1, large ≥ 3:1). Buttons: `--trace` fill with `--on-accent` text (≈8.9:1).
- Violet appears only inside the timeline gradient — one gradient on the page, matching the reference.

### 4.2 Typography

| Role | Face | Usage |
|---|---|---|
| Display | Space Grotesk 500/600 | Section headings, hero name. Tight tracking (-0.02em). |
| Body | IBM Plex Sans 400/500 | Paragraphs, cards. |
| Silkscreen / data | IBM Plex Mono 400/500, uppercase, +0.08em tracking | Section labels (`PWR`, `EDU`…), dates, chips, form labels. |

Scale (rem): 0.75 / 0.875 / 1 / 1.125 / 1.5 / 2.25 / clamp(2.5–4.5) hero.

### 4.3 Spacing, radius, shape

- Spacing: Tailwind default 4px base; sections `py-24` desktop / `py-16` mobile.
- Radius: pills for nav + buttons (`9999px`, matches reference buttons), `12px` cards, `8px` inputs.
- Buttons match reference: cyan pill primary with subtle outer glow on hover; ghost pill secondary with `--line` border.

### 4.4 Signature element

**The circuit-trace timeline** (Experience section): an SVG bundle of PCB traces running vertically, drawn on scroll (`stroke-dashoffset`), gradient `--trace → --violet` top-to-bottom. Each job is a node (circular pad with icon) branching off the bundle, entries alternating left/right on desktop and stacking single-column on mobile. Hero reuses a faint static version of the trace pattern as background texture — one motif, two intensities.

### 4.5 Motion

- **Page load:** hero traces "power on" — draw in over ~900ms, then node pulse. Once, on load only.
- **Scroll:** timeline traces draw as the section enters; cards fade/rise 12px, staggered 60ms.
- **Hover:** button glow, card border brightens to `--trace` at 40%.
- `prefers-reduced-motion`: all draws/reveals become instant; pulses disabled.

---

## 5. Architecture

```
app/
  layout.tsx          # fonts, metadata, theme
  page.tsx            # composes sections
components/
  nav.tsx  hero.tsx  academics.tsx  experience-timeline.tsx
  projects.tsx  leadership.tsx  contact.tsx  footer.tsx
  ui/ (button, card, chip, silkscreen-label, section)
content/
  resume.ts           # single source of truth: typed education/experience/projects/leadership
  site.ts             # name, links, email, meta
lib/
  contact-schema.ts   # zod schema (shared client/server)
public/               # og image, favicon, trace SVGs
```

- All sections are server components; only the contact form and motion wrappers are client components.
- Content edits touch `content/*.ts` only — components never hardcode resume facts.

### 5.1 Contact flow

1. Client validates with the Zod schema; inline field errors on failure.
2. On success, the client builds a `mailto:matt.ketas@gmail.com` link (subject + body pre-filled from the form) and navigates to it, handing off to the visitor's own mail client.
3. The form reports "your email app should open" — it never claims the message was already sent, since a static site can't confirm delivery.

No env vars, no server, no per-message cost or rate limit to maintain.

---

## 6. Quality Budgets

- Lighthouse ≥ 95 performance / 100 accessibility on mobile.
- JS shipped to client < 90KB gzip (motion loaded only where used).
- Largest Contentful Paint < 2.0s on Fast 3G-throttled mobile.
- Keyboard: visible focus ring (`--trace-hot` 2px offset ring) on every interactive element; logical tab order; skip-to-content link.
- OG image + full metadata (title, description, canonical) for link sharing.

## 7. Deployment

- GitHub Pages, built and published by `.github/workflows/deploy.yml` (`actions/upload-pages-artifact` + `actions/deploy-pages`) on every push to `main`.
- CI (`.github/workflows/ci.yml`): lint, typecheck, build, Playwright smoke on PRs.
- Domain: `matthewketas.github.io` (repo renamed to that exact name so Pages serves it at the root, no basePath); custom domain drop-in later via a `CNAME` file if desired.
