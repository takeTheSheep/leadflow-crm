import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/70 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-muted md:px-6">
        <p>(c) {new Date().getFullYear()} LeadFlow CRM</p>
        <nav className="flex items-center gap-4">
          <Link href="/security" className="hover:text-heading">Security</Link>
          <Link href="/privacy" className="hover:text-heading">Privacy</Link>
          <Link href="/terms" className="hover:text-heading">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

