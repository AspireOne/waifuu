import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import metaHandler from "@/server/lib/metaHandler";

// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // Allow cors.
  responseMeta() {
    return {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Request-Method": "*",
      },
    };
  },
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

export default metaHandler.public(nextApiHandler);
