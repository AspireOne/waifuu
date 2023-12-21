import { CharacterCard } from "@components/CharacterCard";
import { CharacterCardSkeleton } from "@components/CharacterCard/CharacterCardSkeleton";

import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { Trans, t } from "@lingui/macro";

import { AppRouter } from "@/server/routers/root";
import { inferRouterOutputs } from "@trpc/server";
import { FaCompass } from "react-icons/fa";

type GetAllUsedBotsOutput = inferRouterOutputs<AppRouter>["bots"]["getAllUsedBots"];

export const ActiveChatsDiscoverCategory = () => {
  const { data: bots } = api.bots.getAllUsedBots.useQuery(
    {
      limit: 5,
    },
    {
      // will refetch only if data is stale.
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  return (
    <div className="">
      <Title description={t`Your active chats with characters`} bold icon={FaCompass}>
        <Trans>Active chats</Trans>
      </Title>

      {bots && bots.length === 0 && (
        <div className={"flex flex-col justify-center items-center h-full"}>
          <p className="text-neutral-500 mt-3">
            <Trans>Chats you start will show up here.</Trans>
          </p>
        </div>
      )}

      <CharacterList bots={bots} />
    </div>
  );
};

const CharacterList = (props: { bots?: GetAllUsedBotsOutput | null }) => {
  return (
    <div className="flex w-full flex-row gap-5 overflow-scroll overflow-x-visible">
      {props.bots?.map((bot) => {
        return (
          <CharacterCard
            //showVisibility={true}
            key={bot.id + bot.chatType}
            chatType={bot.chatType}
            chatId={bot.chatId}
            character={bot}
          />
        );
      })}

      {!props.bots && <CharacterCardSkeleton inline count={2} />}
    </div>
  );
};
