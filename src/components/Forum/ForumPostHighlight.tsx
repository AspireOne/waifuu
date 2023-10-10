import { Card, CardBody, CardHeader, Chip, Image } from "@nextui-org/react";
import { FaEye, FaHeart } from "react-icons/fa";
import { LargeText } from "../shared/LargeText";
import Link from "next/link";
import paths from "~/utils/paths";
import { ForumPost, User } from "@prisma/client";
import moment from "moment";

export const ForumPostHighlight = (post: ForumPost & { author: User }) => {
  return (
    <Card>
      <Link href={paths.forumPost(post.id)}>
        <CardBody>
          <div className="flex flex-row gap-2 mb-2">
            <h1 className="text-lg text-left font-bold">{post.title}</h1>
            <div className="flex flex-row gap-2 w-fit mx-auto mr-0 mt-1.5">
              <section className="flex gap-1 flex-row">
                <FaHeart color="default" className="mx-auto w-fit gap-1" />
                <p className="mt-[-5px]">
                  {parseInt(post.likeCount.toString())}
                </p>
              </section>

              <section className="flex flex-row gap-1">
                <FaEye color="default" className="mx-auto w-fit" />
                <p className="mt-[-5px]">
                  {parseInt(post.viewCount.toString())}
                </p>
              </section>
            </div>
          </div>

          <LargeText
            className="text-gray-400 text-sm"
            content={post.content}
            maxLength={100}
          />

          <div className="flex mt-2 mb-2 flex-row gap-1 align-center">
            <Image
              src={post.author.image ?? "/default-avatar.png"}
              width={30}
              height={30}
              className="rounded-full h-[30px] w-[30px]"
              alt="Avatar"
            />

            <div className="mt-2 flex-row flex">
              <Link className="text-xs" href={paths.profile}>
                @{post.author.username}
              </Link>
              <p className="text-gray-400 text-xs ml-1 mr-1">•</p>
              <p className="text-gray-400 text-xs">
                replied {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </div>

          <Chip className="mt-2" color="primary">
            General
          </Chip>
        </CardBody>
      </Link>
    </Card>
  );
};
