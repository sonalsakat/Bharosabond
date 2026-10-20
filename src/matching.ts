export const learnerInterestIds = ['fixing', 'electricity', 'building', 'vehicles', 'computers', 'helping', 'outdoors', 'design'] as const;
export type LearnerInterestId = (typeof learnerInterestIds)[number];
export type SchoolSubjectId = 'maths' | 'science' | 'computers' | 'art' | 'languages' | 'practical';
export type QuizAnswerId = 'light' | 'metal' | 'fault' | 'pipe' | 'hands' | 'screen' | 'site' | 'workshop' | 'problem' | 'service';
export type RecommendationProfile = {
  interests: LearnerInterestId[];
  subjects: SchoolSubjectId[];
  quizAnswers: QuizAnswerId[];
  spokenInterests: LearnerInterestId[];
};
export type TradeMatch = { trade: 'Electrician' | 'Welder' | 'Plumber'; score: number; reasons: string[] };

type Trade = TradeMatch['trade'];
const trades: Trade[] = ['Electrician', 'Welder', 'Plumber'];

const interestWeights: Record<LearnerInterestId, Partial<Record<Trade, number>>> = {
  fixing: { Electrician: 2, Welder: 1, Plumber: 1 },
  electricity: { Electrician: 3, Welder: 0.4 },
  building: { Welder: 2, Plumber: 1.5 },
  vehicles: { Welder: 1.5, Electrician: 1 },
  computers: { Electrician: 1.5 },
  helping: { Plumber: 1.4, Electrician: 0.8 },
  outdoors: { Plumber: 1.4, Welder: 1.1 },
  design: { Welder: 1.1, Electrician: 0.8, Plumber: 0.5 },
};
const subjectWeights: Record<SchoolSubjectId, Partial<Record<Trade, number>>> = {
  maths: { Electrician: 0.8, Welder: 0.8, Plumber: 0.7 },
  science: { Electrician: 1.1, Welder: 0.8 },
  computers: { Electrician: 1.1 },
  art: { Welder: 0.8, Electrician: 0.5 },
  languages: { Plumber: 0.8 },
  practical: { Electrician: 0.7, Welder: 0.7, Plumber: 0.7 },
};
const quizWeights: Record<QuizAnswerId, Partial<Record<Trade, number>>> = {
  light: { Electrician: 3 }, metal: { Welder: 3 }, fault: { Electrician: 3 }, pipe: { Plumber: 3 },
  hands: { Electrician: 1, Welder: 1, Plumber: 1 }, screen: { Electrician: 1.5, Welder: 0.5 },
  site: { Welder: 1, Plumber: 1 }, workshop: { Electrician: 0.7, Welder: 1.2 },
  problem: { Electrician: 0.5, Welder: 0.5, Plumber: 0.5 }, service: { Plumber: 1.5, Electrician: 0.5 },
};
const labels: Record<Trade, string> = { Electrician: 'electricity', Welder: 'building or metal work', Plumber: 'practical service work' };

export function interestsFromWords(words: string): LearnerInterestId[] {
  const text = words.toLocaleLowerCase();
  const rules: Array<[LearnerInterestId, RegExp]> = [
    ['fixing', /(fix|repair|mend|tinker|दुरुस्त|ठीक करना|जोड़)/i],
    ['electricity', /(electric|wiring|light|current|bijli|विद्युत|बिजली|वीज)/i],
    ['building', /(build|construct|metal|frame|fabricat|बनाना|निर्माण|बांधकाम|मजबूत)/i],
    ['vehicles', /(vehicle|car|bike|automobile|गाड़ी|वाहन|गाडी)/i],
    ['computers', /(computer|technology|coding|डिजिटल|संगणक|कंप्यूटर)/i],
    ['helping', /(help|serve|people|customer|मदद|मदत|लोकांना)/i],
    ['outdoors', /(outdoor|outside|field|site|बाहर|बाहेर|मैदान)/i],
    ['design', /(design|draw|drawing|plan|नक्शा|नकाशा|ड्रॉइंग)/i],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
}

export function rankTrainingTrades(profile: RecommendationProfile): TradeMatch[] {
  const scores: Record<Trade, number> = { Electrician: 0, Welder: 0, Plumber: 0 };
  const reasons: Record<Trade, string[]> = { Electrician: [], Welder: [], Plumber: [] };
  for (const interest of [...profile.interests, ...profile.spokenInterests]) {
    const weights = interestWeights[interest];
    for (const trade of trades) {
      const weight = weights[trade] ?? 0;
      scores[trade] += weight;
      if (weight >= 1.3 && !reasons[trade].includes(labels[trade])) reasons[trade].push(labels[trade]);
    }
  }
  for (const subject of profile.subjects) for (const trade of trades) scores[trade] += subjectWeights[subject][trade] ?? 0;
  for (const answer of profile.quizAnswers) for (const trade of trades) scores[trade] += quizWeights[answer][trade] ?? 0;
  const stableOrder: Trade[] = ['Electrician', 'Welder', 'Plumber'];
  return stableOrder.map((trade) => ({ trade, score: scores[trade], reasons: reasons[trade] }))
    .sort((left, right) => right.score - left.score || stableOrder.indexOf(left.trade) - stableOrder.indexOf(right.trade));
}

/** A transparent share of all available match points in the currently selected answers. */
export function fitPercentage(match: TradeMatch, profile: RecommendationProfile): number {
  let availablePoints = 0;
  const strongest = (weights: Partial<Record<Trade, number>>) => Math.max(0, ...trades.map((trade) => weights[trade] ?? 0));
  for (const interest of [...profile.interests, ...profile.spokenInterests]) availablePoints += strongest(interestWeights[interest]);
  for (const subject of profile.subjects) availablePoints += strongest(subjectWeights[subject]);
  for (const answer of profile.quizAnswers) availablePoints += strongest(quizWeights[answer]);
  if (availablePoints === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((match.score / availablePoints) * 100)));
}

