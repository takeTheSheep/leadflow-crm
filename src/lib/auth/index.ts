import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { AppError } from "@/lib/security/safe-error";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuthSession() {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.user.workspaceId || !session.user.role) {
    redirect("/login");
  }

  return session;
}

export async function requireApiSession() {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.user.workspaceId || !session.user.role) {
    throw new AppError("Unauthorized", 401);
  }

  return session;
}

