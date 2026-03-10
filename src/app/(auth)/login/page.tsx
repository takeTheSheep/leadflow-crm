import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(79,124,255,0.18),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(60,199,178,0.12),transparent_42%)]" />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-heading">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to website
        </Link>
        <Suspense fallback={<div className="surface-card p-6 text-sm text-muted">Loading sign-in form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

