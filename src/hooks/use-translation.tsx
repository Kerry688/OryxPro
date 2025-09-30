'use client';

import { useLanguage } from '@/contexts/language-context';
import { getTranslation, Translations } from '@/lib/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof Translations): string => {
    return getTranslation(language, key);
  };
  
  return { t, language };
}
