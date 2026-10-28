# Shared visual system

ARCHVANTA is the parent brand; FRONTIER is its editorial publication. FRONTIER's existing token, typography, rounded-card, motion and interaction systems are the foundation. Structural brand marks, architecture diagrams and concept assets are retained. The creator is MohammadAmin Sadeghi / محمدامین صادقی.

`src/styles/tokens.css` is authoritative. `src/styles/brand.css` scopes the previous brand layout beneath `.av-brand` and aliases its colors/fonts to the shared tokens. `unified.css` adds canonical shell, project/gallery, lab and creator layouts. No independent theme/locale provider remains.

Typography uses the locally bundled FRONTIER families throughout: Inter Variable for English text/headings, JetBrains Mono for technical metadata, and Vazirmatn Variable for all Persian roles and form controls. Explicit English content retains Inter inside Persian pages.

User-supplied UI integrations live in `src/components/ui`:

- Nimbus Liquid Navbar / Waterline, attributed in source to guglielmogiannattasio.it: actual internal navigation, existing disclosure menus and keyboard behavior. The active state is one measured CSS glass pill with a short transform, so rapid route changes cannot leave a spring or WebGL layer trailing behind the selected item. Sound is disabled.
- CircularTestimonials: image composition used for real selected project summaries, not endorsements. No placeholder restaurant testimonials. Scoped keyboard behavior, theme tokens, RTL controls, lazy images, no per-word blur; autoplay disabled in the application.
- Parallax opening: the supplied Osmo / 21st.dev mountain scene with its original three image layers, self-hosted locally. ARCHVANTA sits between the mountain and foreground person. GSAP/ScrollTrigger preserves 70/55/40/10% layer travel; Lenis provides smooth wheel scrolling with native touch behavior. Scoped cleanup releases the ticker, timeline and smooth scrolling on route changes. Reduced/lite motion presents the static scene. The prior statues and computer film/poster are not mounted. See `docs/PARALLAX-UI.md` for paths, setup and demo usage.

TypeScript and React/Vite were already installed. Tailwind 4 is configured through its Vite plugin with utilities only, avoiding a second CSS reset. `components.json` and `@/` aliases provide the shadcn-compatible `src/components/ui` directory. `src/lib/utils.ts` exports standard `cn`; Framer Motion and react-icons are installed for the supplied carousel. Do not run a second project scaffold over this app.

Local language/theme keys retain existing FRONTIER preferences. Brand-only preferences migrate once when there is no reader preference. New labels/summaries support English/Persian. Original project documentation and some source notes remain English; drawings and source credits are not fabricated or silently rewritten.
