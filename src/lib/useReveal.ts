import { useEffect } from "react";
/** Progressive enhancement: content starts visible and is hidden only when the observer is ready. */
export function useReveal() {
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.reveal = "in";
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px 24px 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.dataset.reveal = "pending";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);
}
