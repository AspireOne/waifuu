import { api } from "@/lib/api";

/**
 * Custom hook that fetches the specified bot and redirects if the bot or mode is invalid.
 * @param chatId The chatId of the chat.
 * @param enabled Whether the query should be enabled. Can be used to postpone the query until botId or mode is ready.
 */
const useBot = (chatId?: string, enabled = true) => {
  const { data: bot } = api.bots.getBotByChatId.useQuery(
    // biome-ignore lint/style/noNonNullAssertion: Will not be null due to the enabled condition.
    { chatId: chatId! },
    {
      enabled: enabled && !!chatId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
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
