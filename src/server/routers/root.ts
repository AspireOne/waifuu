import { createTRPCRouter } from "@/server/lib/trpc";
import { authRouter } from "@/server/routers/auth";
import { botsRouter } from "@/server/routers/bots";
import { chatRouter } from "@/server/routers/chat";
import { contactRouter } from "@/server/routers/contact";
import { earlyAccessRouter } from "@/server/routers/early-access";
import { generalRouter } from "@/server/routers/general";
import { plansRouter } from "@/server/routers/plans";
import { RRChatRouter } from "@/server/routers/rr-chat";
import { usersRouter } from "@/server/routers/users";
import { testingRouter } from "src/server/routers/testing";
import { forumRouter } from "./forum";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  general: generalRouter,
  testing: testingRouter,
  bots: botsRouter,
  users: usersRouter,
  RRChat: RRChatRouter,
  auth: authRouter,
  forum: forumRouter,
  contact: contactRouter,
  chat: chatRouter,
  plans: plansRouter,
  earlyAccess: earlyAccessRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
