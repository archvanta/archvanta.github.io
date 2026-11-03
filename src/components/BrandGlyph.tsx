import { CodeIcon, CubeIcon, LayersIcon, ReaderIcon } from '@radix-ui/react-icons';

/** The same outline family is used in cards, menus, the introduction and Lab. */
export const disciplineIcons = [CubeIcon, CodeIcon, LayersIcon, ReaderIcon] as const;

export function BrandGlyph({ mode, className = '' }: { mode: number; className?: string }) {
  const Glyph = disciplineIcons[mode] ?? CodeIcon;
  return <Glyph className={`brand-glyph ${className}`} width="48" height="48" aria-hidden="true" focusable="false" />;
}

export function PerspectiveMark() {
  return (
    <div className="perspective-mark" aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none">
        <path d="M30 260 150 30l120 230H30Z" />
        <path d="m65 230 85-160 85 160H65Zm35-30 50-91 50 91H100Z" />
        <path d="M150 0v300M0 260h300M30 260 250 60M270 260 50 60" strokeDasharray="2 6" opacity=".45" />
        <circle cx="150" cy="154" r="5" className="perspective-mark-dot" />
      </svg>
      <span dir="ltr">A SHIFT IN PERSPECTIVE</span>
    </div>
  );
}
