import { api } from "@/lib/api";
import { Button } from "@nextui-org/react";
import { CharacterTag } from "@prisma/client";
import { useSession } from "@providers/SessionProvider";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = {
  onSelectTagIds: (tagIds: CharacterTag[]) => void;
  description?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TagRowSelector = (props: Props) => {
  const session = useSession();
  const [selected, setSelected] = useState<Set<CharacterTag>>(new Set<CharacterTag>());
  const { onSelectTagIds } = props;

  useEffect(() => onSelectTagIds(Array.from(selected)), [selected]);

  const { data, isLoading } = api.bots.getPopularTags.useQuery(
    {
      limit: 10,
    },
    {
      staleTime: Infinity,
      enabled: session.status !== "unauthenticated",
      retry: 2,
    },
  );

  // Handle tag selection toggle
  const toggleSelection = (tagId: CharacterTag) => {
    const newSelection = new Set(selected);
    if (selected.has(tagId)) {
      newSelection.delete(tagId);
    } else {
      newSelection.add(tagId);
    }
    setSelected(newSelection);
  };

  // Render the tags
  const items =
    data &&
    Object.keys(data).map((tagId) => (
      <Button
        key={tagId}
        type={"button"}
        /*variant={selected.has(tagId) ? "bordered" : "default"}*/
        onClick={() => toggleSelection(tagId as CharacterTag)}
        className={`mr-2 mb-2 py-1 bg-default-100 max-w-full w-fit min-w-fit ${
          selected.has(tagId as CharacterTag) ? "bg-default-300" : ""
        }`}
      >
        {data[tagId as keyof typeof data]}
      </Button>
    ));

  return (
    <div className="flex-nowrap overflow-x-auto">
      <div className={"flex flex-row"}>{items?.slice(0, items.length / 2)}</div>
      <div className={"flex flex-row"}>{items?.slice(items.length / 2)}</div>
    </div>
  );
};
