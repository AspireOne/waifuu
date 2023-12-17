import Title from "@components/ui/Title";

import { AppRouter } from "@/server/routers/root";
import { CharacterCard } from "@components/CharacterCard";
import { CharacterCardSkeleton } from "@components/CharacterCard/CharacterCardSkeleton";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { Trans, msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { inferRouterOutputs } from "@trpc/server";
import NextLink from "next/link";
import parse from "parse-duration";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";

type GetUserBotsOutput = inferRouterOutputs<AppRouter>["bots"]["getUserBots"];

export const MyCharactersDiscoverCategory = () => {
  const { _ } = useLingui();
  const { data: bots } = api.bots.getUserBots.useQuery(
    {},
    {
      // will refetch only if data is stale.
      refetchOnMount: true,
      staleTime: parse("10 min"),
    },
  );
  return (
    <div className="">
      <Title description={t`Characters you created`} bold icon={IoIosHeart} className="mb-3">
        <Trans>Your Characters</Trans>
        <Tooltip content={_(msg`Create a new character`)}>
          <Button
            as={NextLink}
            href={paths.createBot}
            color={"primary"}
            className={"ml-auto md:ml-1 mr-1"}
            size="sm"
            isIconOnly
          >
            <AiOutlinePlus fontSize={25} fontWeight={700} />
          </Button>
        </Tooltip>
      </Title>

      {bots && bots.length === 0 && (
        <p className="text-foreground-700 mt-3">
          <Trans>
            You have not created any characters yet!{" "}
            <Link as={NextLink} href={paths.createBot}>
              Let's create one!
            </Link>
          </Trans>
        </p>
      )}

      <CharacterList bots={bots} />
    </div>
  );
};

const CharacterList = (props: { bots?: GetUserBotsOutput | null }) => {
  return (
    <div className="flex w-full flex-row gap-5 overflow-scroll overflow-x-visible">
      {props.bots?.map((bot) => {
        return (
          <CharacterCard key={bot.id + bot.createdAt} character={bot} showVisibility={true} />
        );
      })}

      {!props.bots && <CharacterCardSkeleton inline count={2} />}
    </div>
  );
};
