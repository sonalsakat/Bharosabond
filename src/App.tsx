import { useCallback, useEffect, useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { LoadingScreen, TopBar } from './components';
import { readFamilyInvite } from './familyInvitation';
import { LearnerFlow } from './LearnerFlow';
import { ParentFlow } from './ParentFlow';
import { t, type Language } from './i18n';

type Audience = 'parent' | 'learner';
function audienceFromLocation(): Audience { return new URLSearchParams(window.location.search).get('audience') === 'learner' ? 'learner' : 'parent'; }

export default function App() {
  const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin';
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(!isAdmin);
  const [audience, setAudience] = useState<Audience>(() => audienceFromLocation());
  const [invitation, setInvitation] = useState(() => readFamilyInvite(window.location.search));
  const [screenText, setScreenText] = useState(t('en', 'welcomeHeading'));
  const finishLoading = useCallback(() => setIsLoading(false), []);

  const changeAudience = useCallback((next: Audience) => {
    const url = new URL(window.location.href);
    url.pathname = '/';
    if (next === 'learner') {
      for (const key of ['invite', 'name', 'trade', 'district', 'concern', 'gender', 'qualification']) url.searchParams.delete(key);
      url.searchParams.set('audience', 'learner');
      setInvitation(null);
    } else {
      url.searchParams.delete('audience');
      setInvitation(readFamilyInvite(url.search));
    }
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setAudience(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
    document.title = `Bharosa Bond — ${isAdmin ? t(language, 'adminView') : t(language, 'tagline')}`;
  }, [language, isAdmin]);

  useEffect(() => {
    const syncFromLocation = () => {
      setAudience(audienceFromLocation());
      setInvitation(readFamilyInvite(window.location.search));
    };
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  if (isLoading) {
    return <LoadingScreen language={language} onLanguage={setLanguage} onFinish={finishLoading} />;
  }

  const currentHeaderText = isAdmin ? t(language, 'overview') : audience === 'learner' ? t(language, 'learnerChoice') : screenText;

  return (
    <div className="app-root">
      <TopBar language={language} onLanguage={setLanguage} titleText={currentHeaderText} />
      {isAdmin
        ? <AdminDashboard language={language} onTitle={setScreenText} />
        : audience === 'learner'
          ? <LearnerFlow language={language} onTitle={setScreenText} />
          : <ParentFlow language={language} onLanguage={setLanguage} onTitle={setScreenText} initialInvitation={invitation} onAudienceChange={changeAudience} />}
    </div>
  );
}
