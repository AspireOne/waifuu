import { createTRPCRouter } from "@/server/api/trpc";
import logOut from "@/server/api/routers/auth/logOut";
import handleFirebaseSignIn from "@/server/api/routers/auth/handleFirebaseSignIn";

export const authRouter = createTRPCRouter({
  logOut,
  handleFirebaseSignIn,
});
