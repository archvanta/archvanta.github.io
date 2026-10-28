import { BrandGlyph } from './BrandGlyph';
import { BrandMark } from '../brand/components/Brand';
import { useI18n } from '../lib/i18n';
import { brandHref } from '../lib/unifiedRouter';
import { Icon } from './Icon';

/** A quiet index into the four connected fields, without duplicating hero cards. */
export function DisciplineIndex() {
  const { locale } = useI18n();
  const entries = [
    { path: '/expertise/architecture', mode: 0, en: 'Architecture', fa: 'معماری' },
    { path: '/expertise/bim', mode: 2, en: 'BIM & coordination', fa: 'BIM و هماهنگی' },
    { path: '/expertise/infrastructure', mode: 3, en: 'Data centers', fa: 'دیتاسنترها' },
    { path: '/lab', mode: 1, en: 'Digital Lab', fa: 'آزمایشگاه دیجیتال' },
  ];
  return <nav className="studio-discipline-index" aria-label={locale === 'fa' ? 'حوزه‌های طراحی' : 'Design disciplines'}>
    {entries.map((entry, index) => <a key={entry.path} href={brandHref(entry.path)}>
      <span className="studio-index-number" aria-hidden="true">0{index + 1}</span>
      <BrandGlyph mode={entry.mode} />
      <span>{entry[locale]}</span>
      <Icon name="arrow" size={16} directional />
    </a>)}
  </nav>;
}

/** Original schematic illustrations for the lab, not screenshots of the interactive models. */
export function LabSchematic({ variant }: { variant: number }) {
  return <svg viewBox="0 0 360 190" className="studio-lab-schematic" fill="none" aria-hidden="true">
    <defs><pattern id={`lab-grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0v20" stroke="currentColor" strokeOpacity=".08" /></pattern></defs>
    <rect width="360" height="190" fill={`url(#lab-grid-${variant})`} />
    <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      {variant % 3 === 0 ? <>
        <path d="m53 115 153-76 105 51-153 77-105-52Z" />
        <path d="m74 113 131-64 84 41-131 66-84-43Z" />
        <path d="m112 94 85 42m-40-65 85 43m-67-52 85 42M91 121l132-65m-111 76 131-66m-110 76 130-66" opacity=".5" />
        <path d="M53 115v12l105 52 153-77V90m-153 77v12M190 58v58" />
        <path d="m53 146 105 52m170-90-153 77" strokeDasharray="3 5" opacity=".5" />
      </> : variant % 3 === 1 ? <>
        <path d="m118 40 66-22 63 25v116l-66 23-63-27V40Zm0 0 63 26 66-23M181 66v116" />
        <path d="m128 52 44 18v92l-44-18V52Z" />
        {[0,1,2,3,4,5].map(i => <path key={i} d={`m134 ${65+i*13} 30 12m-25-5 0 1m8 2 0 1`} />)}
        <path d="m193 77 41-14m-41 27 41-14m-41 27 41-14m-41 27 41-14m-41 27 41-14m-41 27 41-14" opacity=".45" />
        <path d="M98 40v115m-5-115h10m-10 115h10m151-109v116m-5-116h10m-10 116h10" strokeDasharray="3 4" opacity=".5" />
      </> : <>
        <path d="m65 103 150-64 83 41v46l-151 65-82-42v-46Zm0 0 82 42 151-65M147 145v46" />
        <path d="m85 101 49 26V86l-49-24v39Zm49-15 86-34 49 25-135 57m13 11 0-11" />
        <path d="m162 102 43-19 35 18-43 19-35-18Zm0 0v23l35 18 43-19v-23m-43 19v23" />
        <path d="m259 94 26-11v34l-26 11V94ZM80 129l51 26m-51-13 51 26m22-9 130-55" opacity=".5" />
      </>}
      <path d="M20 25h15m-7.5-7.5v15M325 165h15m-7.5-7.5v15" opacity=".5" />
    </g>
  </svg>;
}

export function CreatorSignature() {
  return <div className="studio-signature" aria-hidden="true">
    <span className="studio-signature-cross">+</span>
    <div className="studio-signature-mark"><BrandMark /></div>
    <span className="studio-signature-name" dir="ltr">M / S</span>
    <span className="studio-signature-caption" dir="ltr">SPACE · SYSTEMS · PERSPECTIVE</span>
  </div>;
}
