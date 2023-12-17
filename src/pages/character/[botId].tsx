import { CustomRadio } from "@/components/ui/CustomRadio";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { fullUrl, paths } from "@/lib/paths";
import { AppPage } from "@components/AppPage";
import { makeDownloadUrl } from "@lib/utils";
import { Trans, msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card } from "@nextui-org/card";
import { Button, Image, Link, RadioGroup, Spacer, Textarea } from "@nextui-org/react";
import { Bot, BotVisibility, ChatMode } from "@prisma/client";
import { useRouter } from "next/router";

import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { AppHeaderCharSettingsButton } from "@components/AppHeaderCharSettingsButton";
import Title from "@components/ui/Title";
import { Tooltip } from "@nextui-org/tooltip";
import NextLink from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoChatbubbleEllipsesSharp, IoShareSocialOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

type FormProps = {
  mode: ChatMode;
  userContext: string;
};

type Mode = {
  title: string;
  description: string;
  value: ChatMode;
};

const getModes = (): Mode[] => {
  return [
    {
      title: t`Roleplay`,
      description: t`Roleplay with the character, feels just real!`,
      value: ChatMode.ROLEPLAY,
    },
    {
      title: t`Chat`,
      description: t`Classic chat experience, talk about your day, interests, or try to make a romantic partner!`,
      value: ChatMode.CHAT,
    },
    {
      title: t`Adventure`,
      description: t`Adventure-style game. Let the character guide you through the story!`,
      value: ChatMode.ADVENTURE,
    },
  ];
};

function Header(props: {
  isLoading: boolean;
  bot?: Bot | null;
  creatorUsername?: string | null;
}) {
  const bot = props.bot;
  return (
    <div className="relative">
      <img
        src={makeDownloadUrl(props.bot?.backgroundImage) ?? ""}
        alt="background"
        // loading strategy
        loading="eager"
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = "1";
        }}
        className="duration-1000 opacity-0 absolute inset-0 w-full h-full object-cover z-[-5] pb-[1px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-default-50 z-[-4]" />

      <div className={"z-2 flex flex-col text-center items-center gap-2 p-3 pt-5 z-[10]"}>
        <Image
          radius={"lg"}
          className={"z-0 h-[90px] w-[90px] mx-auto block object-cover shadow-lg"}
          isLoading={props.isLoading}
          isBlurred={true}
          src={makeDownloadUrl(props.bot?.avatar ?? "")}
        />
        <div>
          <div className="flex flex-col">
            <Spacer x={2} y={2} />

            <Title
              as={"h1"}
              size={"sm"}
              bold={false}
              className={"text-center mx-auto mb-0 font-normal"}
            >
              <Trans context={"bot main menu title"}>
                Chat with{" "}
                {props.isLoading ? (
                  <Skeleton />
                ) : (
                  <b className={"-ml-1 font-semibold"}>{props.bot?.name}</b>
                )}
              </Trans>
            </Title>
            <p className={"text-center text-foreground-400 text-sm"}>
              {bot?.source === "OFFICIAL" && <Trans>Official character</Trans>}
              {bot?.source !== "OFFICIAL" && props.creatorUsername && (
                <Trans>
                  Character by{" "}
                  <Link
                    as={NextLink}
                    color={"secondary"}
                    className={"text-sm"}
                    href={paths.userProfile(props.creatorUsername)}
                  >
                    {props.creatorUsername}
                  </Link>
                </Trans>
              )}
            </p>
            <Spacer y={4} />
            <p className="text-foreground-500">
              <Trans>Select one of the available experiences</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Main page of the bot for creating new chats. */
