import { Image } from "@nextui-org/react";
import { ChatHeaderProps } from "./types";
import { BsThreeDotsVertical, BsShareFill } from 'react-icons/bs';

const ChatHeader = ({ avatarPath, name, userName }: ChatHeaderProps) => {
  return (
    <div className="flex mt-5 rounded-lg w-[75%] mx-auto flex-row bg-black p-3">
      <div>
        <Image
          height={50}
          width={50}
          loading="eager"
          src={avatarPath}
          alt="botavatar"
        />
      </div>

      <div className="ml-3">
        <h3 className="text-white">{name}</h3>
        <h6 className="text-gray-400">@{userName}</h6>
      </div>

      <div className="flex mx-auto mr-1 mt-4 flex-row">
        <BsThreeDotsVertical color="white" />
        <BsShareFill color="white" />
      </div>
    </div>
  );
};

export { ChatHeader };
