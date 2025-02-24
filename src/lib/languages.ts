export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  // Add more languages as needed
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'] | string;