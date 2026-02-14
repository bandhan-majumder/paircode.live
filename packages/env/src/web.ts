import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url(),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
  },
  server: {
    RECIPIENT_EMAIL: z.string().email(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    DATABASE_URL: z.string().min(1),
    USER_EMAIL_ALIAS: z.string().email(),
    USER_EMAIL_PASS: z.string().min(1),
    USER_EMAIL: z.string().email(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    USER_EMAIL_ALIAS: process.env.USER_EMAIL_ALIAS,
    USER_EMAIL_PASS: process.env.USER_EMAIL_PASS,
    USER_EMAIL: process.env.USER_EMAIL,
  },
  emptyStringAsUndefined: true,
});
