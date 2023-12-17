import { paths } from "@/lib/paths";
import {
  getBotVisibilityIcon,
  getVisibilityIconTitle,
  makeDownloadUrl,
  normalizePath,
} from "@lib/utils";
import { useLingui } from "@lingui/react";
import { Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { Bot, BotSource, ChatMode } from "@prisma/client";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { LargeText } from "../ui/LargeText";

type CharacterCardProps = {
  character: Bot;
  likes?: number;
  chatId?: string;
  chatType?: ChatMode;
  bottom?: boolean;
  showVisibility?: boolean;
};

export const CharacterCard = ({
  character,
  chatId,
  chatType,
  bottom,
  likes,
  showVisibility,
}: CharacterCardProps) => {
  const { _ } = useLingui();
  const VisibilityIcon = getBotVisibilityIcon(character.visibility);

  return (
    /*Margin bottom so that scrollbar is not glitched.*/
    <Card className={"w-full min-w-[220px] sm:max-w-[220px] hover:bg-zinc-800 mb-2 relative"}>
      {showVisibility && (
        <Tooltip closeDelay={0} content={getVisibilityIconTitle(character.visibility)}>
          <div className="absolute top-2 right-2">
            <VisibilityIcon size={21} />
          </div>
        </Tooltip>
      )}
      <Link className={"p-3"} href={normalizePath(paths.botChat(chatId ?? "", character.id))}>
        <Spacer y={2} />
        <Image
          removeWrapper
          src={makeDownloadUrl(character.avatar)}
          alt="character"
          className={"h-[100px] w-[100px] object-cover z-0 mx-auto rounded-lg bg-gray-100"}
          width={100}
          height={100}
        />

        <CardBody className="min-w-[190px]">
          <b className="text-md flex flex-row text-white text-center mx-auto">
            <p className="text-center mx-auto w-fit line-clamp-1">{character.name}</p>

            {character.source === BotSource.OFFICIAL && (
              <MdVerified fontSize={23} className="ml-2 text-primary" />
            )}
          </b>
          {!chatType && (
            <LargeText
              className="table mx-auto text-center text-sm mt-2"
              content={character.description}
              maxLength={35}
              lines={2}
            />
          )}
          <div className="flex flex-row gap-2">
            {chatType ? (
              <Chip className="bg-opacity-70 w-fit mt-2 mx-auto">{chatType}</Chip>
            ) : null}
            {!bottom && character.nsfw && (
              <Chip variant="flat" className="mx-auto mt-2 w-fit">
                NSFW
              </Chip>
            )}
          </div>

          {bottom && character.moodImagesEnabled && (
            <Chip className="mt-2 w-fit mx-auto" color="primary" variant="dot">
              Custom emotions
            </Chip>
          )}
        </CardBody>

        {bottom && (
          <div className={cx(["flex flex-row px-4 items-end", !likes && "mx-auto w-fit"])}>
            {character.nsfw && (
              <div className="mx-auto ml-0 w-fit">
                <Chip variant="flat">NSFW</Chip>
              </div>
            )}

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
