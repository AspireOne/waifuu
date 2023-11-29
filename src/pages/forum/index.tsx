import { CreateForumPostModal } from "@/components/forum/CreateForumPostModal";
import { ForumPostHighlight } from "@/components/forum/ForumPostHighlight";
import { api } from "@/lib/api";
import { AppPage } from "@components/AppPage";
import Title from "@components/ui/Title";
import { paths } from "@lib/paths";
import { Trans, t } from "@lingui/macro";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ForumPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const toggleCreatePostOpen = () => setIsCreatePostOpen(!isCreatePostOpen);

  const posts = api.forum.getAll.useQuery({ take: 10, skip: 0 });

  return (
    <AppPage backPath={paths.discover} title={t`Forum`}>
      {/*TODO: Implement pinned posts (server-side).*/}
      {/*<Title>
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
      */}

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

      <CreateForumPostModal isOpen={isCreatePostOpen} onToggle={toggleCreatePostOpen} />
    </AppPage>
  );
}
