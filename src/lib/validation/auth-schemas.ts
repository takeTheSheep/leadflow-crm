import { z } from "zod";
import { sanitizeTextInput } from "@/lib/security/sanitize";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80),
    workspaceName: z.string().min(2, "Workspace name must be at least 2 characters").max(80),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .max(128)
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    website: z.string().max(0, "Invalid submission").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform((data) => ({
    ...data,
    name: sanitizeTextInput(data.name),
    workspaceName: sanitizeTextInput(data.workspaceName),
    email: data.email.toLowerCase().trim(),
  }));

