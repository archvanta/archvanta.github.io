'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { useMotionMode } from '../../lib/motion';
import { useI18n } from '../../lib/i18n';
import './parallax-scrolling.css';

/** Adapted from the user-supplied Osmo / 21st.dev layered parallax scene. */
export function ParallaxComponent({ title = 'ARCHVANTA' }: { title?: string }) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const mode = useMotionMode();
  const { locale } = useI18n();

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root || mode !== 'full') return;
    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = root.querySelector<HTMLElement>('[data-parallax-layers]');
    if (!triggerElement) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
          invalidateOnRefresh: true,
        },
      });
      [70, 55, 40, 10].forEach((yPercent, index) => {
        timeline.to(root.querySelectorAll(`[data-parallax-layer="${index + 1}"]`), {
          yPercent,
          ease: 'none',
        }, 0);
      });
    }, root);

    const lenis = new Lenis({ smoothWheel: true, syncTouch: false });
    lenisRef.current = lenis;
    const update = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', update);
    gsap.ticker.add(tick);
    const syncModal = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const bodyObserver = new MutationObserver(syncModal);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    syncModal();
    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(root.querySelectorAll('img'));
    images.forEach(image => image.addEventListener('load', refresh));
    let alive = true;
    void document.fonts.ready.then(() => { if (alive) refresh(); });
    return () => {
      alive = false;
      images.forEach(image => image.removeEventListener('load', refresh));
      gsap.ticker.remove(tick);
      bodyObserver.disconnect();
      lenis.off('scroll', update);
      lenis.destroy();
      lenisRef.current = null;
      context.revert();
    };
  }, [mode]);

  const skip = () => {
    const root = parallaxRef.current;
    const target = (root?.parentElement?.querySelector('.circular-testimonials')?.closest('section') ?? root?.nextElementSibling) as HTMLElement | null;
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -80 });
    else target.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="parallax" ref={parallaxRef} data-motion={mode}>
      <section className="parallax__header" aria-labelledby="home-title">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" aria-hidden="true" />
          <div data-parallax-layers className="parallax__layers">
            <img src="/images/parallax/background.webp" loading="eager" fetchPriority="high" width="2000" height="1906" data-parallax-layer="1" alt="" className="parallax__layer-img" />
            <img src="/images/parallax/middle.webp" loading="eager" width="2000" height="1906" data-parallax-layer="2" alt="" className="parallax__layer-img" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h1 id="home-title" className="parallax__title" lang="en" dir="ltr">{title}</h1>
            </div>
            <img src="/images/parallax/foreground.webp" loading="eager" width="2000" height="1906" data-parallax-layer="4" alt="" className="parallax__layer-img" />
          </div>
          <div className="parallax__fade" aria-hidden="true" />
          <div className="parallax__top">
            <span lang="en">ARCHITECTURE / INFRASTRUCTURE / DIGITAL INTELLIGENCE</span>
            <button type="button" onClick={skip}>{locale === 'fa' ? 'رفتن به پروژه‌ها' : 'Skip to projects'} <span aria-hidden="true">↓</span></button>
          </div>
          <p className="parallax__scroll">{locale === 'fa' ? 'برای کشف بیشتر اسکرول کن' : 'SCROLL TO EXPLORE'} <span aria-hidden="true">↓</span></p>
        </div>
      </section>
      <section className="parallax__content" aria-label={locale === 'fa' ? 'نگاه آرک‌ونتا' : 'The ARCHVANTA perspective'}>
        <svg viewBox="0 0 160 160" fill="none" className="osmo-icon-svg" aria-hidden="true">
          <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor" />
        </svg>
        <h2>{locale === 'fa' ? <>طراحی فضا.<br />مهندسی آینده.</> : <>Designing Space.<br />Engineering the Future.</>}</h2>
        <a className="parallax__credit" href="https://www.osmo.supply/" target="_blank" rel="noreferrer">Parallax resource by Osmo ↗</a>
      </section>
    </div>
  );
}
