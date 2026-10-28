# Unified application validation

Validated locally on 2026-10-28 in Chromium against Vite production/mock preview builds.

- TypeScript and ESLint passed.
- 26 unit files / 170 tests passed, including original editorial/account/SQL isolation coverage and new canonical route/content provenance checks.
- 43 browser tests passed: 12 responsive route matrices (English/Persian at 360, 390, 768, 1024, 1440 and 1920px); 20 Axe scans (both languages/themes on five routes); 11 interaction/integration checks.
- Axe WCAG 2 A/AA and 2.1 A/AA scans reported zero violations in the tested states. This is automated coverage, not certification of every possible interaction.
- Integration checks cover project detail refresh/gallery, original collaboration credits/proposal images, saved-story persistence, global news/project search, language/theme migration, mobile disclosures/focus, lazy model launch, editorial routes, external-source attribution, liquid navigation keyboard/disclosures/CSP, circular project navigation, and a dismissible/session-only entrance.
- Production preview smoke checks used live FRONTIER data. Home/projects/news/Persian mobile produced no page exceptions or horizontal document overflow. Screenshots are in `docs/previews/unification`.
- Production build completed. Secret-key bundle scan passed. Main entry is approximately 361KB JS /117KB gzip; brand and editorial routes are split. Portfolio media are separate lazy assets; model Three.js is not in the application bundle.

The introduction bypasses reduced/lite motion and direct routes. The navbar has no idle animation, mobile/reduced fallback uses CSS, and the project carousel has no autoplay in the application. Universal 60fps cannot be guaranteed across devices; this report does not reuse the old standalone site's Lighthouse scores or claim a new 100/100 score.

Individual third-party model-viewer CDN execution and external demo availability are runtime dependencies, not guaranteed by local route/asset checks. No real production account backend is enabled. GitHub CI is configured to rerun checks on the review PR; production remains unchanged until approved merge.
