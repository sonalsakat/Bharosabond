import React, { type ReactNode } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { languageLabels, speechLocales, t, type Language } from './i18n';

export function BMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`b-mark ${className}`} viewBox="0 0 52 52" role="img" aria-label="Bharosa Bond mark">
      <circle cx="20" cy="26" r="15" fill="none" stroke="#6D28D9" strokeWidth="4" />
      <circle cx="32" cy="26" r="15" fill="none" stroke="#DB2777" strokeWidth="4" />
      <path d="M30.6 36.6 A15 15 0 0 1 21.6 40.7" fill="none" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ intro = false }: { intro?: boolean }) {
  const word = 'Bharosa Bond';
  return (
    <span className={`brand-lockup ${intro ? 'brand-lockup-intro' : ''}`}>
      <BMark />
      <span className="brand-word" aria-label={word}>
        {intro ? [...word].map((letter, index) => <span key={`${letter}-${index}`} style={{ '--letter-index': index } as React.CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span>) : word}
      </span>
    </span>
  );
}

export function Reader({ language, text }: { language: Language; text: string }) {
  function readAloud() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const visibleScreen = document.querySelector('.screen-frame, .admin-layout')?.textContent?.replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(visibleScreen || text);
    utterance.lang = speechLocales[language];
    utterance.rate = 0.91;
    window.speechSynthesis.speak(utterance);
  }
  return <button className="icon-button speaker-button" type="button" onClick={readAloud} aria-label="Read this screen aloud" title="Read this screen aloud"><Volume2 size={20} strokeWidth={2} /></button>;
}

export function LanguageSwitch({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-switch" role="group" aria-label="Choose language">
      {(['mr', 'hi', 'en'] as Language[]).map((item) => (
        <button key={item} type="button" className={language === item ? 'language-option active' : 'language-option'} onClick={() => onChange(item)} aria-pressed={language === item}>
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}

export function TopBar({ language, onLanguage, titleText }: { language: Language; onLanguage: (language: Language) => void; titleText: string }) {
  return (
    <header className="topbar">
      <a className="topbar-brand" href="/" aria-label="Bharosa Bond home"><Logo /></a>
      <div className="topbar-tools">
        <Reader language={language} text={titleText} />
        <LanguageSwitch language={language} onChange={onLanguage} />
        <a className="admin-link" href={window.location.pathname === '/admin' ? '/' : '/admin'}>
          {window.location.pathname === '/admin' ? t(language, 'home') : t(language, 'adminView')}
        </a>
      </div>
    </header>
  );
}

export function ProgressDots({ current, total = 9 }: { current: number; total?: number }) {
  return <div className="progress-dots" aria-label={`Step ${current} of ${total}`} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>{Array.from({ length: total }, (_, index) => <span key={index} className={index + 1 <= current ? 'progress-dot complete' : 'progress-dot'} />)}</div>;
}

export function LoadingScreen({ language, onLanguage, onFinish }: { language: Language; onLanguage: (language: Language) => void; onFinish: () => void }) {
  const [line, setLine] = React.useState(0);
  React.useEffect(() => {
    const first = window.setTimeout(() => setLine(1), 1400);
    const finish = window.setTimeout(onFinish, 3000);
    return () => { window.clearTimeout(first); window.clearTimeout(finish); };
  }, [onFinish]);
  const tagline = t(language, 'tagline');
  const localLines = language === 'mr' ? ['आपल्या माणसांसोबत', 'अपनों के साथ'] : language === 'hi' ? ['अपनों के साथ', 'आपल्या माणसांसोबत'] : ['With families nearby', 'आपल्या माणसांसोबत'];
  return (
    <main className="loading-screen" aria-label="Bharosa Bond loading">
      <div className="loading-tools"><Reader language={language} text={`Bharosa Bond. ${tagline}`} /><LanguageSwitch language={language} onChange={onLanguage} /></div>
      <div className="loading-center">
        <div className="loading-mark"><BMark /></div>
        <div className="loading-word"><Logo intro /></div>
        <p className="loading-tagline">{tagline}</p>
        <p key={line} className="loading-local-line">{localLines[line]}</p>
      </div>
      <div className="loading-progress" aria-hidden="true"><span /></div>
      <span className="sr-only">Loading Bharosa Bond</span>
    </main>
  );
}

export function ScreenFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`screen-frame ${className}`}>{children}</div>;
}

export function BackButton({ onClick, language }: { onClick: () => void; language: Language }) {
  return <button type="button" className="text-button back-button" onClick={onClick}><ArrowLeft size={17} /> {t(language, 'back')}</button>;
}
