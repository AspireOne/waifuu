import { Button, Image, Textarea } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ForumPostComment } from "~/components/Forum/ForumPostComment";
import Page from "~/components/Page";
import { api } from "~/utils/api";

type CreateFormPostForm = {
  content: string;
};

export default function ForumPostPage() {
  const { id } = useRouter().query;

  const { register, handleSubmit } = useForm<CreateFormPostForm>();
  const createCommentMutation = api.forum.comment.useMutation();
  const onSubmit = async (data: CreateFormPostForm) => {
    await createCommentMutation.mutateAsync({
      content: data.content,
      parentPostId: id as string,
    });

    postComments.refetch();
  };

  const post = api.forum.get.useQuery({ id: id as string });
  const postComments = api.forum.getPostComments.useQuery({ id: id as string, cursor: 0 });

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
          <h1 className="text-2xl font-bold">{post.data?.title}</h1>
          <p>{post.data?.content}</p>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h1>Comments</h1>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Textarea {...register("content")} placeholder="Comment" />
          <Button isLoading={createCommentMutation.isLoading} type="submit">
            Submit
          </Button>
        </form>

        <div className="flex flex-col gap-6 p-2">
            {postComments.data?.map((comment) => <ForumPostComment {...comment} />)}
        </div>
      </section>
    </Page>
  );
}
