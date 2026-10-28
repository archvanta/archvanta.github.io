# Shared visual system

ARCHVANTA is the parent brand; FRONTIER is its editorial publication. FRONTIER's existing token, typography, rounded-card, motion and interaction systems are the foundation. Structural brand marks, architecture diagrams and concept assets are retained. The creator is MohammadAmin Sadeghi / محمدامین صادقی.

`src/styles/tokens.css` is authoritative. `src/styles/brand.css` scopes the previous brand layout beneath `.av-brand` and aliases its colors/fonts to the shared tokens. `unified.css` adds canonical shell, project/gallery, lab and creator layouts. No independent theme/locale provider remains.

User-supplied UI integrations live in `src/components/ui`:

- Nimbus Liquid Navbar / Waterline, attributed in source to guglielmogiannattasio.it: actual internal navigation, existing disclosure menus and keyboard behavior. Shader runs during interaction, stops when settled/hidden; no ambient rendering or SVG refraction. Reduced/lite/mobile uses the CSS drop. Sound is disabled.
- CircularTestimonials: image composition used for real selected project summaries, not endorsements. No placeholder restaurant testimonials. Scoped keyboard behavior, theme tokens, RTL controls, lazy images, no per-word blur; autoplay disabled in the application.
- Old Masters Preloader: marble cast assets extracted from the supplied demo into local WebP files; outline/fill wordmark, meander and curtain reveal adapted for a brief initial introduction. No injected Google Fonts or continuous canvas/parallax. Dismissible native modal, session-only; reduced/lite motion and direct links bypass it. Progress measures scene image/font settlement, not news loading; stalled assets have a timeout.

TypeScript and React/Vite were already installed. Tailwind 4 is configured through its Vite plugin with utilities only, avoiding a second CSS reset. `components.json` and `@/` aliases provide the shadcn-compatible `src/components/ui` directory. `src/lib/utils.ts` exports standard `cn`; Framer Motion and react-icons are installed for the supplied carousel. Do not run a second project scaffold over this app.

Local language/theme keys retain existing FRONTIER preferences. Brand-only preferences migrate once when there is no reader preference. New labels/summaries support English/Persian. Original project documentation and some source notes remain English; drawings and source credits are not fabricated or silently rewritten.
