import { Chip } from "@nextui-org/react";
import { Bot, BotMode } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import paths, { makeDownloadPath } from "~/utils/paths";

type CharacterCardProps = {
  bot: Bot;
  chatId?: string;
  chatType?: BotMode;
};

const CharacterCard = ({ bot, chatId, chatType }: CharacterCardProps) => {
  return (
    <Link
      href={paths.botChat(chatId ?? "", bot.id)}
      className="w-fit rounded-lg border-1 border-gray-500 p-3"
    >
      <div>
        {chatType ? (
          <Chip className="z-30 relative top-1 left-1 bg-opacity-70">
            {chatType}
          </Chip>
        ) : null}
        <Image
          src={makeDownloadPath(bot.avatar!)}
          alt="character"
          className={`opacity-100 rounded-lg w-full ${
            chatType ? "mt-[-27px]" : null
          } h-28 object-cover`}
          width={100}
          height={100}
        />
      </div>

      <h1 className="text-xl text-white mt-1">{bot.name}</h1>
      <p className="text-gray-300 table w-[120px] text-sm">{bot.description}</p>
    </Link>
  );
};

export { CharacterCard };
