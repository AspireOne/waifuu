import { Card, Image } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import { FaComment, FaHeart } from "react-icons/fa";
import { Flex } from "../shared/Flex";
import { api } from "~/utils/api";

type ForumPostProps = {
  post: ForumPost & { author: User };
  onLikeToggle: VoidFunction;
  onCommentToggle: VoidFunction;
};

export const ForumPostComment = ({
  post,
  onCommentToggle,
  onLikeToggle,
}: ForumPostProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-2">
          <Image
            src={post.author.image ?? "/default-avatar.png"}
            width={50}
            className="rounded-full h-[50px] w-[50px]"
            height={50}
            alt="Avatar"
          />

          <div className="flex flex-col spacing-2">
            <p>{post.author.name}</p>
            <p className="text-gray-400">@{post.author.username}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 mb-3">{post.content}</p>

      <div className="flex flex-row gap-4 mx-auto mr-4 mt-2.5">
        <FaHeart
          onClick={onLikeToggle}
          className="text-gray-500"
          fontSize={20}
        />
        <FaComment
          onClick={onCommentToggle}
          className="text-primary-500"
          fontSize={20}
        />
      </div>
    </Card>
  );
};
