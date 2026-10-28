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

`public/images/entrance/{apollo,hercules,flowers,david}.webp` were extracted from the user's earlier Old Masters demo. They are retained as historical assets and are not loaded by the current home opening.

`public/images/parallax/{background,middle,foreground}.webp` are the original three image layers from the user's supplied Osmo / 21st.dev Parallax component, downloaded unchanged from the supplied CDN URLs (hashes beginning `a43f4eae`, `50ca6a0d`, `e1c8137b`). The component preserves the Osmo resource credit. They are supplied reference assets, not generated ARCHVANTA artwork.
