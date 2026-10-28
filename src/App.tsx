import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GlobalHeader, EditorialNav } from "./components/GlobalHeader";
import { SiteEntrance } from "./components/SiteEntrance";
import { GlobalFooter } from "./components/GlobalFooter";
import { AccountToast } from "./components/account/AccountToast";
import { Loading } from "./components/States";
import { AccountProvider } from "./lib/account/AccountProvider";
import type { AccountConfig } from "./lib/account/config";
import type { AccountBackend } from "./lib/account/types";
import { createDataSource, type DataSource } from "./lib/data";
import { DataProvider } from "./lib/dataContext";
import { useAsync } from "./lib/hooks";
import { useI18n } from "./lib/i18n";
import { useHash, routePath } from "./lib/router";
import { appRoute } from "./lib/unifiedRouter";
import { focusSection } from "./lib/focus";
import { projectCatalog } from "./content/catalog";
const BrandPages = lazy(() => import("./brand/pages/BrandPages"));
const EditorialPage = lazy(() =>
  import("./EditorialPage").then((m) => ({ default: m.EditorialPage })),
);
export function App({
  source,
  account,
}: {
  source?: DataSource;
  account?: { config?: AccountConfig; backend?: AccountBackend };
}) {
  const data = useMemo(() => source ?? createDataSource(), [source]);
  const { t, locale } = useI18n();
  const hash = useHash();
  const route = useMemo(() => appRoute(hash), [hash]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const [heroSlot, setHeroSlot] = useState<HTMLElement | null>(null);
  const meta = useAsync(() => data.meta(), [data]);
  const positions = useRef(new Map<string, number>());
  const path = routePath(hash);
  useLayoutEffect(() => {
    window.scrollTo({
      top: positions.current.get(path) || 0,
      behavior: "instant",
    });
    const record = () => positions.current.set(path, window.scrollY);
    window.addEventListener("scroll", record, { passive: true });
    return () => window.removeEventListener("scroll", record);
  }, [path]);
  useEffect(() => {
    const label =
      route.kind === "editorial"
        ? "FRONTIER | News & Insights — ARCHVANTA"
        : route.page === "project"
          ? `${projectCatalog(locale).find((p) => p.slug === route.slug)?.title || "Project"} — ARCHVANTA`
          : route.page === "home"
            ? "ARCHVANTA — Architecture, Infrastructure & Digital Systems"
            : `${route.page === "portfolio" ? "MohammadAmin Sadeghi" : route.page.charAt(0).toUpperCase() + route.page.slice(1)} — ARCHVANTA`;
    document.title = label;
  }, [route, locale]);
  return (
    <DataProvider source={data}>
      <AccountProvider config={account?.config} backend={account?.backend}>
        <button className="skip-link" onClick={() => focusSection("main")}>
          {t("skipToContent")}
        </button>
        {data.mode === "mock" && (
          <p className="mock-banner" role="note">
            {t("mock_banner")}
          </p>
        )}
        <GlobalHeader route={route} />
        {route.kind === "editorial" && <EditorialNav route={route.route} />}
        <main id="main" tabIndex={-1}>
          <div ref={setHeroSlot} className="hero-slot" />
          <Suspense
            fallback={
              <div className="container">
                <Loading rows={2} />
              </div>
            }
          >
            {route.kind === "brand" ? (
              <BrandPages key={path} route={route} />
            ) : (
              <div className="container site-main route-view" key={path}>
                <EditorialPage
                  route={route.route}
                  now={now}
                  meta={meta.status === "ready" ? meta.data : null}
                  heroSlot={heroSlot}
                />
              </div>
            )}
          </Suspense>
        </main>
        <GlobalFooter />
        <AccountToast />
        <SiteEntrance
          enabled={route.kind === "brand" && route.page === "home"}
        />
      </AccountProvider>
    </DataProvider>
  );
}
