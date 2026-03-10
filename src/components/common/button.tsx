import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClassName: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-[var(--blue)] to-[var(--violet)] text-white shadow-[0_18px_32px_-18px_rgba(79,124,255,0.85)] hover:brightness-105 active:scale-[0.99]",
  secondary:
    "border border-[var(--border)] bg-white text-heading hover:border-[var(--blue)]/40 hover:bg-[var(--blue-soft)]/40 active:scale-[0.99]",
  ghost: "bg-transparent text-muted hover:bg-white/70 hover:text-heading",
  danger: "bg-[var(--rose)] text-white hover:bg-[#f95578] active:scale-[0.99]",
};

const sizeClassName: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "ring-focus inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      {...props}
    />
  );
});

