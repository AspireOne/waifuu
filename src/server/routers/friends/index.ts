import { createTRPCRouter } from "@/server/lib/trpc";
import AddFriend from "@/server/routers/friends/addFriend";
import isFriend from "@/server/routers/friends/isFriend";
import removeFriend from "@/server/routers/friends/removeFriend";
import RetrieveAllFriends from "@/server/routers/friends/retrieveAllFriends";

export const friendsRouter = createTRPCRouter({
  add: AddFriend,
  remove: removeFriend,
  getAll: RetrieveAllFriends,
  isFriend: isFriend,
});
