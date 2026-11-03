import { smoothScrollTo } from './smoothScroll';

/** In-page jumps can't use #fragments (the hash is the router), so scroll + focus instead. */
export function focusSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  smoothScrollTo(el, { offset: Number.isFinite(padding) ? -padding : 0 });
}
