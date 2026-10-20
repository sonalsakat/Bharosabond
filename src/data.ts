export const districts = ['Pune', 'Nashik', 'Satara', 'Nagpur', 'Latur'] as const;
export const trades = ['Electrician', 'Welder', 'Plumber'] as const;
export type District = (typeof districts)[number];
export type TradeScores = { safety: number; pay: number; respect: number };
export type DistrictProof = { rate: string; pay: string; provider: string; date: string };

// Two fictional, consent-labelled local stories per district; order is electrician first, welder second.
export const mentors = [
  { name: 'Asha', village: 'Bhor', district: 'Pune', trade: 'Electrician', lineKey: 'storyElectricianLine', captionKey: 'storyElectricianCaption', company: 'Pune Solar Services', languageKey: 'languageMarathi', calls: 4 },
  { name: 'Shankar', village: 'Junnar', district: 'Pune', trade: 'Welder', lineKey: 'storyWelderLine', captionKey: 'storyWelderCaption', company: 'Junnar Fabrication Works', languageKey: 'languageMarathiHindi', calls: 3 },
  { name: 'Jyoti', village: 'Dindori', district: 'Nashik', trade: 'Electrician', lineKey: 'storyElectricianLine', captionKey: 'storyElectricianCaption', company: 'Nashik Solar Services', languageKey: 'languageMarathi', calls: 6 },
  { name: 'Ramesh', village: 'Sinnar', district: 'Nashik', trade: 'Welder', lineKey: 'storyWelderLine', captionKey: 'storyWelderCaption', company: 'Sinnar Fabrication Works', languageKey: 'languageMarathiHindi', calls: 5 },
  { name: 'Sunita', village: 'Koregaon', district: 'Satara', trade: 'Electrician', lineKey: 'storyElectricianLine', captionKey: 'storyElectricianCaption', company: 'Satara Solar Works', languageKey: 'languageMarathi', calls: 7 },
  { name: 'Meera', village: 'Karad', district: 'Satara', trade: 'Welder', lineKey: 'storyWelderLine', captionKey: 'storyWelderCaption', company: 'Karad Fabrication Works', languageKey: 'languageMarathi', calls: 4 },
  { name: 'Imran', village: 'Hingna', district: 'Nagpur', trade: 'Electrician', lineKey: 'storyElectricianLine', captionKey: 'storyElectricianCaption', company: 'Nagpur Solar Services', languageKey: 'languageMarathiHindi', calls: 8 },
  { name: 'Anjali', village: 'Umred', district: 'Nagpur', trade: 'Welder', lineKey: 'storyWelderLine', captionKey: 'storyWelderCaption', company: 'Umred Fabrication Works', languageKey: 'languageMarathi', calls: 6 },
  { name: 'Vijaya', village: 'Ausa', district: 'Latur', trade: 'Electrician', lineKey: 'storyElectricianLine', captionKey: 'storyElectricianCaption', company: 'Latur Solar Services', languageKey: 'languageMarathi', calls: 2 },
  { name: 'Mangal', village: 'Nilanga', district: 'Latur', trade: 'Welder', lineKey: 'storyWelderLine', captionKey: 'storyWelderCaption', company: 'Nilanga Fabrication Works', languageKey: 'languageMarathi', calls: 5 },
] as const;

export const districtProofs: Record<District, DistrictProof> = {
  Pune: { rate: '76%', pay: '₹14,620–18,710', provider: 'Pune District Skills Centre', date: 'Placement follow-up · 17 Sep 2026' },
  Nashik: { rate: '81%', pay: '₹15,120–19,480', provider: 'Nashik Trades Centre', date: 'Mentor follow-up · 19 Sep 2026' },
  Satara: { rate: '78%', pay: '₹14,350–18,420', provider: 'Satara Skills Centre', date: 'Family follow-up · 12 Sep 2026' },
  Nagpur: { rate: '75%', pay: '₹14,480–18,960', provider: 'Nagpur Skills Hub', date: 'Placement follow-up · 23 Sep 2026' },
  Latur: { rate: '73%', pay: '₹13,920–17,640', provider: 'Latur District Training Centre', date: 'Family follow-up · 26 Sep 2026' },
};

