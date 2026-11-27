import { describe, expect, it } from 'vitest';
import { sanitizeSvg } from './PlanViewer';
import { sheets } from './content';

describe('sanitizeSvg', () => {
  it('keeps drawing geometry and layer groups', () => {
    const svg = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><g data-layer="A-WALL"><path d="M0 0L10 10"/></g></svg>',
    );
    expect(svg).not.toBeNull();
    expect(svg!.querySelector('g[data-layer="A-WALL"] path')).not.toBeNull();
  });
  it('removes scripts, event handlers, foreign objects and javascript links', () => {
    const svg = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onload="alert(1)"><script>alert(2)</script><foreignObject><div/></foreignObject><a xlink:href="javascript:alert(3)" href="javascript:alert(4)"><rect onclick="x()" width="1" height="1"/></a></svg>',
    )!;
    const html = svg.outerHTML;
    expect(html).not.toMatch(/script|onload|onclick|foreignObject|javascript:/i);
  });
  it('rejects documents that are not SVG', () => {
    expect(sanitizeSvg('<html><body>x</body></html>')).toBeNull();
    expect(sanitizeSvg('not xml at all <')).toBeNull();
  });
});

describe('drawing sheets', () => {
  it('lists only published, non-confidential sheets with bilingual titles', () => {
    const list = sheets();
    expect(list.length).toBeGreaterThan(8);
    for (const s of list) {
      expect(s.title.en.length).toBeGreaterThan(0);
      expect(s.title.fa.length).toBeGreaterThan(0);
      expect(s.src).not.toMatch(/data-hall|rack|data-cent/i);
    }
    expect(new Set(list.map((s) => s.id)).size).toBe(list.length);
  });
});
