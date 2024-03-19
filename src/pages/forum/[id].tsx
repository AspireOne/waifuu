import { ForumPostHeader } from "@/components/ForumPostHeader";
import { ForumPostComment } from "@/components/forum/ForumPostComment";
import { api } from "@/lib/api";
import { AppPage } from "@components/AppPage";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, Modal, ModalContent, Textarea } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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

  return (
    <AppPage
      backPath={paths.forum}
      title={_(msg`Forum Post`)}
      className="space-y-4"
    >
      <ForumPostHeader
        post={post}
        user={user}
        onOpenComment={() => setCommentInputOpen(true)}
      />

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
