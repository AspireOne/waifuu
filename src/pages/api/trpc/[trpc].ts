import { createNextApiHandler } from "@trpc/server/adapters/next";
import cors from "cors";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { nodeHTTPRequestHandler } from "@trpc/server/src/adapters/node-http";
import { NextApiRequest, NextApiResponse } from "next";

// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

// @see https://nextjs.org/docs/api-routes/introduction
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // CORS preflight check.
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // finally pass the request on to the tRPC handler
  return nextApiHandler(req, res);
}
