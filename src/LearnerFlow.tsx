import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, BookOpen, Check, Clipboard, Hammer, Lightbulb, MapPin, MessageCircle, Monitor, Ruler, ShieldCheck, Trees, UsersRound, Wrench, Zap } from 'lucide-react';
import { BackButton, ProgressDots, ScreenFrame } from './components';
import { ContactForm } from './ContactForm';
import { flowText } from './flowCopy';
import { createFamilyInviteUrl } from './familyInvitation';
import { interestsFromWords, rankTrainingTrades, fitPercentage, type LearnerInterestId, type QuizAnswerId, type RecommendationProfile, type SchoolSubjectId } from './matching';
import { tradeFacts, providersByDistrict, tradeNames, districtNames, salaryMethodNote, type DistrictName } from './trainingData';
import { useSpeechInput } from './useSpeechInput';
import { VoiceCapture } from './VoiceCapture';
import { t, type Language } from './i18n';
import type { Concern } from './concernAnalysis';

type MainStep = 'profile' | 'enjoy' | 'quiz' | 'matches' | 'parents' | 'invite' | 'myPath' | 'contact';
type QuizQuestion = { key: 'quizQ1' | 'quizQ2' | 'quizQ3' | 'quizQ4' | 'quizQ5'; answers: [{ label: 'quizA1a' | 'quizA2a' | 'quizA3a' | 'quizA4a' | 'quizA5a'; id: QuizAnswerId; icon: typeof Wrench }, { label: 'quizA1b' | 'quizA2b' | 'quizA3b' | 'quizA4b' | 'quizA5b'; id: QuizAnswerId; icon: typeof Wrench }] };
const qualifications = ['8th', '10th', '12th', 'ITI', 'Graduate'] as const;
const subjectOptions: { id: SchoolSubjectId; key: 'subjectMaths' | 'subjectScience' | 'subjectComputers' | 'subjectArt' | 'subjectLanguages' | 'subjectPractical'; icon: typeof Wrench }[] = [
  { id: 'maths', key: 'subjectMaths', icon: Ruler }, { id: 'science', key: 'subjectScience', icon: Lightbulb }, { id: 'computers', key: 'subjectComputers', icon: Monitor }, { id: 'art', key: 'subjectArt', icon: Ruler }, { id: 'languages', key: 'subjectLanguages', icon: BookOpen }, { id: 'practical', key: 'subjectPractical', icon: Wrench },
];
const interestOptions: { id: LearnerInterestId; key: 'interestFixing' | 'interestElectricity' | 'interestBuilding' | 'interestVehicles' | 'interestComputers' | 'interestHelping' | 'interestOutdoors' | 'interestDesign'; icon: typeof Wrench }[] = [
  { id: 'fixing', key: 'interestFixing', icon: Wrench }, { id: 'electricity', key: 'interestElectricity', icon: Zap }, { id: 'building', key: 'interestBuilding', icon: Hammer }, { id: 'vehicles', key: 'interestVehicles', icon: Wrench }, { id: 'computers', key: 'interestComputers', icon: Monitor }, { id: 'helping', key: 'interestHelping', icon: UsersRound }, { id: 'outdoors', key: 'interestOutdoors', icon: Trees }, { id: 'design', key: 'interestDesign', icon: Ruler },
];
const quiz: QuizQuestion[] = [
  { key: 'quizQ1', answers: [{ label: 'quizA1a', id: 'light', icon: Lightbulb }, { label: 'quizA1b', id: 'metal', icon: Hammer }] },
  { key: 'quizQ2', answers: [{ label: 'quizA2a', id: 'fault', icon: Zap }, { label: 'quizA2b', id: 'pipe', icon: Wrench }] },
  { key: 'quizQ3', answers: [{ label: 'quizA3a', id: 'hands', icon: Hammer }, { label: 'quizA3b', id: 'screen', icon: Monitor }] },
  { key: 'quizQ4', answers: [{ label: 'quizA4a', id: 'site', icon: MapPin }, { label: 'quizA4b', id: 'workshop', icon: Lightbulb }] },
  { key: 'quizQ5', answers: [{ label: 'quizA5a', id: 'problem', icon: Wrench }, { label: 'quizA5b', id: 'service', icon: UsersRound }] },
];
const worries: { id: Concern; key: 'parentWorryPay' | 'parentWorrySafety' | 'parentWorryDegree' | 'parentWorryCost' | 'parentWorryRespect' | 'parentWorryGirls' }[] = [
  { id: 'Low pay', key: 'parentWorryPay' }, { id: 'Safety', key: 'parentWorrySafety' }, { id: 'Degree is better', key: 'parentWorryDegree' }, { id: 'Cost', key: 'parentWorryCost' }, { id: 'Respect', key: 'parentWorryRespect' }, { id: "Girls' safety", key: 'parentWorryGirls' },
];
const tradeReasons: Record<Language, Record<(typeof tradeNames)[number], string>> = {
  en: { Electrician: 'Electrical work includes safe wiring and finding faults.', Welder: 'Welding joins metal parts and checks each joint.', Plumber: 'Plumbing brings water through pipes and prevents leaks.' },
  mr: { Electrician: 'इलेक्ट्रिकल कामात सुरक्षित वायरिंग आणि बिघाड शोधणे येते.', Welder: 'वेल्डिंगमध्ये धातूचे भाग जोडून प्रत्येक जोड तपासतात.', Plumber: 'प्लंबिंगमध्ये पाईपमधून पाणी नेणे आणि गळती थांबवणे येते.' },
  hi: { Electrician: 'इलेक्ट्रिकल काम में सुरक्षित वायरिंग और खराबी ढूँढना शामिल है।', Welder: 'वेल्डिंग में धातु के हिस्से जोड़कर हर जोड़ जाँचा जाता है।', Plumber: 'प्लंबिंग में पाइप से पानी पहुँचाना और रिसाव रोकना शामिल है।' },
};
const interestLabels: Record<LearnerInterestId, { en: string; mr: string; hi: string }> = {
  fixing: { en: 'fixing things', mr: 'वस्तू दुरुस्ती', hi: 'चीज़ें ठीक करना' }, electricity: { en: 'electricity', mr: 'वीज', hi: 'बिजली' }, building: { en: 'building', mr: 'बांधकाम', hi: 'निर्माण' }, vehicles: { en: 'vehicles', mr: 'वाहने', hi: 'गाड़ियाँ' }, computers: { en: 'computers', mr: 'संगणक', hi: 'कंप्यूटर' }, helping: { en: 'helping people', mr: 'लोकांना मदत', hi: 'लोगों की मदद' }, outdoors: { en: 'outdoor work', mr: 'बाहेरचे काम', hi: 'बाहर का काम' }, design: { en: 'design', mr: 'रचना', hi: 'डिज़ाइन' },
};

