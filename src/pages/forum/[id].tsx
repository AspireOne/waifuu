import { ForumPostComment } from "@/components/forum/ForumPostComment";
import { Flex } from "@/components/ui/Flex";
import { api } from "@/lib/api";
import { AppPage } from "@components/AppPage";
import { paths } from "@lib/paths";
import { makeDownloadUrl } from "@lib/utils";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Button,
  Chip,
  Image,
  Modal,
  ModalContent,
  Textarea,
} from "@nextui-org/react";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaHeart, FaMapPin, FaReply } from "react-icons/fa";

type CreateFormPostForm = {
  content: string;
};

export default function ForumPostPage() {
  const { _ } = useLingui();
  const { id } = useRouter().query;

  const [commentInputOpen, setCommentInputOpen] = useState(false);
  const [openComments, setOpenComments] = useState<string[]>([]);
  const openComment = (id: string) => {
    if (openComments.includes(id)) {
      setOpenComments(openComments.filter((c) => c !== id));
    } else {
      setOpenComments([...openComments, id]);
    }
  };

  const { register, handleSubmit } = useForm<CreateFormPostForm>();
  const createCommentMutation = api.forum.comment.useMutation();
  const onSubmit = async (data: CreateFormPostForm) => {
    await createCommentMutation.mutateAsync({
      content: data.content,
      parentPostId: id as string,
    });

    postComments.refetch();
    setCommentInputOpen(false);
  };

  const post = api.forum.get.useQuery({ id: id as string });
  const postComments = api.forum.getPostComments.useQuery({
    id: id as string,
    cursor: 0,
  });

  const { data: user } = api.users.getSelf.useQuery({ includeBots: false });

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
    <AppPage
      backPath={paths.forum}
      title={_(msg`Forum Post`)}
      className="space-y-4"
    >
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

          <Button onClick={() => setCommentInputOpen(true)} color="primary">
            <FaReply />
            <Trans context={"Create a new comment"}>Comment</Trans>
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 align-center mt-4">
          <h1 className="text-xl font-bold">
            <Trans>Comments</Trans>
          </h1>
          <label className="mt-0.5 text-gray-500">
            {postComments.data?.length} <Trans>replies</Trans>
          </label>
        </div>

        <Modal
          isOpen={commentInputOpen}
          onClose={() => setCommentInputOpen(false)}
        >
          <ModalContent className="p-3">
            <h1 className="text-lg font-bold">
              <Trans>Create a new comment</Trans>
            </h1>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Textarea
                {...register("content")}
                placeholder={_(msg`Comment`)}
              />
              <Button isLoading={createCommentMutation.isLoading} type="submit">
                <Trans>Submit</Trans>
              </Button>
            </form>
          </ModalContent>
        </Modal>

        <div className="flex flex-col gap-6 p-2">
          {postComments.data?.map((comment) => (
            <ForumPostComment
              // @ts-ignore TODO: Fix this type error later
              parentPost={post.data!}
              onCommentToggle={() => openComment(comment.id)}
              onLikeToggle={() => onLike(comment.id)}
              // @ts-ignore TODO: Fix this type error later
              comment={comment}
              isOpen={openComments.includes(comment.id)}
              nestedLevel={0}
            />
          ))}
        </div>
      </section>
    </AppPage>
  );
}
