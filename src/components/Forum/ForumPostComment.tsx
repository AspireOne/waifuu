import { Card, Image } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import { FaComment, FaHeart } from "react-icons/fa";
import { Flex } from "../shared/Flex";

type ForumPostProps = ForumPost & {
  author: User;
};

export const ForumPostComment = (data: ForumPostProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-2">
          <Image
            src={data.author.image ?? "/default-avatar.png"}
            width={50}
            className="rounded-full"
            height={50}
            alt="Avatar"
          />

          <div className="flex flex-col spacing-2">
            <p>dlkjfkd</p>
            <p className="text-gray-400">@lkjfdlkfjd</p>
          </div>
        </div>

        <div className="flex flex-row gap-4 mx-auto mr-4 mt-2.5">
          <FaHeart className="text-gray-500" fontSize={20} />
          <FaComment className="text-primary-500" fontSize={20} />
        </div>
      </div>

      <p className="mt-3 mb-3">{data.content}</p>
    </Card>
  );
};
