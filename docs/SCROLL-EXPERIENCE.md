# Shared scrolling and borderless editorial cards

On 2026-11-03, smooth scrolling moved from the home-only parallax component to the application shell. `src/lib/smoothScroll.ts` owns a single lazily imported Lenis instance with the original smooth-wheel settings. One requestAnimationFrame loop runs across brand and FRONTIER routes; GSAP remains confined to the existing home parallax effect. The four home layer speeds and reversible movement remain unchanged.

Route restoration cancels the previous page's momentum and synchronizes Lenis with the restored scroll position. Home project jumps, skip-to-content and back-to-top use the same controller. Skip-to-content preserves root scroll padding. Shared Lenis CSS loads for direct internal-page URLs too.

Reduced/lite motion and browsers without ResizeObserver keep native scrolling; touch retains native behavior. Menus with data-lenis-prevent, the mobile menu and project lightbox preserve native scrolling inside their own content. Body/dialog locks pause background motion and release it when closed. Effect cleanup removes the controller, observers and animation frame on motion-mode changes or unmount.

Colored editorial story and wall cards have no outer border, removing the bright upper rim while retaining the existing gradients and corner radii. Control, badge and focus outlines are preserved. The production-preview image is in docs/previews/global-scroll.

Validation: TypeScript and ESLint; 170 unit tests; 49 browser checks, including direct FRONTIER wheel movement, route momentum cancellation, project dialog stop/release, reduced-motion teardown and preserved home parallax reversal. Production/mock builds passed, as did media integrity and bundle secret scans. Manual production-preview checks confirmed the mobile menu lock and zero page exceptions. The smooth-scroll import adds about 1KB to the main entry's uncompressed code, while Lenis remains a separate lazy chunk. No universal frame-rate guarantee is made.