const ChatMainMenu = () => {
  const router = useRouter();
  const { user } = useSession();
  const { _ } = useLingui();
  const [selectedModeIsAlreadyActive, setSelectedModeIsAlreadyActive] =
    useState<boolean>(false);

  const botId = router.query.botId as string;

  const getOrCreateBotChatMut = api.chat.getOrCreate.useMutation({
    onSuccess: (data) => {
      router.push(paths.botChat(data.id, bot.data?.id ?? ""));
    },
  });
  const bot = api.bots.getBot.useQuery({ botId: botId }, { enabled: !!botId });
  const { data: usedChatModes } = api.bots.getUsedChatModes.useQuery(
    { botId: botId },
    { enabled: !!botId },
  );

  const { register, setValue, watch, handleSubmit } = useForm<FormProps>();
  const mode = watch("mode");

  const onSubmit = (data: FormProps) => {
    if (!bot.data || !bot.data?.id) return;

    getOrCreateBotChatMut.mutate({
      botId: bot.data.id,
      ...data,
    });
  };

  function handleRadioValueChange(value: string) {
    setSelectedModeIsAlreadyActive(usedChatModes!.includes(value as ChatMode));
    setValue("mode", value as ChatMode);
  }

  async function handleShare() {
    if (!bot.data) return;
    const url = fullUrl(paths.botChatMainMenu(bot.data.id));

    if (!Capacitor.isNativePlatform()) {
      await navigator.clipboard.writeText(url);
      toast(t`Copied link to clipboard`, {
        type: "success",
        autoClose: 1500,
        pauseOnHover: false,
      });
      return;
    }

    await Share.share({
      title: _(msg`${bot.data.name} | Waifuu`),
      text: _(msg`Try out ${bot.data.name} on Waifuu.`),
      url: url,
      dialogTitle: _(msg`'Share ${bot.data.name} with friends`),
    });
  }

  return (
    <AppPage
      title={bot.isLoading ? _(msg`Loading...`) : _(msg`Chat with ${bot.data?.name}`)}
      className={"space-y-12"}
      backPath={paths.discover}
      appHeaderEndContent={<AppHeaderCharSettingsButton />}
    >
      <Card className="z-20 mx-auto md:w-[600px]">
        {bot.data?.visibility !== BotVisibility.PRIVATE && (
          <Tooltip content={t`Share`} closeDelay={0}>
            <Button
              onClick={handleShare}
              className={"absolute left-3 top-3 bg-transparent p-0 z-[20]"}
              isIconOnly={true}
            >
              <IoShareSocialOutline size={28} />
            </Button>
          </Tooltip>
        )}

        {/* TODO: Implement edit. */}
        {/*{
          <Tooltip content={t`Edit Character`} closeDelay={0}>
            <Button className={"absolute right-3 top-3 bg-transparent p-0"} isIconOnly={true}>
              <HiOutlinePencil size={28} />
            </Button>
          </Tooltip>
        }*/}

        <Header
          creatorUsername={bot.data?.creator?.username}
          isLoading={bot.isLoading}
          bot={bot.data}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <RadioGroup onValueChange={handleRadioValueChange} className="w-full">
            {getModes().map((mode) => {
              const isActive = usedChatModes?.includes(mode.value);
              return (
                <CustomRadio
                  key={mode.value}
                  className={isActive ? "bg-default-100/30" : ""}
                  description={_(mode.description)}
                  value={mode.value}
                >
                  <p>
                    {mode.title}
                    {isActive && (
                      <span className={"text-sm ml-2 text-blue-300"}>
                        <Trans>Active</Trans>
                      </span>
                    )}
                  </p>
                </CustomRadio>
              );
            })}
          </RadioGroup>

          <Spacer y={7} />

          <Textarea
            {...register("userContext")}
            variant={"faded"}
            label={_(msg`What should this character know about you?`)}
            defaultValue={user?.botContext ?? ""}
          />

          <div className="p-3 mt-4">
            <Button
              variant={"solid"}
              color={"primary"}
              isDisabled={!mode}
              isLoading={getOrCreateBotChatMut.isLoading}
              type="submit"
              className="w-full"
            >
              {selectedModeIsAlreadyActive ? (
                <Trans>
                  <IoChatbubbleEllipsesSharp size={20} /> Continue your chat
                </Trans>
              ) : (
                <Trans>
                  <IoChatbubbleEllipsesSharp size={20} /> Start the chat
                </Trans>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </AppPage>
  );
};

export default ChatMainMenu;
