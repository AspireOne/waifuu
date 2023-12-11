import { createTRPCRouter } from "@/server/lib/trpc";
import accept from "@/server/routers/early-access/accept";
import getAll from "@/server/routers/early-access/getAll";
import requestEarlyAccess from "@/server/routers/early-access/requestEarlyAccess";

export const earlyAccessRouter = createTRPCRouter({
  requestEarlyAccess,
  getAll,
  accept,
});
