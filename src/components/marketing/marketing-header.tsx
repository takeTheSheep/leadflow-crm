"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils/cn";

type MarketingHeaderProps = {
  mobileTheme?: "light" | "dark";
};

const mobileNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];

export function MarketingHeader({ mobileTheme = "light" }: MarketingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDarkMobile = mobileTheme === "dark";

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        isDarkMobile ? "border-white/10 bg-[#08111f]/78 md:border-white/70 md:bg-white/75" : "border-white/70 bg-white/75",
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between md:hidden">
          <Link href="/" className="inline-flex min-h-12 min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(79,124,255,0.85)]">
              LF
            </span>
            <span className={cn("truncate font-semibold", isDarkMobile ? "text-white" : "text-heading")}>LeadFlow CRM</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/register" className="hidden min-[390px]:block" onClick={() => setMenuOpen(false)}>
              <Button className="h-12 rounded-2xl px-4 text-sm">Book Demo</Button>
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((current) => !current)}
              className={cn(
                "ring-focus inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition",
                isDarkMobile
                  ? "border-white/12 bg-white/[0.06] text-white hover:bg-white/10"
                  : "border-[var(--border)] bg-white text-heading hover:bg-[var(--background-soft)]",
              )}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between md:flex">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] text-sm font-bold text-white">
              LF
            </span>
            <span className="font-semibold text-heading">LeadFlow CRM</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            {mobileNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-heading">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="ring-focus rounded-xl px-3 py-2 text-sm text-muted hover:bg-[var(--background-soft)] hover:text-heading">
              Sign in
            </Link>
            <Link href="/register">
              <Button className="h-9">Get Demo</Button>
            </Link>
          </div>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-[73px] z-40 bg-[#030813]/62 md:hidden"
            />
            <div className="absolute inset-x-0 top-full z-50 px-4 pt-3 md:hidden">
              <div
                className={cn(
                  "mx-auto w-full max-w-7xl rounded-[28px] border p-4 shadow-[0_28px_80px_-42px_rgba(0,0,0,0.88)] backdrop-blur-2xl",
                  isDarkMobile
                    ? "border-white/10 bg-[rgba(9,18,32,0.98)] text-slate-200"
                    : "border-white/70 bg-[rgba(255,255,255,0.98)] text-heading",
                )}
              >
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", isDarkMobile ? "text-slate-400" : "text-muted")}>
                  Sales CRM
                </p>
                <div className="mt-3 grid gap-2">
                  {mobileNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "ring-focus flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-medium transition",
                        isDarkMobile ? "bg-white/[0.06] text-white hover:bg-white/10" : "bg-[var(--background-soft)] text-heading hover:bg-white",
                      )}
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ))}
                </div>

                <div className="mt-4 grid gap-2">
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <Button className="h-12 w-full justify-between rounded-2xl px-4 text-sm">
                      Start Demo
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "ring-focus flex min-h-12 items-center justify-center rounded-2xl text-sm font-medium transition",
                      isDarkMobile ? "border border-white/12 text-slate-200 hover:bg-white/[0.06]" : "border border-[var(--border)] text-heading hover:bg-[var(--background-soft)]",
                    )}
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}

