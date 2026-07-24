# CONTRIBUTING.md — Maintaining This Site

This is a plain static HTML/CSS/JS site — no npm, no build step, no framework. Every page is hand-written HTML that shares a common header/nav/footer block. Deployed via GitHub Pages on push to the default branch (`.nojekyll` at the repo root disables Jekyll processing).

See `AGENTS.md` in this same folder for the fixed decisions (colors, no build tooling, image conventions, etc.) behind these instructions, and `SYSTEM_DESIGN.md` for the site's narrative and positioning.

## Preview the site locally

```
python3 -m http.server 8000
```

Run from the repo root, then visit `http://localhost:8000/`. Don't just double-click `index.html` — opening it as a `file://` URL changes how relative paths resolve and won't match how GitHub Pages actually serves the site.

## Add a new page

1. Copy the `<head>` block (fonts, meta tags), `.site-header`, and `.site-footer` from `index.html` into the new file.
2. Update the nav's active-state so the current page is marked (see how `projects/saveit/index.html` does it).
3. Add the new path to the link-check command in the validation checklist below.
4. If the page should appear in navigation, add it to `.site-nav` in **every** existing page's header — there's no shared template, so this is a manual, all-files edit.

## Add or replace a project image

Every project's image lives at `assets/projects/<slug>/cover.svg` (placeholder) or `assets/projects/<slug>/cover.jpg` / `.png` (once you have something real). Every `<img>` referencing one is preceded by a marker comment:

```html
<!-- IMAGE:saveit/cover -->
<img src="assets/projects/saveit/cover.svg" alt="…" />
```

To swap a placeholder for a real photo, CAD export, or PCB layout:

1. Drop the real file into `assets/projects/<slug>/`, named `cover.<ext>` (or `detail-01.<ext>`, `detail-02.<ext>` for extra images on a project's detail page).
2. Find every place it's referenced: `grep -rn "IMAGE:<slug>" *.html projects/*/index.html`.
3. Update the `src=` attribute on the line directly below each marker to point at the new filename. Update the `alt` text to describe the real image. No CSS or JS changes are needed.

That's it — this is a pure file-replace plus a one-line `src=`/`alt` edit per reference, by design, so it never turns into a real code change.

## Add a new project card

Use this fixed structure (matches the cards already in `projects/index.html`):

```html
<article class="hub-card" data-categories="embedded hardware">
  <div class="card-visual">
    <!-- IMAGE:<slug>/cover -->
    <img src="../../assets/projects/<slug>/cover.svg" alt="…" width="…" height="…" loading="lazy" />
  </div>
  <div class="card-body">
    <div class="project-card-top"><span class="project-index">0N / <Type></span></div>
    <h3><Project name></h3>
    <p class="project-lede"><One sentence: what it is and why it matters></p>
    <ul class="tag-list"><li>Tech</li>…</ul>
    <a class="card-link" href="…">…</a>
  </div>
</article>
```

`data-categories` should be a space-separated list drawn from the existing filter set (`embedded`, `hardware`, `software`) — this reuses the filter-button mechanism in `script.js` unchanged; no JS edits are needed to add a project.

## Design tokens

All tokens live in `:root` at the top of `styles.css`. Colors are frozen (see `AGENTS.md`). When you need spacing, radius, shadow, or transition values, use the existing tokens (`--space-1` through `--space-16`, `--radius-sm/md/full`, `--shadow-sm/md`, `--transition-fast/base/slow`) rather than a new arbitrary value.

**Breakpoints are documented, not functional.** CSS custom properties can't be interpolated into `@media (max-width: ...)` conditions without a preprocessor, and this repo intentionally has none. The comment above `:root` lists the four breakpoints in use (`28rem` / `52rem` / `72rem` / `94rem`) purely as documentation — if you change a breakpoint in an actual `@media` rule, update that comment by hand so the two never drift apart.

## Update the resume

1. Edit `personalcredentials/KetasResume7-17.docx` — this is the editable source of truth.
2. Re-export it to PDF (Pages or Word: File → Export To → PDF) and save it as `personalcredentials/KetasResume.pdf` — deliberately without a date in the filename, so every link on the site that points to it keeps working without edits.
3. The `.docx` stays in the repo as the source file; only the PDF is linked from the live site.

## Validation checklist before calling a change done

- [ ] `node tests/check-site.mjs` — confirms every page has the mobile navigation control and every external script has SHA-384 integrity metadata.
- [ ] Preview locally and click through every page at four widths: 28rem, 52rem, 72rem, and 94rem.
- [ ] `grep -oE 'href="[^"]+"' index.html projects/*/index.html` — click through every internal link (anchors, pages) and spot-check external ones.
- [ ] `grep -rn "raw.githubusercontent.com" .` — should return nothing; every project image should be local.
- [ ] Keyboard-only pass: tab through nav, project filters, hub cards, carousel controls, and every About/Contact link — confirm a visible focus ring at every stop.
- [ ] Confirm heading order is h1 → h2 → h3 with no skipped levels on every page.
- [ ] Confirm the homepage's first screen alone communicates who Matthew is, his focus, and at least one clear call to action — no scrolling required.
