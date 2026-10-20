import type { Language } from './i18n';

export const districtNames = ['Pune', 'Nashik', 'Satara', 'Nagpur', 'Latur'] as const;
export type DistrictName = (typeof districtNames)[number];
export const tradeNames = ['Electrician', 'Welder', 'Plumber'] as const;
export type RecommendedTrade = (typeof tradeNames)[number];
type LocalizedText = Record<Language, string>;

export type ProviderEvidence = {
  name: string;
  location: string;
  entryEvidence: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  currentOfferingVerified: boolean;
  feeOrStipend: LocalizedText;
  feeSourceUrl: string | null;
};
export type TradeFact = {
  duration: LocalizedText;
  durationSourceUrl: string;
  durationSourceTitle: string;
  durationSourceDate: string;
  earningsRange: string;
  earningsSourceUrl: string;
  earningsSourceTitle: string;
  earningsDate: string;
  description: LocalizedText;
  typicalDay: LocalizedText;
};

const directory2024 = 'https://www.dvet.gov.in/wp-content/uploads/2025/02/PUNETrade_Gov.pdf';
const directory2020Nagpur = 'https://inventory.dvet.gov.in/assets/Attachments/PDF/2020/TRADEWISEITI/Tradewise_Nagpur.pdf';
const directory2020Latur = 'https://inventory.dvet.gov.in/assets/Attachments/PDF/2020/TRADEWISEITI/Tradewise_Aurangabad.pdf';
const nashikProviderPage = 'https://nashik.dvet.gov.in/nashik-institutes/govt-iti-nashik/';
const feeUnpublished: LocalizedText = {
  en: 'Fee or stipend is not stated in the linked directory; ask the institute to confirm.',
  mr: 'जोडलेल्या यादीत शुल्क किंवा विद्यावेतन दिलेले नाही; संस्थेकडून खात्री करून घ्या.',
  hi: 'इस सूची में शुल्क या वजीफ़ा नहीं दिया है; संस्थान से पुष्टि करें।',
};
const feesNashik: LocalizedText = {
  en: '₹1,950 open category / ₹950 reserved category; confirm the current amount.',
  mr: 'खुला प्रवर्ग ₹१,९५० / आरक्षित प्रवर्ग ₹९५०; सध्याची रक्कम तपासा.',
  hi: 'सामान्य श्रेणी ₹1,950 / आरक्षित श्रेणी ₹950; मौजूदा राशि की पुष्टि करें।',
};
const feesNashikWelder: LocalizedText = {
  en: '₹2,150 open category / ₹950 reserved category; confirm the current amount.',
  mr: 'खुला प्रवर्ग ₹२,१५० / आरक्षित प्रवर्ग ₹९५०; सध्याची रक्कम तपासा.',
  hi: 'सामान्य श्रेणी ₹2,150 / आरक्षित श्रेणी ₹950; मौजूदा राशि की पुष्टि करें।',
};
const d2024 = 'DVET Trade Directory for Admission in Year 2024–25 (2024 admission listings); accessed 9 Oct 2026. Current 2026–27 offering was not independently verified.';
const d2020Nagpur = 'DVET Trade Directory for Admission in Year 2020–21; accessed 9 Oct 2026. Current 2026–27 offering was not independently verified.';
const d2020Latur = 'DVET Trade Directory for Admission in Year 2020–21 (Aurangabad region); accessed 9 Oct 2026. Current 2026–27 offering was not independently verified.';
const dNashik = 'Official Government ITI Nashik course page; accessed 7 Oct 2026. Course is listed on the institute page; confirm current seats and fees before admission.';
const noFeeSource = null;

