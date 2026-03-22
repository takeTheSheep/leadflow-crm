import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="animate-reveal w-full max-w-lg">
            <Link href="/" className="mb-10 inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg hero-gradient text-sm font-bold text-white">
                LF
              </span>
              <span className="text-lg font-bold text-heading">LeadFlow CRM</span>
            </Link>

            <Link href="/" className="mb-5 inline-flex items-center gap-1 text-sm text-muted transition hover:text-heading">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to website
            </Link>

            <RegisterForm />
          </div>
        </section>

        <section className="hero-gradient relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center lg:px-12">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.95) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="animate-reveal relative z-10 max-w-md text-white">
            <h2 className="text-3xl font-bold leading-tight">Launch a cleaner pipeline for your revenue team</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/72">
              Spin up your workspace, invite reps, and move from scattered leads to a structured deal flow in minutes.
            </p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Instant workspace setup</p>
                <p className="mt-1 text-sm text-white/70">Preconfigured stages, analytics, and team access controls.</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Built for ops clarity</p>
                <p className="mt-1 text-sm text-white/70">Track lead quality, response time, and forecast movement from day one.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