function ToggleChoice({ active, icon: Icon, children, onClick }: { active: boolean; icon: typeof Wrench; children: ReactNode; onClick: () => void }) {
  return <button type="button" className={`choice-button ${active ? 'selected' : ''}`} aria-pressed={active} onClick={onClick}><Icon size={20} strokeWidth={2} /><span>{children}</span><span className="choice-check">{active && <Check size={16} />}</span></button>;
}
function localizedInterest(id: LearnerInterestId, language: Language) { return interestLabels[id][language]; }
function matchFitReason(language: Language, trade: (typeof tradeNames)[number], interests: LearnerInterestId[], spoken: LearnerInterestId[], quizAnswers: QuizAnswerId[], subjects: SchoolSubjectId[]) {
  const activityLabels = [...new Set([...interests, ...spoken])].map((id) => localizedInterest(id, language));
  const quizLabels = quiz.flatMap((question) => question.answers).filter((answer) => quizAnswers.includes(answer.id)).map((answer) => flowText(language, answer.label));
  const subjectLabels = subjectOptions.filter((subject) => subjects.includes(subject.id)).map((subject) => flowText(language, subject.key));
  const evidence = activityLabels.length ? activityLabels : quizLabels.length ? quizLabels : subjectLabels;
  if (!evidence.length) return flowText(language, 'quizDescription');
  const items = evidence.slice(0, 3).join(', ');
  const detail = tradeReasons[language][trade];
  if (language === 'mr') return `तुम्ही ${items} निवडले. ${detail}`;
  if (language === 'hi') return `आपने ${items} चुना। ${detail}`;
  return `You chose ${items}. ${detail}`;
}

