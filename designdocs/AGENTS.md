# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this repo is

Personal portfolio site for Matthew Ketas (Computer Engineering, University of Pittsburgh). Next.js 15 + TypeScript + Tailwind CSS v4, statically exported (`output: "export"`) and deployed on GitHub Pages. Full architecture and design system: [designdocs/SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (must pass before any PR)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Playwright smoke suite
```

## Hard rules

1. **Design tokens are law.** All colors, fonts, radii come from the token tables in SYSTEM_DESIGN.md §4, defined as CSS variables in `app/globals.css`. Never introduce ad-hoc hex values or fonts in components.
2. **Content lives in `content/*.ts` only.** Resume facts (jobs, dates, projects, GPA) are never hardcoded in components. To change site text, edit `content/resume.ts` or `content/site.ts`.
3. **`personalcredentials/` is the resume working directory.** The only sanctioned copy out of it is the public resume PDF at `public/MatthewKetas-Resume.pdf` (user-approved download). Never paste its contents into components or content files; resume facts flow through `content/resume.ts`. Public contact email is `matt.ketas@gmail.com`.
4. **No secrets in the repo, no server.** This is a static export with no API routes and no env vars to configure. If you find a committed secret, stop and flag it.
5. **Accessibility floor:** WCAG AA contrast, visible focus rings, `prefers-reduced-motion` respected on any animation you add. Cyan (`--trace`) is never used as body-text color.
6. **Server components by default.** Add `"use client"` only for the contact form and motion wrappers.

## Conventions

- Components: one per file in `components/`, PascalCase exports, kebab-case filenames.
- Shared primitives (button, card, chip, section frame) live in `components/ui/` — reuse before creating new ones.
- Validation schemas in `lib/`, shared between client and server (Zod).
- Commit style: see [CONTRIBUTING.md](CONTRIBUTING.md).
- Match existing Tailwind class ordering and file idiom; avoid inline `style=` except for dynamic SVG values.

## Definition of done

A change is done when `lint`, `typecheck`, `build`, and `test` all pass, the affected UI matches the SYSTEM_DESIGN.md tokens, and mobile (360px) layout is verified.
