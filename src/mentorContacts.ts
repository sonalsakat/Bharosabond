export type MentorContactTarget = { phoneDigits: string; whatsappDigits: string };

// Deliberately non-routable placeholders. Replace only with programme-approved test numbers.
const placeholder: MentorContactTarget = {
  phoneDigits: '0000000000',
  whatsappDigits: '910000000000',
};

export const mentorContacts: Record<string, MentorContactTarget> = {
  asha: placeholder,
  ramesh: placeholder,
  sunita: placeholder,
  dattatray: placeholder,
  meena: placeholder,
  prakash: placeholder,
  lata: placeholder,
  santosh: placeholder,
  counsellor: placeholder,
};
