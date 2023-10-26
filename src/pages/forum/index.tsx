import { Trans, t } from "@lingui/macro";
import { Button, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CreateForumPostModal } from "@/components/forum/CreateForumPostModal";
import { ForumPostHighlight } from "@/components/forum/ForumPostHighlight";
import { PinnedPost } from "@/components/forum/PinnedPost";
import Page from "@/components/Page";
import { api } from "@/lib/api";
import Title from "@components/ui/Title";

export default function ForumPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const toggleCreatePostOpen = () => setIsCreatePostOpen(!isCreatePostOpen);

  const posts = api.forum.getAll.useQuery({ take: 10, skip: 0 });

  return (
    <Page title={t`Forum`} unprotected>
      <div className="md:w-[600px] mx-auto">
        <Title>
          <Trans>Pinned posts</Trans>
        </Title>
        {posts.isLoading || !posts.data ? (
          <p>
            <Trans>Loading...</Trans>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {posts.data.map((item) => {
              return <PinnedPost key={item.id} {...item} />;
            })}
          </div>
        )}

        <Spacer y={6} />

        <Title className={"justify-between"}>
          <Trans>Recent</Trans>
          <Button
            onClick={toggleCreatePostOpen}
            variant="bordered"
            size="md"
            className="ml-auto"
            startContent={<FaPlus />}
          >
            <Trans>Create a new post</Trans>
          </Button>
        </Title>

        {posts.isLoading || !posts.data ? (
          <p>
            <Trans>Loading...</Trans>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {posts.data.map((item) => {
              return <ForumPostHighlight key={item.id} {...item} />;
            })}
          </div>
        )}

        <CreateForumPostModal
          isOpen={isCreatePostOpen}
          onToggle={toggleCreatePostOpen}
        />
      </div>
    </Page>
  );
}
