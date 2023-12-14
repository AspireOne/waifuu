import { env } from "@/server/env";
import { global } from "@/server/global";
import Langfuse from "langfuse";

// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
export const langfuse = (global.langfuse ??= new Langfuse({
  secretKey: env.LANGFUSE_SK, // sk-lf-...
  publicKey: env.NEXT_PUBLIC_LANGFUSE_PK, // pk-lf-...
  // baseUrl: defaults to "https://cloud.langfuse.com"
}));
