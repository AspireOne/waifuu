import { Button, Checkbox, Input, Spacer, Switch } from "@nextui-org/react";
import Image from "next/image";
import { FaCompass } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import Page from "@/components/Page";
import { CharacterCard } from "@/components/CharacterCard";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { Bot, BotSource } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { MdForum } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import Router from "next/router";
import { paths } from "@/lib/paths";
import { ForumPostHighlight } from "@/components/forum/ForumPostHighlight";
import { TagSelect } from "@/components/ui/TagSelect";
import { AiOutlinePlus } from "react-icons/ai";
import Title from "@components/ui/Title";
import { Tooltip } from "@nextui-org/tooltip";
import { t, Trans } from "@lingui/macro";

// TODO: Refactor this shitty code

type SearchType = {
  textFilter?: string;
  nsfw: boolean;
  officialBots?: BotSource | null;
  cursor: number;
};

const Discover = () => {
  const { user } = useSession();

  const [searchData, setSearchData] = useState<SearchType>({
    textFilter: undefined,
    nsfw: true,
    officialBots: null,
    cursor: 0,
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const toggleNsfw = () => {
    setSearchData({
      ...searchData,
      nsfw: !searchData.nsfw,
    });
  };

  const toggleOfficialBots = () => {
    setSearchData({
      ...searchData,
      officialBots:
        searchData.officialBots === null ? BotSource.OFFICIAL : null,
    });
  };

  const CURSOR_LIMIT = 1;
  const skipPage = () => {
    setSearchData({
      ...searchData,
      cursor: searchData.cursor + CURSOR_LIMIT,
    });
  };

  const [bots, setBots] = useState<Bot[]>([]);
  api.bots.getAllBots.useQuery(
    {
      ...searchData,
      sourceFilter: searchData.officialBots,
      limit: CURSOR_LIMIT,
    },
    {
      onSuccess: (data) => {
        setBots([...bots, ...data.bots]);
        setHasNextPage(data.hasNextPage);
      },
    },
  );

  const forumPosts = api.forum.getAll.useQuery({ take: 10, skip: 0 });
  const conversationBots = api.bots.getAllUsedBots.useQuery(
    {
      limit: 5,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const { register, watch } = useForm<SearchType>();

  useEffect(() => {
    const subscription = watch((value) => {
      setSearchData({
        textFilter: value.textFilter,
        nsfw: value.nsfw as boolean,
        officialBots: value.officialBots,
        cursor: value.cursor as number,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Page title={t`Discover Characters`} showActionBar autoBack={false}>
      <div className="relative">
        <Image
          alt="background"
          loading="eager"
          className="opacity-30 h-[140px] mt-[-20px] object-cover z-10"
          src={"/assets/background.png"}
          width={1920}
          height={1080}
        />

        <div className="mx-auto mt-[-120px] z-20 relative">
          <div>
            <p className="text-2xl">👋</p>

            <div>
              <Title className={"my-1"} size={"md"} as={"p"} bold>
                <Trans>Hi, {user?.name}</Trans>
              </Title>
              <p className={"text-foreground-700"}>
                <Trans>Let's explore some new characters.</Trans>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto mt-20">
          <div className="mb-5 mt-10">
            <Title bold icon={FaCompass}>
              <Trans>Active chats</Trans>
            </Title>

            {conversationBots.data?.length === 0 && (
              <p className="text-foreground-500 mt-3">
                <Trans>
                  You don't have any active chats yet. Start one now!
                </Trans>
              </p>
            )}

            <div className="flex w-full flex-row mt-3 gap-5 overflow-scroll overflow-x-visible">
              {conversationBots.data?.map((bot) => {
                return (
                  <CharacterCard
                    chatType={bot.chatType}
                    chatId={bot.chatId}
                    bot={bot}
                  />
                );
              })}
            </div>
          </div>

          <form>
            <div className="mt-10 flex flex-row align-center items-center gap-4">
              <Title icon={BiTrendingUp} bold>
                <Trans>Popular Characters</Trans>
              </Title>

              <Tooltip content={"Create a character"}>
                <Button
                  onClick={() => Router.push(paths.createBot)}
                  isIconOnly={true}
                >
                  <AiOutlinePlus fontSize={25} />
                </Button>
              </Tooltip>
            </div>

            <div className="mb-5 mt-1 flex flex-col items-center gap-4">
              <div className="flex flex-col w-full gap-3">
                <TagSelect onChange={(value) => {}} />

                <Input
                  {...register("textFilter")}
                  label="Search by name"
                  placeholder="Enter your search term..."
                  className="flex-1 rounded-lg text-white"
                  type="text"
                />

                <div className={"flex flex-row gap-3"}>
                  <Checkbox onValueChange={toggleOfficialBots}>
                    <Trans>Only display official characters</Trans>
                  </Checkbox>

                  <Switch
                    isSelected={searchData.nsfw}
                    onValueChange={toggleNsfw}
                    className="w-fit mx-auto mr-4"
                  >
                    NSFW
                  </Switch>
                </div>
              </div>
            </div>
          </form>

          <div className="flex w-full flex-wrap gap-5">
            {bots?.length === 0 && (
              <p className="">
                <Trans>
                  No characters found. Try changing your search term.
                </Trans>
              </p>
            )}

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 w-fit mx-auto">
              {bots.map((bot) => {
                return <CharacterCard bot={bot} />;
              })}
            </div>

            {hasNextPage && (
              <Button
                onClick={skipPage}
                variant="solid"
                className="w-1/2 mx-auto mb-4"
              >
                <Trans>Load more</Trans>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <Title bold icon={MdForum}>
            <Trans>Popular forum posts</Trans>
          </Title>

          <div className="flex flex-col gap-2 mt-5">
            {forumPosts.data?.map((post) => {
              return <ForumPostHighlight {...post} />;
            })}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Discover;
