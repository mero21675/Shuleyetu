'use client';

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-6">
      <div className="mx-auto max-w-5xl px-3 md:px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
          <p>© {currentYear} {t('footerCopyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="/why-shuleyetu" className="hover:text-sky-400 transition-colors">
              {t('footerAbout')}
            </Link>
            <Link href="/vendors" className="hover:text-sky-400 transition-colors">
              {t('footerVendors')}
            </Link>
            <Link href="/orders/track" className="hover:text-sky-400 transition-colors">
              {t('footerTrackOrder')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
