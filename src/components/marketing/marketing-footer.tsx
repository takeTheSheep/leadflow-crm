import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type MarketingFooterProps = {
  mobileTheme?: "light" | "dark";
};

export function MarketingFooter({ mobileTheme = "light" }: MarketingFooterProps) {
  const isDarkMobile = mobileTheme === "dark";

  return (
    <footer
      className={cn(
        "border-t py-8",
        isDarkMobile ? "border-white/10 bg-[#050b14] pb-28 md:border-white/70 md:bg-transparent md:py-8" : "border-white/70",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between md:px-6",
          isDarkMobile ? "text-slate-400 md:text-muted" : "text-muted",
        )}
      >
        <p>(c) {new Date().getFullYear()} LeadFlow CRM</p>
        <nav className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link
            href="/security"
            className={cn(
              "inline-flex min-h-12 items-center rounded-xl pr-3 transition",
              isDarkMobile ? "hover:text-white md:hover:text-heading" : "hover:text-heading",
            )}
          >
            Security
          </Link>
          <Link
            href="/privacy"
            className={cn(
              "inline-flex min-h-12 items-center rounded-xl pr-3 transition",
              isDarkMobile ? "hover:text-white md:hover:text-heading" : "hover:text-heading",
            )}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className={cn(
              "inline-flex min-h-12 items-center rounded-xl pr-3 transition",
              isDarkMobile ? "hover:text-white md:hover:text-heading" : "hover:text-heading",
            )}
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

