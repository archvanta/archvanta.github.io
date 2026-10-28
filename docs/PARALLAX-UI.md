# Parallax opening integration

The application already has React, TypeScript, Tailwind 4 (Vite plugin, utilities without a second reset), and shadcn configuration. No scaffolding or CLI initialization is required.

- Component: `src/components/ui/parallax-scrolling.tsx`
- Component styles: `src/components/ui/parallax-scrolling.css`
- Demo: `src/demos/parallax-demo.tsx`
- Shared styles/tokens: `src/styles/`
- shadcn configuration: `components.json`

`@/components/ui` resolves to `src/components/ui` through the Vite and TypeScript aliases. This is the project's equivalent of `/components/ui`; keep imported UI here so shadcn and supplied imports agree rather than creating a second root-level component folder.

Dependencies are installed and locked:

```sh
npm install gsap @studio-freight/lenis
```

Usage:

```tsx
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function Opening() {
  return <ParallaxComponent title="ARCHVANTA" />;
}
```

The supplied Osmo / 21st.dev composition is the first home section. All three original WebP layers are self-hosted under `/images/parallax/`. Its title sits between the mountain and foreground person; layer travel remains 70%, 55%, 40%, and 10%, with scroll-linked GSAP movement and Lenis smooth wheel scrolling. Touch scrolling remains native.

Lifecycle adaptations: GSAP context only reverts this instance's timeline and trigger; the exact Lenis ticker callback is removed on unmount, then Lenis is destroyed. No global trigger destruction or ticker lag setting is applied. Reduced/lite motion uses the same static composition without GSAP/Lenis. Modal scroll locks pause Lenis and disclosure panels keep native internal scrolling.

The computer video/poster and previous statue introduction are not mounted. Home has one H1, responsive title sizing, English/Persian controls, the original Osmo resource credit, and navigation to real selected work.
