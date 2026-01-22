'use client';

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-6 md:py-8 safe-area-bottom">
      <div className="mx-auto max-w-5xl px-3 md:px-4">
        <div className="flex flex-col items-center justify-between gap-6 text-xs md:text-sm text-slate-400 md:flex-row">
          <p className="text-center md:text-left">© {currentYear} {t('footerCopyright')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link 
              href="/why-shuleyetu" 
              className="hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2 py-2"
            >
              {t('footerAbout')}
            </Link>
            <Link 
              href="/vendors" 
              className="hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2 py-2"
            >
              {t('footerVendors')}
            </Link>
            <Link 
              href="/orders/track" 
              className="hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2 py-2"
            >
              {t('footerTrackOrder')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
