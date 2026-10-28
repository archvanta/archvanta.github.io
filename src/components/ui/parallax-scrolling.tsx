'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { useMotionMode } from '../../lib/motion';
import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { BrandMark } from '../../brand/components/Brand';
import { DisciplineIndex } from '../StudioDetails';
import { Icon } from '../Icon';
import { StatueLayers } from './statue-layers';
import './parallax-scrolling.css';

/** Adapted from the user-supplied Osmo / 21st.dev layered parallax scene. */
export function ParallaxComponent({ title = 'ARCHVANTA' }: { title?: string }) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const mode = useMotionMode();
  const { locale } = useI18n();

  useLayoutEffect(() => {
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
    const target = (root?.parentElement?.querySelector('#selected-work') ?? root?.nextElementSibling) as HTMLElement | null;
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -80 });
    else target.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="parallax parallax--statues" ref={parallaxRef} data-motion={mode}>
      <section className="parallax__header" aria-labelledby="home-title">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" aria-hidden="true" />
          <div data-parallax-layers className="parallax__layers">
            <StatueLayers title={title} />
          </div>
          <div className="parallax__fade" aria-hidden="true" />
          <div className="parallax__top">
            <span lang="en">ARCHITECTURE / INFRASTRUCTURE / DIGITAL INTELLIGENCE</span>
            <button type="button" onClick={skip}>{locale === 'fa' ? 'رفتن به پروژه‌ها' : 'Skip to projects'} <span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </section>
      <section className="parallax__content" aria-label={locale === 'fa' ? 'نگاه آرک‌ونتا' : 'The ARCHVANTA perspective'}>
        <div className="studio-manifesto">
          <div className="studio-manifesto-label" data-reveal><BrandMark /><span>ARCHVANTA / 01</span></div>
          <h2 data-reveal>{locale === 'fa' ? <>طراحی فضا.<br /><span>مهندسی آینده.</span></> : <>Designing Space.<br /><span>Engineering the Future.</span></>}</h2>
          <div className="studio-manifesto-body" data-reveal>
            <p>{locale === 'fa' ? 'معماری فقط ساختن یک حجم نیست؛ هماهنگی فضا، تجهیزات و اطلاعات است. آرک‌ونتا این ارتباط را از ایده و مدل تا مستندات و ابزارهای تعاملی دنبال می‌کند.' : 'Architecture extends beyond a building. It connects space, equipment and information. ARCHVANTA explores that connection through design studies, coordinated models and interactive tools.'}</p>
            <a href={brandHref('/portfolio')}>{locale === 'fa' ? 'دیدگاه و کارهای محمدامین صادقی' : 'The work & perspective of MohammadAmin Sadeghi'}<Icon name="arrow" directional size={16} /></a>
            <div className="studio-hero-actions">
              <a className="studio-pill" href={brandHref('/projects')}>{locale === 'fa' ? 'کشف پروژه‌ها' : 'Explore projects'}<Icon name="arrow" directional size={18} /></a>
              <a className="studio-hero-lab" href={brandHref('/lab')}>{locale === 'fa' ? 'ورود به آزمایشگاه' : 'Enter the Lab'}<Icon name="arrow" directional size={16} /></a>
            </div>
          </div>
        </div>
        <DisciplineIndex />
        <a className="parallax__credit" href="https://www.osmo.supply/" target="_blank" rel="noreferrer">Parallax resource by Osmo ↗</a>
      </section>
    </div>
  );
}
