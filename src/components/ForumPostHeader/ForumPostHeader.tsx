import moment from "moment";
import { Flex } from "../ui/Flex";
import { Button, Chip, Image } from "@nextui-org/react";
import { FaHeart, FaMapPin, FaReply } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { makeDownloadUrl } from "@/lib/utils";
import { Trans } from "@lingui/macro";

type Props = {
  post: any;
  user: any;
  onOpenComment: VoidFunction;
};

export const ForumPostHeader = ({ post, user, onOpenComment }: Props) => {
  const [isLiked, setIsLiked] = useState(post.data?.liked ?? false);
  useEffect(() => setIsLiked(post.data?.liked ?? false), [post.data]);
  const likeMutation = api.forum.like.useMutation({
    onSuccess: () => setIsLiked(true),
  });
  const dislikeMutation = api.forum.dislike.useMutation({
    onSuccess: () => setIsLiked(false),
  });
  const onLike = (postId: string) => {
    if (isLiked) {
      dislikeMutation.mutateAsync({ id: postId });
    } else {
      likeMutation.mutateAsync({ id: postId });
    }
  };

  const [isPinned, setIsPinned] = useState(post.data?.pinned ?? false);
  useEffect(() => setIsPinned(post.data?.pinned ?? false), [post.data]);

  const { mutateAsync: pinPost, isLoading: isPinning } =
    api.forum.pin.useMutation();
  const onPin = async (postId: string) => {
    await pinPost(postId);
    setIsPinned(!isPinned);
  };

  return (
    <header className="w-full">
      <Image
        isLoading={post.isLoading}
        alt="Card example background"
        className="z-0 w-screen h-36 object-cover"
        src={
          post.data?.bannerImage
            ? makeDownloadUrl(post.data.bannerImage)
            : "/default-banner.png"
        }
      />

      <div className="mt-2">
        <Flex orientation="col" className="align-center">
          <h1 className="text-2xl font-bold">{post.data?.title}</h1>
          <p className="text-gray-500">
            {moment(post.data?.createdAt).fromNow()}
          </p>
        </Flex>

        <Chip
          key={post.data?.category?.name}
          className="mt-2 mb-2"
          color="default"
        >
          {post.data?.category?.name}
        </Chip>

        <p className="mt-3">{post.data?.content}</p>
      </div>

      <div className="mt-2 flex flex-row gap-2">
        <Button
          onClick={() => onLike(post.data?.id!)}
          variant={isLiked ? "solid" : "bordered"}
          isLoading={likeMutation.isLoading || dislikeMutation.isLoading}
          color="danger"
        >
          <FaHeart />
        </Button>

        {user?.isAdmin && (
          <Button
            isLoading={isPinning}
            variant={isPinned ? "solid" : "bordered"}
            color="secondary"
            onClick={() => onPin(post.data?.id ?? "")}
          >
            <FaMapPin />
          </Button>
        )}

        <Button onClick={onOpenComment} color="primary">
          <FaReply />
          <Trans context={"Create a new comment"}>Comment</Trans>
        </Button>
      </div>
    </header>
  );
};
