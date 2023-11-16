import { paths } from "@/lib/paths";
import { makeDownloadUrl, normalizePath } from "@lib/utils";
import { Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { Bot, BotSource, ChatMode } from "@prisma/client";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { LargeText } from "../ui/LargeText";

type CharacterCardProps = {
  bot: Bot;
  likes?: number;
  chatId?: string;
  chatType?: ChatMode;
  bottom?: boolean;
};

export const CharacterCard = ({
  bot,
  chatId,
  chatType,
  bottom,
  likes,
}: CharacterCardProps) => {
  return (
    <Card className={"w-full min-w-[220px] sm:max-w-[220px] hover:bg-zinc-800"}>
      <Link className={"p-3"} href={normalizePath(paths.botChat(chatId ?? "", bot.id))}>
        <Spacer y={2} />
        <Image
          removeWrapper
          src={makeDownloadUrl(bot.avatar)}
          alt="character"
          className={"h-[100px] w-[100px] object-cover z-0 mx-auto rounded-lg bg-gray-100"}
          width={100}
          height={100}
        />

        <CardBody className="min-w-[190px]">
          <b className="text-md flex flex-row text-white text-center mx-auto">
            <p className="text-center mx-auto w-fit">{bot.name}</p>

            {bot.source === BotSource.OFFICIAL && (
              <MdVerified fontSize={23} className="ml-2 text-primary" />
            )}
          </b>
          {!chatType && (
            <LargeText
              className="table mx-auto text-center w-[150px] text-sm mt-2"
              content={bot.description}
              maxLength={35}
            />
          )}
          <div className="flex flex-row gap-2">
            {chatType ? (
              <Chip className="bg-opacity-70 w-fit mt-2 mx-auto">{chatType}</Chip>
            ) : null}
            {!bottom && (
              <Chip variant="flat" className="mx-auto mt-2 w-fit">
                {bot.nsfw ? "NSFW" : "SFW"}
              </Chip>
            )}
          </div>

          {bottom && bot.moodImagesEnabled && (
            <Chip className="mt-2 w-fit mx-auto" color="primary" variant="dot">
              Custom emotions
            </Chip>
          )}
        </CardBody>

        {bottom && (
          <div className="flex flex-row px-4 items-end">
            <div className="mx-auto ml-0 w-fit">
              <Chip variant="flat">{bot.nsfw ? "NSFW" : "SFW"}</Chip>
            </div>

            {likes && (
              <div className="mx-auto mr-0 w-fit flex flex-row gap-2">
                <p>{likes}</p>
                <div>
                  <Spacer y={1} />
                  <FaHeart color="red" />
                </div>
              </div>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
};
