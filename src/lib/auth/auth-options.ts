import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation/auth-schemas";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const rate = checkRateLimit({
          key: `auth:login:${email.toLowerCase()}`,
          windowMs: 60_000,
          limit: 8,
        });

        if (!rate.allowed) {
          await prisma.loginEvent.create({
            data: {
              email,
              success: false,
              reason: "Rate limited",
              ipAddress: req?.headers?.["x-forwarded-for"] as string | undefined,
              userAgent: req?.headers?.["user-agent"],
            },
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase().trim(),
          },
          include: {
            memberships: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        const membership = user?.memberships.find((item) => item.isDefault) ?? user?.memberships[0];

        if (!user || !user.passwordHash || !membership) {
          await prisma.loginEvent.create({
            data: {
              workspaceId: membership?.workspaceId,
              userId: user?.id,
              email,
              success: false,
              reason: "Invalid credentials",
              ipAddress: req?.headers?.["x-forwarded-for"] as string | undefined,
              userAgent: req?.headers?.["user-agent"],
            },
          });
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
          await prisma.loginEvent.create({
            data: {
              workspaceId: membership.workspaceId,
              userId: user.id,
              email,
              success: false,
              reason: "Invalid password",
              ipAddress: req?.headers?.["x-forwarded-for"] as string | undefined,
              userAgent: req?.headers?.["user-agent"],
            },
          });
          return null;
        }

        await Promise.all([
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }),
          prisma.loginEvent.create({
            data: {
              workspaceId: membership.workspaceId,
              userId: user.id,
              email,
              success: true,
              ipAddress: req?.headers?.["x-forwarded-for"] as string | undefined,
              userAgent: req?.headers?.["user-agent"],
            },
          }),
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: membership.role,
          workspaceId: membership.workspaceId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.role = user.role;
        token.workspaceId = user.workspaceId;
      }

      if (token.sub && (!token.role || !token.workspaceId)) {
        const membership = await prisma.membership.findFirst({
          where: {
            userId: token.sub,
          },
          orderBy: {
            isDefault: "desc",
          },
        });

        if (membership) {
          token.role = membership.role;
          token.workspaceId = membership.workspaceId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.sub || !token.role || !token.workspaceId) {
        return session;
      }

      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.workspaceId = token.workspaceId;

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (!token?.sub) {
        return;
      }

      const membership = await prisma.membership.findFirst({
        where: { userId: token.sub },
        select: { workspaceId: true },
      });

      await prisma.loginEvent.create({
        data: {
          workspaceId: membership?.workspaceId,
          userId: token.sub,
          email: token.email ?? "unknown",
          success: true,
          reason: "User signed out",
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

