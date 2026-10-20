import { useEffect, useMemo, useState, type ReactNode, type SetStateAction } from 'react';
import {
  ArrowRight, BadgeCheck, BookOpen, Check, CircleHelp, Clock3, GraduationCap, HeartHandshake,
  MapPin, MessageCircle, ShieldCheck, Volume2, Wallet, type LucideIcon,
} from 'lucide-react';
import { BackButton, Logo, ProgressDots, ScreenFrame } from './components';
import { ContactForm } from './ContactForm';
import { districtProofs, districts, type District, type DistrictProof } from './data';
import { flowText } from './flowCopy';
import type { FamilyInvitation } from './familyInvitation';
import { t, languageLabels, type CopyKey, type Language } from './i18n';
import { buildRuleAnalysis, applyExplicitRules, isConcernAnalysis, type Concern, type ConcernAnalysis, type TradeName } from './concernAnalysis';
import { mentors, rankMentors, type MatchProfile, type MentorStory } from './mentorStories';
import { useSpeechInput } from './useSpeechInput';
import { VoiceCapture } from './VoiceCapture';
import { StoryPlayer } from './StoryPlayer';

type Step = 'welcome' | 'district' | 'income' | 'class' | 'worry' | 'understood' | 'mentor' | 'proof' | 'contact' | 'decision' | 'callback';
type Audience = 'parent' | 'learner';
const screenProgress: Record<Step, number> = {
  welcome: 0, district: 1, income: 2, class: 3, worry: 4, understood: 5,
  mentor: 6, proof: 7, contact: 7, decision: 8, callback: 9,
};
const worryOptions: { concern: Concern; key: CopyKey; icon: LucideIcon }[] = [
  { concern: 'Low pay', key: 'lowPay', icon: Wallet },
  { concern: 'Safety', key: 'safety', icon: ShieldCheck },
  { concern: 'Respect', key: 'respect', icon: HeartHandshake },
  { concern: 'Degree is better', key: 'degree', icon: GraduationCap },
  { concern: "Girls' safety", key: 'girlsSafety', icon: ShieldCheck },
  { concern: 'Cost', key: 'cost', icon: CircleHelp },
];
const worryCopyKey: Record<Concern, CopyKey> = {
  'Low pay': 'lowPay', Safety: 'safety', Respect: 'respect', 'Degree is better': 'degree', "Girls' safety": 'girlsSafety', Cost: 'cost',
};
function localizedTrade(language: Language, trade: TradeName): string {
  if (trade === 'Drafting technician') return language === 'mr' ? 'ड्राफ्टिंग तंत्रज्ञ' : language === 'hi' ? 'ड्राफ्टिंग तकनीशियन' : 'Drafting technician';
  return t(language, trade === 'Electrician' ? 'electrician' : trade === 'Welder' ? 'welder' : 'plumber');
}
const titleCopyKey: Record<Step, CopyKey> = {
  welcome: 'welcomeHeading', district: 'districtQuestion', income: 'incomeQuestion', class: 'classQuestion',
  worry: 'speakWorry', understood: 'weUnderstood', mentor: 'meetParent', proof: 'localProof', contact: 'talkParent',
  decision: 'familyCard', callback: 'counsellorTitle',
};
const incomeChoices = [
  { value: 'incomeUnder', key: 'incomeUnder', icon: Wallet }, { value: 'income10to20', key: 'income10to20', icon: Wallet },
  { value: 'income20to35', key: 'income20to35', icon: Wallet }, { value: 'incomeOver35', key: 'incomeOver35', icon: Wallet },
] as const;
const classChoices = [
  'class8', 'class9', 'class10', 'class11or12', 'finishedSchool', 'otherOption',
] as const;

function ChoiceButton({ active, icon: Icon, children, onClick }: { active: boolean; icon: LucideIcon; children: ReactNode; onClick: () => void }) {
  return <button type="button" className={`choice-button ${active ? 'selected' : ''}`} aria-pressed={active} onClick={onClick}><Icon size={21} strokeWidth={2} /><span>{children}</span><span className="choice-check">{active && <Check size={16} />}</span></button>;
}

