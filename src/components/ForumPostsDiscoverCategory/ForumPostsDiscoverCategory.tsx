import * as React from "react";
import Title from "@components/ui/Title";
import { MdForum } from "react-icons/md";
import { Trans } from "@lingui/macro";
import { ForumPostHighlight } from "@components/forum/ForumPostHighlight";
import { api } from "@lib/api";
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import { paths } from "@lib/paths";

export const ForumPostsDiscoverCategory = (props: {}) => {
  const forumPosts = api.forum.getAll.useQuery({ take: 10, skip: 0 });
  const router = useRouter();

  return (
    <div className="">
      <Title bold icon={MdForum}>
        <Trans>Popular forum posts</Trans>
      </Title>

      <Button
        variant={"faded"}
        className={"w-full sm:w-60"}
        onClick={() => router.push(paths.forum)}
      >
        <Trans>Browse more</Trans>
      </Button>

      <Spacer y={3} />

      <div className="flex flex-col gap-2 ">
        {forumPosts.data?.map((post) => {
          return <ForumPostHighlight {...post} />;
        })}
      </div>
    </div>
  );
};
