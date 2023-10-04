import { Bot, BotMode } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { makeDownloadPath } from "~/utils/paths";

type CharacterCardProps = {
  bot: Bot;
  chatType?: BotMode;
};

const CharacterCard = ({ bot, chatType }: CharacterCardProps) => {
  return (
    <Link
      href={`/character/${bot.id}/${chatType}`}
      className="w-fit rounded-lg border-1 border-gray-500 p-3"
    >
      <Image
        src={makeDownloadPath(bot.avatar!)}
        alt="character"
        className="opacity-100 rounded-lg w-full h-28 object-cover"
        width={100}
        height={100}
      />
      <h1 className="text-xl text-white mt-3">{bot.name}</h1>
      <p className="text-gray-300 table w-[120px] text-sm">{bot.description}</p>
    </Link>
  );
};

export { CharacterCard };