export const tradeFacts: Record<RecommendedTrade, TradeFact> = {
  Electrician: {
    duration: {
      en: '2 years (2,400 training hours plus 300 hours of OJT/group project)',
      mr: '२ वर्षे (२,४०० प्रशिक्षण तास आणि ३०० तास OJT/गट प्रकल्प)',
      hi: '2 साल (2,400 प्रशिक्षण घंटे और 300 घंटे OJT/समूह परियोजना)',
    },
    durationSourceUrl: 'https://dgt.gov.in/sites/default/files/2024-01/Electrician_CTS2.0_NSQF-4.pdf',
    durationSourceTitle: 'DGT Electrician CTS curriculum, NSQF Level 4',
    durationSourceDate: 'Curriculum revised July 2022; accessed 9 Oct 2026',
    earningsRange: '₹13,413–₹31,624 net per month at the start of the job',
    earningsSourceUrl: 'https://wageindicator.org/en-in/work-in-india/role-and-pay/india-building-and-related-electricians/',
    earningsSourceTitle: 'WageIndicator India — Building and related electricians',
    earningsDate: '2026 range; accessed 9 Oct 2026',
    description: {
      en: 'Install, inspect and repair electrical wiring, fittings and equipment.',
      mr: 'वीजेची वायरिंग, फिटिंग आणि उपकरणे बसवणे, तपासणे व दुरुस्त करणे.',
      hi: 'बिजली की वायरिंग, फिटिंग और उपकरण लगाना, जाँचना और ठीक करना।',
    },
    typicalDay: {
      en: 'Read a simple work plan, route wires, fit switches and test that a circuit is safe.',
      mr: 'कामाचा आराखडा पाहणे, वायर टाकणे, स्विच बसवणे आणि सर्किट सुरक्षित आहे का तपासणे.',
      hi: 'काम का नक्शा पढ़ना, तार लगाना, स्विच फिट करना और सर्किट सुरक्षित है या नहीं जाँचना।',
    },
  },
  Welder: {
    duration: {
      en: '1 year (1,200 training hours plus 150 hours of OJT/group project)',
      mr: '१ वर्ष (१,२०० प्रशिक्षण तास आणि १५० तास OJT/गट प्रकल्प)',
      hi: '1 साल (1,200 प्रशिक्षण घंटे और 150 घंटे OJT/समूह परियोजना)',
    },
    durationSourceUrl: 'https://dgt.gov.in/sites/default/files/Welder_CTS2.0_NSQF-3.pdf',
    durationSourceTitle: 'DGT Welder CTS curriculum, NSQF Level 3',
    durationSourceDate: 'Curriculum revised July 2022; accessed 9 Oct 2026',
    earningsRange: '₹16,844–₹31,404 net per month at the start of the job',
    earningsSourceUrl: 'https://wageindicator.org/en-in/work-in-india/role-and-pay/india-welders-and-flame-cutters/',
    earningsSourceTitle: 'WageIndicator India — Welders and flamecutters',
    earningsDate: '2026 range; accessed 9 Oct 2026',
    description: {
      en: 'Join or cut metal parts with heat, then check the finished joint against the work plan.',
      mr: 'उष्णतेने धातूचे भाग जोडणे किंवा कापणे आणि तयार जोड आराखड्यानुसार तपासणे.',
      hi: 'गर्मी से धातु के हिस्से जोड़ना या काटना और तैयार जोड़ को काम के नक्शे से जाँचना।',
    },
    typicalDay: {
      en: 'Check protective gear, prepare metal, make a supervised weld and inspect the seam.',
      mr: 'सुरक्षा साधने तपासणे, धातू तयार करणे, देखरेखीखाली वेल्डिंग करणे आणि जोड तपासणे.',
      hi: 'सुरक्षा के सामान जाँचना, धातु तैयार करना, निगरानी में वेल्ड करना और जोड़ देखना।',
    },
  },
  Plumber: {
    duration: {
      en: '1 year (1,200 training hours plus 150 hours of OJT/group project)',
      mr: '१ वर्ष (१,२०० प्रशिक्षण तास आणि १५० तास OJT/गट प्रकल्प)',
      hi: '1 साल (1,200 प्रशिक्षण घंटे और 150 घंटे OJT/समूह परियोजना)',
    },
    durationSourceUrl: 'https://dgt.gov.in/sites/default/files/2026-09/Plumber-CTS3.0_NSQF-2.5.pdf',
    durationSourceTitle: 'DGT Plumber CTS 3.0 curriculum, NSQF Level 2.5',
    durationSourceDate: 'Curriculum revised January 2024; accessed 9 Oct 2026',
    earningsRange: '₹21,182–₹64,663 net per month at the start of the job',
    earningsSourceUrl: 'https://wageindicator.org/en-in/work-in-india/role-and-pay/india-plumbers-and-pipe-fitters/',
    earningsSourceTitle: 'WageIndicator India — Plumbers and pipe fitters',
    earningsDate: '2026 range; accessed 9 Oct 2026',
    description: {
      en: 'Fit and repair water, drainage and other pipe systems in homes or work sites.',
      mr: 'घरात किंवा कामाच्या ठिकाणी पाणी, निचरा आणि इतर पाईप व्यवस्था बसवणे व दुरुस्त करणे.',
      hi: 'घर या काम की जगह पर पानी, निकासी और दूसरी पाइप व्यवस्था लगाना और ठीक करना।',
    },
    typicalDay: {
      en: 'Measure and join pipes, fit a tap or basin, and test that water flows without leaks.',
      mr: 'पाईप मोजणे व जोडणे, नळ किंवा बेसिन बसवणे आणि गळती नसल्याची खात्री करणे.',
      hi: 'पाइप नापना और जोड़ना, नल या बेसिन लगाना और रिसाव न होने की जाँच करना।',
    },
  },
};

function listing(
  name: string,
  location: string,
  entryEvidence: string,
  sourceUrl: string,
  sourceTitle: string,
  sourceDate: string,
  currentOfferingVerified: boolean,
  feeOrStipend: LocalizedText = feeUnpublished,
  feeSourceUrl: string | null = noFeeSource,
): ProviderEvidence {
  return { name, location, entryEvidence, sourceUrl, sourceTitle, sourceDate, currentOfferingVerified, feeOrStipend, feeSourceUrl };
}

