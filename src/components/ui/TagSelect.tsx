import { Chip } from "@nextui-org/react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { api } from "@/lib/api";
import { Category } from "@prisma/client";

type TagSelectProps = {
  onChange: (value: string[]) => void;
};

export const TagSelect = ({ onChange }: TagSelectProps) => {
  const [tags, setTags] = useState<string[]>([]);

  const onTagToggle = (value: string): void => {
    const newValue = tags.includes(value)
      ? tags.filter((tag) => tag !== value)
      : [...tags, value];

    setTags(newValue);
    onChange(newValue);
  };

  const fetchedTags = api.bots.getPopularTags.useQuery({
    limit: 10,
  });

  const isTagToggled = (value: string): boolean => tags.includes(value);

  if (
    fetchedTags.isLoading ||
    !fetchedTags.data ||
    fetchedTags.data.length === 0
  ) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-1 overflow-scroll overflow-scroll-y">
      {fetchedTags.data.map((tag: Category) => {
        return (
          <Chip
            size="lg"
            variant={isTagToggled(tag.name) ? "solid" : "bordered"}
            key={tag.name}
            onClick={() => onTagToggle(tag.name)}
            className="cursor-pointer bg-opacity-70"
          >
            {tag.name}
          </Chip>
        );
      })}
    </div>
  );
};
