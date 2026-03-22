import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/button";

export function FinalCta() {
  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#101b30_0%,#09111f_100%)] p-5 md:hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[var(--blue)]/22 via-[var(--violet)]/20 to-emerald-400/18" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Final CTA</p>
          <h2 className="mt-2 text-2xl font-semibold !text-white">Start with a demo workspace and see your pipeline with fresh eyes.</h2>
          <p className="mt-3 max-w-[30ch] text-sm leading-6 text-slate-300">
            Seeded business-ready data lets you evaluate workflow, pipeline clarity, and rep follow-up in minutes.
          </p>
          <div className="mt-6 grid gap-3">
            <Link href="/register">
              <Button className="h-12 w-full justify-between rounded-2xl px-5 text-sm">
                Start Demo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/pricing" className="ring-focus inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/12 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]">
              Explore Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden surface-card p-8 text-center md:block">
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
    </>
  );
}

