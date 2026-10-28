# Unification report

Baseline: canonical `f0f974a`; FRONTIER `635fd7c`; portfolio `863f366`. Work lives on `feat/archvanta-unification`, with local baseline tag `baseline/archvanta-before-unification`. The original brand modules are preserved under `src/brand`.

Imported portfolio data is extracted by `scripts/import-portfolio.mjs`: nine project records, 184 image files, five standalone model HTML tools and original Persian dictionary. The asset manifest is in `docs/migration/portfolio-asset-manifest.json`. These files are published beneath `/work-media/`; `/portfolio/` cannot be used because GitHub Pages assigns that path to the existing `archvanta/portfolio` project site, which otherwise intercepts the canonical site's image and model requests. Original project status, anonymization, academic/design distinctions and collaboration credit remain. Three prior ARCHVANTA concept studies are explicitly distinguished from sourced portfolio work. No awards, client reviews or completed-building claims were invented.

FRONTIER's existing router, components, editorial pages, schemas, ranking, attribution, archive, videos, search, saved articles and optional accounts were reused. Original unit tests and SQL isolation tests remain executable; original browser tests are archived under `docs/migration/frontier-tests` as source reference, replaced by canonical integration browser checks. The cinematic hero is reused with the parent wordmark. Expensive old intro/glow effects are not mounted in the editorial home.

The collector remains in FRONTIER as the single running pipeline. The canonical app consumes its public dataset through `VITE_NEWS_BASE_URL` (default https://archvanta.github.io/frontier/). No duplicate scheduler or stale data snapshot was created. Pipeline ownership can move in a later coordinated change; until then live news availability depends on that endpoint. Production accounts remain disabled as in the source deployment; no deleted Supabase endpoint is reactivated. Local saved stories work without login.

Root hash routes are refresh-safe. Existing separate deployments have not been retired, redirected or overwritten by this branch. The review PR must be approved before production replacement. Rollback is the baseline commit, not removal of the legacy repositories.

Figma was requested, but no Figma connector/tool was available in this session; no Figma file, import or publication is claimed. The actual source websites, user screenshots and three supplied component files are the implementation references.

GitHub Pages provides a static HTML shell. Route-specific document titles update in the app; social previews/canonical URL use the root. Full route indexing and distinct social cards would require prerendering/SSR beyond this static migration.

Individual model tools use external Three.js from unpkg only after launch, inside sandboxed frames. External digital-demo URLs are retained as source-listed demos and are not represented as uptime guarantees. The parent app does not bundle Three.js.
