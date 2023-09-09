import { ChatMessage } from "~/components/Chat/ChatMessage";
import { ChatTypingIndicator } from "~/components/Chat/ChatTypingIndicator";
import { Image } from "@nextui-org/react";
import { BsShareFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiSendPlane2Fill } from "react-icons/ri";
import useBotChat from "~/use-hooks/useBotChat";
import { BotMode } from "@prisma/client";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect } from "react";
import paths from "~/utils/paths";

const ChatMainMenu = () => {
  const router = useRouter();
  const { botId, mode } = router.query;

  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  useEffect(() => {
    if (!bot.isLoading && !bot.data) {
      router.push(paths.explore);
    }
  }, [bot.isLoading, bot.data]);

  // TODO: Bot main menu.
  return (
    <div>
      <p>bot main menu</p>
    </div>
  );
};

export default ChatMainMenu;
