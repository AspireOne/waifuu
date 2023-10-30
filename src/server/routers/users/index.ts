import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import updateSelfSchema from "@/server/shared/updateSelfSchema";
import getSelf from "@/server/routers/users/getSelf";
import getPublic from "@/server/routers/users/getPublic";
import checkUsernameAvailability from "@/server/routers/users/checkUsernameAvailability";
import updateSelf from "@/server/routers/users/updateSelf";

export const usersRouter = createTRPCRouter({
  getSelf,
  getPublic,
  checkUsernameAvailability,
  updateSelf,
});
