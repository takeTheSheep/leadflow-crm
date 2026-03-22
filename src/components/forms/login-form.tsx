"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/common/button";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@leadflowcrm.dev",
      password: "DemoPass123!",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);

    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (!result?.ok) {
      setError("Invalid credentials or login blocked due to rate limiting.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-heading">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your workspace.</p>
      </div>

      <label className="space-y-1 text-sm">
        <span className="text-heading">Email</span>
        <input type="email" autoComplete="username" {...form.register("email")} className="field-base" />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-heading">Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...form.register("password")}
            className="field-base pr-10"
          />
          <button
            type="button"
            className="ring-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:text-heading"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="pt-2 text-center text-xs text-muted">Demo credentials are pre-filled. Just click sign in.</p>

      <p className="text-sm text-muted">
        Need a workspace?{" "}
        <Link href="/register" className="font-medium text-[var(--blue-deep)] hover:underline">
          Create demo account
        </Link>
      </p>
    </form>
  );
}

