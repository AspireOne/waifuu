import { CharacterCard } from "@components/CharacterCard";
import { CharacterCardSkeleton } from "@components/CharacterCard/CharacterCardSkeleton";

import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { Trans } from "@lingui/macro";

import { FaCompass } from "react-icons/fa";

export const ActiveChatsDiscoverCategory = () => {
  const { data: bots } = api.bots.getAllUsedBots.useQuery({
    limit: 5,
  });

  return (
    <div className="">
      <Title description="Your active chats with characters" bold icon={FaCompass}>
        <Trans>Active chats</Trans>
      </Title>

      {bots && bots.length === 0 && (
        <p className="text-foreground-500 mt-3">
          <Trans>You don't have any active chats yet. Start one now!</Trans>
        </p>
      )}

      <CharacterList />
    </div>
  );
};

const CharacterList = () => {
  const { data: bots } = api.bots.getAllUsedBots.useQuery({
    limit: 5,
  });

  return (
    <div className="flex w-full flex-row gap-5 overflow-scroll overflow-x-visible">
      {bots?.map((bot) => {
        return (
          <CharacterCard
            key={bot.id + bot.chatType}
            chatType={bot.chatType}
            chatId={bot.chatId}
            bot={bot}
          />
        );
      })}

      {!bots && <CharacterCardSkeleton inline count={2} />}
    </div>
  );
};
