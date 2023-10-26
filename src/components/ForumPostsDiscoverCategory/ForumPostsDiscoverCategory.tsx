import * as React from "react";
import Title from "@components/ui/Title";
import { MdForum } from "react-icons/md";
import { Trans } from "@lingui/macro";
import { ForumPostHighlight } from "@components/forum/ForumPostHighlight";
import { api } from "@lib/api";

export const ForumPostsDiscoverCategory = (props: {}) => {
  const forumPosts = api.forum.getAll.useQuery({ take: 10, skip: 0 });

  return (
    <div className="">
      <Title bold icon={MdForum}>
        <Trans>Popular forum posts</Trans>
      </Title>

      <div className="flex flex-col gap-2 ">
        {forumPosts.data?.map((post) => {
          return <ForumPostHighlight {...post} />;
        })}
      </div>
    </div>
  );
};
