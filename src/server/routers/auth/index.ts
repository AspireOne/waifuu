import { createTRPCRouter } from "@/server/lib/trpc";
import handleSignIn from "@/server/routers/auth/handleSignIn";
import logOut from "@/server/routers/auth/logOut";

export const authRouter = createTRPCRouter({
  logOut,
  handleSignIn,
});