export const providersByDistrict: Record<DistrictName, Record<RecommendedTrade, ProviderEvidence>> = {
  Pune: {
    Electrician: listing('Government Industrial Training Institute, Aundh Pune', 'Aundh, Pune City, Pune district', 'DVET lists Electrician (NSQF), 60 seats, for admission year 2024–25.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
    Welder: listing('Government Industrial Training Institute, Aundh Pune', 'Aundh, Pune City, Pune district', 'DVET lists Welder (NSQF) in two intake rows (100 and 20 seats) for admission year 2024–25; the current offering is unverified.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
    Plumber: listing('Government Industrial Training Institute, Aundh Pune', 'Aundh, Pune City, Pune district', 'DVET lists Plumber (NSQF), 48 seats, for admission year 2024–25.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
  },
  Nashik: {
    Electrician: listing('Government Industrial Training Institute Nashik', 'Babubhai Rathi Chowk, Trambak Road, Satpur, Nashik', 'The official institute page lists Electrician, 2 years, 120 seats; it publishes open-category fees of ₹1,950 and reserved-category fees of ₹950.', nashikProviderPage, 'Directorate of Vocational Education and Training — Government ITI Nashik', dNashik, true, feesNashik, nashikProviderPage),
    Welder: listing('Government Industrial Training Institute Nashik', 'Babubhai Rathi Chowk, Trambak Road, Satpur, Nashik', 'The official institute page lists Welder, 1 year, 60 seats; it publishes open-category fees of ₹2,150 and reserved-category fees of ₹950.', nashikProviderPage, 'Directorate of Vocational Education and Training — Government ITI Nashik', dNashik, true, feesNashikWelder, nashikProviderPage),
    Plumber: listing('Government Industrial Training Institute Nashik', 'Babubhai Rathi Chowk, Trambak Road, Satpur, Nashik', 'The official institute page lists Plumber, 1 year, 24 seats; it publishes open-category fees of ₹1,950 and reserved-category fees of ₹950.', nashikProviderPage, 'Directorate of Vocational Education and Training — Government ITI Nashik', dNashik, true, feesNashik, nashikProviderPage),
  },
  Satara: {
    Electrician: listing('Government Industrial Training Institute, Satara', 'Satara city, Satara district', 'DVET lists Electrician (NSQF), 40 seats, for admission year 2024–25.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
    Welder: listing('Government Industrial Training Institute, Satara', 'Satara city, Satara district', 'DVET lists Welder (NSQF), 40 seats, for admission year 2024–25; a separate Dual System Training row lists 20 seats.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
    Plumber: listing('Government Industrial Training Institute, Satara', 'Satara city, Satara district', 'DVET lists Plumber (NSQF), 24 seats, for admission year 2024–25.', directory2024, 'Maharashtra DVET — Trade Directory for Admission in Year 2024–25', d2024, false),
  },
  Nagpur: {
    Electrician: listing('Government Industrial Training Institute, Nagpur', 'Nagpur city, Nagpur district', 'DVET’s 2020–21 admission directory lists Electrician with intake 60 at Government ITI Nagpur; the current offering is not verified.', directory2020Nagpur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Nagpur region', d2020Nagpur, false),
    Welder: listing('Government Industrial Training Institute, Nagpur', 'Nagpur city, Nagpur district', 'DVET’s 2020–21 admission directory lists Welder with intake 60 at Government ITI Nagpur; the current offering is not verified.', directory2020Nagpur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Nagpur region', d2020Nagpur, false),
    Plumber: listing('Government Industrial Training Institute, Nagpur', 'Nagpur city, Nagpur district', 'DVET’s 2020–21 admission directory lists Plumber with intake 24 at Government ITI Nagpur; the current offering is not verified.', directory2020Nagpur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Nagpur region', d2020Nagpur, false),
  },
  Latur: {
    Electrician: listing('Government Industrial Training Institute, Latur', 'Latur city, Latur district', 'DVET’s 2020–21 directory shows two Electrician intake rows (20 and 40 seats) for Government ITI Latur; the current offering is not verified.', directory2020Latur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Aurangabad region', d2020Latur, false),
    Welder: listing('Government Industrial Training Institute, Latur', 'Latur city, Latur district', 'DVET’s 2020–21 directory lists Welder with intake 60 at Government ITI Latur; the current offering is not verified.', directory2020Latur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Aurangabad region', d2020Latur, false),
    Plumber: listing('Government Industrial Training Institute, Latur', 'Latur city, Latur district', 'DVET’s 2020–21 directory shows two Plumber rows of 24 seats each for Government ITI Latur; the current offering is not verified.', directory2020Latur, 'Maharashtra DVET — Trade Directory for Admission in Year 2020–21, Aurangabad region', d2020Latur, false),
  },
};

export const salaryMethodNote: LocalizedText = {
  en: 'India-wide starting-job estimate, not a district-specific starting offer or guarantee. Actual pay depends on employer, skills and location.',
  mr: 'भारतभरातील सुरुवातीच्या नोकरीचा अंदाज; जिल्ह्याची पगाराची ऑफर किंवा हमी नाही. प्रत्यक्ष कमाई नियोक्ता, कौशल्ये आणि ठिकाणानुसार बदलते.',
  hi: 'भारत में शुरुआती नौकरी का अनुमान; यह ज़िले का वेतन प्रस्ताव या गारंटी नहीं है। असली कमाई कंपनी, कौशल और जगह पर निर्भर करती है।',
};
