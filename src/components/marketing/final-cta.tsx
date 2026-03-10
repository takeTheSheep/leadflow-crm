import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/button";

export function FinalCta() {
  return (
    <section className="surface-card relative overflow-hidden p-8 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[var(--blue-soft)]/45 via-[var(--violet-soft)]/45 to-[var(--teal-soft)]/45" />
      <div className="relative">
        <h2 className="text-3xl font-semibold text-heading">Ready to modernize your lead operations?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-body">
          Launch a demo workspace and explore the full LeadFlow CRM experience with seeded business-ready data.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <Button className="h-11 px-6">
              Start Demo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" className="h-11 px-6">
              Explore Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

