"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/common/button";
import { registerSchema } from "@/lib/validation/auth-schemas";

const schema = registerSchema;

type Values = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultType, setResultType] = useState<"success" | "error" | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      workspaceName: "",
      email: "",
      password: "",
      confirmPassword: "",
      website: "",
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await registerAction(values);

      if (!response.success) {
        setResultType("error");
        setResultMessage(response.message);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setResultType("success");
        setResultMessage("Account created. Sign in to continue.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface-card relative w-full max-w-lg space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Create demo workspace</h1>
        <p className="mt-1 text-sm text-muted">Set up your team environment in under two minutes.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted">Your name</span>
          <input {...form.register("name")} className="field-base" />
          {errors.name ? <p className="text-xs text-rose-600">{errors.name.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted">Workspace name</span>
          <input
            {...form.register("workspaceName")}
            className="field-base"
          />
          {errors.workspaceName ? <p className="text-xs text-rose-600">{errors.workspaceName.message}</p> : null}
        </label>
      </div>

      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        {...form.register("website")}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <label className="space-y-1 text-sm">
        <span className="text-muted">Email</span>
        <input type="email" {...form.register("email")} className="field-base" />
        {errors.email ? <p className="text-xs text-rose-600">{errors.email.message}</p> : null}
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted">Password</span>
          <input
            type="password"
            {...form.register("password")}
            className="field-base"
          />
          {errors.password ? (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted">Min 10 chars, uppercase, lowercase, number, special.</p>
          )}
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted">Confirm password</span>
          <input
            type="password"
            {...form.register("confirmPassword")}
            className="field-base"
          />
          {errors.confirmPassword ? <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p> : null}
        </label>
      </div>

      {resultMessage ? (
        <p className={`text-sm ${resultType === "error" ? "text-rose-600" : "text-emerald-600"}`}>{resultMessage}</p>
      ) : null}
      {errors.website ? <p className="text-sm text-rose-600">Unable to submit. Please try again.</p> : null}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Creating workspace..." : "Create Account"}
      </Button>

      <p className="text-sm text-muted">
        Already have access? <Link href="/login" className="font-medium text-[var(--blue-deep)] hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

