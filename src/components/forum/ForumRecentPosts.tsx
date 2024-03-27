import { ForumPost, User } from "@prisma/client";
import { ForumPostDetailedHighlight } from "./ForumPostDetailedHighlight";

type Props = {
  posts?: (ForumPost & { author: User })[];
};

export default ({ posts }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4 w-full">
        {posts?.map((item) => {
          return <ForumPostDetailedHighlight key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
};
