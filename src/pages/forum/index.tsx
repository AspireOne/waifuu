import { CreateForumPostModal } from "@/components/forum/CreateForumPostModal";
import ForumOverview from "@/components/forum/ForumOverview";
import ForumRecentPosts from "@/components/forum/ForumRecentPosts";
import { api } from "@/lib/api";
import { AppPage } from "@components/AppPage";
import Title from "@components/ui/Title";
import { paths } from "@lib/paths";
import { Trans, t } from "@lingui/macro";
import { Card, Spacer } from "@nextui-org/react";
import { cx } from "class-variance-authority";
import { useState } from "react";

export default function ForumPage() {
  const [cardOpen, setCardOpen] = useState<"OVERVIEW" | "RECENT">("OVERVIEW");
  const toggleCardOpen = (card: "OVERVIEW" | "RECENT") => setCardOpen(card);
  const isCardToggled = (card: "OVERVIEW" | "RECENT") => cardOpen === card;

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const toggleCreatePostOpen = () => setIsCreatePostOpen(!isCreatePostOpen);

  const categories = api.forum.getCategories.useQuery({
    skip: 0,
    take: 10,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const toggleCategory = (name: string) => {
    if (selectedCategories.includes(name)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== name));
    } else {
      setSelectedCategories([...selectedCategories, name]);
    }
  };
  const isSelectedCategory = (name: string) => selectedCategories.find((el) => el === name);

  const posts = api.forum.getAll.useQuery({
    take: 10,
    skip: 0,
    includesCategories: cardOpen === "RECENT" ? [] : selectedCategories,
  });

  return (
    <AppPage backPath={paths.discover} title={t`Forum`}>
      <div className="flex xl:flex-row flex-col gap-8 mt-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex flex-col gap-1 max-w-[300px]">
              <Title>
                <Trans>Pages</Trans>
              </Title>

              <button onClick={() => toggleCardOpen("OVERVIEW")}>
                <Card
                  className={cx([
                    "p-3 hover:bg-opacity-50 hover:cursor-pointer text-left",
                    isCardToggled("OVERVIEW") && "bg-primary-500 bg-opacity-50",
                  ])}
                >
                  <Trans>Overview</Trans>
                </Card>
              </button>

              <button onClick={() => toggleCardOpen("RECENT")}>
                <Card
                  className={cx([
                    "p-3 hover:bg-opacity-50 hover:cursor-pointer text-left",
                    isCardToggled("RECENT") && "bg-primary-500 bg-opacity-50",
                  ])}
                  onClick={() => toggleCardOpen("RECENT")}
                >
                  <Trans>Recent posts</Trans>
                </Card>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 max-w-[300px]">
              <Title>
                <Trans>Categories</Trans>
              </Title>
            </div>

            <div className="flex flex-col gap-1 max-w-[300px]">
              {categories.isLoading || !categories.data ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {categories.data.map((item) => {
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <div key={item.name} onClick={() => toggleCategory(item.name)}>
                        <Card
                          className={cx([
                            "p-3 hover:bg-opacity-50 hover:cursor-pointer",
                            isSelectedCategory(item.name) && "bg-primary-500 bg-opacity-50",
                          ])}
                        >
                          {item.name}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          {posts.isLoading && <Trans>Posts are loading...</Trans>}
          {cardOpen === "OVERVIEW" && posts.data && (
            <ForumOverview posts={posts.data} onToggleCreatePostOpen={toggleCreatePostOpen} />
          )}

          {cardOpen === "RECENT" && <ForumRecentPosts posts={posts.data} />}
        </div>
      </div>

      <Spacer y={6} />

      <CreateForumPostModal
        onCreate={() => posts.refetch()}
        isOpen={isCreatePostOpen}
        onToggle={toggleCreatePostOpen}
      />
    </AppPage>
  );
}
