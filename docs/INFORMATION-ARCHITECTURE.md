# One application, two contexts

The canonical base is `/` at archvanta.github.io. Hash routing preserves refresh support on GitHub Pages. All sections share the React root, data provider, account provider, locale, theme, header, footer and search.

| Path after # | Content |
|---|---|
| / | Osmo mountain parallax with ARCHVANTA, disciplines, selected work, model, creator, live editorial preview, lab, process and contact |
| /expertise/:slug | Architecture, BIM, infrastructure and digital systems |
| /projects?category=… | Nine sourced portfolio projects and three explicitly labeled concept studies |
| /projects/:slug | Project, original status, roles, credits, gallery, proposal and related work |
| /portfolio | MohammadAmin Sadeghi, experience, skills and selected work |
| /lab, /lab/:slug | Five original interactive model tools and source-listed external demos |
| /about, /contact | Parent brand and real creator contact |
| /search?q=… | Shared search across projects, disciplines, tools, pages and editorial index |
| /frontier/… | Existing editorial home, picks, archive, search/filter, stories, videos, sources, method, saved and optional accounts |

Old root editorial hashes (e.g. `#/story/id` and `#/picks/weekly`) still parse. New editorial links always use the `/frontier` namespace; editorial About is `#/frontier/about`, distinct from parent About. Old `/frontier/` and `/portfolio/` deployments remain untouched. Canonical portfolio media therefore use the independent `/work-media/` namespace. No external-site iframe is used: only the five individual model tools use isolated, on-demand frames.
