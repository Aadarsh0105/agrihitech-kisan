import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { translations, type TranslationKey } from "./translations";
import { LANGUAGES, type Locale } from "./languages";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;

  t: (key: TranslationKey) => string;

  tv: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "agrimandi.locale";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";

    const saved = localStorage.getItem(STORAGE_KEY);

    const exists = LANGUAGES.some((l) => l.code === saved);

    return exists ? (saved as Locale) : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);

    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const toggleLocale = useCallback(() => {
    const currentIndex = LANGUAGES.findIndex((l) => l.code === locale);

    const nextIndex = (currentIndex + 1) % LANGUAGES.length;

    setLocaleState(LANGUAGES[nextIndex].code);
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey) => {
      return (
        translations[locale as keyof typeof translations]?.[key] ??
        translations.en[key] ??
        key
      );
    },
    [locale]
  );

  const tv = useCallback(
    (en: string, hi: string) => {
      return locale === "hi" ? hi : en;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        tv,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}