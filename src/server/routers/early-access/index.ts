import { createTRPCRouter } from "@/server/lib/trpc";
import requestEarlyAccess from "@/server/routers/early-access/requestEarlyAccess";

export const earlyAccessRouter = createTRPCRouter({
  requestEarlyAccess,
});
