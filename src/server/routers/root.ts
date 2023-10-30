import { generalRouter } from "@/server/routers/general";
import { createTRPCRouter } from "@/server/lib/trpc";
import { botsRouter } from "@/server/routers/bots";
import { usersRouter } from "@/server/routers/users";
import { RRChatRouter } from "@/server/routers/rr-chat";
import { authRouter } from "@/server/routers/auth";
import { forumRouter } from "./forum";
import { contactRouter } from "@/server/routers/contact";
import { chatRouter } from "@/server/routers/chat";

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
  contact: contactRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
