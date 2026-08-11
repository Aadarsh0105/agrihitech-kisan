import type { LanguageCode, Translated } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

export const LANGUAGES: LanguageOption[] = [
{ code: 'en', label: 'English', native: 'English' },
{ code: 'hi', label: 'Hindi', native: 'हिन्दी' },
{ code: 'mr', label: 'Marathi', native: 'मराठी' },
{ code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
{ code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
{ code: 'ta', label: 'Tamil', native: 'தமிழ்' },
{ code: 'te', label: 'Telugu', native: 'తెలుగు' },
{ code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
{ code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
{ code: 'bn', label: 'Bengali', native: 'বাংলা' },
{ code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
{ code: 'as', label: 'Assamese', native: 'অসমীয়া' }];


/** Resolve a translated field with an English fallback. */
export function t(field: Translated | undefined, lang: LanguageCode = 'en'): string {
  if (!field) return '';
  return field[lang] ?? field.en ?? '';
}

/** Percentage of languages filled in for a translated field. */
export function translationCoverage(field: Translated): number {
  const filled = LANGUAGES.filter((l) => Boolean(field[l.code]?.trim())).length;
  return Math.round(filled / LANGUAGES.length * 100);
}

/** Create an empty translated value seeded with English text. */
export function translated(en: string, rest: Partial<Record<LanguageCode, string>> = {}): Translated {
  return { en, ...rest };
}