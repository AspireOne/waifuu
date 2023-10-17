import { generalRouter } from "@/server/api/routers/general";
import { createTRPCRouter } from "@/server/api/trpc";
import { botsRouter } from "@/server/api/routers/bots";
import { usersRouter } from "@/server/api/routers/users";
import { RRChatRouter } from "@/server/api/routers/RRChat";
import { authRouter } from "@/server/api/routers/auth";
import { forumRouter } from "./routers/forum";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  general: generalRouter,
  bots: botsRouter,
  users: usersRouter,
  RRChat: RRChatRouter,
  auth: authRouter,
  forum: forumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
