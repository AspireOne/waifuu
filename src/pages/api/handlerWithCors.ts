import { NextApiRequest, NextApiResponse } from "next";

export default function handlerWithCors(
  handler: (req: NextApiRequest, res: NextApiResponse) => any,
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
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

    return handler(req, res);
  };
}
