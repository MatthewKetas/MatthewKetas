# CONTRIBUTING.md

## Setup

```bash
git clone https://github.com/MatthewKetas/MatthewKetas.github.io.git
cd MatthewKetas.github.io
npm install
npm run dev
```

Node 20+. No env vars or API keys needed — the contact form hands off to a `mailto:` link client-side.

## Branch & PR flow

- `main` is production (auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`). Never commit directly to it.
- Branch naming: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Open a PR into `main`; there's no PR preview deploy, so check `npm run build && npx serve out` locally for visual changes. Review desktop *and* mobile width before merging.
- CI must be green: lint, typecheck, build, Playwright smoke.

## Commit messages

Conventional-commit style, imperative mood, ≤ 72-char subject:

```
feat: add circuit-trace timeline draw animation
fix: correct focus ring on nav pills
docs: update system design contact flow
content: update Aerotech bullet points
```

`content:` is the type for resume/site text changes (edits to `content/*.ts`).

## Making changes

| Change | Where |
|---|---|
| Resume facts, jobs, projects | `content/resume.ts` |
| Name, links, email, metadata | `content/site.ts` |
| Colors, fonts, spacing | `app/globals.css` tokens (see [designdocs/SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) §4 — update the doc in the same PR) |
| Layout/components | `components/` |

## Rules

- Design decisions follow [designdocs/SYSTEM_DESIGN.md](SYSTEM_DESIGN.md); change the doc first if you're changing the system.
- Never commit secrets or anything from `personalcredentials/`.
- New interactive elements need keyboard focus states and reduced-motion handling.
- Screenshots in PR description for any visual change.
