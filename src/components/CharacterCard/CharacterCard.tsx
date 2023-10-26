import { Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { Bot, BotMode, BotSource } from "@prisma/client";
import Link from "next/link";
import { paths } from "@/lib/paths";
import { LargeText } from "../ui/LargeText";
import { MdVerified } from "react-icons/md";
import { makeDownloadPath, normalizePath } from "@lib/utils";
import { FaHeart } from "react-icons/fa";

type CharacterCardProps = {
  bot: Bot;
  chatId?: string;
  chatType?: BotMode;
  bottom?: boolean;
};

export const CharacterCard = ({
  bot,
  chatId,
  chatType,
  bottom,
}: CharacterCardProps) => {
  return (
    <Card className="p-3">
      <Link href={normalizePath(paths.botChat(chatId ?? "", bot.id))}>
        <Spacer y={2} />
        <Image
          removeWrapper
          src={makeDownloadPath(bot.avatar!)}
          alt="character"
          className={`h-[100px] w-[100px] object-cover z-0 mx-auto rounded-lg bg-gray-100`}
          width={100}
          height={100}
        />

        <CardBody>
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
          <div className="flex flex-row gap-2">
            {chatType ? (
              <Chip className="bg-opacity-70 w-fit mt-2 mx-auto">
                {chatType}
              </Chip>
            ) : null}
            {!bottom && (
              <Chip variant="flat" className="mx-auto mt-2 w-fit">
                {bot.characterNsfw ? "NSFW" : "SFW"}
              </Chip>
            )}
          </div>
        </CardBody>

        {bottom ? (
          <div className="flex flex-row px-4 items-end">
            <div className="mx-auto ml-0 w-fit">
              <Chip variant="flat">{bot.characterNsfw ? "NSFW" : "SFW"}</Chip>
            </div>

            <div className="mx-auto mr-0 w-fit flex flex-row gap-2">
              <p>2.3k</p>
              <div>
                <Spacer y={1} />
                <FaHeart color="red" />
              </div>
            </div>
          </div>
        ) : null}
      </Link>
    </Card>
  );
};
