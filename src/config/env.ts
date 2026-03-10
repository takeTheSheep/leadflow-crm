import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  REDIS_TOKEN: z.string().optional(),
});

export const env = envSchema.safeParse(process.env);

export const isProduction = process.env.NODE_ENV === "production";

