import { lazy, useEffect } from 'react';
import type { AppRoute } from '../lib/unifiedRouter';
import Home from './pages/Home';
import { DrawingsPage, ProjectPage, WorkPage } from './pages/Work';
import { AboutPage, ContactPage, FrontierPage, VenturesPage } from './pages/Studio';
import './site.css';

// The model viewer and global search keep their earlier implementation.
const LegacyBrandPages = lazy(() => import('../brand/pages/BrandPages'));

type BrandRoute = Extract<AppRoute, { kind: 'brand' }>;

export default function SitePages({ route }: { route: BrandRoute }) {
  useEffect(() => {
    if (route.page !== 'project') window.scrollTo({ top: 0 });
  }, [route.page]);
  let body;
  switch (route.page) {
    case 'home':
      body = <Home />;
      break;
    case 'work':
    case 'projects':
      body = <WorkPage />;
      break;
    case 'project':
      body = <ProjectPage slug={route.slug} />;
      break;
    case 'drawings':
      body = <DrawingsPage params={route.params} />;
      break;
    case 'about':
    case 'portfolio':
    case 'expertise':
      body = <AboutPage />;
      break;
    case 'ventures':
    case 'lab':
      body = <VenturesPage />;
      break;
    case 'venture':
      body = route.slug === 'frontier' ? <FrontierPage /> : <VenturesPage />;
      break;
    case 'contact':
      body = <ContactPage />;
      break;
    default:
      return <LegacyBrandPages route={route} />;
  }
  return <div className="sx-site">{body}</div>;
}
