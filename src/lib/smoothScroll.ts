import { useLayoutEffect } from 'react';
import type Lenis from '@studio-freight/lenis';
import { motionMode, useMotionMode } from './motion';

type ScrollOptions = NonNullable<Parameters<Lenis['scrollTo']>[1]>;
let active: Lenis | null = null;
let syncLock: (() => void) | null = null;

/** One scroll controller for the whole application, loaded only when motion is allowed. */
export function useSmoothScroll() {
  const mode = useMotionMode();
  useLayoutEffect(() => {
    if (mode !== 'full' || typeof ResizeObserver === 'undefined') return;
    let alive = true;
    let dispose: (() => void) | undefined;
    void import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (!alive) return;
      const lenis = new Lenis({ smoothWheel: true, syncTouch: false });
      active = lenis;
      let frame = 0;
      const tick = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      const updateLock = () => {
        const locked = document.body.style.overflow === 'hidden' || !!document.querySelector('dialog[open]');
        if (locked !== lenis.isStopped) {
          if (locked) lenis.stop();
          else lenis.start();
        }
      };
      syncLock = updateLock;
      const bodyObserver = new MutationObserver(updateLock);
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      const dialogObserver = new MutationObserver(updateLock);
      dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
      updateLock();
      dispose = () => {
        cancelAnimationFrame(frame);
        bodyObserver.disconnect();
        dialogObserver.disconnect();
        if (active === lenis) { active = null; syncLock = null; }
        lenis.destroy();
      };
    });
    return () => { alive = false; dispose?.(); };
  }, [mode]);
}

/** Route restoration must cancel the previous page's momentum before recording its new position. */
export function restoreScroll(top: number) {
  syncLock?.();
  if (active) {
    active.resize();
    active.scrollTo(top, { immediate: true, force: true });
  } else window.scrollTo({ top, behavior: 'instant' });
}

export function smoothScrollTo(target: number | HTMLElement, options: ScrollOptions = {}) {
  if (active) active.scrollTo(target, options);
  else {
    const top = (typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY) + (options.offset ?? 0);
    window.scrollTo({ top, behavior: options.immediate || motionMode() !== 'full' ? 'instant' : 'smooth' });
  }
}
