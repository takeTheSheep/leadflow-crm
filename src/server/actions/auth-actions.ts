"use server";

import { registerDemoUser } from "@/lib/auth/register";
import { toSafeError } from "@/lib/security/safe-error";

export type AuthActionState = {
  success: boolean;
  message: string;
};

export async function registerAction(payload: unknown): Promise<AuthActionState> {
  try {
    await registerDemoUser(payload);

    return {
      success: true,
      message: "Registration successful. You can now sign in.",
    };
  } catch (error) {
    const safe = toSafeError(error, "Registration failed.");

    return {
      success: false,
      message: safe.message,
    };
  }
}

