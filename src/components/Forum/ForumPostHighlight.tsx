import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { FaEye, FaHeart } from "react-icons/fa";
import { LargeText } from "../shared/LargeText";
import Link from "next/link";
import paths from "~/utils/paths";
import { ForumPost } from "@prisma/client";

export const ForumPostHighlight = (post: ForumPost) => {
  return (
    <Card>
      <Link href={paths.forumPost(post.id)}>
        <Image
          src={"https://picsum.photos/seed/picsum/200/300"}
          width={100}
          removeWrapper
          className={`h-[100px] w-full object-cover z-0 mx-auto rounded-lg bg-gray-100`}
          height={100}
          alt="Forum Post Image"
        />

        <CardBody>
          <h1 className="text-lg text-center font-bold">{post.title}</h1>
          <LargeText
            className="text-gray-400 text-center"
            content={post.content}
            maxLength={100}
          />

          <div className="flex flex-row gap-2 w-fit mx-auto mt-3">
            <section className="text-center">
              <FaHeart color="red" className="mx-auto w-fit" />
              <p>{parseInt(post.likeCount.toString())}</p>
            </section>

            <section className="text-center">
              <FaEye color="lightblue" className="mx-auto w-fit" />
              <p>{parseInt(post.viewCount.toString())}</p>
            </section>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};
