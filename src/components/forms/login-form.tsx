"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    <form onSubmit={onSubmit} className="surface-card w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to access your lead workspace.</p>
      </div>

      <label className="space-y-1 text-sm">
        <span className="text-muted">Email</span>
        <input type="email" {...form.register("email")} className="field-base" />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-muted">Password</span>
        <input
          type="password"
          {...form.register("password")}
          className="field-base"
        />
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-sm text-muted">
        Need a workspace? <Link href="/register" className="font-medium text-[var(--blue-deep)] hover:underline">Create demo account</Link>
      </p>
    </form>
  );
}

