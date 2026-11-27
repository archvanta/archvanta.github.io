# Drawings on the site

The Drawings room (`#/drawings`) and each project page show sheets in the
`PlanViewer` (`src/site/PlanViewer.tsx`): drag to pan, wheel or pinch to zoom
at the cursor, double-click to zoom in, `+` `-` `0` and arrow keys, fit,
blueprint ink and full screen.

## Supported sheet formats

| Format | How it shows | Layers |
| --- | --- | --- |
| `.webp` / `.png` / `.jpg` | raster image | no |
| `.svg` | sanitised inline SVG (scripts and `on*` handlers removed) | yes, every `<g data-layer="NAME">` gets a toggle |

## From AutoCAD (DXF) to the site

1. In AutoCAD, `SAVEAS` → *AutoCAD 2018 DXF* (or export from Revit: *Export → CAD Formats → DXF*).
2. Convert locally (the DXF itself is never committed — `.gitignore` blocks CAD/BIM files):

   ```bash
   pip install ezdxf
   python scripts/dxf_to_svg.py plan.dxf public/work-media/drawings/<project>-plan.svg \
     --exclude-layers DEFPOINTS,A-ANNO-NOTE
   ```

   Each DXF layer becomes a switchable layer in the viewer. Use `--layers` to
   keep only the layers worth publishing; keep the file under ~3 MB.
3. Add the sheet to the project's `gallery` in `src/content/portfolio-source.json`
   with `"aspect": "plan"` so it appears in the Drawings room.

## Confidential work

Data-center drawings are confidential and are never published, converted into
`public/`, or described with project names. `scripts/check-confidential.mjs`
runs in CI and before every deploy; it fails on CAD/BIM source files and on the
names of the withdrawn data-center projects. Data-center experience is shown
only as the abstract capability diagram on the About page.
