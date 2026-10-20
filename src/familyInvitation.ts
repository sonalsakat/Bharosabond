import { concernCategories, type Concern, type LearnerGender, type TradeName } from './concernAnalysis';
import { districts } from './data';
import type { Language } from './i18n';

const allowedTrades: TradeName[] = ['Electrician', 'Welder', 'Plumber', 'Drafting technician'];
export type FamilyInvitation = {
  learnerName: string;
  trade: TradeName;
  district: (typeof districts)[number];
  concern: Concern;
  language: Language;
  learnerGender: LearnerGender | null;
  qualification: string;
};

export function createFamilyInviteUrl(profile: FamilyInvitation, origin: string): string {
  const url = new URL('/', origin);
  url.searchParams.set('invite', '1');
  url.searchParams.set('name', profile.learnerName.trim().slice(0, 60));
  url.searchParams.set('trade', profile.trade);
  url.searchParams.set('district', profile.district);
  url.searchParams.set('concern', profile.concern);
  url.searchParams.set('language', profile.language);
  url.searchParams.set('gender', profile.learnerGender ?? '');
  url.searchParams.set('qualification', profile.qualification.slice(0, 40));
  return url.toString();
}

export function readFamilyInvite(search: string): FamilyInvitation | null {
  const params = new URLSearchParams(search);
  if (params.get('invite') !== '1') return null;
  const learnerName = (params.get('name') ?? '').trim().slice(0, 60);
  const trade = params.get('trade') as TradeName | null;
  const district = params.get('district') as FamilyInvitation['district'] | null;
  const concern = params.get('concern') as Concern | null;
  const language = params.get('language') as Language | null;
  const genderValue = params.get('gender');
  const qualification = (params.get('qualification') ?? '').trim().slice(0, 40);
  if (!learnerName || !trade || !allowedTrades.includes(trade) || !district || !districts.includes(district) || !concern || !concernCategories.includes(concern) || !language || !['en', 'mr', 'hi'].includes(language)) return null;
  const learnerGender: LearnerGender | null = genderValue === 'son' || genderValue === 'daughter' ? genderValue : null;
  return { learnerName, trade, district, concern, language, learnerGender, qualification };
}
