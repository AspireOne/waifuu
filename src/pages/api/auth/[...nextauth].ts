import NextAuth from "next-auth";

import { authOptions } from "~/server/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

// TODO: Do not duplicate this with [trpc].ts handler.
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
  NextAuth(authOptions);
}
