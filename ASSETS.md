# Asset provenance

All architectural SVG graphics, the procedural React model, the structural-frame brand mark, the geometric SVG wordmark and social preview are original artwork created for ARCHVANTA in this repository.

The three project studies are illustrative concepts created for the brand website. They are not real commissions or construction documents. Source: `scripts/generate-assets.py` and `src/components/ArchitecturalModel.tsx`.

`public/images/frontier-live.webp`: screenshot of https://archvanta.github.io/frontier/#/ captured 2026-10-27 UTC. FRONTIER is the owner's separate public project. Screenshot preserves the actual interface rather than presenting invented app functionality.

Self-hosted font dependencies:

- Space Grotesk — Copyright 2020 The Space Grotesk Project Authors. SIL OFL 1.1. https://github.com/floriankarsten/space-grotesk
- Vazirmatn — Copyright the Vazirmatn Project Authors. SIL OFL 1.1. https://github.com/rastikerdar/vazirmatn

Their license texts ship in the corresponding `node_modules/@fontsource-variable/*/LICENSE` packages and are copied to `public/fonts/` for the published artifact.

## Unification additions

Portfolio records and 184 images originate in `archvanta/portfolio` commit `863f366`, extracted unchanged into `public/work-media/images`; the migration manifest records their mapping. The dedicated `/work-media/` URL avoids the `/portfolio/` namespace owned by the existing GitHub Pages project site. Five source model tools are retained separately. FRONTIER images, cinematic film/poster and icon sets come from `archvanta/frontier` commit `635fd7c`; editorial credit stays with the corresponding publishers. These assets are not newly generated or claimed as third-party work by the creator.

`public/images/entrance/{apollo,hercules,flowers,david}.webp` are extracted from the embedded demonstration assets in the user's supplied Old Masters Preloader file. Apollo, Hercules and Flowers are used decoratively in the introduction; David is retained as supplied but not loaded in the runtime composition. The file supplied no separate media license metadata; review usage rights before external redistribution of these demo assets. Supplied components are adapted and attributed in their source files and the brand-system documentation.
