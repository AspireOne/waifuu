import {
  Button,
  Chip,
  Input,
  MenuItem,
  Select,
  Switch,
} from "@nextui-org/react";
import Image from "next/image";
import { FaCompass } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import Page from "~/components/Page";
import { CharacterCard } from "~/components/Character/CharacterCard";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { BotSource } from "@prisma/client";
import { useEffect, useState } from "react";
import useSession from "~/hooks/useSession";
import { MdForum } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import Router from "next/router";
import paths from "~/utils/paths";
import { ForumPostHighlight } from "~/components/Forum/ForumPostHighlight";
import { CreateForumPostModal } from "~/components/Forum/CreateForumPostModal";

type SearchType = {
  textFilter?: string;
  sourceFilter?: BotSource;
};

const Discover = () => {
  const { user } = useSession();

  const [searchData, setSearchData] = useState<SearchType>({
    textFilter: undefined,
  });
  const tags = useState<string[]>([]);
  const onTagToggle = (value: string): void => {
    if (tags[0].includes(value)) {
      tags[1](tags[0].filter((tag) => tag !== value));
    } else {
      tags[1]([...tags[0], value]);
    }
  };
  const isTagToggled = (value: string): boolean => tags[0].includes(value);

  const bots = api.bots.getAllBots.useQuery(searchData);
  const forumPosts = api.forum.getAll.useQuery({ take: 10, skip: 0 });
  const conversationBots = api.bots.getAllConversationBots.useQuery({
    limit: 5,
  });

  const { register, watch } = useForm<{
    textFilter?: string;
    sourceFilter?: BotSource;
  }>();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);

      setSearchData({
        textFilter: value.textFilter,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Page title="Discover Characters" showActionBar back={null}>
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
          <div className="mb-5 mt-7">
            <h3 className="flex align-center font-bold flex-row gap-2 text-2xl text-white">
              <FaCompass className="mt-1.5" />
              <p>Active chats</p>
            </h3>

            {conversationBots.data?.length === 0 && (
              <p className="text-white mt-3">
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

          <div className="mt-10 flex flex-row align-center">
            <h3 className="mb-3 mt-2 font-bold flex flex-row gap-2 text-2xl text-white">
              <BiTrendingUp className="mt-1.5" />
              <p>Popular bots</p>
            </h3>

            <Switch className="w-fit mx-auto mr-4">NSFW</Switch>
          </div>

          <form className="mb-5 mt-1 flex flex-col items-center gap-4">
            <div className="flex flex-col w-full gap-3">
              <Button onClick={() => Router.push(paths.createBot)}>
                <BsPlus fontSize={25} /> Create new bot
              </Button>

              <div className="flex flex-row gap-1 overflow-scroll overflow-scroll-y">
                {[
                  "All",
                  "Anime",
                  "Games",
                  "Movies",
                  "TV",
                  "NSFW",
                  "Nevim",
                  "Submissive",
                  "Dominant",
                  "Fetish",
                ].map((tag) => {
                  return (
                    <Chip
                      variant={isTagToggled(tag) ? "solid" : "bordered"}
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className="bg-opacity-70 w-fit mt-2 mx-auto"
                    >
                      {tag}
                    </Chip>
                  );
                })}
              </div>

              <Input
                {...register("textFilter")}
                label="Search by name"
                placeholder="Enter your search term..."
                className="flex-1 rounded-lg text-white"
                type="text"
              />

              <Select label="Display community or official bots">
                <MenuItem value={undefined}>All</MenuItem>
                <MenuItem value={BotSource.COMMUNITY}>Community</MenuItem>
                <MenuItem value={BotSource.OFFICIAL}>Official</MenuItem>
              </Select>
            </div>
          </form>

          <div className="flex w-full flex-wrap gap-5">
            {bots.data?.length === 0 && (
              <p className="text-white">
                No bots found. Try changing your search term.
              </p>
            )}

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 w-fit mx-auto">
              {bots.data?.map((bot) => {
                return <CharacterCard bot={bot} />;
              })}
            </div>

            <Button variant="solid" className="w-1/2 mx-auto mb-4">
              Load more
            </Button>
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
