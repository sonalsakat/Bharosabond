import { Mic } from 'lucide-react';
import type { CSSProperties } from 'react';
import { flowText } from './flowCopy';
import type { Language } from './i18n';
import type { useSpeechInput } from './useSpeechInput';

type SpeechState = ReturnType<typeof useSpeechInput>;
type Props = {
  language: Language;
  controller: SpeechState;
  label: string;
  placeholder: string;
  idleCopy: string;
  disabled?: boolean;
  rows?: number;
};

export function VoiceCapture({ language, controller, label, placeholder, idleCopy, disabled = false, rows = 3 }: Props) {
  const { text, setText, listening, fallback, toggle } = controller;
  return <div className="voice-capture">
    <div className="mic-area"><button type="button" className={`mic-button ${listening ? 'is-listening' : ''}`} onClick={toggle} disabled={disabled} aria-pressed={listening} aria-label={listening ? flowText(language, 'stopListening') : flowText(language, 'listenLive')}><span className="mic-ring mic-ring-one" /><span className="mic-ring mic-ring-two" /><Mic size={32} strokeWidth={2} /></button><span className="mic-hint">{listening ? flowText(language, 'analysing') : idleCopy}</span></div>
    <div className={`waveform ${listening ? 'waveform-live' : ''}`} aria-hidden="true">{Array.from({ length: 23 }, (_, index) => <span key={index} style={{ '--bar-index': index, '--bar-height': `${6 + (index % 6) * 4}px` } as CSSProperties} />)}</div>
    <label className="voice-input-label" htmlFor="voice-capture-text">{label}</label>
    <textarea id="voice-capture-text" className="voice-capture-textarea" rows={rows} maxLength={1200} value={text} onChange={(event) => setText(event.target.value)} placeholder={placeholder} disabled={disabled} />
    <p className="voice-capture-hint" aria-live="polite">{fallback ? flowText(language, 'voiceUnavailableHelp') : text ? flowText(language, 'hearSummary') : flowText(language, 'notHeardYet')}</p>
  </div>;
}
