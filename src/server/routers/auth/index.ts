import { createTRPCRouter } from "@/server/lib/trpc";
import logOut from "@/server/routers/auth/logOut";
import handleFirebaseSignIn from "@/server/routers/auth/handleFirebaseSignIn";

export const authRouter = createTRPCRouter({
  logOut,
  handleFirebaseSignIn,
});
