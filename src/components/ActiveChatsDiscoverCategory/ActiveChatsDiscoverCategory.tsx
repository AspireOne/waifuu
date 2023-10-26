import Title from "@components/ui/Title";
import { FaCompass } from "react-icons/fa";
import { Trans } from "@lingui/macro";
import { CharacterCard } from "@components/CharacterCard";
import { Skeleton } from "@components/Skeleton";
import { api } from "@lib/api";
import { Bot } from "@prisma/client";
import { CharacterCardSkeleton } from "@components/CharacterCard/CharacterCardSkeleton";

export const ActiveChatsDiscoverCategory = (props: {}) => {
  const { data: bots } = api.bots.getAllUsedBots.useQuery({
    limit: 5,
  });

  return (
    <div className="">
      <Title bold icon={FaCompass}>
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
      {bots &&
        bots.map((bot, index) => {
          return (
            <CharacterCard
              key={index}
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
