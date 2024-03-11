import { ForumPostDetailedHighlight } from "./ForumPostDetailedHighlight";
import { ForumPost, User } from "@prisma/client";

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
