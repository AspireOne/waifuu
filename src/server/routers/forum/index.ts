import { createTRPCRouter, protectedProcedure } from "../../lib/trpc";
import create from "@/server/routers/forum/create";
import getPostComments from "@/server/routers/forum/getPostComments";
import get from "@/server/routers/forum/get";
import like from "@/server/routers/forum/like";
import dislike from "@/server/routers/forum/dislike";
import comment from "@/server/routers/forum/comment";
import getAll from "@/server/routers/forum/getAll";

export const forumRouter = createTRPCRouter({
  create,
  getPostComments,
  get,
  like,
  dislike,
  comment,
  getAll,
});
