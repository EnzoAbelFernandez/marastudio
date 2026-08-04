'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { type Locale, type Dictionary, dictionaries } from './dictionaries';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'mara_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Spanish for server side rendering / initial hydration match
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    // On client mount, check saved preference in localStorage or auto-detect browser language
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'es' || saved === 'en') {
      setLocaleState(saved);
    } else if (typeof window !== 'undefined' && window.navigator && window.navigator.language) {
      const browserLang = window.navigator.language.toLowerCase();
      const defaultLocale: Locale = browserLang.startsWith('es') ? 'es' : 'en';
      setLocaleState(defaultLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
