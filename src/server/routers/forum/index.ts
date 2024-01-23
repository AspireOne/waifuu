import comment from "@/server/routers/forum/comment";
import create from "@/server/routers/forum/create";
import dislike from "@/server/routers/forum/dislike";
import get from "@/server/routers/forum/get";
import getAll from "@/server/routers/forum/getAll";
import getCategories from "@/server/routers/forum/getCategories";
import getPinned from "@/server/routers/forum/getPinned";
import getPostComments from "@/server/routers/forum/getPostComments";
import like from "@/server/routers/forum/like";
import pin from "@/server/routers/forum/pin";

import { createTRPCRouter } from "../../lib/trpc";

export const forumRouter = createTRPCRouter({
  create,
  getPostComments,
  get,
  like,
  dislike,
  comment,
  getAll,
  pin,
  getPinned,
  getCategories,
});
