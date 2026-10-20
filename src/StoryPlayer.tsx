import { useEffect, useRef, useState } from 'react';
import { Captions, Pause, Play, RotateCcw } from 'lucide-react';
import type { MentorStory } from './mentorStories';
import { flowText } from './flowCopy';
import { speechLocales, t, type Language } from './i18n';

type Props = { language: Language; mentor: MentorStory; onDecision: (helped: boolean) => void };
const timeLabel = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function StoryPlayer({ language, mentor, onDecision }: Props) {
  const scenes = mentor.story[language].scenes;
  const [playing, setPlaying] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRef = useRef(false);
  const generationRef = useRef(0);
  const clockRef = useRef({ elapsed: 0, startedAt: 0 });
  const duration = mentor.durationSeconds;
  const videoMode = Boolean(mentor.videoUrl);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => {
    if (!playing || videoMode || ended) return;
    const utteranceId = ++generationRef.current;
    const finish = () => {
      if (generationRef.current !== utteranceId || !playingRef.current) return;
      if (sceneIndex + 1 >= scenes.length) {
        setPlaying(false);
        setEnded(true);
        clockRef.current.elapsed = Math.min(duration, Math.max(clockRef.current.elapsed, (Date.now() - clockRef.current.startedAt) / 1000));
        return;
      }
      setSceneIndex((value) => value + 1);
    };
    if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance(scenes[sceneIndex]);
      utterance.lang = speechLocales[language];
      utterance.rate = 0.88;
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    } else {
      const timeout = window.setTimeout(finish, Math.max(5000, Math.round(scenes[sceneIndex].length / 11 * 1000)));
      return () => window.clearTimeout(timeout);
    }
    return () => { ++generationRef.current; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [duration, ended, language, playing, sceneIndex, scenes, videoMode]);

  useEffect(() => {
    if (!playing || videoMode || ended) return;
    const timer = window.setInterval(() => {
      const seconds = clockRef.current.elapsed + (Date.now() - clockRef.current.startedAt) / 1000;
      setElapsed(seconds);
    }, 200);
    return () => window.clearInterval(timer);
  }, [ended, playing, videoMode]);

  useEffect(() => () => { ++generationRef.current; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  function start() {
    if (videoMode && videoRef.current) {
      if (ended) { videoRef.current.currentTime = 0; setSceneIndex(0); setElapsed(0); setEnded(false); }
      void videoRef.current.play();
      setPlaying(true);
      return;
    }
    if (ended) { setEnded(false); setSceneIndex(0); setElapsed(0); clockRef.current = { elapsed: 0, startedAt: Date.now() }; }
    else clockRef.current.startedAt = Date.now();
    setPlaying(true);
  }
  function pause() {
    if (videoMode && videoRef.current) videoRef.current.pause();
    else {
      clockRef.current.elapsed += (Date.now() - clockRef.current.startedAt) / 1000;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    setElapsed(clockRef.current.elapsed);
    setPlaying(false);
  }
  function replay() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    generationRef.current += 1;
    clockRef.current = { elapsed: 0, startedAt: Date.now() };
    setElapsed(0); setSceneIndex(0); setEnded(false); setPlaying(true);
    if (videoMode && videoRef.current) void videoRef.current.play();
  }
  function updateVideo() {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;
    setElapsed(time);
    const length = video.duration || duration;
    setSceneIndex(Math.min(scenes.length - 1, Math.floor((time / length) * scenes.length)));
  }
  function finishVideo() { setPlaying(false); setEnded(true); }

  const current = scenes[Math.min(sceneIndex, scenes.length - 1)] ?? '';
  const progress = videoMode && videoRef.current?.duration
    ? Math.min(1, elapsed / videoRef.current.duration)
    : ended ? 1 : Math.min(0.98, (sceneIndex + (playing ? 0.28 : 0)) / scenes.length);
  const timerTotal = videoMode && videoRef.current?.duration ? videoRef.current.duration : duration;
  return <section className="story-player" aria-label={`${mentor.name} story`}>
    <div className="story-player-art">
      {mentor.videoUrl ? <video ref={videoRef} className="story-player-video" src={mentor.videoUrl} poster={mentor.imageUrl} playsInline preload="metadata" onTimeUpdate={updateVideo} onEnded={finishVideo} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} /> : <img key={sceneIndex} src={mentor.imageUrl} alt={`${mentor.name} from ${mentor.village}`} />}
      <span className="story-player-count">{flowText(language, 'storyOne')} {sceneIndex + 1} {flowText(language, 'storyOf')} {scenes.length}</span>
      <button type="button" className="story-player-main-control" onClick={playing ? pause : start} aria-label={playing ? flowText(language, 'pauseStory') : flowText(language, 'playStory')}>{playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button>
    </div>
    {captionsOn && <p className="story-player-caption" aria-live={playing ? 'polite' : undefined}>{current}</p>}
    <div className="story-progress-track" role="progressbar" aria-label={flowText(language, 'storyMoving')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${progress * 100}%` }} /></div>
    <div className="story-player-controls"><span className="story-player-timer">{timeLabel(elapsed)} / {timeLabel(timerTotal)}</span><div><button type="button" className="story-control-button" onClick={replay}><RotateCcw size={17} />{flowText(language, 'replayStory')}</button><button type="button" className="story-control-button" onClick={() => setCaptionsOn((value) => !value)} aria-pressed={captionsOn}><Captions size={17} />{captionsOn ? flowText(language, 'captionsOn') : flowText(language, 'captionsOff')}</button></div></div>
    {ended && <div className="story-ending" role="group" aria-label={t(language, 'didThisHelp')}><span className="eyebrow-label">{flowText(language, 'storyDone')}</span><h3>{t(language, 'didThisHelp')}</h3><div className="help-buttons"><button type="button" className="button-primary" onClick={() => onDecision(true)}>{t(language, 'yes')}</button><button type="button" className="button-outline" onClick={() => onDecision(false)}>{t(language, 'notYet')}</button></div></div>}
  </section>;
}
