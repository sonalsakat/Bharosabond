import { useState, type FormEvent } from 'react';
import { ArrowRight, BadgeCheck, Check, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { mentorContacts } from './mentorContacts';
import { flowText } from './flowCopy';
import type { Language } from './i18n';

const slots = ['morningSlot', 'afternoonSlot', 'eveningSlot'] as const;
type Props = { language: Language; mentorName: string; contactId: string; isCounsellor?: boolean; onNotNow: () => void };

export function ContactForm({ language, mentorName, contactId, isCounsellor = false, onNotNow }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(language);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const target = mentorContacts[contactId] ?? mentorContacts.counsellor;
  const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
  const dialHref = `tel:${target.phoneDigits}`;
  const slotLabel = slot ? flowText(preferredLanguage, slot as typeof slots[number]) : '';
  const languageLabel = preferredLanguage === 'mr' ? 'मराठी' : preferredLanguage === 'hi' ? 'हिंदी' : 'English';
  const message = preferredLanguage === 'mr'
    ? `नमस्कार ${mentorName}, माझे नाव ${name.trim()} आहे. माझा फोन क्रमांक ${cleanPhone} आहे. कृपया ${slotLabel} या वेळेत मला फोन करा. मला ${languageLabel} भाषेत बोलायला आवडेल.`
    : preferredLanguage === 'hi'
      ? `नमस्ते ${mentorName}, मेरा नाम ${name.trim()} है। मेरा फ़ोन नंबर ${cleanPhone} है। कृपया ${slotLabel} के समय मुझे कॉल करें। मैं ${languageLabel} में बात करना चाहूँगा/चाहूँगी।`
      : `Hello ${mentorName}, my name is ${name.trim()} and my number is ${cleanPhone}. Please call me during ${slotLabel}. My preferred language is ${languageLabel}.`;
  const whatsAppHref = `https://wa.me/${target.whatsappDigits}?text=${encodeURIComponent(message)}`;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError(flowText(language, 'nameNeeded')); return; }
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) { setError(flowText(language, 'phoneInvalid')); return; }
    if (!slot) { setError(flowText(language, 'timeNeeded')); return; }
    if (!consent) { setError(flowText(language, 'consentNeeded')); return; }
    setError('');
    setReady(true);
  }

  return <section className="contact-request-layout">
    <div className="contact-request-intro"><span className="eyebrow-label">{isCounsellor ? flowText(language, 'counsellor') : flowText(language, 'mentorContact', { name: mentorName })}</span><h1>{flowText(language, 'contactAsk', { name: mentorName })}</h1><p className="section-lede">{flowText(language, 'contactIntro', { name: mentorName })}</p></div>
    {!ready ? <form className="contact-request-form" onSubmit={submit} noValidate>
      <label className="form-field"><span>{flowText(language, 'parentName')}</span><input autoComplete="name" maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder={flowText(language, 'parentNamePlaceholder')} /></label>
      <label className="form-field"><span>{flowText(language, 'mobileNumber')}</span><input inputMode="numeric" type="tel" autoComplete="tel-national" maxLength={10} pattern="[6-9][0-9]{9}" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={flowText(language, 'mobilePlaceholder')} /></label>
      <fieldset className="contact-time-fieldset"><legend>{flowText(language, 'preferredCallTime')}</legend><div className="contact-time-options">{slots.map((key) => <label className={slot === key ? 'contact-time-option selected' : 'contact-time-option'} key={key}><input type="radio" name="contact-time" value={key} checked={slot === key} onChange={() => { setSlot(key); setError(''); }} /><span>{flowText(language, key)}</span>{slot === key && <Check size={16} />}</label>)}</div></fieldset>
      <label className="form-field"><span>{flowText(language, 'preferredLanguage')}</span><select value={preferredLanguage} onChange={(event) => setPreferredLanguage(event.target.value as Language)}><option value="mr">मराठी</option><option value="hi">हिंदी</option><option value="en">English</option></select></label>
      <label className="contact-consent"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setError(''); }} /><span>{flowText(language, 'consentStart')} <strong>{mentorName}</strong> {flowText(language, 'consentEnd')}</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="contact-local-note"><ShieldCheck size={16} />{flowText(language, 'detailsLocal')}</p>
      <button className="button-primary contact-submit" type="submit">{flowText(language, 'requestMentorCall')} <ArrowRight size={18} /></button>
      <button className="text-button contact-not-now" type="button" onClick={onNotNow}>{flowText(language, 'notNow')}</button>
    </form> : <div className="contact-ready-card" role="status">
      <div className="contact-ready-mark"><Check size={24} /></div><p className="contact-ready-confirmation">{flowText(language, 'callConfirmation', { name: mentorName, slot: flowText(language, slot as typeof slots[number]) })}</p>
      <div className="contact-person-card"><span className="contact-avatar">{mentorName.slice(0, 1)}</span><span><strong>{flowText(language, 'mentorContact', { name: mentorName })}</strong><small>{flowText(language, 'preferredLanguage')}: {preferredLanguage === 'mr' ? 'मराठी' : preferredLanguage === 'hi' ? 'हिंदी' : 'English'}</small></span><BadgeCheck size={18} /></div>
      <div className="contact-actions"><a className="button-primary" href={dialHref}><Phone size={18} />{flowText(language, 'call')}</a><a className="button-outline" href={whatsAppHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />{flowText(language, 'whatsapp')}</a></div>
      <p className="consent-note"><ShieldCheck size={17} />{flowText(language, 'contactShared')}</p><p className="contact-dispatch-note">{flowText(language, 'callNoDispatch')}</p>
      <button type="button" className="text-button contact-not-now" onClick={onNotNow}>{flowText(language, 'notNow')}</button>
    </div>}
  </section>;
}
