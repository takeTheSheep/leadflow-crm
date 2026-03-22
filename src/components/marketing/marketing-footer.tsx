import Link from "next/link";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Blog" },
      { href: "/", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

type MarketingFooterProps = {
  mobileTheme?: "light" | "dark";
};

export function MarketingFooter({ mobileTheme }: MarketingFooterProps) {
  return (
    <footer className={mobileTheme ? "border-t border-[var(--border)] py-12" : "border-t border-[var(--border)] py-12"}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg hero-gradient text-xs font-bold text-white">
                LF
              </span>
              <span className="font-bold text-heading">LeadFlow CRM</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted">
              The modern CRM for teams that want to close more deals faster.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h4 className="mb-3 text-sm font-semibold text-heading">{column.heading}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted transition hover:text-heading">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-muted">
          (c) 2026 LeadFlow CRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
