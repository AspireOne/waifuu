import {
  Button,
  Image,
  Modal,
  ModalContent,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaHeart, FaReply } from "react-icons/fa";
import { ForumPostComment } from "~/components/Forum/ForumPostComment";
import Page from "~/components/Page";
import { Flex } from "~/components/shared/Flex";
import { api } from "~/utils/api";

type CreateFormPostForm = {
  content: string;
};

export default function ForumPostPage() {
  const { id } = useRouter().query;

  const [commentInputOpen, setCommentInputOpen] = useState(false);

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

  return (
    <Page
      metaTitle={post.isLoading ? "Loading Post..." : post.data?.title ?? ""}
      className={"space-y-4"}
      header={{ back: null }}
    >
      <header className="w-full">
        <Image
          isLoading={post.isLoading}
          alt="Card example background"
          className="z-0 w-screen h-36 object-cover"
          src={"https://picsum.photos/seed/picsum/200/300"}
        />

        <div className="mt-2">
          <Flex orientation="col" className="align-center">
            <h1 className="text-2xl font-bold">{post.data?.title}</h1>
            <p className="text-gray-500">33 minutes ago</p>
          </Flex>

          <p className="mt-3">{post.data?.content}</p>
        </div>

        <div className="mt-2 flex flex-row gap-2">
          <Button color="danger">
            <FaHeart />
          </Button>

          <Button onClick={() => setCommentInputOpen(true)} color="primary">
            <FaReply />
            Comment
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 align-center mt-4">
          <h1 className="text-xl font-bold">Comments</h1>
          <label className="mt-0.5 text-gray-500">{postComments.data?.length} replies</label>
        </div>

        <Modal
          isOpen={commentInputOpen}
          onClose={() => setCommentInputOpen(false)}
        >
          <ModalContent className="p-3">
            <h1 className="text-lg font-bold">Create a new comment</h1>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Textarea {...register("content")} placeholder="Comment" />
              <Button isLoading={createCommentMutation.isLoading} type="submit">
                Submit
              </Button>
            </form>
          </ModalContent>
        </Modal>

        <div className="flex flex-col gap-6 p-2">
          {postComments.data?.map((comment) => (
            <ForumPostComment {...comment} />
          ))}
        </div>
      </section>
    </Page>
  );
}
