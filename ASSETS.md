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

`public/images/entrance/{apollo,hercules,flowers,david}.webp` were extracted from the user's earlier Old Masters demo. Apollo, Hercules and Flowers are used in the current red home opening; David remains historical.

`public/images/parallax/{background,middle,foreground}.webp` are the original three image layers from the user's supplied Osmo / 21st.dev Parallax component, downloaded unchanged from the supplied CDN URLs (hashes beginning `a43f4eae`, `50ca6a0d`, `e1c8137b`). The component preserves the Osmo resource credit. They are supplied reference assets, not generated ARCHVANTA artwork.

## Generated brand artwork refresh

`public/images/brand-art/` contains owner-requested AI-generated decorative artwork, optimized for local delivery. Architecture, BIM, Data Centers and Digital Lab share a pearl/champagne titanium material with turquoise edge light. Their PNG versions retain transparent source artwork; the interface uses smaller WebP derivatives. Four `system-*` images are matched concept illustrations for the interactive building layers, not actual project drawings. `creator-object.webp` is a conceptual architectural sculpture, not a real built commission.

The owner approved the generated architectural portal logo. `logo.webp`, `logo.png`, `public/favicon.png` and `public/apple-touch-icon.png` are optimized derivatives of that image. The red statue composition uses the previously supplied assets listed above. The historical Osmo mountain images remain available but are not loaded on home; the supplied parallax mechanics and resource attribution are retained.

The owner-supplied résumé is published unchanged; its checksum and the static uploaded portfolio audit are recorded in `docs/migration/uploaded-portfolio-audit.md`. No scripts from the uploaded HTML were executed.

## Minimal discipline revision

The active discipline symbols are original flat monochrome SVG paths in `src/components/BrandGlyph.tsx`. They replace the generated metallic category images in the introduction, navigation, expertise and Lab. The systems section again uses the original procedural `ArchitecturalModel` with four selectable modes. The generated category and system images remain historical files, without runtime references from these sections. The independently approved logo and creator artwork are separate from the discipline icon family.
