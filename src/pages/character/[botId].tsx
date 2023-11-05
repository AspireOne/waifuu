import Page from "@/components/Page";
import { CustomRadio } from "@/components/ui/CustomRadio";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import { makeDownloadUrl } from "@lib/utils";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card } from "@nextui-org/card";
import { Button, Image, RadioGroup, Spacer, Textarea } from "@nextui-org/react";
import { ChatMode } from "@prisma/client";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";

type FormProps = {
  mode: ChatMode;
  userContext: string;
};

/** Main page of the bot for creating new chats. */
const ChatMainMenu = () => {
  const router = useRouter();
  const { botId } = router.query;
  const { user } = useSession();
  const { _ } = useLingui();

  const getOrCreateBotChat = api.chat.getOrCreate.useMutation({
    onSuccess: (data) => {
      router.push(paths.botChat(data.id, bot.data?.id ?? ""));
    },
  });
  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  const { register, setValue, handleSubmit } = useForm<FormProps>();

  const onSubmit = (data: FormProps) => {
    if (!bot.data || !bot.data?.id) return;

    getOrCreateBotChat.mutate({
      botId: bot.data.id,
      ...data,
    });
  };

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
            className={"z-0 h-[90px] w-[90px] mx-auto block scale-120 object-cover"}
            isLoading={bot.isLoading}
            isBlurred={true}
            src={makeDownloadUrl(bot.data?.avatar) ?? ""}
          />
          <div>
            <div className="flex flex-col">
              <Spacer x={2} y={2} />

              <h1 className="title-2xl font-semibold">
                <Trans>
                  Starting chat with {bot.isLoading ? <Skeleton /> : bot.data?.name}
                </Trans>
              </h1>
              <p className="text-gray-400">
                <Trans>Select one of the available experiences</Trans>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <RadioGroup
            onValueChange={(value) => setValue("mode", value as ChatMode)}
            className="w-full"
          >
            <CustomRadio
              description={_(
                msg`Classic chat experience, talk about your day, interests, or try to make a romantic partner!`,
              )}
              value={ChatMode.CHAT}
            >
              <Trans>Chat</Trans>
            </CustomRadio>
            <CustomRadio
              description={_(
                msg`Adventure-style game. Let the character guide you through the story!`,
              )}
              value={ChatMode.ADVENTURE}
            >
              <Trans>Adventure</Trans>
            </CustomRadio>
            <CustomRadio
              description={_(msg`Roleplay with the character, feels just real!`)}
              value={ChatMode.ROLEPLAY}
            >
              <Trans>Roleplay</Trans>
            </CustomRadio>
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
              <Trans>Start the chat</Trans>
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
};

export default ChatMainMenu;
