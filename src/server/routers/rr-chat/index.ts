import { createTRPCRouter } from "@/server/lib/trpc";
import searchUser from "@/server/routers/rr-chat/searchUser";
import sendMessage from "@/server/routers/rr-chat/sendMessage";

// Keep it here. It's used in the client.
export type ChannelData = {
  name: string;
  topic: string;
};

export const RRChatRouter = createTRPCRouter({
  // user starts searching
  // -> if someone already exists, remove him and assign them to a chat. Return ChatId.
  // -> if no one exists, add to the db and start polling.
  // -> If assigned to a chat during search, it will be polled. Return chatID.
  // -> If not assigned to a chat, remove from the db and return null.
  searchUser,
  sendMessage,
});