function FamilyDecisionCard({ language, district, proof, onListen, onShare }: { language: Language; district: string; proof: DistrictProof; onListen: () => void; onShare: () => void }) {
  const sequence: CopyKey[] = ['course', 'nsqf', 'diploma', 'degreePath'];
  return (
    <section className="decision-paper" id="decision-card" aria-label={t(language, 'familyCard')}>
      <div className="decision-card-head"><Logo /></div>
      <div className="decision-card-rule" />
      <div className="decision-proof-row"><div className="decision-proof-icon"><Check size={21} /></div><div><p className="decision-kicker">01 / {t(language, 'proofSection')}</p><strong>{proof.rate}</strong><span>{t(language, 'placementRate')}</span><small>{t(language, 'startingPay')}: {proof.pay} / {t(language, 'perMonth')}</small></div></div>
      <div className="decision-card-rule" />
      <div className="decision-path-row"><div className="decision-proof-icon"><GraduationCap size={22} /></div><div className="decision-path-content"><p className="decision-kicker">02 / {t(language, 'childPath')}</p><div className="path-ladder">{sequence.map((key, index) => <div className="path-step" key={key}><span className="path-step-number">0{index + 1}</span><span>{t(language, key)}</span></div>)}</div></div></div>
      <div className="decision-card-rule" />
      <div className="decision-relatives-row"><div className="decision-proof-icon"><MessageCircle size={20} /></div><div><p className="decision-kicker">03 / {t(language, 'relatives')}</p><p className="relatives-line">“{t(language, 'relativesLine')}”</p><small>{district} · {proof.provider}</small></div></div>
      <div className="decision-card-bottom"><span>Bharosa Bond · {t(language, 'tagline')}</span><span>{proof.date}</span></div>
      <div className="decision-card-controls no-print"><button type="button" className="button-outline" onClick={onListen}><Volume2 size={17} strokeWidth={2} />{t(language, 'listen')}</button><button type="button" className="button-outline" onClick={onShare}>{t(language, 'shareWhatsapp')}</button><button type="button" className="button-primary" onClick={() => window.print()}>{t(language, 'downloadPdf')} <ArrowRight size={17} /></button></div>
    </section>
  );
}

