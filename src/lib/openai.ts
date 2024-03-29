import { env } from "@/server/env";
import openai from "openai";

export const OpenAI = new openai({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": `${"https://waifuu.com"}`,
    "X-Title": `${"Waifuu"}`,
    "Content-Type": "application/json",
  },
});
