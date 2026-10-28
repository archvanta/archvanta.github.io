# Unified application validation

Validated locally on 2026-10-28 in Chromium against Vite production/mock preview builds.

- TypeScript and ESLint passed.
- 26 unit files / 170 tests passed, including original editorial/account/SQL isolation coverage and new canonical route/content provenance checks.
- 48 browser checks passed locally: 12 responsive route matrices (English/Persian at 360, 390, 768, 1024, 1440 and 1920px); 20 Axe scans (both languages/themes on five routes); 16 interaction/integration checks, including parallax reversal, shared fonts and the studio navigation flow.
- Axe WCAG 2 A/AA and 2.1 A/AA scans reported zero violations in the tested states. This is automated coverage, not certification of every possible interaction.
- Integration checks cover project detail refresh/gallery, original collaboration credits/proposal images, `/work-media/` cover availability, saved-story persistence, global news/project search, language/theme migration, mobile disclosures/focus, lazy model launch, editorial routes, external-source attribution, stable liquid navigation keyboard/disclosures/CSP, headline project navigation, and the permanent scroll opening.
- Production preview smoke checks used live FRONTIER data. Home/projects/news/Persian mobile produced no page exceptions or horizontal document overflow. Screenshots are in `docs/previews/unification`.
- Production build completed. Secret-key bundle scan passed. Main entry is approximately 348KB JS /111KB gzip; brand and editorial routes are split. Portfolio media are separate lazy assets; model Three.js is not in the application bundle. All 184 images and five model files are checked in both the source and published build.

The refresh is documented in `docs/STUDIO-EXPERIENCE.md`, with screenshots in `docs/previews/refresh`. The restored red statue scene keeps the four reversible parallax layers. New checks cover generated artwork dimensions and image loading, all six proposal page counts, uniform gallery frames, PDF response bytes, Cheghad access and per-frame header stability across routes. The mock-only fixture banner is removed for the header measurement to match the published shell. The header also has its own named view-transition snapshot.

The source audit in `docs/migration/uploaded-portfolio-audit.md` found nine matching projects, 182 byte-identical embedded images and 119 proposal pages. All source proposals are expanded by default; no portfolio content needed re-importing.

The opening uses transform-only GSAP scroll animation and Lenis in full motion; reduced/lite motion preserves a static scene and native scrolling. Direct routes bypass the home-only section. The navbar has no canvas, spring or idle animation, and the project carousel has no autoplay in the application. Universal 60fps cannot be guaranteed across devices; this report does not reuse the old standalone site's Lighthouse scores or claim a new 100/100 score.

Individual third-party model-viewer CDN execution and external demo availability are runtime dependencies, not guaranteed by local route/asset checks. No real production account backend is enabled. GitHub CI reruns checks before merging; the Pages workflow rebuilds and validates the published artifact.
