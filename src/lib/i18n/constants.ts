import locales from '@/locales';

export type Language = {
  key: keyof typeof locales;
  dir?: 'ltr' | 'rtl';
  fontScale?: number;
};

export const DEFAULT_NAMESPACE = 'common';

export const DEFAULT_LANGUAGE_KEY: Language['key'] = 'fr';

export type LanguageKey = Language['key'];
export const AVAILABLE_LANGUAGES: Language[] = [
  {
    key: 'fr',
  },
];
