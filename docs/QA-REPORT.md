# Unified application validation

Validated locally on 2026-10-28 in Chromium against Vite production/mock preview builds.

- TypeScript and ESLint passed.
- 26 unit files / 170 tests passed, including original editorial/account/SQL isolation coverage and new canonical route/content provenance checks.
- 46 browser checks passed locally (45 in the full suite and the new studio flow in a targeted run): 12 responsive route matrices (English/Persian at 360, 390, 768, 1024, 1440 and 1920px); 20 Axe scans (both languages/themes on five routes); 14 interaction/integration checks, including parallax reversal, shared fonts and the studio navigation flow.
- Axe WCAG 2 A/AA and 2.1 A/AA scans reported zero violations in the tested states. This is automated coverage, not certification of every possible interaction.
- Integration checks cover project detail refresh/gallery, original collaboration credits/proposal images, `/work-media/` cover availability, saved-story persistence, global news/project search, language/theme migration, mobile disclosures/focus, lazy model launch, editorial routes, external-source attribution, stable liquid navigation keyboard/disclosures/CSP, circular project navigation, and the permanent scroll opening.
- Production preview smoke checks used live FRONTIER data. Home/projects/news/Persian mobile produced no page exceptions or horizontal document overflow. Screenshots are in `docs/previews/unification`.
- Production build completed. Secret-key bundle scan passed. Main entry is approximately 348KB JS /111KB gzip; brand and editorial routes are split. Portfolio media are separate lazy assets; model Three.js is not in the application bundle. All 184 images and five model files are checked in both the source and published build.

Current opening screenshots are in `docs/previews/parallax`. The supplied Osmo mountain scene replaces the prior statue opening, with ARCHVANTA behind the foreground figure. Browser coverage verifies different layer travel, reversal on upward scroll, and Lenis cleanup on route/motion changes. Computer media remain removed. Original line glyphs appear below the scene and in brand menus. Lab titles and icons use white on their dark colored cards.

The studio finish is documented in `docs/STUDIO-EXPERIENCE.md`, with production screenshots in `docs/previews/studio`. It adds useful hero actions, prioritizes selected work, frames the original linework and models, improves the creator/contact/footer sections, and removes duplicate news content on home. Catalog filter counts are derived from source records. Back-to-top preserves the current route.

The opening uses transform-only GSAP scroll animation and Lenis in full motion; reduced/lite motion preserves a static scene and native scrolling. Direct routes bypass the home-only section. The navbar has no canvas, spring or idle animation, and the project carousel has no autoplay in the application. Universal 60fps cannot be guaranteed across devices; this report does not reuse the old standalone site's Lighthouse scores or claim a new 100/100 score.

Individual third-party model-viewer CDN execution and external demo availability are runtime dependencies, not guaranteed by local route/asset checks. No real production account backend is enabled. GitHub CI reruns checks before merging; the Pages workflow rebuilds and validates the published artifact.
