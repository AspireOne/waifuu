import { env } from "@/server/env";
import openai from "openai";

export const OpenAI = new openai({
  apiKey: env.OPENAI_API_KEY,
});
