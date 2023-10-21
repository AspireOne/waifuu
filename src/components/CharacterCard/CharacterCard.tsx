import { Card, CardBody, Chip, Image } from "@nextui-org/react";
import { Bot, BotMode, BotSource } from "@prisma/client";
import Link from "next/link";
import { paths } from "@/lib/paths";
import { LargeText } from "../ui/LargeText";
import { MdVerified } from "react-icons/md";
import { makeDownloadPath, normalizePath } from "@/utils/utils";

type CharacterCardProps = {
  bot: Bot;
  chatId?: string;
  chatType?: BotMode;
};

export const CharacterCard = ({
  bot,
  chatId,
  chatType,
}: CharacterCardProps) => {
  return (
    <Card className="min-w-[160px]">
      <Link href={normalizePath(paths.botChat(chatId ?? "", bot.id))}>
        <div>
          <Image
            removeWrapper
            src={makeDownloadPath(bot.avatar!)}
            alt="character"
            className={`h-[100px] w-full object-cover z-0 mx-auto rounded-lg bg-gray-100`}
            width={100}
            height={100}
          />
        </div>

        <CardBody className="p-2">
          <b className="text-md flex flex-row text-white text-center mx-auto">
            <p>{bot.name}</p>

            {bot.source === BotSource.OFFICIAL && (
              <MdVerified fontSize={23} className="ml-2 text-primary" />
            )}
          </b>
          {!chatType && (
            <LargeText
              className="table text-center w-[150px] text-sm mt-2"
              content={bot.description}
              maxLength={35}
            />
          )}
          {chatType ? (
            <Chip className="bg-opacity-70 w-fit mt-2 mx-auto">{chatType}</Chip>
          ) : null}
        </CardBody>
      </Link>
    </Card>
  );
};
