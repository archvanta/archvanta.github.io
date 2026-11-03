# ARCHVANTA studio experience

The permanent home introduction restores the owner's red statue composition. Four GSAP layers retain the supplied Osmo scroll speeds (70/55/40/10), reverse on upward scroll and release their own GSAP context when leaving home. The initial cast reveal runs once per mount; reduced motion keeps the composition still. No computer video or mountain scene is requested by the home page. Chande Bootcamp informed the editorial rhythm and oversized introduction; its assets and branding are not copied.

- Home sequence: introduction → expertise → systems → Lab → digital projects → creator → news → process → selected work → contact.
- Selected work uses a large indigo headline card and a crimson next-project card, replacing the rotating image stack. Controls are manual and links resolve to real project records.
- Discipline symbols use a flat monochrome family: architectural portal, overlapping coordination layers, server racks and digital tools. They inherit surrounding text colors and have no metallic textures, gradients or rotation. Navigation, introduction, expertise and Lab share the same symbols with sizes appropriate to each context. The systems section restores the original procedural architectural model and its four selectable modes, replacing generated building photos. The creator panel retains its separate conceptual sculpture.
- The owner-approved generated portal logo appears in the header and favicon. Delivery images are optimized local WebP files.
- Project drawing galleries use consistent 4:3 contain frames, preserving complete drawings. Clicking opens the original. All 119 supplied proposal pages are expanded by default; source project text, deliverables, timeline and credits remain available.
- The creator section offers the supplied PDF résumé unchanged. A minimal Cheghad row opens the owner's actual website; its source repository is linked separately.
- The global header has its own view-transition snapshot, excluded from page translation. One shared smooth-scroll controller survives route changes; route restoration cancels previous momentum.

Shared FRONTIER fonts and tokens remain authoritative: Inter for English and Vazirmatn for Persian, with both themes supported. Generated image motion is interaction-driven rather than continuous. Model WebGL still loads only on request. No universal frame-rate guarantee is made.

Implementation: `src/styles/generated-experience.css`, `src/components/ui/statue-layers.tsx`, `src/components/ui/project-headlines.tsx`, and the existing shared components. Current icon and model screenshots are in `docs/previews/minimal`; the broader refresh is recorded in `docs/previews/refresh`.

The home expertise section now uses the supplied Bento composition with Radix outline icons and actual discipline links. See `docs/BENTO-EXPERTISE.md` and `docs/previews/bento` for the current card implementation and validation. Introduction, navigation, Lab and expertise cards now share the same Radix outline icons through `disciplineIcons` in `src/components/BrandGlyph.tsx`.

Sitewide scroll behavior and the borderless editorial-card finish are documented in `docs/SCROLL-EXPERIENCE.md`.
