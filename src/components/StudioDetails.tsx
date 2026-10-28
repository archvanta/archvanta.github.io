import { BrandGlyph } from './BrandGlyph';
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
  return <nav className="studio-discipline-index" data-reveal aria-label={locale === 'fa' ? 'حوزه‌های طراحی' : 'Design disciplines'}>
    {entries.map((entry, index) => <a key={entry.path} href={brandHref(entry.path)}>
      <span className="studio-index-number" aria-hidden="true">0{index + 1}</span>
      <BrandGlyph mode={entry.mode} />
      <span>{entry[locale]}</span>
      <Icon name="arrow" size={16} directional />
    </a>)}
  </nav>;
}

/** The same monochrome symbols used in the introduction and navigation. */
export function LabSchematic({ variant }: { variant: number }) {
  return <BrandGlyph mode={[0, 3, 1][variant % 3]!} className="studio-lab-schematic" />;
}

export function CreatorSignature() {
  return <div className="studio-signature studio-signature-art" aria-hidden="true">
    <img src="/images/brand-art/creator-object.webp" alt="" width="960" height="960" loading="lazy" decoding="async" />
  </div>;
}
