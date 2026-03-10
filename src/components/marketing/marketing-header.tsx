import Link from "next/link";
import { Button } from "@/components/common/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] text-sm font-bold text-white">
            LF
          </span>
          <span className="font-semibold text-heading">LeadFlow CRM</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/features" className="hover:text-heading">Features</Link>
          <Link href="/pricing" className="hover:text-heading">Pricing</Link>
          <Link href="/security" className="hover:text-heading">Security</Link>
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
    </header>
  );
}

