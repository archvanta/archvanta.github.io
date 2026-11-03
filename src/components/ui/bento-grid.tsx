import type { ComponentType, ReactNode, SVGProps } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import './bento-grid.css';

function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('bento-grid grid w-full auto-rows-[22rem] grid-cols-3 gap-4', className)}>{children}</div>;
}

interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: ComponentType<Pick<SVGProps<SVGSVGElement>, 'className' | 'aria-hidden'>>;
  description: string;
  href: string;
  cta: string;
  eyebrow?: string;
  tags?: readonly string[];
}

/** Adapted from the supplied Bento component; hover, focus and touch share the same action. */
function BentoCard({ name, className, background, Icon, description, href, cta, eyebrow, tags }: BentoCardProps) {
  return <article className={cn('bento-card group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl', className)} data-reveal>
    <div className="bento-card__background" aria-hidden="true">{background}</div>
    {eyebrow && <span className="bento-card__eyebrow technical" dir="ltr">{eyebrow}</span>}
    <div className="bento-card__content">
      <Icon className="bento-card__icon brand-glyph" aria-hidden="true" />
      <h3>{name}</h3>
      <p>{description}</p>
      {tags && <ul className="bento-card__tags technical" dir="ltr">{tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
    </div>
    <div className="bento-card__action">
      <Button variant="ghost" asChild size="sm">
        <a href={href}>{cta}<ArrowRightIcon className="bento-card__arrow" aria-hidden="true" /></a>
      </Button>
    </div>
  </article>;
}

export { BentoCard, BentoGrid };
