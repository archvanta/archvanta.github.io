import { EmptyState } from './components/States';
import { useI18n } from './lib/i18n';
import { href, type Route } from './lib/router';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/account/AccountPage';
import { ForYouPage } from './pages/account/ForYouPage';
import { OnboardingPage } from './pages/account/OnboardingPage';
import { PrivacyPage } from './pages/account/PrivacyPage';
import { SignInPage } from './pages/account/SignInPage';
import { ArchivePage, DayPage } from './pages/ArchivePage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { PicksPage } from './pages/PicksPage';
import { SavedPage } from './pages/SavedPage';
import { SectionPage } from './pages/SectionPage';
import { SourcesPage } from './pages/SourcesPage';
import { StoryPage } from './pages/StoryPage';

export function EditorialPage({ route, now, meta, heroSlot }: { route: Route; now: Date; meta: import('./lib/types').Meta | null; heroSlot: HTMLElement | null }) {
  const { t } = useI18n();
  switch (route.name) {
    case 'home':
      return <><h1 className="visually-hidden">FRONTIER</h1><HomePage showIntro={false} page={route.page} meta={meta} now={now} heroSlot={heroSlot} /></>;
    case 'ai-news':
      return <HomePage variant="ai-news" page={route.page} meta={meta} now={now} heroSlot={heroSlot} />;
    case 'picks':
      return <PicksPage window={route.window} />;
    case 'explore':
      return <ExplorePage params={route.params} />;
    case 'section':
      return <SectionPage id={route.id} params={route.params} />;
    case 'archive':
      return <ArchivePage />;
    case 'day':
      return <DayPage day={route.day} />;
    case 'story':
      return <StoryPage day={route.day} id={route.id} />;
    case 'saved':
      return <SavedPage />;
    case 'about':
      return <AboutPage />;
    case 'sources':
      return <SourcesPage />;
    case 'signin':
      return <SignInPage create={route.create} next={route.next} />;
    case 'welcome':
      return <OnboardingPage />;
    case 'account':
      return <AccountPage />;
    case 'for-you':
      return <ForYouPage now={now} />;
    case 'privacy':
      return <PrivacyPage />;
    default:
      return (
        <div className="page container-narrow">
          <h1 className="page-title">{t('not_found')}</h1>
          <EmptyState title={t('not_found')}>
            <a className="btn" href={href('/')}>
              {t('go_home')}
            </a>
          </EmptyState>
        </div>
      );
  }
}
