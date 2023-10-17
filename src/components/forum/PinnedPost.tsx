import { Card } from "@nextui-org/react";
import { ForumPost } from "@prisma/client";
import Link from "next/link";
import { TbPinnedFilled } from "react-icons/Tb";
import { paths } from "@/lib/paths";

export const PinnedPost = (data: ForumPost) => {
  return (
    <Link href={paths.forumPost(data.id)}>
      <Card className="flex flex-row gap-3 p-2">
        <div className="h-[30px] w-[30px]">
          <TbPinnedFilled className="h-[30px] w-[30px] align-center text-primary-500" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold">{data.title}</h1>
          <p className="text-gray-500 text-md">{data.content}</p>
        </div>
      </Card>
    </Link>
  );
};
