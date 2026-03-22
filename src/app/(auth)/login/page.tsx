import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-sm font-bold text-white">
              LF
            </span>
            <span className="text-lg font-bold text-heading">LeadFlow CRM</span>
          </Link>

          <Suspense fallback={<div className="surface-card p-6 text-sm text-muted">Loading sign-in form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>

      <section className="hero-gradient relative hidden flex-1 items-center justify-center overflow-hidden px-12 lg:flex">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.95) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-3xl font-bold text-white">Your pipeline, finally under control.</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Track every lead from first touch to closed deal with a CRM designed for speed, visibility, and clean execution.
          </p>
        </div>
      </section>
    </main>
  );
}

