# Unified application validation

Validated locally on 2026-10-28 in Chromium against Vite production/mock preview builds.

- TypeScript and ESLint passed.
- 26 unit files / 170 tests passed, including original editorial/account/SQL isolation coverage and new canonical route/content provenance checks.
- 45 browser tests passed: 12 responsive route matrices (English/Persian at 360, 390, 768, 1024, 1440 and 1920px); 20 Axe scans (both languages/themes on five routes); 13 interaction/integration checks, including scroll chapters and shared fonts.
- Axe WCAG 2 A/AA and 2.1 A/AA scans reported zero violations in the tested states. This is automated coverage, not certification of every possible interaction.
- Integration checks cover project detail refresh/gallery, original collaboration credits/proposal images, `/work-media/` cover availability, saved-story persistence, global news/project search, language/theme migration, mobile disclosures/focus, lazy model launch, editorial routes, external-source attribution, stable liquid navigation keyboard/disclosures/CSP, circular project navigation, and the permanent scroll opening.
- Production preview smoke checks used live FRONTIER data. Home/projects/news/Persian mobile produced no page exceptions or horizontal document overflow. Screenshots are in `docs/previews/unification`.
- Production build completed. Secret-key bundle scan passed. Main entry is approximately 348KB JS /111KB gzip; brand and editorial routes are split. Portfolio media are separate lazy assets; model Three.js is not in the application bundle. All 184 images and five model files are checked in both the source and published build.

Opening screenshots for desktop and Persian mobile are in `docs/previews/opening`. The red statue scene scrolls naturally and returns intact on upward scroll. The computer film/poster and intermediate hero scene are removed. The global header remains available, and original line glyphs appear below the scene and in brand menus. Lab titles and icons use white on their dark colored cards.

The opening uses normal document scrolling with no scroll-linked rendering loop; direct routes bypass the home-only section. Reduced motion disables its initial figure transitions. The navbar has no canvas, spring or idle animation, and the project carousel has no autoplay in the application. Universal 60fps cannot be guaranteed across devices; this report does not reuse the old standalone site's Lighthouse scores or claim a new 100/100 score.

Individual third-party model-viewer CDN execution and external demo availability are runtime dependencies, not guaranteed by local route/asset checks. No real production account backend is enabled. GitHub CI is configured to rerun checks on the review PR; production remains unchanged until approved merge.
