import { Chip } from "@nextui-org/react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { api } from "~/utils/api";

type TagSelectProps = {
  onChange: (value: string[]) => void;
};

export const TagSelect = ({ onChange }: TagSelectProps) => {
  const [tags, setTags] = useState<string[]>([]);

  const onTagToggle = (value: string): void => {
    if (tags.includes(value)) {
      setTags(tags.filter((tag) => tag !== value));
    } else {
      setTags([...tags, value]);
    }

    onChange(tags);
  };

  const fetchedTags = api.bots.getPopularTags.useQuery({
    limit: 10,
  });

  const isTagToggled = (value: string): boolean => tags.includes(value);

  if (fetchedTags.isLoading || !fetchedTags.data) {
    return <Skeleton inline count={10} width={50} height={20} />;
  }

  return (
    <div className="flex flex-row gap-1 overflow-scroll overflow-scroll-y">
      {fetchedTags.data.map((tag) => {
        return (
          <Chip
            variant={isTagToggled(tag.name) ? "solid" : "bordered"}
            key={tag.name}
            onClick={() => onTagToggle(tag.name)}
            className="cursor-pointer bg-opacity-70 w-fit mt-2 mx-auto"
          >
            {tag.name}
          </Chip>
        );
      })}
    </div>
  );
};
