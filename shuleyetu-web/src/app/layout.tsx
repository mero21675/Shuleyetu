import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import { ToastProvider } from "@/components/ToastProvider";
import { MobileNav } from "@/components/ui/MobileNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuleyetu",
  description:
    "Tanzanian school supply marketplace for textbooks, uniforms, and stationery.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 text-sm backdrop-blur">
              <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-3 py-3 md:px-4">
                <Link href="/" className="text-base font-semibold tracking-tight text-slate-50">
                  Shuleyetu
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-4 text-xs md:text-sm">
                  <Link
                    href="/"
                    className="text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/vendors"
                    className="text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    Vendors
                  </Link>
                  <Link
                    href="/orders"
                    className="text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="h-4 w-px bg-slate-700" />
                  <ThemeToggle />
                  <NavUser />
                </div>

                {/* Mobile navigation */}
                <div className="flex items-center gap-2 md:hidden">
                  <ThemeToggle />
                  <NavUser />
                  <MobileNav />
                </div>
              </nav>
            </header>
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/80 py-6">
              <div className="mx-auto max-w-5xl px-3 md:px-4">
                <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
                  <p>&copy; {new Date().getFullYear()} Shuleyetu. School supplies made easy.</p>
                  <div className="flex items-center gap-4">
                    <Link href="/why-shuleyetu" className="hover:text-sky-400 transition-colors">
                      About
                    </Link>
                    <Link href="/vendors" className="hover:text-sky-400 transition-colors">
                      Vendors
                    </Link>
                    <Link href="/orders/track" className="hover:text-sky-400 transition-colors">
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