export function ParentFlow({
  language, onLanguage, onTitle, initialInvitation, onAudienceChange,
}: {
  language: Language;
  onLanguage: (language: Language) => void;
  onTitle: (text: string) => void;
  initialInvitation: FamilyInvitation | null;
  onAudienceChange: (audience: Audience) => void;
}) {
  const [step, setStep] = useState<Step>(() => initialInvitation ? 'worry' : 'welcome');
  const [district, setDistrict] = useState<District>(initialInvitation?.district ?? 'Satara');
  const [income, setIncome] = useState('');
  const [learnerClass, setLearnerClass] = useState(initialInvitation?.qualification ?? '');
  const [concern, setConcern] = useState<Concern>(initialInvitation?.concern ?? 'Safety');
  const [chipOverride, setChipOverride] = useState(false);
  const [analysis, setAnalysis] = useState<ConcernAnalysis | null>(null);
  const [analysisWasLocal, setAnalysisWasLocal] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [seenMentors, setSeenMentors] = useState<string[]>([]);
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null);
  const [showAnotherParentNote, setShowAnotherParentNote] = useState(false);
  const [error, setError] = useState('');
  const speech = useSpeechInput(language);
  const speechController = useMemo(() => ({
    ...speech,
    toggle: () => { setChipOverride(false); speech.toggle(); },
    setText: (value: SetStateAction<string>) => { setChipOverride(false); speech.setText(value); },
  }), [speech]);

  useEffect(() => {
    const text = speech.text.trim();
    if (!text || chipOverride) return;
    setConcern(buildRuleAnalysis(text, language, concern).primary_concern);
  }, [speech.text, language, chipOverride, concern]);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  const selectedProof = districtProofs[district];
  const targetTrade = analysis?.trade_mentioned ?? initialInvitation?.trade ?? null;
  const targetGender = analysis?.learner_gender_if_mentioned ?? initialInvitation?.learnerGender ?? null;
  const matchProfile: MatchProfile | null = analysis ? {
    concern: analysis.primary_concern, trade: targetTrade, district, language, learnerGender: targetGender,
  } : null;
  const matchingMentors = matchProfile ? rankMentors(matchProfile).filter(({ mentor }) => !seenMentors.includes(mentor.id)) : [];
  const mentor: MentorStory | null = matchingMentors[0]?.mentor ?? null;
  const alternateStory = showAnotherParentNote;
  const title = step === 'contact' && mentor ? `${t(language, 'talkParent')} ${mentor.name}` : t(language, titleCopyKey[step]);
  useEffect(() => { onTitle(title); }, [language, onTitle, title]);

  function goBack() {
    setError('');
    setShowAnotherParentNote(false);
    if (step === 'income') setStep('district');
    else if (step === 'class') setStep('income');
    else if (step === 'worry') setStep(initialInvitation ? 'welcome' : 'class');
    else if (step === 'understood') setStep('worry');
    else if (step === 'mentor') setStep('understood');
    else if (step === 'proof') setStep('mentor');
    else if (step === 'contact') setStep('decision');
    else if (step === 'decision') setStep('proof');
    else if (step === 'callback') setStep('decision');
    else setStep('welcome');
  }

  function readCard() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = `${t(language, 'familyCard')}. ${t(language, 'proofSection')}. ${selectedProof.rate}. ${selectedProof.pay}. ${t(language, 'childPath')}: ${['course', 'nsqf', 'diploma', 'degreePath'].map((key) => t(language, key as CopyKey)).join('. ')}. ${t(language, 'relativesLine')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  }

  function shareCard() {
    const message = `Bharosa Bond · ${t(language, 'localProof')}: ${selectedProof.rate} · ${selectedProof.pay}\n${t(language, 'childPath')}: ${['course', 'nsqf', 'diploma', 'degreePath'].map((key) => t(language, key as CopyKey)).join(' → ')}\n${district}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function selectConcern(selected: Concern) { setConcern(selected); setChipOverride(true); }

  async function classifyConcern() {
    const text = speech.text.trim();
    const localFallback = buildRuleAnalysis(text, language, concern);
    if (!text) {
      setAnalysis(buildRuleAnalysis('', language, concern));
      setConcern(concern);
      setAnalysisWasLocal(true);
      setError('');
      setSeenMentors([]);
      setActiveMentorId(null);
      setStep('understood');
      return;
    }
    setAnalysing(true);
    setError('');
    let result: ConcernAnalysis | null = null;
    try {
      const response = await fetch('/api/concern-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      if (!response.ok) throw new Error('Unavailable');
      const payload: unknown = await response.json();
      if (!isConcernAnalysis(payload)) throw new Error('Invalid result');
      result = applyExplicitRules(payload, text, language, concern);
      if (!result.one_line_summary.trim()) result.one_line_summary = localFallback.one_line_summary;
      if (chipOverride) {
        result.primary_concern = concern;
        result.one_line_summary = buildRuleAnalysis('', language, concern).one_line_summary;
        if (result.secondary_concern === concern) result.secondary_concern = null;
      }
      setAnalysisWasLocal(false);
    } catch {
      result = chipOverride
        ? { ...buildRuleAnalysis(text, language, concern), primary_concern: concern, one_line_summary: buildRuleAnalysis('', language, concern).one_line_summary }
        : localFallback;
      setAnalysisWasLocal(true);
    } finally {
      setAnalysing(false);
    }
    setAnalysis(result);
    if (result) setConcern(result.primary_concern);
    setChipOverride(false);
    setSeenMentors([]);
    setActiveMentorId(null);
    setShowAnotherParentNote(false);
    setStep('understood');
  }

  function matchReasonLine(current: MentorStory): string {
    if (!analysis) return '';
    const reasons: string[] = [];
    reasons.push(current.district === district ? flowText(language, 'sameDistrict') : flowText(language, 'nearbyDistrict', { district: current.district }));
    if (current.concern === analysis.primary_concern) reasons.push(flowText(language, 'sameConcern', { concern: t(language, worryCopyKey[current.concern]) }));
    if (targetTrade && current.trade === targetTrade) reasons.push(flowText(language, 'similarTrade', { trade: localizedTrade(language, current.trade) }));
    if (current.languages.includes(language)) reasons.push(flowText(language, 'languageStory', { language: current.languages.map((code) => languageLabels[code]).join(', ') }));
    if (targetGender && current.learnerGender === targetGender) reasons.push(flowText(language, 'genderMatch'));
    return `${flowText(language, 'matchIntro')} ${reasons.join(' · ')}`;
  }

  if (step === 'welcome') {
    return <ScreenFrame className="welcome-screen">
      <div className="welcome-layout"><div className="welcome-copy"><h1>{t(language, 'welcomeHeading')}</h1><p className="welcome-lede">{t(language, 'welcomeBody')}</p>
        <div className="welcome-language-block"><span className="eyebrow-label">{t(language, 'languagePrompt')}</span><div className="welcome-language-options">{(['mr', 'hi', 'en'] as Language[]).map((item) => <button key={item} type="button" aria-pressed={language === item} className={language === item ? 'welcome-language active' : 'welcome-language'} onClick={() => onLanguage(item)}>{languageLabels[item]}</button>)}</div></div>
        <div className="welcome-choices"><button className="role-button role-primary" type="button" onClick={() => setStep('district')}><span>{t(language, 'parentChoice')}</span><ArrowRight size={20} /></button><button className="role-button role-secondary" type="button" onClick={() => onAudienceChange('learner')}><span>{t(language, 'learnerChoice')}</span><ArrowRight size={20} /></button></div>
      </div><div className="welcome-illustration-wrap"><img src="/branding/family-at-table.webp" alt={t(language, 'welcomeFamilyAlt')} className="welcome-illustration" /><div className="welcome-illustration-caption"><span className="caption-rule" /><span>{t(language, 'welcomeCaption')}</span></div><div className="welcome-sticker"><span>1</span><p>{t(language, 'welcomeSticker')}</p></div></div></div>
    </ScreenFrame>;
  }

  if (step === 'district' || step === 'income' || step === 'class') {
    const stepMeta = step === 'district'
      ? { title: t(language, 'districtQuestion'), help: t(language, 'districtHelp'), options: districts.map((value) => ({ value, title: value, icon: MapPin })) }
      : step === 'income'
        ? { title: t(language, 'incomeQuestion'), help: t(language, 'incomeHelp'), options: incomeChoices.map(({ value, key, icon }) => ({ value, title: t(language, key), icon })) }
        : { title: t(language, 'classQuestion'), help: t(language, 'classHelp'), options: classChoices.map((key) => ({ value: key, title: t(language, key), icon: BookOpen })) };
    const activeValue = step === 'district' ? district : step === 'income' ? income : learnerClass;
    const updateValue = step === 'district'
      ? (value: string) => setDistrict(value as District)
      : step === 'income' ? setIncome : setLearnerClass;
    const profileIndex = step === 'district' ? 1 : step === 'income' ? 2 : 3;
    const advance: Step = step === 'district' ? 'income' : step === 'income' ? 'class' : 'worry';
    return <ScreenFrame className="journey-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /><span className="step-count-label">{t(language, 'stepLabel')} {profileIndex} {t(language, 'of')} 3</span></div><div className="question-progress"><span style={{ width: `${(profileIndex / 3) * 100}%` }} /></div>
      <section className="question-content"><span className="eyebrow-label">{t(language, 'quickProfile')}</span><h1>{stepMeta.title}</h1><p className="section-lede">{stepMeta.help}</p><div className={`choice-list ${step === 'district' ? 'district-choice-list' : ''}`}>{stepMeta.options.map(({ value, title: option, icon }) => <ChoiceButton key={value} icon={icon} active={activeValue === value} onClick={() => updateValue(value)}>{option}</ChoiceButton>)}</div>
        <div className="question-footer"><span className="privacy-note"><ShieldCheck size={16} /> {t(language, 'noStorage')}</span><button type="button" className="button-primary" disabled={!activeValue} onClick={() => setStep(advance)}>{t(language, 'next')} <ArrowRight size={18} /></button></div></section>
    </ScreenFrame>;
  }

  if (step === 'worry') {
    const displayConcern = speech.text.trim() && !chipOverride ? buildRuleAnalysis(speech.text, language, concern).primary_concern : concern;
    return <ScreenFrame className="journey-screen worry-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div>
      <section className="worry-layout"><div className="worry-copy"><span className="eyebrow-label">{t(language, 'speakWorry')}</span><h1>{t(language, 'worryPrompt')}</h1><p className="section-lede">{t(language, 'tapToTalk')}</p>
        {initialInvitation && <div className="invitation-prefill"><strong>{flowText(language, 'invitationPrefill', { name: initialInvitation.learnerName, trade: localizedTrade(language, initialInvitation.trade), district: initialInvitation.district, concern: t(language, worryCopyKey[initialInvitation.concern]) })}</strong></div>}
        <VoiceCapture language={language} controller={speechController} label={flowText(language, 'typedInputLabel')} placeholder={flowText(language, 'typedInputPlaceholder')} idleCopy={flowText(language, 'listenLive')} rows={3} />
        <p className="privacy-note"><ShieldCheck size={16} />{flowText(language, 'analysisPrivacy')}</p>
      </div><div className="worry-choice-side"><div className="worry-choice-heading"><span>{t(language, 'selectWorry')}</span><span className="choice-count">06</span></div><div className="worry-chip-list">{worryOptions.map(({ key, concern: value, icon: Icon }) => <button key={key} className={`worry-chip ${displayConcern === value ? 'selected' : ''}`} type="button" aria-pressed={displayConcern === value} onClick={() => selectConcern(value)}><Icon size={19} strokeWidth={2} />{t(language, key)}{displayConcern === value && <Check className="chip-check" size={15} />}</button>)}</div>
        {error && <p className="form-error" role="alert">{error}</p>}<button type="button" className="button-primary worry-continue" disabled={analysing} onClick={() => void classifyConcern()}>{analysing ? flowText(language, 'analysing') : t(language, 'next')} <ArrowRight size={18} /></button>
      </div></section></ScreenFrame>;
  }

  if (step === 'understood') {
    const result = analysis ?? buildRuleAnalysis('', language, concern);
    return <ScreenFrame className="journey-screen understood-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div><div className="understood-layout"><div className="understood-number">01</div><div className="understood-content"><span className="eyebrow-label">{t(language, 'weUnderstood')}</span><h1>{t(language, 'mainConcern')}</h1><div className="concern-card"><div className="concern-icon"><ShieldCheck size={27} /></div><div><strong>{t(language, worryCopyKey[result.primary_concern])}</strong><p>{result.one_line_summary}</p>{result.secondary_concern && <span className="secondary-concern-line">{flowText(language, 'secondaryConcern')}: {t(language, worryCopyKey[result.secondary_concern])}</span>}</div></div>
        {speech.text.trim() && <blockquote className="heard-quote">“{speech.text.trim()}”</blockquote>}{result.key_phrases.length > 0 && <div className="key-phrase-list" aria-label={flowText(language, 'keyPhrases')}>{result.key_phrases.map((phrase) => <mark key={phrase}>{phrase}</mark>)}</div>}{analysisWasLocal && <p className="local-analysis-note">{flowText(language, 'analysisError')}</p>}
        <button className="button-primary" type="button" onClick={() => { setConcern(result.primary_concern); setStep('mentor'); }}>{t(language, 'yesRight')} <ArrowRight size={18} /></button><button type="button" className="text-button not-quite" onClick={() => setStep('worry')}>{t(language, 'notQuite')}</button>
      </div><div className="understood-note"><span className="note-line" />{flowText(language, 'analysisPrivacy')}</div></div></ScreenFrame>;
  }

  if (step === 'mentor') {
    return <ScreenFrame className="journey-screen mentor-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /><span className="step-count-label">{flowText(language, 'storyOne')} {Math.min(seenMentors.length + 1, mentors.length)} {flowText(language, 'storyOf')} {mentors.length}</span></div>
      {mentor ? <section className="mentor-layout mentor-story-layout"><div className="mentor-story-main"><StoryPlayer key={mentor.id} language={language} mentor={mentor} onDecision={(helped) => {
        setSeenMentors((items) => items.includes(mentor.id) ? items : [...items, mentor.id]);
        if (helped) { setActiveMentorId(mentor.id); setStep('proof'); }
        else setShowAnotherParentNote(true);
      }} />{alternateStory && <p className="alternate-story-line">{t(language, 'anotherParent')}</p>}</div>
        <div className="mentor-detail"><span className="eyebrow-label">{t(language, 'meetParent')}</span><h1>{mentor.name}<span className="mentor-village">{mentor.village}, {mentor.district}</span></h1><div className="mentor-tags"><span className="same-worry-tag"><HeartHandshake size={15} />{flowText(language, 'sameConcern', { concern: t(language, worryCopyKey[analysis?.primary_concern ?? concern]) })}</span><span className="verified-tag"><BadgeCheck size={15} />{t(language, 'verified')}</span></div><p className="mentor-one-line">{mentor.story[language].line}</p><p className="mentor-company">{mentor.learnerDescription}</p><p className="mentor-match-reasons">{matchReasonLine(mentor)}</p><div className="mentor-language"><span>{t(language, 'language')}</span><strong>{mentor.languages.map((code) => languageLabels[code]).join(', ')}</strong></div></div>
      </section> : <section className="no-more-stories"><span className="eyebrow-label">{t(language, 'meetParent')}</span><h1>{flowText(language, 'noMoreMentors')}</h1><button className="button-primary" type="button" onClick={() => setStep('decision')}>{t(language, 'familyCard')} <ArrowRight size={18} /></button><button className="button-outline" type="button" onClick={() => setStep('callback')}>{flowText(language, 'counsellorNext')}</button></section>}
    </ScreenFrame>;
  }

  if (step === 'proof') {
    const proofTrade = (activeMentorId ? mentors.find((item) => item.id === activeMentorId)?.trade : null) ?? analysis?.trade_mentioned ?? initialInvitation?.trade ?? 'Electrician';
    return <ScreenFrame className="journey-screen proof-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div><section className="proof-layout"><div className="proof-intro"><span className="eyebrow-label">{district} · {localizedTrade(language, proofTrade)}</span><h1>{t(language, 'localProof')}</h1><p className="section-lede">{t(language, 'proofCaveat')}</p></div><div className="proof-card"><div className="proof-card-top"><span className="proof-badge"><Check size={15} /> {t(language, 'verified')}</span><span className="proof-card-id">BB / 07</span></div><div className="proof-numbers"><div><span className="eyebrow-label">{t(language, 'placementRate')}</span><strong>{selectedProof.rate}</strong><span>{t(language, 'placementLearnerCountLabel')}</span></div><div><span className="eyebrow-label">{t(language, 'startingPay')}</span><strong>{selectedProof.pay}</strong><span>{t(language, 'perMonth')}</span></div></div><div className="proof-detail-row"><span>{t(language, 'provider')}</span><strong>{selectedProof.provider}</strong></div><div className="proof-detail-row"><span>{t(language, 'sourceDate')}</span><strong>{selectedProof.date}</strong></div><div className="proof-foot"><MapPin size={16} /><span>{district}, Maharashtra</span><span className="proof-reliability">{t(language, 'localExample')}</span></div></div><button type="button" className="button-primary proof-next" onClick={() => setStep('contact')}>{t(language, 'talkParent')} <ArrowRight size={18} /></button></section></ScreenFrame>;
  }

  if (step === 'contact') {
    const contactMentor = (activeMentorId ? mentors.find((item) => item.id === activeMentorId) : null) ?? mentor ?? mentors.find((item) => seenMentors.includes(item.id)) ?? mentors[0];
    return <ScreenFrame className="journey-screen contact-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div><ContactForm language={language} mentorName={contactMentor.name} contactId={contactMentor.id} onNotNow={() => setStep('decision')} /></ScreenFrame>;
  }

  if (step === 'decision') {
    return <ScreenFrame className="journey-screen decision-screen"><div className="journey-heading-row no-print"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div><div className="decision-layout"><div className="decision-intro no-print"><span className="eyebrow-label">{t(language, 'familyCard')}</span><h1>{t(language, 'familyCard')}</h1><p className="section-lede">{t(language, 'relativesLine')}</p></div><FamilyDecisionCard language={language} district={district} proof={selectedProof} onListen={readCard} onShare={shareCard} /><div className="counsellor-strip no-print"><div><span className="eyebrow-label">{t(language, 'counsellorTitle')}</span><p>{t(language, 'counsellorBody')}</p></div><button className="button-outline" type="button" onClick={() => setStep('callback')}>{t(language, 'requestCall')} <Clock3 size={17} /></button></div></div></ScreenFrame>;
  }

  if (step === 'callback') {
    return <ScreenFrame className="journey-screen callback-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={screenProgress[step]} /></div><ContactForm language={language} mentorName={flowText(language, 'counsellor')} contactId="counsellor" isCounsellor onNotNow={() => setStep('decision')} /></ScreenFrame>;
  }

  return null;
}
