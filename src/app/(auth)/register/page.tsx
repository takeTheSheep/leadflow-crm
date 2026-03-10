import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(139,124,255,0.16),transparent_35%),radial-gradient(circle_at_90%_15%,rgba(79,124,255,0.12),transparent_40%)]" />
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-heading">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to website
        </Link>
        <RegisterForm />
      </div>
    </main>
  );
}

