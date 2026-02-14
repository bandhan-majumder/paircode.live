import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(identifier: string, config: { windowMs: number; max: number }): boolean {
  const key = `${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  } else {
    // Increment count
    entry.count++;

    if (entry.count > config.max) {
      return false;
    }
    return true;
  }
}

// Rate-limited procedures
export const rateLimitedPublicProcedure = (config: { windowMs: number; max: number }) =>
  publicProcedure.use(({ ctx, next }) => {
    // In production, get IP from request headers
    const identifier = "anonymous";
    
    if (!checkRateLimit(identifier, config)) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests, please try again later.",
      });
    }
    
    return next({ ctx });
  });

export const rateLimitedProtectedProcedure = (config: { windowMs: number; max: number }) =>
  protectedProcedure.use(({ ctx, next }) => {
    const identifier = ctx.session.user.id;
    
    if (!checkRateLimit(identifier, config)) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests, please try again later.",
      });
    }
    
    return next({ ctx });
  });
