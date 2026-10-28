# Shared visual system

ARCHVANTA is the parent brand; FRONTIER is its editorial publication. FRONTIER's existing token, typography, rounded-card, motion and interaction systems are the foundation. Structural brand marks, architecture diagrams and concept assets are retained. The creator is MohammadAmin Sadeghi / محمدامین صادقی.

`src/styles/tokens.css` is authoritative. `src/styles/brand.css` scopes the previous brand layout beneath `.av-brand` and aliases its colors/fonts to the shared tokens. `unified.css` adds canonical shell, project/gallery, lab and creator layouts. No independent theme/locale provider remains.

Typography uses the locally bundled FRONTIER families throughout: Inter Variable for English text/headings, JetBrains Mono for technical metadata, and Vazirmatn Variable for all Persian roles and form controls. Explicit English content retains Inter inside Persian pages.

User-supplied UI integrations live in `src/components/ui`:

- Nimbus Liquid Navbar / Waterline, attributed in source to guglielmogiannattasio.it: actual internal navigation, existing disclosure menus and keyboard behavior. The active state is one measured CSS glass pill with a short transform, so rapid route changes cannot leave a spring or WebGL layer trailing behind the selected item. Sound is disabled.
- CircularTestimonials: image composition used for real selected project summaries, not endorsements. No placeholder restaurant testimonials. Scoped keyboard behavior, theme tokens, RTL controls, lazy images, no per-word blur; autoplay disabled in the application.
- Old Masters opening: marble cast assets extracted from the supplied demo into local WebP files; the red statue scene keeps its outline/fill wordmark, meander and initial figure reveal. It scrolls naturally with the document and returns unchanged when scrolling back up. The computer background film and poster are removed, including from the editorial introduction. Perspective and the four original line glyphs follow beneath the statue scene on the red ground. The skip control scrolls to selected work; reduced motion disables the initial transitions. Progress measures scene image/font settlement, not news loading; stalled assets have a timeout.

TypeScript and React/Vite were already installed. Tailwind 4 is configured through its Vite plugin with utilities only, avoiding a second CSS reset. `components.json` and `@/` aliases provide the shadcn-compatible `src/components/ui` directory. `src/lib/utils.ts` exports standard `cn`; Framer Motion and react-icons are installed for the supplied carousel. Do not run a second project scaffold over this app.

Local language/theme keys retain existing FRONTIER preferences. Brand-only preferences migrate once when there is no reader preference. New labels/summaries support English/Persian. Original project documentation and some source notes remain English; drawings and source credits are not fabricated or silently rewritten.
