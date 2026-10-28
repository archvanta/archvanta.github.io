import { useState, useEffect } from "react";
import { useI18n } from "../../lib/i18n";
import { useData } from "../../lib/dataContext";
import { useAsync } from "../../lib/hooks";
import { searchEntries, filtersFromParams } from "../../lib/search";
import { href } from "../../lib/router";
import { brandHref } from "../../lib/unifiedRouter";
import { localSearch } from "../../content/search";
import { messages } from "../../content/messages";
import { Loading, ErrorState } from "../../components/States";
export function GlobalSearchPage({ params }: { params: URLSearchParams }) {
  const { locale } = useI18n();
  const m = messages[locale];
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);
  const data = useData();
  const news = useAsync(
    () => (q.trim() ? data.searchIndex() : Promise.resolve(null)),
    [data, q],
  );
  const local = localSearch(q, locale);
  const articles =
    news.status === "ready"
      ? searchEntries(
          news.data?.entries || [],
          filtersFromParams(new URLSearchParams({ q })),
        ).slice(0, 20)
      : [];
  return (
    <div className="container av-search-page">
      <header className="page-head">
        <p className="eyebrow">ARCHVANTA / DISCOVER</p>
        <h1>{m.search}</h1>
        <p>{m.searchHint}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            location.hash = brandHref("/search", { q: input.trim() });
          }}
          role="search"
        >
          <label htmlFor="global-query">{m.search}</label>
          <div>
            <input
              id="global-query"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn is-primary" type="submit">
              {locale === "fa" ? "جست‌وجو" : "Search"}
            </button>
          </div>
        </form>
      </header>
      {(["project", "expertise", "lab", "page"] as const).map((type) => {
        const matches = local.filter((x) => x.type === type);
        return matches.length ? (
          <section className="av-search-results" key={type}>
            <h2>
              {type === "project"
                ? m.searchProjects
                : type === "lab"
                  ? m.searchLab
                  : m.searchPages}
            </h2>
            <ul>
              {matches.map((x) => (
                <li key={x.href}>
                  <small>{type.toUpperCase()}</small>
                  <h3>
                    <a href={x.href}>{x.title}</a>
                  </h3>
                  <p>{x.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })}
      {q && (
        <section className="av-search-results">
          <h2>{m.searchNews}</h2>
          {news.status === "loading" ? (
            <Loading rows={1} />
          ) : news.status === "error" ? (
            <ErrorState onRetry={news.reload} />
          ) : articles.length ? (
            <ul>
              {articles.map((a) => (
                <li key={a.id}>
                  <small>FRONTIER / {a.sn}</small>
                  <h3>
                    <a href={href(`/story/${a.d}/${a.id}`)} dir="auto">
                      {locale === "fa" && a.tf ? a.tf : a.t}
                    </a>
                  </h3>
                </li>
              ))}
            </ul>
          ) : (
            <p>{m.noResults}</p>
          )}
          <a href={href("/explore", { q })} className="btn">
            {locale === "fa"
              ? "فیلترهای پیشرفتهٔ خبر"
              : "Advanced news filters"}
          </a>
        </section>
      )}
    </div>
  );
}
