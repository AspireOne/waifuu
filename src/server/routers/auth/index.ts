import { createTRPCRouter } from "@/server/lib/trpc";
import handleFirebaseSignIn from "@/server/routers/auth/handleFirebaseSignIn";
import logOut from "@/server/routers/auth/logOut";

export const authRouter = createTRPCRouter({
  logOut,
  handleFirebaseSignIn,
});
