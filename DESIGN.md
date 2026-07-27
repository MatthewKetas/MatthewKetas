# DESIGN.md — Visual Authority

<!-- impeccable:design-schema 1 -->

World: **a powered-on PCB**. The page is a dark board; content sits on it like components; cyan traces carry the reader between them. Pinned by user-supplied reference screenshots (`designdocs/HERO_REFERENCE_IMAGE.png`, `HERO_REFERENCE_IMAGE_2.png`) and the approved [designdocs/SYSTEM_DESIGN.md](designdocs/SYSTEM_DESIGN.md) §4, which is the token source of truth. This file records the durable rules; exact values live in `app/globals.css`.

## Tokens (authoritative values in globals.css)

- Backgrounds: `--bg-abyss #05090F` (page), `--bg-board #0A121F` (sections), `--bg-raised #101B2E` (cards/inputs).
- Line: `--line #1B2B44` hairlines/borders.
- Accent: `--trace #35C4F2` (interactive, traces), `--trace-hot #7EE0FF` (hover, pulses, focus ring), `--violet #8F7BF2` (timeline gradient terminus ONLY — one gradient on the page).
- Text: `--text #E8F0FA`, `--muted #93A7C4`, `--on-accent #04121C` (on cyan fills).
- Feedback: `--error #F2A1A1` (form errors only).

## Rules

1. Cyan is never body-text color. Accent, links, interactive, silkscreen highlights only.
2. Glow = the board's LED light: `box-shadow` with `--trace` at ≤35% alpha, always with blur, never stacked, never pure `#00FFFF`. Glows appear on interactive elements and trace nodes, not on text or static containers.
3. One *color* gradient on the page: the experience-timeline trace bundle, `--trace → --violet`, top to bottom. Nothing else is gradient-filled; no gradient text ever. Exempt: low-alpha radial light-scatter washes (`--trace` ≤14% alpha) used as scene lighting behind trace clusters — they are the board's LED ambience, not a fill.
4. Silkscreen language: IBM Plex Mono, uppercase, +0.08em tracking, `--muted`, used only where a PCB would print it — section reference designators (`PWR`, `EDU`, `XP`, `LAB`, `ORG`, `IO`), dates, chips, form labels, footer legend. Never for headings or body.
5. Type: Space Grotesk 500/600 display (tracking -0.02em); IBM Plex Sans 400/500 body. Body measure 65–75ch. Display max 6rem.
6. Shape: pills (9999px) for nav and buttons; 12px cards; 8px inputs. Cards are bordered (`--line`) raised surfaces, hover border brightens toward `--trace` at 40% — no colored left-border stripes.
7. Traces are drawn, not decorated: SVG paths with 45° bends, vias (circles) at branches, pads (rings) at endpoints. Trace geometry follows PCB routing grammar everywhere it appears.
8. Motion: one orchestrated moment — hero power-on (trace draw + node pulse, ~900ms, once). Scroll: timeline draws with scroll progress; cards fade/rise 12px stagger 60ms. Exponential ease-out. `prefers-reduced-motion` collapses all of it to instant/visible.
9. Contrast: WCAG AA floor everywhere; secondary text is blue-tinted (`--muted`), never gray.
10. Dark is not a style choice; it is the scene — an energized board photographed in a dim lab. No light theme.

## Anti-rules

- No same-size icon-card grids as page structure; sections vary density and composition.
- No hero-metric template, no section numbers, no eyebrow-per-section outside the silkscreen system defined above.
- No glass/blur decoration; backdrop-blur only on the sticky nav where content scrolls beneath it.
