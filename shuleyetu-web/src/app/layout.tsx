import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import { ToastProvider } from "@/components/ToastProvider";
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
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 bg-slate-950/80 text-sm backdrop-blur">
              <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-3 py-3 md:px-4">
                <Link href="/" className="text-base font-semibold tracking-tight text-slate-50">
                  Shuleyetu
                </Link>
                <div className="flex items-center gap-4 text-xs md:text-sm">
                  <Link
                    href="/"
                    className="text-slate-300 hover:text-sky-400"
                  >
                    Home
                  </Link>
                  <Link
                    href="/vendors"
                    className="text-slate-300 hover:text-sky-400"
                  >
                    Vendors
                  </Link>
                  <Link
                    href="/orders"
                    className="text-slate-300 hover:text-sky-400"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-slate-300 hover:text-sky-400"
                  >
                    Dashboard
                  </Link>
                  <NavUser />
                </div>
              </nav>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
