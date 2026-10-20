import type { Language } from './i18n.ts';

export const concernCategories = ['Low pay', 'Safety', 'Respect', 'Degree is better', "Girls' safety", 'Cost'] as const;
export type Concern = (typeof concernCategories)[number];
export type TradeName = 'Electrician' | 'Welder' | 'Plumber' | 'Drafting technician';
export type LearnerGender = 'son' | 'daughter';
export type Sentiment = 'worried' | 'uncertain' | 'hopeful' | 'neutral';
export type ConcernAnalysis = {
  primary_concern: Concern;
  secondary_concern: Concern | null;
  trade_mentioned: TradeName | null;
  learner_gender_if_mentioned: LearnerGender | null;
  sentiment: Sentiment;
  key_phrases: string[];
  one_line_summary: string;
};

const phraseRules: Array<{ concern: Concern; pattern: RegExp }> = [
  { concern: "Girls' safety", pattern: /(girl(?:s)?|daughter|female|mulgi|mulich[eya]|beti|ladki|ladkiyon).{0,55}(safety|safe|suraksha|bhiti|fear|dar)|((safety|suraksha|bhiti|fear|dar).{0,55}(girl|daughter|mulgi|beti|ladki))|(?:मुलगी|मुली|बेटी|लड़की|लड़कियों).{0,55}(?:सुरक्षा|भीती|भय|डर)|(?:सुरक्षा|भीती|भय|डर).{0,55}(?:मुलगी|मुली|बेटी|लड़की)/i },
  { concern: 'Respect', pattern: /(respect|respectable|respectability|izzat|ijjat|samman|maan|adar|pratishtha|abru|प्रतिष्ठा|इज़्ज़त|इज्जत|सम्मान|आदर|मान)/i },
  { concern: 'Degree is better', pattern: /(degree|graduat|diploma|ba course|b\.a\.?|padvi|padav[iy]|shikshan|डिग्री|पदवी|स्नातक|डिप्लोमा|डिग्री छोड़|डिग्री सोड)/i },
  { concern: 'Low pay', pattern: /(low pay|low wage|not enough (?:pay|money)|salary|earnings|income|kamai|kam pagar|kami pagar|vetan|pagar|कम पगार|कमी पगार|कमाई|वेतन|पगार|आमदनी)/i },
  { concern: 'Cost', pattern: /(cost|fee|fees|expensive|afford|loan|installment|scholarship|stipend|kharcha|kharch|paise|शुल्क|फीस|खर्च|महंगा|महँगा|कर्ज|छात्रवृत्ति|स्टाइपेंड)/i },
  { concern: 'Safety', pattern: /(safety|safe|unsafe|danger|suraksha|surakshit|bhiti|fear|scared|accident|dhoka|सुरक्षा|सुरक्षित|असुरक्षित|भीती|धोका|डर|खतरा)/i },
];
const tradeRules: Array<{ trade: TradeName; pattern: RegExp }> = [
  { trade: 'Electrician', pattern: /(electrician|electrical|electric|wiring|solar|bijli|vidyut|इलेक्ट्रीशियन|बिजली|विद्युत|वायरिंग|सौर ऊर्जा)/i },
  { trade: 'Welder', pattern: /(welder|welding|weld|fabrication|weldar|वेल्डर|वेल्डिंग|फॅब्रिकेशन)/i },
  { trade: 'Plumber', pattern: /(plumber|plumbing|pipe.?fitting|pipe|nal|nalka|प्लंबर|प्लम्बिंग|पाइप|नल|नलसाज़)/i },
  { trade: 'Drafting technician', pattern: /(architecture|architect|cad|drafting|drawing|आर्किटेक्चर|नक्शा|ड्राफ्टिंग)/i },
];
const sonPattern = /\b(?:son|boy|he|his|beta|mulga|mulacha)\b|मुलगा|मुलाचा|बेटा|लड़का/i;
const daughterPattern = /\b(?:daughter|girl|she|her|beti|mulgi|mulichi)\b|मुलगी|मुली|बेटी|लड़की/i;
const worryPattern = /(worr|fear|afraid|scared|concern|bhiti|kalji|chinta|काळजी|चिंता|डर|भय|भीति)/i;

const concernLabel: Record<Language, Record<Concern, string>> = {
  en: { 'Low pay': 'low pay', Safety: 'safety', Respect: 'respect at work', 'Degree is better': 'choosing between a degree and a trade', "Girls' safety": "your daughter's safety", Cost: 'training cost' },
  mr: { 'Low pay': 'कमी पगार', Safety: 'सुरक्षितता', Respect: 'कामाचा आदर', 'Degree is better': 'पदवी की कौशल्य प्रशिक्षण', "Girls' safety": 'मुलीची सुरक्षितता', Cost: 'प्रशिक्षणाचा खर्च' },
  hi: { 'Low pay': 'कम कमाई', Safety: 'सुरक्षा', Respect: 'काम का सम्मान', 'Degree is better': 'डिग्री या कौशल प्रशिक्षण', "Girls' safety": 'बेटी की सुरक्षा', Cost: 'ट्रेनिंग का खर्च' },
};

