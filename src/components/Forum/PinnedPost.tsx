import { Card } from "@nextui-org/react";
import { ForumPost } from "@prisma/client";
import { TbPinnedFilled } from "react-icons/Tb";

export const PinnedPost = (data: ForumPost) => {
  return (
    <Card className="flex flex-row gap-3 p-2">
      <TbPinnedFilled fontSize={50} className="mt-[-10px] align-center text-primary-500" />

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold">{data.title}</h1>
        <p className="text-gray-500 text-sm">{data.content}</p>
      </div>
    </Card>
  );
};
