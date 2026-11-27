#!/usr/bin/env python3
"""Convert an AutoCAD DXF drawing into a layered, web-friendly SVG.

Each DXF layer becomes ``<g data-layer="NAME">`` so the site's PlanViewer can
switch layers on and off. Geometry only: no fonts, no xrefs, no scripts.

Usage:
    pip install ezdxf
    python scripts/dxf_to_svg.py input.dxf public/work-media/drawings/plan.svg \
        [--layers A-WALL,A-DOOR] [--exclude-layers DEFPOINTS] [--stroke 0.6]

Confidential work (for example the data-center drawings) must never be passed
through this script into ``public/``. ``scripts/check-confidential.mjs`` fails
the build if such names appear in the published tree.
"""

from __future__ import annotations

import argparse
import math
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

try:
    import ezdxf
    from ezdxf import bbox
except ImportError:  # pragma: no cover - guidance only
    sys.exit("ezdxf is required: pip install ezdxf")


def fmt(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".")


def safe_layer(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.\-]+", "_", name)[:64] or "0"


def entity_paths(e) -> list[str]:
    """Return SVG path data strings (in DXF coordinates) for one entity."""
    t = e.dxftype()
    out: list[str] = []
    if t == "LINE":
        s, d = e.dxf.start, e.dxf.end
        out.append(f"M{fmt(s.x)} {fmt(s.y)}L{fmt(d.x)} {fmt(d.y)}")
    elif t in ("LWPOLYLINE", "POLYLINE", "SPLINE", "ARC", "CIRCLE", "ELLIPSE"):
        try:
            if t == "LWPOLYLINE" or t == "POLYLINE":
                pts = [(p[0], p[1]) for p in e.flattening(0.05)] if hasattr(e, "flattening") else []
                if not pts:
                    pts = [(p[0], p[1]) for p in e.points()] if t == "LWPOLYLINE" else [
                        (v.dxf.location.x, v.dxf.location.y) for v in e.vertices
                    ]
            else:
                pts = [(p.x, p.y) for p in e.flattening(0.05)]
        except Exception:
            return out
        if len(pts) >= 2:
            d = "M" + "L".join(f"{fmt(x)} {fmt(y)}" for x, y in pts)
            closed = t == "CIRCLE" or getattr(e, "closed", False) or getattr(e, "is_closed", False)
            out.append(d + ("Z" if closed else ""))
    elif t in ("SOLID", "TRACE", "3DFACE"):
        pts = [e.dxf.get(f"vtx{i}") for i in range(4)]
        pts = [p for p in pts if p is not None]
        if len(pts) >= 3:
            out.append("M" + "L".join(f"{fmt(p.x)} {fmt(p.y)}" for p in pts) + "Z")
    elif t == "HATCH":
        for path in e.paths:
            try:
                verts = [(v[0], v[1]) for v in path.vertices] if hasattr(path, "vertices") else []
            except Exception:
                verts = []
            if len(verts) >= 3:
                out.append("M" + "L".join(f"{fmt(x)} {fmt(y)}" for x, y in verts) + "Z")
    return out


def convert(src: Path, dst: Path, only: set[str] | None, exclude: set[str], stroke: float) -> dict:
    doc = ezdxf.readfile(src)
    msp = doc.modelspace()
    layers: dict[str, list[str]] = {}
    for e in msp:
        if e.dxftype() == "INSERT":
            try:
                children = list(e.virtual_entities())
            except Exception:
                children = []
        else:
            children = [e]
        for c in children:
            layer = c.dxf.get("layer", "0")
            if layer in exclude or (only and layer not in only):
                continue
            paths = entity_paths(c)
            if paths:
                layers.setdefault(layer, []).extend(paths)

    if not layers:
        raise SystemExit("No drawable geometry found (check --layers).")

    box = bbox.extents(e for e in msp if e.dxf.get("layer", "0") in layers)
    if not box.has_data:
        raise SystemExit("Could not compute drawing extents.")
    minx, miny = box.extmin.x, box.extmin.y
    w, h = box.size.x or 1.0, box.size.y or 1.0
    pad = max(w, h) * 0.02
    # DXF Y grows upward; flip with a group transform so coordinates stay exact.
    vb = f"{fmt(minx - pad)} {fmt(-(miny + h) - pad)} {fmt(w + 2 * pad)} {fmt(h + 2 * pad)}"
    sw = stroke * max(w, h) / 1000

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none" '
        f'stroke="currentColor" stroke-width="{fmt(sw)}" stroke-linecap="round" stroke-linejoin="round">',
        '<g transform="scale(1,-1)">',
    ]
    for name in sorted(layers):
        parts.append(f"<g data-layer={quoteattr(safe_layer(name))}><title>{escape(name)}</title>")
        parts.append(f'<path d="{"".join(layers[name])}"/>')
        parts.append("</g>")
    parts += ["</g>", "</svg>"]
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text("\n".join(parts), encoding="utf-8")
    return {"layers": len(layers), "bytes": dst.stat().st_size, "width": w, "height": h}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", type=Path)
    ap.add_argument("dst", type=Path)
    ap.add_argument("--layers", default="", help="comma-separated layers to keep (default: all)")
    ap.add_argument("--exclude-layers", default="DEFPOINTS", help="comma-separated layers to drop")
    ap.add_argument("--stroke", type=float, default=0.6, help="stroke width per mille of drawing size")
    a = ap.parse_args(argv)
    only = {x for x in a.layers.split(",") if x} or None
    exclude = {x for x in a.exclude_layers.split(",") if x}
    info = convert(a.src, a.dst, only, exclude, a.stroke)
    print(f"{a.dst}: {info['layers']} layers, {info['bytes'] / 1024:.0f} KB, "
          f"{fmt(info['width'])} x {fmt(info['height'])} drawing units")
    if math.isfinite(info["bytes"]) and info["bytes"] > 3_000_000:
        print("warning: SVG over 3 MB; consider --layers or simplifying the drawing", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
