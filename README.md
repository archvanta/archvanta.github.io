# ARCHVANTA unified application

ARCHVANTA is the parent brand for architecture, infrastructure, digital tools and FRONTIER news, with MohammadAmin Sadeghi's real portfolio integrated as native routes.

This integration is on `feat/archvanta-unification` for review before production replacement. Legacy FRONTIER and portfolio deployments are preserved.

## Development

Node >=22.12 (CI uses 24).

```sh
npm ci
npm run dev
npm run check
npm run build:mock
npx playwright install chromium
npm run test:e2e
```

The production build reads live public data from the existing FRONTIER collector; see `.env.example`. Mock builds use visibly labeled fixtures and an in-memory account backend for deterministic tests. Never publish `dist-mock`. Deployment uploads only `dist` after checks on main.

The app has one shared shell, token system, English/Persian locale and light/dark theme. Routes are documented in [information architecture](docs/INFORMATION-ARCHITECTURE.md). Data provenance, preserved features and limits are documented in [migration report](docs/MIGRATION-REPORT.md). Supplied UI component adaptations and setup are in [brand system](docs/BRAND-SYSTEM.md). See [QA report](docs/QA-REPORT.md) for measured validation.

Portfolio images and model tools are extracted into separate assets; large data URLs never enter the application JavaScript. Only individual model viewers use frames, on explicit launch. Optional account source remains preserved; the removed Supabase project is not configured.
