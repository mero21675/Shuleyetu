'use client';

import { useLanguage } from '@/components/LanguageProvider';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'sw' : 'en')}
      className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
      aria-label={`Switch to ${locale === 'en' ? 'Swahili' : 'English'}`}
    >
      {locale === 'en' ? '🇹🇿 SW' : '🇬🇧 EN'}
    </button>
  );
}