function localSummary(text: string, language: Language, concern: Concern): string {
  const aboutDegreeAndJob = /(degree|graduat|diploma|डिग्री|पदवी|डिप्लोमा)/i.test(text) && /(job|work|career|naukri|rozgar|नोकरी|रोजगार|काम)/i.test(text);
  if (aboutDegreeAndJob) {
    if (language === 'mr') return 'पदवीनंतर चांगले काम मिळेल का आणि कौशल्याचा मार्ग योग्य आहे का, हे तुम्ही तपासत आहात.';
    if (language === 'hi') return 'आप सोच रहे हैं कि डिग्री के बाद अच्छा काम मिलेगा या कौशल का रास्ता बेहतर होगा।';
    return 'You are weighing whether a degree will lead to the job your child wants.';
  }
  const label = concernLabel[language][concern];
  if (language === 'mr') return `तुम्हाला ${label} याबद्दल काळजी वाटते.`;
  if (language === 'hi') return `आपको ${label} की चिंता है।`;
  return `You are concerned about ${label}.`;
}

export function buildRuleAnalysis(text: string, language: Language, fallbackConcern: Concern = 'Safety'): ConcernAnalysis {
  const matches = phraseRules.filter((rule) => rule.pattern.test(text));
  const primary = matches[0]?.concern ?? fallbackConcern;
  const secondary = matches.find((item) => item.concern !== primary && !(primary === "Girls' safety" && item.concern === 'Safety'))?.concern ?? null;
  const trade = tradeRules.find((rule) => rule.pattern.test(text))?.trade ?? null;
  const gender: LearnerGender | null = daughterPattern.test(text) ? 'daughter' : sonPattern.test(text) ? 'son' : null;
  const keyPhrases: string[] = [];
  for (const pattern of [...phraseRules.map((rule) => rule.pattern), ...tradeRules.map((rule) => rule.pattern), daughterPattern, sonPattern]) {
    const phrase = text.match(pattern)?.[0]?.trim();
    if (phrase && !keyPhrases.some((value) => value.toLocaleLowerCase() === phrase.toLocaleLowerCase())) keyPhrases.push(phrase);
    if (keyPhrases.length === 4) break;
  }
  const sentiment: Sentiment = worryPattern.test(text) ? 'worried' : /(good|hope|confiden|glad|happy|chhan|changla|आशा|खुश|अच्छा)/i.test(text) ? 'hopeful' : text.trim() ? 'uncertain' : 'neutral';
  return { primary_concern: primary, secondary_concern: secondary, trade_mentioned: trade, learner_gender_if_mentioned: gender, sentiment, key_phrases: keyPhrases.slice(0, 4), one_line_summary: localSummary(text, language, primary) };
}

export function isConcernAnalysis(value: unknown): value is ConcernAnalysis {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return concernCategories.includes(item.primary_concern as Concern)
    && (item.secondary_concern === null || concernCategories.includes(item.secondary_concern as Concern))
    && (item.trade_mentioned === null || tradeRules.some((rule) => rule.trade === item.trade_mentioned))
    && (item.learner_gender_if_mentioned === null || item.learner_gender_if_mentioned === 'son' || item.learner_gender_if_mentioned === 'daughter')
    && ['worried', 'uncertain', 'hopeful', 'neutral'].includes(String(item.sentiment))
    && Array.isArray(item.key_phrases) && item.key_phrases.length <= 4 && item.key_phrases.every((phrase) => typeof phrase === 'string' && phrase.length <= 80)
    && typeof item.one_line_summary === 'string' && item.one_line_summary.length <= 240;
}

export function applyExplicitRules(modelResult: ConcernAnalysis, text: string, language: Language, fallbackConcern: Concern): ConcernAnalysis {
  const local = buildRuleAnalysis(text, language, fallbackConcern);
  const hasConcernEvidence = phraseRules.some((rule) => rule.pattern.test(text));
  const keyPhrases = [...new Set([...local.key_phrases, ...modelResult.key_phrases])].slice(0, 4);
  return {
    ...modelResult,
    primary_concern: hasConcernEvidence ? local.primary_concern : modelResult.primary_concern,
    secondary_concern: local.secondary_concern ?? (hasConcernEvidence ? null : modelResult.secondary_concern),
    trade_mentioned: local.trade_mentioned ?? modelResult.trade_mentioned,
    learner_gender_if_mentioned: local.learner_gender_if_mentioned ?? modelResult.learner_gender_if_mentioned,
    key_phrases: keyPhrases,
  };
}
