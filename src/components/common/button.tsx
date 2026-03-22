import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClassName: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--blue)] text-white shadow-[0_6px_18px_-10px_rgba(42,141,124,0.55)] hover:brightness-105 hover:shadow-[0_12px_24px_-16px_rgba(42,141,124,0.65)] active:scale-[0.99]",
  secondary:
    "border border-[var(--border)] bg-white text-heading hover:border-[var(--blue)]/35 hover:bg-[var(--background-soft)] active:scale-[0.99]",
  ghost: "bg-transparent text-muted hover:bg-[var(--background-soft)] hover:text-heading",
  danger: "bg-[var(--rose)] text-white hover:bg-[#f95578] active:scale-[0.99]",
};

const sizeClassName: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs",
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
        "ring-focus inline-flex cursor-pointer items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      {...props}
    />
  );
});

