"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <form onSubmit={onSubmit} className="relative w-full max-w-lg space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-heading">Create your workspace</h1>
        <p className="mt-2 text-sm text-muted">Set up your team environment, invite reps, and start tracking deals in one place.</p>
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              className="field-base pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:text-heading"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted">Min 10 chars, uppercase, lowercase, number, special.</p>
          )}
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted">Confirm password</span>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              className="field-base pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:text-heading"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p> : null}
        </label>
      </div>

      {resultMessage ? (
        <p className={`rounded-xl px-4 py-3 text-sm ${resultType === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
          {resultMessage}
        </p>
      ) : null}
      {errors.website ? <p className="text-sm text-rose-600">Unable to submit. Please try again.</p> : null}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Creating workspace..." : "Create Account"}
      </Button>

      <p className="text-sm text-muted">
        Already have access?{" "}
        <Link href="/login" className="font-medium text-[var(--blue-deep)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

