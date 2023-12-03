import { api } from "@/lib/api";
import { CharacterCard } from "@components/CharacterCard";
import { CharacterCardSkeleton } from "@components/CharacterCard/CharacterCardSkeleton";
import Title from "@components/ui/Title";
import { Trans } from "@lingui/macro";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Bot } from "@prisma/client";
import { PropsWithChildren } from "react";
import Skeleton from "react-loading-skeleton";

function InfoCard(
  props: PropsWithChildren<{
    isLoaded: boolean;
    title: string;
    className?: string;
  }>,
) {
  if (!props.isLoaded) {
    return <Skeleton height={"120px"} className={props.className} />;
  }
  return (
    <Card className={props.className}>
      <CardHeader>
        <Title size={"md"} className={"mb-0"}>
          {props.title}
        </Title>
      </CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}

export default function InfoCards(props: { username?: string }) {
  const { isInitialLoading, data: user } = api.users.getPublic.useQuery(
    {
      username: props.username!,
    },
    {
      enabled: !!props.username,
    },
  );

  const hasBots = user?.bots && user.bots.length > 0;

  return (
    <>
      <InfoCard isLoaded={!isInitialLoading} title={"Bio"} className={"mt-20"}>
        <p>{user?.bio || <Trans>This user has not set a bio yet. Check back later!</Trans>}</p>
      </InfoCard>

      <InfoCard isLoaded={!isInitialLoading} title={"Characters"}>
        {hasBots && <CharacterList bots={user?.bots} />}
        {!hasBots && (
          <p>
            <Trans>This user has not created any characters yet :(</Trans>
          </p>
        )}
      </InfoCard>
    </>
  );
}

/*
function BotList(props: { bots: Bot[] }) {
  console.log(props.bots);
  return (
    <Card className={""}>
      {props.bots?.map((bot) => (
        <Link href={paths.botChatMainMenu(bot.id)} key={bot.id}>
          <Card
            className={"relative flex flex-col gap-4 border border-gray-700 bg-zinc-800 p-2"}
          >
            <div className={"flex flex-row gap-3"}>
              <img
                className={"aspect-square h-16 w-16 rounded-xl"}
                src={bot.avatar}
                alt={bot.name}
              />
              <div className={"flex max-w-xs flex-col"}>
                <p className={"line-clamp-1 text-lg font-bold"}>{bot.name}</p>
                <p className={"line-clamp-2"}>
                  {bot.description || <Trans>No description.</Trans>}
                </p>
              </div>
            </div>
            <div className={"inline-flex gap-2"}>
              <Chip
                startContent={<FaHeart />}
                variant="faded"
                color="default"
                className={"px-3"}
              >
                {/!*<Trans>Likes</Trans>*!/}
              </Chip>
              <Chip
                startContent={<FaEye />}
                variant="faded"
                color="default"
                className={"px-3"}
              >
                {/!*<Trans>Views</Trans>*!/}
              </Chip>
            </div>
          </Card>
        </Link>
      ))}
    </Card>
  );
}
*/

const CharacterList = (props: { bots?: Bot[] | null }) => {
  return (
    <div className="flex w-full flex-row gap-5 overflow-scroll overflow-x-visible">
      {props.bots?.map((bot) => {
        return <CharacterCard key={bot.id} bot={bot} />;
      })}

      {!props.bots && <CharacterCardSkeleton inline count={2} />}
    </div>
  );
};
