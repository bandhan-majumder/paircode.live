import { auth } from "@paircode/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function createContext(opts: { req: Request }) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(Object.fromEntries(opts.req.headers.entries())),
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
