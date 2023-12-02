import { env } from "@/server/env";
import { global } from "@/server/global";
import FormData from "form-data";
import Mailgun from "mailgun.js";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const emailClient = (global.emailClient ??= new Mailgun(FormData).client({
  username: "api",
  key: env.MAILGUN_API_KEY,
  timeout: 30_000,
  url: "https://api.eu.mailgun.net",
}));
