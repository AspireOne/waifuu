import { Button, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCompass } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import Page from "~/components/Page";
import { CharacterCard } from "~/components/Character/CharacterCard";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { BotSource } from "@prisma/client";
import { useEffect, useState } from "react";

type SearchType = {
  textFilter?: string;
  sourceFilter?: BotSource;
};

const Discover = () => {
  const [searchData, setSearchData] = useState<SearchType>({
    textFilter: undefined,
  });

  const bots = api.bots.getAllBots.useQuery(searchData);
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
    <Page metaTitle="Discover Characters" showMobileNav header={{ back: null }}>
      <div className="hidden h-[350px] overflow-hidden sm:block">
        <Image
          alt="background"
          loading="eager"
          className="opacity-30"
          src={"/assets/background.png"}
          width={1920}
          height={1080}
        />
        <div className="absolute left-0 top-4 flex h-[350px] w-full flex-row">
          <div className="clear-both">
            <BiChevronLeft
              color="white"
              fontSize={70}
              className="mt-[150px] cursor-pointer"
            />
          </div>

          <div className="align-center absolute mx-auto flex w-fit flex-row sm:relative">
            <Image
              alt="background"
              loading="eager"
              src={"/assets/character.png"}
              className="h-[350px] w-[300px]"
              width={1920}
              height={1080}
            />
            <div className="mt-[50px] flex w-[400px] flex-col gap-4">
              <h1 className="text-6xl font-extrabold text-white">Fauna</h1>
              <p className="text-white">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt
                iure recusandae sapiente repellat quasi tenetur!
              </p>
              <Button>Buy now</Button>
            </div>
          </div>

          <div className="clear-both">
            <BiChevronRight
              color="white"
              fontSize={70}
              className="mt-[150px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto p-5">
        <div className="mb-5 mt-7">
          <h3 className="flex flex-row gap-2 text-3xl text-white">
            <FaCompass /> Active chats
          </h3>
        </div>

        <div className="flex w-full flex-row gap-5 overflow-scroll overflow-x-visible">
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

      <div className="mx-auto p-5">
        <div className="mb-5 mt-7">
          <h3 className="mb-3 flex flex-row gap-2 text-3xl text-white">
            <BiTrendingUp /> Popular bots
          </h3>
        </div>

        <form className="mb-5 flex flex-col items-center gap-4">
          <div className="flex flex-col w-full gap-1">
            <Input
              {...register("textFilter")}
              label="Search by name"
              placeholder="Enter your search term..."
              className="flex-1 rounded-lg text-white"
              type="text"
            />
          </div>

          {/** Implement in future */}
          {/* <Select label="Bot visibility" {...register('sourceFilter')}>
            <SelectItem key={BotSource.OFFICIAL} value={BotSource.OFFICIAL}>Official</SelectItem>
            <SelectItem key={BotSource.COMMUNITY} value={BotSource.COMMUNITY}>Community</SelectItem>
          </Select> */}
        </form>

        <div className="flex w-full flex-wrap gap-5">
          {bots.data?.map((bot) => {
            return <CharacterCard bot={bot} />;
          })}
        </div>
      </div>
    </Page>
  );
};

export default Discover;
