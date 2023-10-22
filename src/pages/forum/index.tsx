import { Trans, t } from "@lingui/macro";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CreateForumPostModal } from "@/components/forum/CreateForumPostModal";
import { ForumPostHighlight } from "@/components/forum/ForumPostHighlight";
import { PinnedPost } from "@/components/forum/PinnedPost";
import Page from "@/components/Page";
import { api } from "@/lib/api";

export default function ForumPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const toggleCreatePostOpen = () => setIsCreatePostOpen(!isCreatePostOpen);

  const posts = api.forum.getAll.useQuery({ take: 10, skip: 0 });

  return (
    <Page title={t`Forum`} unprotected>
      <h1 className="text-xl font-bold">
        <Trans>Pinned posts</Trans>
      </h1>
      {posts.isLoading || !posts.data ? (
        <p>
          <Trans>Loading...</Trans>
        </p>
      ) : (
        <div className="flex flex-col gap-2 mt-5">
          {posts.data.map((item) => {
            return <PinnedPost key={item.id} {...item} />;
          })}
        </div>
      )}

      <div className="flex flex-row gap-2 mt-7">
        <h1 className="text-xl font-bold">
          <Trans>Recent posts</Trans>
        </h1>
        <Button
          onClick={toggleCreatePostOpen}
          variant="bordered"
          size="md"
          className="w-fit mx-auto mr-0"
        >
          <FaPlus />
          <Trans>Create a new post</Trans>
        </Button>
      </div>
      {posts.isLoading || !posts.data ? (
        <p>
          <Trans>Loading...</Trans>
        </p>
      ) : (
        <div className="flex flex-col gap-2 mt-5">
          {posts.data.map((item) => {
            return <ForumPostHighlight key={item.id} {...item} />;
          })}
        </div>
      )}

      <CreateForumPostModal
        isOpen={isCreatePostOpen}
        onToggle={toggleCreatePostOpen}
      />
    </Page>
  );
}
