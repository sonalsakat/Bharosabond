import type { Concern, LearnerGender, TradeName } from './concernAnalysis';
import type { Language } from './i18n';

export type LocalizedStory = { line: string; scenes: string[] };
export type MentorStory = {
  id: string; name: string; village: string; district: string; concern: Concern; trade: TradeName;
  learnerGender: LearnerGender; learnerDescription: string; languages: Language[]; company: string;
  durationSeconds: number; imageUrl: string; videoUrl?: string; story: Record<Language, LocalizedStory>;
};
export type MatchProfile = { concern: Concern; trade: TradeName | null; district: string; language: Language; learnerGender: LearnerGender | null };
export type RankedMentor = { mentor: MentorStory; score: number };

export const mentors: MentorStory[] = [
  {
    id: 'asha', name: 'Asha', village: 'Bhor', district: 'Pune', concern: 'Low pay', trade: 'Electrician', learnerGender: 'son', learnerDescription: 'Her son is an electrician.', languages: ['mr', 'hi'], company: 'Pune Solar Services', durationSeconds: 51, imageUrl: '/branding/story-asha.webp',
    story: {
      en: { line: 'Her son trained as an electrician and joined a local solar team.', scenes: ['When my son wanted to train as an electrician, I wondered whether he could earn steadily.', 'We visited a Pune workshop and saw him practise on a disconnected training board.', 'His teachers explained the safety routine, the tools and how an apprenticeship works.', 'He joined a local solar team and kept learning from the crew beside him.', 'Now, when neighbours ask, I can explain the work and the path he took.'] },
      mr: { line: 'तिच्या मुलाने इलेक्ट्रिशियनचे प्रशिक्षण घेतले आणि स्थानिक सौरऊर्जा पथकात काम सुरू केले.', scenes: ['मुलाला इलेक्ट्रिशियनचे प्रशिक्षण घ्यायचे होते, तेव्हा कमाई नियमित असेल का याची मला काळजी वाटली.', 'आम्ही पुण्यातील प्रशिक्षण कार्यशाळेला गेलो. त्याने बंद प्रशिक्षण फलकावर सराव केला.', 'शिक्षकांनी सुरक्षिततेची पद्धत, साधने आणि अप्रेंटिसशिप कशी चालते हे समजावले.', 'तो जवळच्या सौरऊर्जा पथकात रुजू झाला आणि कामातून शिकत राहिला.', 'आता शेजारी विचारतात तेव्हा हा व्यवसाय आणि त्याचा प्रवास मी समजावू शकते.'] },
      hi: { line: 'उनके बेटे ने इलेक्ट्रीशियन का प्रशिक्षण लिया और स्थानीय सौर टीम में काम शुरू किया।', scenes: ['जब मेरे बेटे ने इलेक्ट्रीशियन का प्रशिक्षण चुनना चाहा, मुझे नियमित कमाई की चिंता हुई।', 'हम पुणे की प्रशिक्षण कार्यशाला गए और उसने बंद अभ्यास बोर्ड पर काम किया।', 'शिक्षकों ने सुरक्षा के तरीके, औज़ार और अप्रेंटिसशिप समझाई।', 'वह पास की सौर टीम में शामिल हुआ और काम करते हुए सीखता रहा।', 'अब पड़ोसी पूछते हैं तो मैं काम और उसके रास्ते के बारे में बता सकती हूँ।'] },
    },
  },
  {
    id: 'ramesh', name: 'Ramesh', village: 'Sinnar', district: 'Nashik', concern: 'Safety', trade: 'Welder', learnerGender: 'son', learnerDescription: 'His son is a welder.', languages: ['mr', 'hi'], company: 'Sinnar Fabrication Works', durationSeconds: 54, imageUrl: '/branding/story-ramesh.webp',
    story: {
      en: { line: 'His son completed a safety-led welding course near Sinnar.', scenes: ['I worried when my son chose welding; I wanted to know how the workshop stayed safe.', 'We met his instructor and watched a supervised practice session.', 'My son learned to check his helmet, gloves and work area before he started.', 'He qualified and took a place with a fabrication team near Sinnar.', 'I still ask questions, but now I understand the training and the protections.'] },
      mr: { line: 'त्याच्या मुलाने सुरक्षिततेवर भर देणारे वेल्डिंग प्रशिक्षण पूर्ण केले.', scenes: ['मुलाने वेल्डिंग निवडले तेव्हा कार्यशाळेत सुरक्षितता कशी राखतात हे मला जाणून घ्यायचे होते.', 'आम्ही शिक्षकांना भेटलो आणि त्यांच्या देखरेखीखालील सराव पाहिला.', 'काम सुरू करण्यापूर्वी हेल्मेट, हातमोजे आणि कामाची जागा तपासायला मुलगा शिकला.', 'प्रशिक्षण पूर्ण करून तो सिन्नरजवळील फॅब्रिकेशन पथकात रुजू झाला.', 'मी अजूनही प्रश्न विचारतो; आता प्रशिक्षण आणि सुरक्षिततेच्या पद्धती समजतात.'] },
      hi: { line: 'उनके बेटे ने सुरक्षा पर ध्यान देने वाला वेल्डिंग प्रशिक्षण पूरा किया।', scenes: ['बेटे ने वेल्डिंग चुनी तो मैं जानना चाहता था कि कार्यशाला सुरक्षित कैसे रहती है।', 'हम शिक्षक से मिले और उनकी देखरेख में अभ्यास देखा।', 'काम शुरू करने से पहले बेटा हेलमेट, दस्ताने और काम की जगह जाँचना सीख गया।', 'प्रशिक्षण के बाद उसने सिन्नर के पास एक फ़ैब्रिकेशन टीम में काम शुरू किया।', 'मैं आज भी सवाल पूछता हूँ, लेकिन अब प्रशिक्षण और सुरक्षा के तरीके समझता हूँ।'] },
    },
  },
  {
    id: 'sunita', name: 'Sunita', village: 'Wai', district: 'Satara', concern: "Girls' safety", trade: 'Electrician', learnerGender: 'daughter', learnerDescription: 'Her daughter is an electrician.', languages: ['mr'], company: 'Wai Electrical Services', durationSeconds: 56, imageUrl: '/branding/story-sunita.webp',
    story: {
      en: { line: 'Her daughter trained as an electrician and joined a nearby team.', scenes: ['My daughter wanted electrical training, and I worried she might feel alone.', 'We went to the class together and met the women instructor.', 'She practised on a safe training board with the other learners.', 'After the course, she joined an electrician team near Wai.', 'Seeing her work with confidence helped our family decide together.'] },
      mr: { line: 'तिच्या मुलीने इलेक्ट्रिकल प्रशिक्षण घेऊन जवळच्या पथकात काम सुरू केले.', scenes: ['मुलीला इलेक्ट्रिकल प्रशिक्षण घ्यायचे होते, पण तिला एकटे वाटेल का याची मला काळजी होती.', 'आम्ही वर्गात एकत्र गेलो आणि महिला शिक्षिकेला भेटलो.', 'इतर विद्यार्थ्यांसोबत तिने सुरक्षित प्रशिक्षण फलकावर सराव केला.', 'अभ्यासक्रमानंतर ती वाईजवळील इलेक्ट्रिशियन पथकात रुजू झाली.', 'तिला आत्मविश्वासाने काम करताना पाहून आमच्या कुटुंबाने मिळून निर्णय घेतला.'] },
      hi: { line: 'उनकी बेटी ने इलेक्ट्रिकल प्रशिक्षण लिया और पास की टीम में काम शुरू किया।', scenes: ['मेरी बेटी इलेक्ट्रिकल प्रशिक्षण चाहती थी, मुझे चिंता थी कि वह अकेली महसूस करेगी।', 'हम साथ में कक्षा गए और महिला प्रशिक्षक से मिले।', 'उसने दूसरे विद्यार्थियों के साथ सुरक्षित अभ्यास बोर्ड पर काम किया।', 'कोर्स के बाद वह वाई के पास इलेक्ट्रीशियन टीम में शामिल हुई।', 'उसे आत्मविश्वास से काम करते देखकर परिवार ने मिलकर फैसला किया।'] },
    },
  },
  {
    id: 'dattatray', name: 'Dattatray', village: 'Ausa', district: 'Latur', concern: 'Degree is better', trade: 'Plumber', learnerGender: 'son', learnerDescription: 'His son left a BA course and trained in plumbing.', languages: ['mr', 'hi'], company: 'Ausa Plumbing Co-operative', durationSeconds: 53, imageUrl: '/branding/story-dattatray.webp',
    story: {
      en: { line: 'His son left a BA course and chose a practical plumbing diploma.', scenes: ['My son left his BA course and asked about a practical plumbing diploma.', 'I was unsure whether changing direction would lead to steady work.', 'We visited the centre and saw the pipe-fitting lessons and assessment steps.', 'He earned his diploma and began assisting a local plumbing crew.', 'I now tell relatives to compare the course with the learner’s own goals.'] },
      mr: { line: 'त्याने BA अभ्यासक्रम सोडून प्लंबिंगचा व्यावहारिक डिप्लोमा निवडला.', scenes: ['मुलाने BA अभ्यासक्रम सोडला आणि प्लंबिंगच्या व्यावहारिक डिप्लोमाबद्दल विचारले.', 'मार्ग बदलल्याने नियमित काम मिळेल का, याबद्दल मी साशंक होतो.', 'आम्ही प्रशिक्षण केंद्र पाहिले; पाईप जोडण्याचे धडे आणि परीक्षेची पद्धत समजली.', 'डिप्लोमा मिळवल्यावर तो स्थानिक प्लंबिंग पथकासोबत काम करू लागला.', 'आता नातेवाईकांना विद्यार्थ्याच्या ध्येयाशी अभ्यासक्रम जुळतो का हे पाहायला सांगतो.'] },
      hi: { line: 'उन्होंने BA छोड़कर प्लंबिंग में व्यावहारिक डिप्लोमा चुना।', scenes: ['बेटे ने BA की पढ़ाई छोड़ दी और प्लंबिंग डिप्लोमा के बारे में पूछा।', 'मुझे भरोसा नहीं था कि रास्ता बदलने पर नियमित काम मिलेगा।', 'हम केंद्र गए और पाइप जोड़ने की कक्षा तथा परीक्षा की प्रक्रिया देखी।', 'डिप्लोमा के बाद उसने स्थानीय प्लंबिंग टीम के साथ काम शुरू किया।', 'अब मैं रिश्तेदारों से कहता हूँ कि कोर्स को बच्चे के अपने लक्ष्य से मिलाएँ।'] },
    },
  },
  {
    id: 'meena', name: 'Meena', village: 'Katol', district: 'Nagpur', concern: 'Respect', trade: 'Welder', learnerGender: 'daughter', learnerDescription: 'Her daughter completed welding training.', languages: ['mr', 'hi'], company: 'Katol Metalworks', durationSeconds: 57, imageUrl: '/branding/story-meena.webp',
    story: {
      en: { line: 'Her daughter completed welding training and works with a fabrication team.', scenes: ['My daughter chose welding, and we wondered whether people would respect the work.', 'We visited a fabrication shop and watched her explain a metal joint she made.', 'She learned safe working habits and how to read a simple job drawing.', 'She now works with a welding team near Katol.', 'Skill has given her a clear way to answer questions about her work.'] },
      mr: { line: 'तिच्या मुलीने वेल्डिंगचे प्रशिक्षण पूर्ण करून फॅब्रिकेशन पथकात काम सुरू केले.', scenes: ['मुलीने वेल्डिंग निवडले; या कामाला लोक आदर देतील का, याची आम्हाला शंका होती.', 'फॅब्रिकेशन दुकानात आम्ही तिने जोडलेला धातूचा सांधा समजावून सांगताना पाहिला.', 'सुरक्षित कामाची सवय आणि साधे कामाचे चित्र वाचणे तिने शिकले.', 'आता ती काटोलजवळील वेल्डिंग पथकात काम करते.', 'आपले काम काय आहे हे सांगण्यासाठी तिच्याकडे आता कौशल्यपूर्ण उत्तर आहे.'] },
      hi: { line: 'उनकी बेटी ने वेल्डिंग प्रशिक्षण पूरा किया और फ़ैब्रिकेशन टीम में काम करती है।', scenes: ['बेटी ने वेल्डिंग चुनी; हमें चिंता थी कि लोग इस काम का सम्मान करेंगे या नहीं।', 'फ़ैब्रिकेशन की दुकान पर हमने उसे अपना बनाया जोड़ समझाते देखा।', 'उसने सुरक्षित काम के तरीके और आसान काम का चित्र पढ़ना सीखा।', 'अब वह काटोल के पास वेल्डिंग टीम के साथ काम करती है।', 'अपने हुनर से वह लोगों को अपने काम के बारे में साफ़ बता पाती है।'] },
    },
  },
  {
    id: 'prakash', name: 'Prakash', village: 'Baramati', district: 'Pune', concern: 'Cost', trade: 'Electrician', learnerGender: 'son', learnerDescription: 'His son is an electrical apprentice.', languages: ['mr', 'hi'], company: 'Baramati Electrical Services', durationSeconds: 55, imageUrl: '/branding/story-prakash.webp',
    story: {
      en: { line: 'His family asked about fee support before his son started electrical training.', scenes: ['Training costs worried our family when my son chose electrical work.', 'We asked the institute about scholarships, fees and apprenticeship stipends.', 'A staff member showed us which aid forms our family could apply for.', 'My son joined an electrical apprenticeship and receives support under its terms.', 'We planned the expenses together before he enrolled.'] },
      mr: { line: 'मुलाने इलेक्ट्रिकल प्रशिक्षण सुरू करण्यापूर्वी त्याच्या कुटुंबाने फी मदतीबद्दल विचारले.', scenes: ['मुलाने इलेक्ट्रिकल काम निवडले तेव्हा प्रशिक्षणाच्या खर्चाची आम्हाला काळजी वाटली.', 'आम्ही संस्थेकडे शिष्यवृत्ती, फी आणि अप्रेंटिसशिप स्टायपेंडबद्दल विचारले.', 'आमच्या कुटुंबाला कोणते मदत अर्ज करता येतील हे कर्मचाऱ्यांनी दाखवले.', 'मुलगा इलेक्ट्रिकल अप्रेंटिसशिपमध्ये रुजू झाला आणि ठरलेल्या अटींनुसार मदत मिळवतो.', 'प्रवेश घेण्यापूर्वी आम्ही खर्चाचा आराखडा एकत्र तयार केला.'] },
      hi: { line: 'बेटे के प्रशिक्षण से पहले परिवार ने फीस की मदद के बारे में पूछा।', scenes: ['बेटे ने इलेक्ट्रिकल काम चुना तो प्रशिक्षण के खर्च की चिंता हुई।', 'हमने संस्थान से छात्रवृत्ति, फीस और अप्रेंटिसशिप के स्टाइपेंड के बारे में पूछा।', 'कर्मचारी ने बताया कि परिवार किन सहायता फ़ॉर्मों के लिए आवेदन कर सकता है।', 'बेटे ने इलेक्ट्रिकल अप्रेंटिसशिप शुरू की और उसकी शर्तों के अनुसार सहायता पाता है।', 'दाख़िले से पहले हमने मिलकर खर्चों की योजना बनाई।'] },
    },
  },
  {
    id: 'lata', name: 'Lata', village: 'Igatpuri', district: 'Nashik', concern: 'Degree is better', trade: 'Drafting technician', learnerGender: 'daughter', learnerDescription: 'She studied architecture, then chose a CAD diploma and works as a drafting technician.', languages: ['mr', 'hi'], company: 'Igatpuri Drafting Studio', durationSeconds: 59, imageUrl: '/branding/story-lata.webp',
    story: {
      en: { line: 'After an architecture degree, she chose a CAD diploma and found drafting work.', scenes: ['After studying architecture, I found I wanted practical drafting work.', 'My family asked if another diploma was the right next step.', 'I tried a short CAD course and liked turning drawings into clear plans.', 'I completed the diploma and found a drafting role near Igatpuri.', 'My experience shows that work paths can change as a person’s interests grow.'] },
      mr: { line: 'आर्किटेक्चरचे शिक्षण घेतल्यानंतर तिने CAD डिप्लोमा निवडला आणि ड्राफ्टिंगचे काम मिळवले.', scenes: ['आर्किटेक्चरचे शिक्षण घेतल्यानंतर मला प्रत्यक्ष ड्राफ्टिंगचे काम आवडेल असे जाणवले.', 'आणखी एक डिप्लोमा पुढचे योग्य पाऊल आहे का, असे माझ्या कुटुंबाने विचारले.', 'मी छोटा CAD अभ्यासक्रम पाहिला आणि नकाशांना स्पष्ट आराखड्यात बदलायला मला आवडले.', 'डिप्लोमा पूर्ण करून मला इगतपुरीजवळ ड्राफ्टिंगचे काम मिळाले.', 'आवड वाढली की कामाचा मार्ग बदलू शकतो, हे माझ्या अनुभवातून समजले.'] },
      hi: { line: 'आर्किटेक्चर पढ़ने के बाद उन्होंने CAD डिप्लोमा चुना और ड्राफ्टिंग का काम पाया।', scenes: ['आर्किटेक्चर पढ़ने के बाद मुझे हाथ से ड्राफ्टिंग का काम करना अच्छा लगा।', 'परिवार ने पूछा कि क्या एक और डिप्लोमा अगला सही कदम होगा।', 'मैंने छोटा CAD कोर्स आज़माया और रेखाचित्रों को साफ़ नक्शों में बदलना पसंद आया।', 'डिप्लोमा पूरा करके मुझे इगतपुरी के पास ड्राफ्टिंग का काम मिला।', 'मेरे अनुभव से पता चलता है कि रुचि बढ़े तो काम का रास्ता भी बदल सकता है।'] },
    },
  },
  {
    id: 'santosh', name: 'Santosh', village: 'Karad', district: 'Satara', concern: 'Respect', trade: 'Plumber', learnerGender: 'son', learnerDescription: 'His son is a trained plumber.', languages: ['mr'], company: 'Karad Waterworks', durationSeconds: 52, imageUrl: '/branding/story-santosh.webp',
    story: {
      en: { line: 'His son trained as a plumber and works with a local repair team.', scenes: ['My son wanted to become a plumber; our relatives did not always see the skill in it.', 'We visited a work site and saw him measure pipes and check the water flow.', 'His training covered tools, fittings, safe repair and talking to customers.', 'He joined a plumbing team in Karad and built a regular work routine.', 'Now I can describe the care and responsibility this trade takes.'] },
      mr: { line: 'त्याच्या मुलाने प्लंबरचे प्रशिक्षण घेतले आणि स्थानिक दुरुस्ती पथकात काम सुरू केले.', scenes: ['मुलाला प्लंबर व्हायचे होते; या कामातील कौशल्य नातेवाईकांना नेहमी दिसत नव्हते.', 'आम्ही कामाची जागा पाहिली. तो पाईप मोजत होता आणि पाण्याचा प्रवाह तपासत होता.', 'साधने, जोडणी, सुरक्षित दुरुस्ती आणि ग्राहकांशी बोलणे हे प्रशिक्षणात होते.', 'तो कराडमधील प्लंबिंग पथकात रुजू झाला आणि नियमित काम सुरू केले.', 'या कामासाठी किती काळजी आणि जबाबदारी लागते हे मी आता सांगू शकतो.'] },
      hi: { line: 'उनके बेटे ने प्लंबर का प्रशिक्षण लिया और स्थानीय मरम्मत टीम में काम शुरू किया।', scenes: ['बेटा प्लंबर बनना चाहता था; रिश्तेदारों को इस काम का हुनर साफ़ नहीं दिखता था।', 'हम काम की जगह गए और उसे पाइप नापते और पानी का बहाव जाँचते देखा।', 'प्रशिक्षण में औज़ार, जोड़, सुरक्षित मरम्मत और ग्राहकों से बात करना शामिल था।', 'वह कराड की प्लंबिंग टीम में जुड़ा और नियमित काम करने लगा।', 'अब मैं बता सकता हूँ कि इस काम में कितनी सावधानी और ज़िम्मेदारी चाहिए।'] },
    },
  },
];

export function rankMentors(profile: MatchProfile): RankedMentor[] {
  return mentors.map((mentor) => {
    const score = (mentor.concern === profile.concern ? 100 : 0)
      + (profile.trade && mentor.trade === profile.trade ? 48 : 0)
      + (mentor.district === profile.district ? 24 : 0)
      + (mentor.languages.includes(profile.language) ? 16 : 0)
      + (profile.learnerGender && mentor.learnerGender === profile.learnerGender ? 14 : 0);
    return { mentor, score };
  }).sort((left, right) => right.score - left.score || left.mentor.id.localeCompare(right.mentor.id));
}
