import { Button, Checkbox, Input, Switch } from "@nextui-org/react";
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
  const conversationBots = api.bots.getAllConversationBots.useQuery({
    limit: 5,
  });

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
    <Page title="Discover Characters" showActionBar autoBack={false}>
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
            <h1 className="title-xl">👋</h1>

            <div>
              <h1 className="title-xl flex-wrap font-bold">Hi, {user?.name}</h1>
              <p>Let's explore some new characters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto mt-10">
          <div className="mb-5 mt-20">
            <h3 className="flex align-center font-bold flex-row gap-2 text-2xl text-white">
              <FaCompass className="mt-1.5" />
              <p>Active chats</p>
            </h3>

            {conversationBots.data?.length === 0 && (
              <p className="text-foreground-500 mt-3">
                You don't have any active chats yet. Start one now!
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
            <div className="mt-10 flex flex-row align-center">
              <h3 className="mb-3 mt-2 font-bold flex flex-row gap-2 text-2xl text-white">
                <BiTrendingUp className="mt-1.5" />
                <p>Popular bots</p>
              </h3>

              <Switch
                isSelected={searchData.nsfw}
                onValueChange={toggleNsfw}
                className="w-fit mx-auto mr-4"
              >
                NSFW
              </Switch>
            </div>

            <div className="mb-5 mt-1 flex flex-col items-center gap-4">
              <div className="flex flex-col w-full gap-3">
                <Button onClick={() => Router.push(paths.createBot)}>
                  <BsPlus fontSize={25} /> Create new bot
                </Button>

                <TagSelect onChange={(value) => {}} />

                <Input
                  {...register("textFilter")}
                  label="Search by name"
                  placeholder="Enter your search term..."
                  className="flex-1 rounded-lg text-white"
                  type="text"
                />

                <Checkbox onValueChange={toggleOfficialBots}>
                  Only display official bots
                </Checkbox>
              </div>
            </div>
          </form>

          <div className="flex w-full flex-wrap gap-5">
            {bots?.length === 0 && (
              <p className="text-white">
                No bots found. Try changing your search term.
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
                Load more
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="mb-3 mt-2 font-bold flex flex-row gap-2 text-2xl text-white">
            <MdForum className="mt-1.5" />
            <p>Popular forum posts</p>
          </h3>

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
