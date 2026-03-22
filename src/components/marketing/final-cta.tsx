import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/button";

export function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="hero-gradient relative overflow-hidden rounded-2xl px-8 py-12 text-center md:px-16 md:py-16">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.95) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight !text-white md:text-4xl">Ready to transform your sales process?</h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/75 md:text-lg">
              Join 2,400+ teams already using LeadFlow to close more deals.
            </p>
            <Link href="/register">
              <Button className="mt-8 h-12 border border-white/20 bg-white/12 px-8 text-base text-white shadow-none hover:bg-white/18">
                Start Free Trial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
