import { api } from "@/lib/api";
import { Trans } from "@lingui/macro";
import { Button } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import { FaPlus } from "react-icons/fa";
import Title from "../ui/Title";
import { ForumPostHighlight } from "./ForumPostHighlight";
import { PinnedPost } from "./PinnedPost";

type Props = {
  onToggleCreatePostOpen: VoidFunction;
  posts: (ForumPost & { author: User })[];
};

export default ({ onToggleCreatePostOpen, posts }: Props) => {
  const pinnedPosts = api.forum.getPinned.useQuery();

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div>
          <Title>
            <Trans>Pinned posts</Trans>
          </Title>
          {pinnedPosts.isLoading || !pinnedPosts.data ? (
            <p>
              <Trans>Loading...</Trans>
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {pinnedPosts.data.map((item) => {
                return <PinnedPost key={item.id} {...item} />;
              })}
            </div>
          )}
        </div>

        <div className="w-full">
          <Title>
            <Trans>Recent</Trans>
            <Button
              onClick={onToggleCreatePostOpen}
              variant="bordered"
              size="md"
              className="ml-auto"
              startContent={<FaPlus />}
            >
              <Trans>Create a new post</Trans>
            </Button>
          </Title>

          {posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-fit">
              {posts.map((item) => {
                return <ForumPostHighlight key={item.id} {...item} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
