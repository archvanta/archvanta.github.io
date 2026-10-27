# Validation record

Validated 2026-10-27 UTC (2026-10-28 in Asia/Tehran).

## Automated checks

- TypeScript strict validation: passed.
- ESLint, including React Hooks rules: passed.
- Vite production build: passed; approximately 81.4 KB gzip JavaScript and 8.4 KB gzip CSS before fonts. No Three.js or continuous render runtime.
- Playwright: **20 browser tests passed**.
- Responsive widths: **360, 390, 768, 1024, 1440 and 1920 px** in both English and Persian. No horizontal page overflow.
- Axe WCAG 2 A/AA and WCAG 2.1 A/AA: no violations in all four combinations of language and theme.
- Native project dialogs, project filters, four model modes, expertise disclosure, system layers, keyboard mobile menu, language/theme persistence, reduced motion, configured links and image requests: passed.
- No JavaScript page errors recorded in the responsive tests.

## Performance measurement

Lighthouse was run against the local production preview using headless Chromium, its default simulated mobile throttling profile:

| Category | Measured score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Observed report metrics: LCP 0.91 s, Total Blocking Time 37 ms, CLS 0.022. These are local measurements, not promises for every connection or device. Repeat on the public deployment and on real mobile devices when those are available.

A separate three-second requestAnimationFrame sample after startup recorded 180 frames at both desktop and mobile viewport sizes, mean 16.67 ms and p95 16.7–16.8 ms, with zero intervals above 20 ms. This measures that specific steady-state browser sample. It does not prove 60 fps for every interaction or device. The model intentionally has no perpetual animation loop.

To reproduce the frame sample while preview runs on port 4190:

```sh
node scripts/performance.mjs
```

## Visual review

Desktop English, desktop Persian, mobile English and mobile Persian/light full-page screenshots were captured and inspected. Image loading is completed before captures so lazy-loaded project/Lab imagery is present. Refinements included keeping the hero silhouette clear of its heading, containing the model on mobile, removing a filled annotation artifact, a monochrome structural-A identity and replacing an emoji arrow with a consistent SVG icon.

Capture previews with:

```sh
node scripts/capture.mjs
```

## Integrity and isolation

The project lives in `/workspace/archvanta.github.io`, separate from the existing FRONTIER checkout. No FRONTIER files, routing, authentication, RSS workflow or news data were changed for this work. Its public URL was verified with HTTP 200 and used to capture the actual Lab preview. The three architectural studies are explicitly marked as self-directed concepts. Contact uses only the configured real GitHub profile.

## Remaining content limitations

No real commissioned portfolio assets, founder photograph, biography, credentials, email address or other social profiles were provided. None are invented. The portfolio uses original concept studies and editable project data; contact uses GitHub. Technical illustrations are conceptual and are not verified engineering/construction documents.

## Publication status

The initial repository-creation request was rejected by the GitHub integration. The owner then created `archvanta/archvanta.github.io` and granted this connection access. Source and the deployment workflow are ready for publication there. The live deployment result will be recorded after verification.

A 4.5-second automated full-page scroll sample at 390 px and 1440 px also recorded 270 frames in each run, p95 16.7 ms, with zero intervals above 20 ms. As above, this is a measured browser sample rather than an all-device guarantee.
