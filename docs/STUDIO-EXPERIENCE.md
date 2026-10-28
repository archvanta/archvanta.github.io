# ARCHVANTA studio experience

The interface uses the supplied mountain parallax as the opening image and a restrained architectural language throughout the real content: fine grids, line diagrams, a lime/blue theme accent, large Inter headings and Vazirmatn for Persian.

Implemented changes:

- Hero: concise practice description and working project/Lab links over the dark foreground. Preserve the four image layers and reversible movement.
- Introduction: asymmetric manifesto, actual creator link and a compact four-discipline navigation rail. Retain Osmo resource attribution.
- Home sequence: introduction → selected projects → expertise → systems → Lab → creator → FRONTIER → process → contact. The duplicate news preview is removed and the remaining preview contains three current articles.
- Projects: framed carousel, stronger project titles, consistent image frames, complete detail pages and count badges calculated from the real catalog.
- Expertise: two-column disclosure cards with the original line glyphs, a visible selected state and a single-column mobile layout.
- Lab: original schematic illustrations, retained card colors, clear model-launch actions and no eager WebGL loading. The schematics are decorative drawings, not fabricated model screenshots.
- Creator: typographic M/S signature, structural brand drawing, actual name, role and location. No stock portrait or invented credentials.
- Process/contact/footer: connected numbered steps, direct email action, a route-preserving back-to-top button and a large typographic signature.

`src/styles/studio.css` holds the scoped visual layer. `src/components/StudioDetails.tsx` holds the original index, schematics and signature. Shared FRONTIER tokens remain authoritative for both themes; editorial feeds, ranking and attribution are retained.

No new animation dependency is added for this finish. Grids and diagrams are static; hover changes use short transforms. The existing reduced-motion setting disables animated enhancements. No universal frame-rate guarantee is made.

Validation includes both languages, light/dark themes, six responsive widths, Axe scans, existing integration checks and a new navigation test for project counts, discipline links, model launch and back-to-top behavior. Production screenshots are in `docs/previews/studio`.
