import { Card, Image } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import { FaComment, FaHeart } from "react-icons/fa";
import { Flex } from "../shared/Flex";

type ForumPostProps = ForumPost & {
  author: User;
};

export const ForumPostComment = (data: ForumPostProps) => {
  return (
    <Card className="p-2">
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

      <p className="mt-3 mb-3">{data.content}</p>

      <Flex orientation="row" gap="4">
        <Flex orientation="row" className="text-center">
            <FaHeart fontSize={20} />
            <p>{parseInt(data.likeCount.toString())}</p>
        </Flex>

        <Flex orientation="row" className="text-center">
            <FaComment fontSize={20} />
            <p>{parseInt(data.likeCount.toString())}</p>
        </Flex>
      </Flex>
    </Card>
  );
};
