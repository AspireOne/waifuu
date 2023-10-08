import { BotMode } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import paths from "~/utils/paths";

/**
 * Custom hook that fetches the specified bot and redirects if the bot or mode is invalid.
 * @param enabled Whether the query should be enabled. Can be used to postpone the query until botId or mode is ready.
 */
const useBot = (
  chatId: string | undefined,
  mode: string | undefined,
  enabled: boolean = true,
) => {
  const bot = api.bots.getBotByChatId.useQuery(
    { chatId: chatId! },
    { enabled: enabled },
  );

  // useEffect(() => {
  //   if (!enabled) return;

  //   // If the bot does not exist, redirect to discover page.
  //   TODO: Make this work
  //   if (!bot.isLoading && !bot.data) {
  //     router.replace(paths.discover);
  //   }

  //   // If mode does not exist, redirect to the bot main menu.
  //   if (!Object.values(BotMode).includes(mode as BotMode)) {
  //     router.replace(paths.botChatMainMenu(botId!));
  //   }
  // }, [mode, bot.isLoading, bot.data, bot.data?.id, router]);

  return bot;
};

export { useBot };
