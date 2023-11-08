import { retrieveUser } from "@/server/lib/retrieveUser";
import { User } from "@prisma/client";
import { wrapApiHandlerWithSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export type MetaHandlerContext = {
  user: User | null;
};

export default {
  public: <T extends MetaHandlerContext>(
    // biome-ignore lint/suspicious/noExplicitAny:
    handler: (req: NextApiRequest, res: NextApiResponse, ctx: T) => any,
  ) => metaHandler(handler),

  protected: <T extends MetaHandlerContext & { user: User }>(
    // biome-ignore lint/suspicious/noExplicitAny:
    handler: (req: NextApiRequest, res: NextApiResponse, ctx: T) => any,
  ) => metaHandler(handler, { protected: true }),
};

/**
 * A wrapper around a Next.js API handler that enabled CORS and various useful abstractions.
 * @param handler
 * @param options
 */
function metaHandler<T extends MetaHandlerContext>(
  // biome-ignore lint/suspicious/noExplicitAny:
  handler: (req: NextApiRequest, res: NextApiResponse, ctx: T) => any,
  options?: {
    /** If true, the handler will require a user to be logged in and user field will not be null. */
    protected?: boolean;
  },
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // CORS preflight check.
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    const user = await retrieveUser(req);

    if (options?.protected && !user) {
      res.status(401).send("Unauthorized");
      return;
    }

    // Make the parametrizedRoute empty - it seems to be automatically added from the GET request.
    return wrapApiHandlerWithSentry(handler, "")(req, res, {
      user: user,
    } as T);
  };
}
