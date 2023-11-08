import { ForumPostHighlight } from "@components/forum/ForumPostHighlight";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { Trans } from "@lingui/macro";
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";

import { MdForum } from "react-icons/md";

export const ForumPostsDiscoverCategory = () => {
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

      <div className="flex flex-wrap gap-4 ">
        {forumPosts.data?.map((post) => {
          return <ForumPostHighlight key={post.id} {...post} />;
        })}
      </div>
    </div>
  );
};
