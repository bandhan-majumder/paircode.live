import { appRouter } from '@paircode/api/routers/index';
import { createContext } from '@paircode/api/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => createContext({ req }),
  });

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
