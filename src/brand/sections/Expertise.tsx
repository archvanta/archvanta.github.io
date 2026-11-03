import { CodeIcon, CubeIcon, LayersIcon, ReaderIcon } from '@radix-ui/react-icons';
import { expertise } from '../lib/content';
import { usePreferences } from '../lib/preferences';
import { SectionHeading } from '../components/SectionHeading';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { brandHref } from '@/lib/unifiedRouter';

const icons = [CubeIcon, LayersIcon, ReaderIcon, CodeIcon];
const paths = ['/expertise/architecture', '/expertise/bim', '/expertise/infrastructure', '/lab'];
const actions = {
  en: ['Explore architecture', 'Explore BIM', 'Explore infrastructure', 'Enter the Lab'],
  fa: ['کشف معماری', 'کشف BIM', 'کشف زیرساخت', 'ورود به آزمایشگاه'],
};

/** Quiet geometry keeps the supplied Bento layout architectural and lightweight. */
function DisciplineBackdrop({ index }: { index: number }) {
  return <svg className={`expertise-bento-art expertise-bento-art--${index}`} viewBox="0 0 320 260" fill="none" aria-hidden="true">
    {index === 0 ? <>
      <path d="M40 220V40h240v180H40Zm60 0V100h120v120M40 100h60m120 0h60M100 160h120" />
      <path d="M20 20h280v220H20M160 0v260M0 130h320" strokeDasharray="3 7" opacity=".35" />
    </> : index === 1 ? <>
      {[0, 1, 2].map(layer => <path key={layer} d={`m40 ${65 + layer * 55} 120-50 120 50-120 50-120-50Z`} />)}
      <path d="M160 15v225M40 65v110m240-110v110" strokeDasharray="3 7" opacity=".35" />
    </> : index === 2 ? <>
      {[50, 130, 210].map(x => <g key={x}><rect x={x} y="35" width="60" height="190" rx="4" />{[65, 100, 135, 170].map(y => <path key={y} d={`M${x + 14} ${y}h32`} />)}</g>)}
    </> : <>
      <path d="m90 60-65 70 65 70m140-140 65 70-65 70M185 30l-50 200" />
      <path d="M0 130h320M160 0v260" strokeDasharray="3 7" opacity=".35" />
    </>}
  </svg>;
}

export function Expertise() {
  const { t, language } = usePreferences();
  return <section id="expertise" className="section expertise">
    <div className="section-wrap">
      <SectionHeading label={t.expertiseLabel} title={t.expertiseTitle} accent={t.expertiseAccent} body={t.expertiseIntro} />
      <BentoGrid className="expertise-bento">
        {expertise.map((entry, index) => <BentoCard
          key={entry.id}
          className={`expertise-bento-card expertise-bento-card--${entry.id}`}
          name={entry.title[language]}
          description={entry.body[language]}
          Icon={icons[index]!}
          background={<DisciplineBackdrop index={index} />}
          eyebrow={`0${index + 1} / ARCHVANTA`}
          tags={entry.tags}
          href={brandHref(paths[index]!)}
          cta={actions[language][index]!}
        />)}
      </BentoGrid>
    </div>
  </section>;
}
