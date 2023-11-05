import Page from "@/components/Page";
import { CustomRadio } from "@/components/ui/CustomRadio";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import { makeDownloadUrl } from "@lib/utils";
import { Trans, msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card } from "@nextui-org/card";
import { Button, Image, RadioGroup, Spacer, Textarea } from "@nextui-org/react";
import { ChatMode } from "@prisma/client";
import { useRouter } from "next/router";

import Title from "@components/ui/Title";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";

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
      title: t`Chat`,
      description: t`Classic chat experience, talk about your day, interests, or try to make a romantic partner!`,
      value: ChatMode.CHAT,
    },
    {
      title: t`Adventure`,
      description: t`Adventure-style game. Let the character guide you through the story!`,
      value: ChatMode.ADVENTURE,
    },
    {
      title: t`Roleplay`,
      description: t`Roleplay with the character, feels just real!`,
      value: ChatMode.ROLEPLAY,
    },
  ];
};

/** Main page of the bot for creating new chats. */
const ChatMainMenu = () => {
  const router = useRouter();
  const { user } = useSession();
  const { _ } = useLingui();
  const [usedModeSelected, setUsedModeSelected] = useState<boolean>(false);

  const botId = window.location.pathname.split("/")[2] as string;

  const getOrCreateBotChat = api.chat.getOrCreate.useMutation({
    onSuccess: (data) => {
      router.push(paths.botChat(data.id, bot.data?.id ?? ""));
    },
  });
  const bot = api.bots.getBot.useQuery({ botId: botId });
  const { data: usedChatModes } = api.bots.getUsedChatModes.useQuery({ botId: botId });

  const { register, setValue, handleSubmit } = useForm<FormProps>();

  const onSubmit = (data: FormProps) => {
    if (!bot.data || !bot.data?.id) return;

    getOrCreateBotChat.mutate({
      botId: bot.data.id,
      ...data,
    });
  };

  function handleRadioValueChange(value: string) {
    // biome-ignore lint: this will not be null here.
    setUsedModeSelected(usedChatModes!.includes(value as ChatMode));
    setValue("mode", value as ChatMode);
  }

  return (
    <Page
      title={bot.isLoading ? _(msg`Loading...`) : _(msg`Chat with ${bot.data?.name}`)}
      className={"space-y-12"}
    >
      <Card className="z-20 mx-auto md:w-[600px]">
        <div className="flex flex-col text-center gap-2 p-3 items-center">
          <Spacer y={2} />

          <Image
            radius={"lg"}
            className={"z-0 h-[90px] w-[90px] mx-auto block object-cover"}
            isLoading={bot.isLoading}
            isBlurred={true}
            src={makeDownloadUrl(bot.data?.avatar) ?? ""}
          />
          <div>
            <div className="flex flex-col">
              <Spacer x={2} y={2} />

              <Title as={"h1"} size={"sm"} bold={false} className={"text-center mx-auto mb-0"}>
                <Trans context={"bot main menu title"}>
                  Chat with {bot.isLoading ? <Skeleton /> : bot.data?.name}
                </Trans>
              </Title>
              <p className="text-foreground-500">
                <Trans>Select one of the available experiences</Trans>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <RadioGroup onValueChange={handleRadioValueChange} className="w-full">
            {getModes().map((mode) => {
              const isActive = usedChatModes?.includes(mode.value);
              return (
                <CustomRadio
                  key={mode.value}
                  className={isActive ? "border-foreground-400" : ""}
                  description={_(mode.description)}
                  value={mode.value}
                >
                  <p>
                    {mode.title}{" "}
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
              variant={"faded"}
              isLoading={getOrCreateBotChat.isLoading}
              type="submit"
              className="w-full"
            >
              {usedModeSelected ? (
                <Trans>Continue your chat</Trans>
              ) : (
                <Trans>Start the chat</Trans>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
};

export default ChatMainMenu;
