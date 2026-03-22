"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils/cn";

type MarketingHeaderProps = {
  mobileTheme?: "light" | "dark";
};

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Testimonials" },
];

export function MarketingHeader({ mobileTheme }: MarketingHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--border)]/70 bg-white/82 backdrop-blur-lg",
        mobileTheme === "dark" ? "bg-white/82" : "",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg hero-gradient text-sm font-bold text-white">
            LF
          </span>
          <span className="text-lg font-bold text-heading">LeadFlow CRM</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted transition hover:text-heading">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Start Free Trial</Button>
          </Link>
        </div>

        <button
          type="button"
          className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-heading transition hover:bg-[var(--background-soft)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-3">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
