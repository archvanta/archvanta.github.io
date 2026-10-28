import { useEffect, useId, useState } from 'react';
import { useI18n } from '../../lib/i18n';

const figures = ['hercules', 'apollo', 'flowers'] as const;
function meander() {
  const hook = [[0, 0], [0, 3], [4, 3], [4, 2], [2, 2], [2, 0], [6, 0]] as const;
  let path = '';
  let previous = 0;
  for (let index = 0; index < 32; index++) for (let point = 0; point < hook.length; point++) {
    if (index && !point) continue;
    const [u, v] = hook[point]!;
    const angle = -Math.PI / 2 + ((index + u / 6) * Math.PI) / 16;
    const radius = 176 + (v / 3 - .5) * 22;
    const x = +(200 + Math.cos(angle) * radius).toFixed(2);
    const y = +(200 + Math.sin(angle) * radius).toFixed(2);
    path += !index && !point ? `M${x} ${y}` : previous === v ? ` A${radius} ${radius} 0 0 1 ${x} ${y}` : ` L${x} ${y}`;
    previous = v;
  }
  return path;
}
const ring = meander();

/** Original red composition, separated into the existing four reversible parallax layers. */
export function StatueLayers({ title }: { title: string }) {
  const { locale } = useI18n();
  const id = useId().replace(/:/g, '');
  const [ready, setReady] = useState(0);
  useEffect(() => {
    let alive = true;
    let loaded = 0;
    const settle = () => { if (alive) setReady(Math.min(100, Math.round(++loaded / 4 * 100))); };
    const images = figures.map(name => {
      const image = new Image(); image.onload = settle; image.onerror = settle; image.src = `/images/entrance/${name}.webp`; return image;
    });
    void document.fonts.ready.then(settle);
    const timer = window.setTimeout(() => { if (alive) setReady(100); }, 1800);
    return () => { alive = false; clearTimeout(timer); images.forEach(image => { image.onload = image.onerror = null; }); };
  }, []);
  const figure = (name: typeof figures[number]) => <img key={name} data-figure={name} className="statue-figure" src={`/images/entrance/${name}.webp`} style={{ mask: `url(#${id}${name})` }} width={name === 'apollo' ? 1350 : name === 'hercules' ? 1200 : 572} height="900" alt="" decoding="async" fetchPriority={name === 'hercules' ? 'high' : undefined} />;
  return <div className="statue-composition" data-ready={ready === 100}>
    <svg width="0" height="0" aria-hidden="true"><defs>
      <filter id={`${id}key`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" /><feComponentTransfer><feFuncR type="linear" slope="8" intercept="-0.32" /><feFuncG type="linear" slope="8" intercept="-0.32" /><feFuncB type="linear" slope="8" intercept="-0.32" /></feComponentTransfer></filter>
      {figures.map(name => <mask key={name} id={`${id}${name}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" style={{ maskType: 'luminance' }}><image href={`/images/entrance/${name}.webp`} width="1" height="1" preserveAspectRatio="none" filter={`url(#${id}key)`} /></mask>)}
    </defs></svg>
    <div data-parallax-layer="1" className="statue-layer statue-backdrop" aria-hidden="true"><svg className="statue-ring" viewBox="0 0 400 400" fill="none"><circle cx="200" cy="200" r="198" /><circle cx="200" cy="200" r="154" /><path d={ring} /></svg></div>
    <div data-parallax-layer="2" className="statue-layer statue-cast-back" aria-hidden="true">{figure('hercules')}</div>
    <div data-parallax-layer="3" className="statue-layer statue-title-layer"><h1 id="home-title" className="statue-title" lang="en" dir="ltr">{title}<span aria-hidden="true" style={{ clipPath: `inset(${100 - ready}% 0 0)` }}>{title}</span></h1></div>
    <div data-parallax-layer="4" className="statue-layer statue-cast-front" aria-hidden="true">{figure('flowers')}{figure('apollo')}</div>
    <p className="statue-tagline">{locale === 'fa' ? <>طراحی فضا.<br />مهندسی آینده.</> : <>Designing Space.<br />Engineering the Future.</>}</p>
    <div className="statue-progress" role="progressbar" aria-label={locale === 'fa' ? 'آماده‌سازی صحنه' : 'Preparing the scene'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready}><strong>{ready}</strong><span>{locale === 'fa' ? 'آماده‌سازی صحنه' : 'Preparing the scene'}</span></div>
  </div>;
}
