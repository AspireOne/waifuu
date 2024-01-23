import { api } from "@/lib/api";
import { ForumPostDetailedHighlight } from "./ForumPostDetailedHighlight";

export default () => {
  const posts = api.forum.getAll.useQuery({
    take: 10,
    skip: 0,
  });

  return (
    <div className="flex flex-col gap-2">
      {posts.isLoading || !posts.data ? (
        <p>Loading... </p>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {posts.data.map((item) => {
            return <ForumPostDetailedHighlight key={item.id} {...item} />;
          })}
        </div>
      )}
    </div>
  );
};
