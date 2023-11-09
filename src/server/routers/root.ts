import { createTRPCRouter } from "@/server/lib/trpc";
import { authRouter } from "@/server/routers/auth";
import { botsRouter } from "@/server/routers/bots";
import { chatRouter } from "@/server/routers/chat";
import { contactRouter } from "@/server/routers/contact";
import { RRChatRouter } from "@/server/routers/rr-chat";
import { usersRouter } from "@/server/routers/users";
import { generalRouter } from "src/server/routers/debug";
import { forumRouter } from "./forum";

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
