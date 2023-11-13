import { env } from "@/server/env";
import FormData from "form-data";
import Mailgun, { Interfaces } from "mailgun.js";

const createClient = () => {
  const mailgun = new Mailgun(FormData);
  return mailgun.client({
    username: "api",
    key: env.MAILGUN_API_KEY,
    timeout: 30_000,
  });
};

const globalForMailgun = globalThis as unknown as {
  client: Interfaces.IMailgunClient | undefined;
};

export const emailClient = globalForMailgun.client ?? createClient();

if (process.env.NODE_ENV !== "production") globalForMailgun.client = emailClient;
