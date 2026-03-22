import Link from "next/link";
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react";
import { Button } from "@/components/common/button";

const stats = [
  { icon: Users, label: "Active Teams", value: "2,400+" },
  { icon: BarChart3, label: "Deals Closed", value: "$187M" },
  { icon: Zap, label: "Faster Close", value: "3.2x" },
];

export function HeroSection() {
  return (
    <section className="hero-gradient relative flex min-h-[90vh] items-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.95) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 text-center md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl">
          <span className="animate-reveal mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Now with AI-powered lead scoring
          </span>

          <h1 className="animate-reveal text-4xl font-extrabold leading-[1.05] tracking-tight !text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Close more deals,
            <br />
            faster than ever
          </h1>

          <p className="animate-reveal-delayed mx-auto mb-10 mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl">
            The CRM built for modern sales teams. Capture leads, manage pipelines, and convert prospects into loyal
            customers, all in one place.
          </p>

          <div className="animate-reveal-delayed-2 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/register">
              <Button className="h-12 w-full border border-white/20 bg-white/12 px-8 text-base text-white shadow-none hover:bg-white/18 sm:w-auto">
                Start Free Trial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="h-12 w-full px-8 text-base text-white/85 hover:bg-white/10 hover:text-white sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="animate-reveal-delayed-2 mx-auto mt-16 grid max-w-md grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-white/55" aria-hidden />
                <div className="text-xl font-bold tabular-nums text-white sm:text-2xl">{stat.value}</div>
                <div className="mt-0.5 text-xs text-white/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