export function LearnerFlow({ language, onTitle }: { language: Language; onTitle: (text: string) => void }) {
  const [step, setStep] = useState<MainStep>('profile');
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState<(typeof qualifications)[number] | ''>('');
  const [district, setDistrict] = useState<DistrictName>('Pune');
  const [subjects, setSubjects] = useState<SchoolSubjectId[]>([]);
  const [interests, setInterests] = useState<LearnerInterestId[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswerId[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelection, setQuizSelection] = useState<QuizAnswerId | null>(null);
  const [worry, setWorry] = useState<Concern>('Safety');
  const [link, setLink] = useState('');
  const [notice, setNotice] = useState('');
  const speech = useSpeechInput(language);
  const speechInterests = useMemo(() => interestsFromWords(speech.text), [speech.text]);
  const profile: RecommendationProfile = { interests, subjects, quizAnswers, spokenInterests: speechInterests };
  const matches = useMemo(() => rankTrainingTrades(profile), [interests, subjects, quizAnswers, speechInterests]);
  const quizPreviewProfile: RecommendationProfile = { interests, subjects, quizAnswers: quizSelection ? [...quizAnswers, quizSelection] : quizAnswers, spokenInterests: speechInterests };
  const quizPreviewMatches = useMemo(() => rankTrainingTrades(quizPreviewProfile), [interests, subjects, quizAnswers, quizSelection, speechInterests]);
  const mainIndex: Record<MainStep, number> = { profile: 1, enjoy: 2, quiz: 2, matches: 3, parents: 4, invite: 5, myPath: 6, contact: 6 };
  const title = step === 'profile' ? flowText(language, 'aboutYou') : step === 'enjoy' || step === 'quiz' ? flowText(language, 'whatEnjoy') : step === 'matches' ? flowText(language, 'bestTrades') : step === 'parents' ? flowText(language, 'parentsAgree') : step === 'invite' ? flowText(language, 'inviteParents') : step === 'contact' ? flowText(language, 'counsellor') : flowText(language, 'myPath');
  useEffect(() => { onTitle(title); }, [onTitle, title]);

  function toggleSubject(id: SchoolSubjectId) { setSubjects((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  function toggleInterest(id: LearnerInterestId) { setInterests((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  function startQuiz() { setQuizAnswers([]); setQuizIndex(0); setQuizSelection(null); setStep('quiz'); }
  function nextQuiz() {
    if (!quizSelection) return;
    const answers = [...quizAnswers, quizSelection];
    setQuizAnswers(answers);
    if (quizIndex + 1 >= quiz.length) { setStep('matches'); return; }
    setQuizIndex((value) => value + 1);
    setQuizSelection(null);
  }
  function prepareInvite() {
    const trade = matches[0]?.trade ?? 'Electrician';
    const profileLink = createFamilyInviteUrl({ learnerName: name, trade, district, concern: worry, language, learnerGender: null, qualification: '' }, window.location.origin);
    setLink(profileLink);
    setNotice('');
    setStep('invite');
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setNotice(flowText(language, 'linkCopied')); }
    catch { const input = document.querySelector<HTMLInputElement>('#family-invite-link'); input?.select(); setNotice(flowText(language, 'copyInvite')); }
  }
  const message = `${flowText(language, 'inviteMessage', { trade: matches[0]?.trade ?? 'Electrician', district })}\n${link}`;
  function shareInvite() { window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); }
  function goBack() {
    if (step === 'contact') setStep('myPath');
    else if (step === 'quiz') setStep('enjoy');
    else if (step === 'profile') { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }
    else if (step === 'enjoy') setStep('profile');
    else if (step === 'matches') setStep('enjoy');
    else if (step === 'parents') setStep('matches');
    else if (step === 'invite') setStep('parents');
    else if (step === 'myPath') setStep('invite');
  }
  if (step === 'contact') return <ScreenFrame className="learner-screen"><div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={6} total={6} /></div><ContactForm language={language} mentorName={flowText(language, 'counsellor')} contactId="counsellor" isCounsellor onNotNow={() => setStep('myPath')} /></ScreenFrame>;

  return <ScreenFrame className={`learner-screen learner-${step}`}>
    <div className="journey-heading-row"><BackButton language={language} onClick={goBack} /><ProgressDots current={mainIndex[step]} total={6} /><span className="learner-stage-label">{flowText(language, step === 'myPath' ? 'myPath' : step === 'matches' ? 'bestTrades' : step === 'invite' ? 'inviteParents' : step === 'parents' ? 'parentsAgree' : step === 'enjoy' || step === 'quiz' ? 'whatEnjoy' : 'aboutYou')}</span></div>
    {step === 'profile' && <section className="learner-section learner-profile-section"><div className="learner-section-heading"><span className="eyebrow-label">01 / {flowText(language, 'aboutYou')}</span><h1>{flowText(language, 'learnerTitle')}</h1><p className="section-lede">{flowText(language, 'learnerIntro')}</p></div><div className="learner-profile-form">
      <label className="form-field"><span>{flowText(language, 'learnerName')}</span><input autoComplete="given-name" maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder={flowText(language, 'learnerNamePlaceholder')} /></label>
      <label className="form-field"><span>{flowText(language, 'qualification')}</span><select value={qualification} onChange={(event) => setQualification(event.target.value as typeof qualification)}><option value="">{flowText(language, 'selectOne')}</option>{qualifications.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="form-field"><span>{flowText(language, 'district')}</span><select value={district} onChange={(event) => setDistrict(event.target.value as DistrictName)}>{districtNames.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </div><div className="learner-option-heading"><h2>{flowText(language, 'subjects')}</h2></div><div className="learner-choice-list">{subjectOptions.map(({ id, key, icon }) => <ToggleChoice key={id} active={subjects.includes(id)} icon={icon} onClick={() => toggleSubject(id)}>{flowText(language, key)}</ToggleChoice>)}</div><button type="button" className="button-primary learner-next" disabled={!name.trim() || !qualification} onClick={() => setStep('enjoy')}>{flowText(language, 'continue')} <ArrowRight size={18} /></button></section>}

    {step === 'enjoy' && <section className="learner-section"><div className="learner-section-heading"><span className="eyebrow-label">02 / {flowText(language, 'whatEnjoy')}</span><h1>{flowText(language, 'enjoyPrompt')}</h1><p className="section-lede">{flowText(language, 'voiceOrTap')}</p></div><div className="learner-interest-layout"><div><VoiceCapture language={language} controller={speech} label={flowText(language, 'typedInputLabel')} placeholder={flowText(language, 'typedInputPlaceholder')} idleCopy={flowText(language, 'listenLive')} rows={2} /><div className="learner-interest-actions"><button type="button" className="button-outline" onClick={startQuiz}><Lightbulb size={17} />{flowText(language, 'quizStart')}</button><button type="button" className="button-primary" disabled={!interests.length && !speech.text.trim()} onClick={() => setStep('matches')}>{flowText(language, 'continue')} <ArrowRight size={18} /></button></div></div><div className="learner-interest-side"><h2>{flowText(language, 'interests')}</h2><div className="learner-choice-list">{interestOptions.map(({ id, key, icon }) => <ToggleChoice key={id} active={interests.includes(id)} icon={icon} onClick={() => toggleInterest(id)}>{flowText(language, key)}</ToggleChoice>)}</div></div></div><p className="learner-privacy-line"><ShieldCheck size={16} />{flowText(language, 'detailsLocal')}</p></section>}

    {step === 'quiz' && <section className="learner-section learner-quiz-section"><div className="learner-section-heading"><span className="eyebrow-label">02 / {flowText(language, 'quizTitle')}</span><h1>{flowText(language, quiz[quizIndex].key)}</h1><p className="section-lede">{flowText(language, 'quizProgress', { current: quizIndex + 1 })}</p></div><div className="quiz-answer-grid">{quiz[quizIndex].answers.map(({ label, id, icon }) => <ToggleChoice key={id} active={quizSelection === id} icon={icon} onClick={() => setQuizSelection(id)}>{flowText(language, label)}</ToggleChoice>)}</div><section className="quiz-live-scores" aria-live="polite"><h2>{flowText(language, 'liveMatchScores')}</h2>{quizPreviewMatches.map((match) => { const tradeKey = match.trade === 'Electrician' ? 'electrician' : match.trade === 'Welder' ? 'welder' : 'plumber'; const score = fitPercentage(match, quizPreviewProfile); const scoreLabel = flowText(language, 'fitScore', { score }); return <div className="quiz-live-score-row" key={match.trade}><span>{t(language, tradeKey)}</span><div className="quiz-live-score-meter" role="progressbar" aria-label={scoreLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><span style={{ width: `${score}%` }} /></div><strong>{score}%</strong></div>; })}<p>{flowText(language, 'scoreExplanation')}</p></section><div className="quiz-bottom-actions"><button type="button" className="text-button" onClick={() => setStep('enjoy')}>{flowText(language, 'skipQuiz')}</button><button type="button" className="button-primary" disabled={!quizSelection} onClick={nextQuiz}>{quizIndex === quiz.length - 1 ? flowText(language, 'quizFinish') : flowText(language, 'quizNext')} <ArrowRight size={18} /></button></div></section>}

    {step === 'matches' && <section className="learner-section learner-results-section"><div className="learner-section-heading"><span className="eyebrow-label">03 / {flowText(language, 'bestTrades')}</span><h1>{flowText(language, 'bestTrades')}</h1><p className="section-lede">{flowText(language, 'learnerIntro')}</p></div><div className="trade-match-list">{matches.map((match, index) => {
      const fact = tradeFacts[match.trade];
      const provider = providersByDistrict[district][match.trade];
      const tradeKey = match.trade === 'Electrician' ? 'electrician' : match.trade === 'Welder' ? 'welder' : 'plumber';
      const fitScore = fitPercentage(match, profile);
      const fitReason = matchFitReason(language, match.trade, interests, speechInterests, quizAnswers, subjects);
      return <article className={`trade-match-card ${index === 0 ? 'best-match' : ''}`} key={match.trade}><div className="trade-match-header"><div><span className="eyebrow-label">{index === 0 ? flowText(language, 'bestTrades') : flowText(language, 'fit')}</span><h2>{t(language, tradeKey)}</h2></div><div className="fit-indicator"><span>{flowText(language, 'fitScore', { score: fitScore })}</span><i role="progressbar" aria-label={flowText(language, 'fitScore', { score: fitScore })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={fitScore}><b style={{ width: `${fitScore}%` }} /></i></div></div><p className="trade-fit-reason">{fitReason}</p><div className="trade-facts-grid"><div><h3>{flowText(language, 'whatJob')}</h3><p>{fact.description[language]}</p></div><div><h3>{flowText(language, 'dayInLife')}</h3><p>{fact.typicalDay[language]}</p></div><div><h3>{flowText(language, 'trainingDuration')}</h3><p>{fact.duration[language]}</p><a href={fact.durationSourceUrl} target="_blank" rel="noreferrer">{fact.durationSourceTitle} · {fact.durationSourceDate}</a></div><div><h3>{flowText(language, 'costOrStipend')}</h3><p>{provider.feeOrStipend[language]}</p>{provider.feeSourceUrl && <a href={provider.feeSourceUrl} target="_blank" rel="noreferrer">{provider.sourceTitle}</a>}</div><div><h3>{flowText(language, 'startingEarnings')}</h3><strong>{fact.earningsRange}</strong><p>{flowText(language, 'perMonth')} · {salaryMethodNote[language]}</p><a href={fact.earningsSourceUrl} target="_blank" rel="noreferrer">{fact.earningsSourceTitle} · {fact.earningsDate}</a></div><div><h3>{flowText(language, 'verifiedProvider')}</h3><strong>{provider.name}</strong><p>{provider.location}</p><p>{provider.entryEvidence}</p>{!provider.currentOfferingVerified && <p className="learner-eligibility provider-course-warning"><ShieldCheck size={16} />{flowText(language, 'providerCourseNotConfirmed')}</p>}<a href={provider.sourceUrl} target="_blank" rel="noreferrer">{provider.sourceTitle} · {provider.sourceDate}</a></div></div><div className="nsqf-ladder"><strong>{flowText(language, 'nsqfPath')}</strong><span>{flowText(language, 'course')}</span><ArrowRight size={14} /><span>{flowText(language, 'nsqfLevel')}</span><ArrowRight size={14} /><span>{flowText(language, 'diploma')}</span><ArrowRight size={14} /><span>{flowText(language, 'degree')}</span></div></article>;
    })}</div><p className="learner-score-note">{flowText(language, 'scoreExplanation')}</p><p className="learner-eligibility"><ShieldCheck size={16} />{flowText(language, 'eligibilityNote')}</p><button type="button" className="button-primary learner-next" onClick={() => setStep('parents')}>{flowText(language, 'continue')} <ArrowRight size={18} /></button></section>}

    {step === 'parents' && <section className="learner-section"><div className="learner-section-heading"><span className="eyebrow-label">04 / {flowText(language, 'parentsAgree')}</span><h1>{flowText(language, 'parentsAgree')}</h1><p className="section-lede">{flowText(language, 'chooseWorry')}</p></div><div className="parent-worry-grid">{worries.map(({ id, key }) => <button key={id} type="button" className={worry === id ? 'parent-worry-option selected' : 'parent-worry-option'} aria-pressed={worry === id} onClick={() => setWorry(id)}><span>{flowText(language, key)}</span>{worry === id && <Check size={16} />}</button>)}</div><div className="learner-talking-points"><h2>{flowText(language, 'talkingPoints')}</h2><ol><li>{flowText(language, 'talkingPointPath')}</li><li>{flowText(language, 'talkingPointWork')}</li><li>{flowText(language, 'talkingPointInterest')}</li></ol></div><button type="button" className="button-primary learner-next" onClick={prepareInvite}>{flowText(language, 'inviteParents')} <ArrowRight size={18} /></button></section>}

    {step === 'invite' && <section className="learner-section learner-invite-section"><div className="learner-section-heading"><span className="eyebrow-label">05 / {flowText(language, 'inviteParents')}</span><h1>{flowText(language, 'inviteParents')}</h1><p className="section-lede">{flowText(language, 'inviteExplain')}</p></div><div className="invite-summary-strip"><span>{name}</span><span>{matches[0]?.trade}</span><span>{district}</span><span>{flowText(language, worries.find((item) => item.id === worry)?.key ?? 'parentWorrySafety')}</span></div><label className="invite-link-label" htmlFor="family-invite-link">{flowText(language, 'copyInvite')}</label><input id="family-invite-link" className="invite-link-input" readOnly value={link} /><div className="invite-buttons"><button type="button" className="button-outline" onClick={copyLink}><Clipboard size={17} />{flowText(language, 'copyInvite')}</button><button type="button" className="button-primary" onClick={shareInvite}><MessageCircle size={17} />{flowText(language, 'shareParents')}</button></div>{notice && <p className="invite-feedback" role="status">{notice}</p>}<button type="button" className="button-primary learner-next" onClick={() => setStep('myPath')}>{flowText(language, 'myPath')} <ArrowRight size={18} /></button></section>}

    {step === 'myPath' && <section className="learner-section learner-path-section"><div className="learner-section-heading"><span className="eyebrow-label">06 / {flowText(language, 'myPath')}</span><h1>{flowText(language, 'learnerCard')}</h1></div><article className="learner-path-card"><div className="learner-path-card-head"><div className="learner-path-monogram">{name.slice(0, 1).toUpperCase()}</div><div><span className="eyebrow-label">{flowText(language, 'learnerCard')}</span><h2>{name}</h2><p>{qualification} · {district}</p></div></div><div className="learner-path-trades"><h3>{flowText(language, 'bestTrades')}</h3>{matches.map((match, index) => <div className="learner-path-trade" key={match.trade}><span>0{index + 1}</span><strong>{match.trade}</strong><span>{index === 0 ? flowText(language, 'fit') : ''}</span></div>)}</div><div className="learner-path-next"><h3>{flowText(language, 'nextSteps')}</h3><div className="nsqf-ladder"><span>{flowText(language, 'course')}</span><ArrowRight size={14} /><span>{flowText(language, 'nsqfLevel')}</span><ArrowRight size={14} /><span>{flowText(language, 'diploma')}</span><ArrowRight size={14} /><span>{flowText(language, 'degree')}</span></div></div><p className="learner-path-invite-note">{flowText(language, 'inviteExplain')}</p></article><button type="button" className="button-primary learner-next" onClick={() => setStep('contact')}>{flowText(language, 'counsellor')} <ArrowRight size={18} /></button><button type="button" className="text-button learner-restart" onClick={() => { setStep('profile'); setName(''); setSubjects([]); setInterests([]); setQuizAnswers([]); speech.setText(''); }}>{flowText(language, 'startOver')}</button></section>}
  </ScreenFrame>;
}