export const overviewStats = [
  { key: 'familiesReached', value: '1,284', changeKey: 'familiesChange' },
  { key: 'concernsResolved', value: '846', changeKey: 'concernsChange' },
  { key: 'sentimentImproved', value: '71.6%', changeKey: 'sentimentChange' },
  { key: 'enrolments', value: '327', changeKey: 'enrolmentsChange' },
] as const;

export const districtsForMap = [
  { district: 'Pune', safety: 37, pay: 22, respect: 14, mentorsNeeded: 3, byTrade: { Electrician: { safety: 35, pay: 20, respect: 13 }, Welder: { safety: 41, pay: 25, respect: 16 }, Plumber: { safety: 33, pay: 23, respect: 14 } } },
  { district: 'Nashik', safety: 32, pay: 19, respect: 11, mentorsNeeded: 4, byTrade: { Electrician: { safety: 30, pay: 18, respect: 10 }, Welder: { safety: 38, pay: 23, respect: 14 }, Plumber: { safety: 29, pay: 21, respect: 12 } } },
  { district: 'Satara', safety: 41, pay: 18, respect: 12, mentorsNeeded: 5, byTrade: { Electrician: { safety: 38, pay: 17, respect: 11 }, Welder: { safety: 45, pay: 22, respect: 14 }, Plumber: { safety: 37, pay: 20, respect: 12 } } },
  { district: 'Nagpur', safety: 29, pay: 25, respect: 15, mentorsNeeded: 6, byTrade: { Electrician: { safety: 27, pay: 23, respect: 14 }, Welder: { safety: 36, pay: 29, respect: 19 }, Plumber: { safety: 28, pay: 26, respect: 16 } } },
  { district: 'Latur', safety: 35, pay: 21, respect: 17, mentorsNeeded: 8, byTrade: { Electrician: { safety: 33, pay: 20, respect: 16 }, Welder: { safety: 40, pay: 25, respect: 21 }, Plumber: { safety: 31, pay: 22, respect: 18 } } },
] as const;

export const mentorRows = [
  { name: 'Sunita Pawar', district: 'Satara', trade: 'Electrician', language: 'Marathi', calls: 7, consent: 'Consented' },
  { name: 'Ramesh Shinde', district: 'Nashik', trade: 'Welder', language: 'Marathi, Hindi', calls: 5, consent: 'Consented' },
  { name: 'Asha Jadhav', district: 'Pune', trade: 'Plumber', language: 'Marathi', calls: 4, consent: 'Consented' },
  { name: 'Imran Shaikh', district: 'Nagpur', trade: 'Electrician', language: 'Hindi, Marathi', calls: 8, consent: 'Consented' },
  { name: 'Vijaya Patil', district: 'Latur', trade: 'Welder', language: 'Marathi', calls: 2, consent: 'Follow-up due' },
];

export const escalations = [
  { id: 'BB-248', name: 'Family from Latur', concern: 'Girls’ safety', status: 'New', summary: 'Would like to speak with a woman mentor before visiting the centre.', time: '18 min ago' },
  { id: 'BB-231', name: 'Family from Nashik', concern: 'Training cost', status: 'In progress', summary: 'Asked about travel support and monthly instalments.', time: '2 hr ago' },
  { id: 'BB-216', name: 'Family from Satara', concern: 'Degree is better', status: 'Resolved', summary: 'Counsellor shared the course-to-diploma pathway card.', time: 'Yesterday' },
  { id: 'BB-204', name: 'Family from Pune', concern: 'Low starting pay', status: 'In progress', summary: 'Needs current local wage examples from two training partners.', time: 'Yesterday' },
];
