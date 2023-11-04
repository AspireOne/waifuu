import { createTRPCRouter } from "@/server/lib/trpc";
import checkUsernameAvailability from "@/server/routers/users/checkUsernameAvailability";
import getPublic from "@/server/routers/users/getPublic";
import getSelf from "@/server/routers/users/getSelf";
import updateSelf from "@/server/routers/users/updateSelf";

export const usersRouter = createTRPCRouter({
  getSelf,
  getPublic,
  checkUsernameAvailability,
  updateSelf,
});
