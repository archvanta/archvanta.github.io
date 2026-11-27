import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { copy, pick, type Sheet } from './content';
import { I } from './icons';

interface View { s: number; x: number; y: number }
const MIN = 0.05;
const MAX = 8;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Parse a same-origin SVG drawing, drop anything executable, and expose its `data-layer` groups. */
export function sanitizeSvg(text: string): SVGSVGElement | null {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null;
  doc.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((n) => n.remove());
  doc.querySelectorAll('*').forEach((el) => {
    for (const a of Array.from(el.attributes)) {
      if (/^on/i.test(a.name) || (/href$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) el.removeAttribute(a.name);
    }
  });
  return document.importNode(svg, true) as unknown as SVGSVGElement;
}

export function PlanViewer({
  sheets,
  initial,
  onSelect,
  title,
  compact = false,
  tall = false,
}: {
  sheets: Sheet[];
  initial?: string;
  onSelect?: (id: string) => void;
  title?: string;
  compact?: boolean;
  tall?: boolean;
}) {
  const { locale } = useI18n();
  const t = copy.drawings;
  const [id, setId] = useState(() => (sheets.some((s) => s.id === initial) ? initial! : sheets[0]?.id));
  const sheet = sheets.find((s) => s.id === id) ?? sheets[0];
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const svgHost = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  useLayoutEffect(() => {
    viewRef.current = view;
  }, [view]);
  const [ink, setInk] = useState(false);
  const [drag, setDrag] = useState(false);
  const [layers, setLayers] = useState<{ name: string; on: boolean }[]>([]);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; s: number } | null>(null);

  useEffect(() => {
    if (initial && sheets.some((s) => s.id === initial)) setId(initial);
  }, [initial, sheets]);

  const fit = useCallback((w = size?.w, h = size?.h) => {
    const el = stage.current;
    if (!el || !w || !h) return;
    const pad = 32;
    const s = clamp(Math.min((el.clientWidth - pad * 2) / w, (el.clientHeight - pad * 2 - 56) / h), MIN, MAX);
    setView({ s, x: (el.clientWidth - w * s) / 2, y: (el.clientHeight - 56 - h * s) / 2 + 8 });
  }, [size]);

  // Load raster or SVG sheet and record its natural size.
  useEffect(() => {
    if (!sheet) return;
    let live = true;
    setSize(null);
    setLayers([]);
    if (sheet.svg) {
      fetch(sheet.src)
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
        .then((text) => {
          if (!live) return;
          const svg = sanitizeSvg(text);
          const host = svgHost.current;
          if (!svg || !host) return;
          host.replaceChildren(svg);
          const vb = svg.viewBox.baseVal;
          const w = vb && vb.width ? vb.width : Number(svg.getAttribute('width')) || 1000;
          const h = vb && vb.height ? vb.height : Number(svg.getAttribute('height')) || 700;
          svg.setAttribute('width', String(w));
          svg.setAttribute('height', String(h));
          setLayers(Array.from(svg.querySelectorAll<SVGGElement>('g[data-layer]')).map((g) => ({ name: g.dataset.layer!, on: true })));
          setSize({ w, h });
        })
        .catch(() => undefined);
    } else {
      const img = new Image();
      img.onload = () => live && setSize({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = sheet.src;
    }
    return () => {
      live = false;
    };
  }, [sheet]);

  useLayoutEffect(() => {
    if (size) fit(size.w, size.h);
  }, [size, fit]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => size && fit(size.w, size.h));
    ro.observe(el);
    return () => ro.disconnect();
  }, [size, fit]);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = stage.current;
    if (!el) return;
    const v = viewRef.current;
    const px = cx ?? el.clientWidth / 2;
    const py = cy ?? el.clientHeight / 2;
    const s = clamp(v.s * factor, MIN, MAX);
    const k = s / v.s;
    setView({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
  }, []);

  // Wheel zoom needs a non-passive listener.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      zoomAt(factor, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onDown = (e: React.PointerEvent) => {
    stage.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values()) as [{ x: number; y: number }, { x: number; y: number }];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: viewRef.current.s };
    }
    setDrag(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values()) as [{ x: number; y: number }, { x: number; y: number }];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = stage.current!.getBoundingClientRect();
      const target = clamp(pinch.current.s * (d / pinch.current.d), MIN, MAX);
      zoomAt(target / viewRef.current.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    } else if (pointers.current.size === 1) {
      setView((v) => ({ ...v, x: v.x + next.x - prev.x, y: v.y + next.y - prev.y }));
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setDrag(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = 60;
    const map: Record<string, () => void> = {
      '+': () => zoomAt(1.25),
      '=': () => zoomAt(1.25),
      '-': () => zoomAt(0.8),
      '0': () => fit(),
      ArrowLeft: () => setView((v) => ({ ...v, x: v.x + step })),
      ArrowRight: () => setView((v) => ({ ...v, x: v.x - step })),
      ArrowUp: () => setView((v) => ({ ...v, y: v.y + step })),
      ArrowDown: () => setView((v) => ({ ...v, y: v.y - step })),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };
  const fullscreen = () => {
    const el = root.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  };
  const toggleLayer = (name: string) => {
    setLayers((ls) => ls.map((l) => (l.name === name ? { ...l, on: !l.on } : l)));
    svgHost.current?.querySelectorAll<SVGGElement>(`g[data-layer="${CSS.escape(name)}"]`).forEach((g) => {
      g.style.display = g.style.display === 'none' ? '' : 'none';
    });
  };
  const choose = (sid: string) => {
    setId(sid);
    onSelect?.(sid);
  };
  if (!sheet) return null;
  const label = `${pick(sheet.kind, locale)} — ${pick(sheet.title, locale)}`;
  return (
    <div className={`sx-viewer${tall ? ' sx-viewer--tall' : ''}`} ref={root} data-ink={ink ? 'blueprint' : 'paper'} data-testid="plan-viewer">
      <div
        ref={stage}
        className={`sx-stage sx-grid-bg${drag ? ' is-drag' : ''}`}
        tabIndex={0}
        role="application"
        aria-roledescription={pick(t.viewer, locale)}
        aria-label={label}
        data-lenis-prevent
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => {
          const r = stage.current!.getBoundingClientRect();
          zoomAt(2, e.clientX - r.left, e.clientY - r.top);
        }}
        onKeyDown={onKey}
      >
        <div
          className="sx-stage-canvas"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, opacity: size ? 1 : 0 }}
        >
          {sheet.svg ? (
            <div ref={svgHost} className="sx-svg-host" />
          ) : (
            <img src={sheet.src} alt={label} width={size?.w} height={size?.h} draggable={false} />
          )}
        </div>
        <div className="sx-stage-hud">
          <span className="sx-chip">{pick(sheet.kind, locale)} · {sheet.id}</span>
          {!compact && <span className="sx-chip sx-hide-sm">{pick(t.hint, locale)}</span>}
        </div>
        <div className="sx-tools-bar" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => zoomAt(0.8)} aria-label={pick(t.zoomOut, locale)} title={pick(t.zoomOut, locale)}><I name="minus" /></button>
          <span className="sx-zoom" aria-live="polite" data-testid="zoom-level">{Math.round(view.s * 100)}%</span>
          <button type="button" onClick={() => zoomAt(1.25)} aria-label={pick(t.zoomIn, locale)} title={pick(t.zoomIn, locale)}><I name="plus" /></button>
          <button type="button" onClick={() => fit()} aria-label={pick(t.fit, locale)} title={pick(t.fit, locale)}><I name="fit" /></button>
          <button type="button" onClick={() => setInk((v) => !v)} aria-pressed={ink} aria-label={pick(t.ink, locale)} title={pick(t.ink, locale)}><I name="ink" /></button>
          <button type="button" onClick={fullscreen} aria-label={pick(t.full, locale)} title={pick(t.full, locale)}><I name="expand" /></button>
        </div>
      </div>
      <aside className="sx-sheets" aria-label={pick(t.sheets, locale)}>
        <header>
          <span className="sx-mono sx-fa-ok">{pick(t.sheets, locale)} · {sheets.length}</span>
          {title && <h3>{title}</h3>}
        </header>
        <ol>
          {sheets.map((s) => (
            <li key={s.id}>
              <button type="button" aria-current={s.id === sheet.id} onClick={() => choose(s.id)}>
                <span className="sx-thumb"><img src={s.src} alt="" loading="lazy" decoding="async" /></span>
                <span>
                  <strong>{pick(s.title, locale)}</strong>
                  <small>{pick(s.kind, locale)} · {s.id}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {layers.length > 0 && (
          <fieldset className="sx-layers">
            <legend className="sx-mono sx-fa-ok">{pick(t.layers, locale)}</legend>
            {layers.map((l) => (
              <label key={l.name}>
                <input type="checkbox" checked={l.on} onChange={() => toggleLayer(l.name)} /> {l.name}
              </label>
            ))}
          </fieldset>
        )}
        {!compact && <p className="sx-viewer-note">{pick(t.note, locale)}</p>}
      </aside>
    </div>
  );
}
