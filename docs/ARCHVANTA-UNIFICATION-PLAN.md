# ARCHVANTA integration audit and migration map

Sources inspected: canonical brand baseline f0f974a; FRONTIER 635fd7c; portfolio source main; creator profile README. Integration occurs only in the canonical repository on `feat/archvanta-unification`. The baseline tag preserves the published brand application.

| Existing feature | Source | Target | Strategy | Validation |
|---|---|---|---|---|
| Routing, editorial data access, ranking, stories, filters, archive, sources, videos | FRONTIER | Existing frontend libraries/pages with `/frontier` namespace | Reuse source and schemas; add compatible route parsing | Unit suite and editorial browser checks |
| Language, theme, reader preferences, local bookmarks | FRONTIER + brand | Single shared providers | Retain `signal-ai:*` keys; import brand preferences only when no existing reader preference exists | Preference and bookmark continuity tests |
| News collection and translations | FRONTIER pipeline | Existing single collector, canonical consumer | Keep the running collector untouched; read its explicit public dataset base. No duplicate scheduled collector | Live metadata/day/search checks |
| Architectural model, manifesto, expertise, concept studies, identity | Existing brand | Scoped brand features under shared tokens | Retain original source/assets; adapt stores and internal links | Brand routes, model controls, accessibility |
| Nine actual portfolio records and 184 embedded images | Portfolio index.html | Typed source records and separate static assets | Extract data, do not import the legacy app or CSS. Keep original statuses and anonymization | Project galleries/status/source provenance |
| Five interactive BIM/3D tools | Portfolio | On-demand individual model viewers | Preserve each standalone tool; never embed the old portfolio/site | Lazy viewer route and asset checks |
| Global shell and editorial navigation | FRONTIER navigation conventions | Single ARCHVANTA header/footer + contextual editorial bar | Reuse menu/disclosure/utility patterns, one language/theme/search entry | Keyboard, responsive and route checks |

Production accounts are disabled in FRONTIER's actual deploy workflow. The optional account backend and tests are preserved, but no removed Supabase project is reactivated. Local saved articles remain usable.

Publishing target stays `archvanta.github.io`, base `/`. This branch is delivered through a reviewable PR. Production replacement and legacy retirement require the review/approval requested by the master prompt. Existing FRONTIER and portfolio deployments remain available during validation.
