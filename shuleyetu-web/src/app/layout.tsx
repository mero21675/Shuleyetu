import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import { ToastProvider } from "@/components/ui/Toast";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MobileNav } from "@/components/ui/MobileNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuleyetu",
  description:
    "Tanzanian school supply marketplace for textbooks, uniforms, and stationery.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shuleyetu",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "Shuleyetu",
    description: "Tanzanian school supply marketplace for textbooks, uniforms, and stationery.",
    type: "website",
    locale: "en_TZ",
    siteName: "Shuleyetu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shuleyetu",
    description: "Tanzanian school supply marketplace for textbooks, uniforms, and stationery.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <LanguageProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 text-sm backdrop-blur safe-area-top">
                <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 md:gap-4 md:px-4 md:py-4">
                  <Link href="/" className="text-base font-semibold tracking-tight text-slate-50 flex-shrink-0 min-h-[44px] flex items-center">
                    Shuleyetu
                  </Link>

                  {/* Desktop navigation */}
                  <div className="hidden md:flex items-center gap-6 text-xs md:text-sm">
                    <Link
                      href="/"
                      className="text-slate-300 hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2"
                    >
                      Home
                    </Link>
                    <Link
                      href="/vendors"
                      className="text-slate-300 hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2"
                    >
                      Vendors
                    </Link>
                    <Link
                      href="/orders"
                      className="text-slate-300 hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-slate-300 hover:text-sky-400 transition-colors min-h-[44px] flex items-center px-2"
                    >
                      Dashboard
                    </Link>
                    <div className="h-4 w-px bg-slate-700" />
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <NavUser />
                  </div>

                  {/* Mobile navigation */}
                  <div className="flex items-center gap-1 md:hidden">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <NavUser />
                    <MobileNav />
                  </div>
                </nav>
              </header>
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
            </div>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
