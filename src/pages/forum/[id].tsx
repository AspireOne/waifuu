import { Button, Image, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import Page from "~/components/Page";
import { api } from "~/utils/api";
import { makeDownloadPath } from "~/utils/paths";

export default function ForumPostPage() {
  const { id } = useRouter().query;

  const post = api.forum.get.useQuery({ id: id as string });

  return (
    <Page
      metaTitle={post.isLoading ? "Loading Post..." : post.data?.title ?? ""}
      className={"space-y-12"}
      header={{ back: null }}
    >
      <header>
        <Image
          isLoading={post.isLoading}
          alt="Card example background"
          className="z-0 w-full h-36 scale-120 -translate-y-6 object-cover"
          src={"https://picsum.photos/seed/picsum/200/300"}
        />

        <h1>{post.data?.title}</h1>
        <p>{post.data?.content}</p>
      </header>

      <section>
        <h1>Comments</h1>

        <form onSubmit={() => {}}>
          <Input placeholder="Comment" />
          <Button>Submit</Button>
        </form>

        <div className="flex flex-row"></div>
      </section>
    </Page>
  );
}
