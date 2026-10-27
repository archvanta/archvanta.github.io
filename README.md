# ARCHVANTA

Official, independent architecture, infrastructure and digital systems website.

- Intended production URL: **https://archvanta.github.io/**
- Dedicated repository: **archvanta/archvanta.github.io**
- FRONTIER remains a separate application: **https://archvanta.github.io/frontier/#/**

This repository does not modify FRONTIER, its data pipeline, account system, routes or deployment. Vite uses `/` as the base. This site uses section anchors, has no service worker or catch-all redirect, and cannot take over `/frontier/`.

## Local development

Node 24 LTS is recommended (minimum 22.12).

```sh
npm ci
npm run dev
```

Production and checks:

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs lint, production build (including TypeScript validation) and browser tests. Tests cover six widths in both languages, four theme/language accessibility combinations, project dialogs, filtering, model controls, mobile navigation, local preferences, external links and assets.

## Editable content

- `src/lib/content.ts`: all English/Persian copy, project data, expertise, layers and URLs. Project titles, descriptions, scope and galleries use typed data rather than presentation markup.
- `src/lib/preferences.tsx`: language/theme preferences and `lang`/`dir` synchronization. Preferences are optional; blocked storage does not break the site.
- `src/styles/tokens.css`: both theme palettes, typography, spacing and model materials.
- `src/sections/`: independent, reusable page sections.
- `src/components/ArchitecturalModel.tsx`: original procedural axonometric SVG, four modes, pointer perspective. No WebGL, 3D runtime, per-frame React renders or continuous animation loop.
- `scripts/generate-assets.py`: regenerates original concept illustrations, SVG wordmark and brand symbol using Python's standard library.
- `public/brand-mark.svg`, `public/brand-wordmark.svg`, `public/favicon.svg`: original architectural identity. The mark explores an abstract A, structural frames and perspective.

### Contact and future projects

Only the real configured GitHub profile is shown. To enable email contact, enter a real address in `site.email` in `src/lib/content.ts`. Do not add a placeholder or private credentials.

Add real portfolio work only with accurate descriptions, images and permission to publish. The current `Project` data model includes a title, category, status, statement, scope, cover and secondary gallery image; extend it for actual project dates, more images and external links when those are known. Extend the Lab data/presentation when future products become real.

## Content integrity and asset provenance

- **Real live project:** FRONTIER. `public/images/frontier-live.webp` is a screenshot captured from the actual public application on 2026-10-27 UTC. It is labeled as a snapshot; its news/appearance can change.
- **Original illustrative work:** The Open Threshold, Layers of Coordination, Infrastructure, Revealed. Each is explicitly labeled **Concept study**. They were generated for this website and are not completed commissions, certified infrastructure designs or verified BIM deliverables.
- **Brand introduction:** an independent, evolving identity. No staff, awards, clients, credentials, testimonials or company history are fabricated.
- **Contact:** the supplied GitHub profile. No unconfigured email or social account is displayed.
- **Fonts:** Space Grotesk by Florian Karsten and Vazirmatn by the Vazirmatn project, both SIL Open Font License 1.1. Self-hosted through Fontsource; see dependency LICENSE files and `ASSETS.md`.
- All models, diagrams, project SVGs, identity graphics and social preview are original procedural/vector artwork created in this project. No stock hotlinks or paid APIs.

## Motion, accessibility and performance

The architectural scene is present as SVG even when interaction fails. Pointer perspective uses CSS transforms. Model controls expose pressed state and keep descriptive text available. Reduced motion disables transitions, entry effects and pointer perspective. Offscreen reveals use one IntersectionObserver and do not intercept scrolling. Content is visible without the reveal enhancement.

Dialogs use the native modal dialog for focus containment, Escape and focus restoration. The mobile navigation does not shrink desktop links into an unusable row. Keyboard skip link, focus outlines, semantic sections and bilingual labels are included. A noscript fallback provides the brand description and real external links.

There is no backend, analytics, account service, external font request, large image hotlink, tracking or secret configuration in this repository.

Measurements and screenshots are described in `QA.md`. Performance numbers are measurements in the stated environment, not guarantees on every device.

## Deployment to GitHub Pages

The included workflow `.github/workflows/pages.yml` builds and deploys this repository to the account root. It uses `npm ci`, lint and TypeScript/build validation before publishing.

For a new root repository, from this project directory:

```sh
git init -b main
git add .
git commit -m "Launch the ARCHVANTA official website"
gh repo create archvanta/archvanta.github.io --public --source=. --remote=origin --push
gh api --method POST repos/archvanta/archvanta.github.io/pages -f build_type=workflow
gh workflow run pages.yml --repo archvanta/archvanta.github.io
```

If the repo exists, clone it first and preserve its content; push reviewed updates normally. Do not run the create command twice. In GitHub Settings → Pages select **GitHub Actions**, then push to `main`. Watch the deployment:

```sh
gh run list --repo archvanta/archvanta.github.io
gh run watch RUN_ID --repo archvanta/archvanta.github.io --exit-status
```

The root deployment is independent of the existing `/frontier/` project site. `index.html`, `robots.txt`, `sitemap.xml` and Open Graph tags all use the intended canonical root URL.
