import { paths } from "@/lib/paths";
import { makeDownloadUrl } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
import { Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaEye, FaHeart } from "react-icons/fa";

export const ForumPostDetailedHighlight = (post: ForumPost & { author: User }) => {
  const router = useRouter();
  function onClick() {
    if (Capacitor.isNativePlatform()) {
      router.push(paths.forum);
    }
    router.push(paths.forumPost(post.id));
  }

  return (
    <Card className="max-w-[600px]">
      <CardBody onClick={onClick} className={"cursor-pointer hover:bg-default-100"}>
        <Image
          removeWrapper
          alt="Woman listing to music"
          className="h-[150px] object-cover w-full"
          src={makeDownloadUrl(post.bannerImage)}
        />

        <Spacer y={3.5} />

        <div className="flex flex-row gap-2 mb-2">
          <h1 className="text-lg text-left font-bold">{post.title}</h1>
          <div className="flex flex-row gap-2 w-fit mx-auto mr-0 mt-1.5">
            <section className="flex gap-1 flex-row">
              <FaHeart color="default" className="mx-auto w-fit gap-1" />
              <p className="mt-[-5px]">{parseInt(post.likeCount.toString())}</p>
            </section>

            <section className="flex flex-row gap-1">
              <FaEye color="default" className="mx-auto w-fit" />
              <p className="mt-[-5px]">{parseInt(post.viewCount.toString())}</p>
            </section>
          </div>
        </div>

        <div className="flex mt-2 mb-2 flex-row gap-1 align-center">
          <Image
            src={post.author.image}
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
            <p className="text-gray-400 text-xs">replied {moment(post.createdAt).fromNow()}</p>
          </div>
        </div>

        <Chip className="mt-2" color="primary">
          {post.categoryname}
        </Chip>
      </CardBody>
    </Card>
  );
};
