import { Chip } from "@nextui-org/react";
import { useState } from "react";

export const TagSelect = () => {
  const [tags, setTags] = useState<string[]>([]);

  const onTagToggle = (value: string): void => {
    if (tags.includes(value)) {
      setTags(tags.filter((tag) => tag !== value));
    } else {
      setTags([...tags, value]);
    }
  };

  const isTagToggled = (value: string): boolean => tags.includes(value);

  return (
    <div className="flex flex-row gap-1 overflow-scroll overflow-scroll-y">
      {[
        "All",
        "Anime",
        "Games",
        "Movies",
        "TV",
        "NSFW",
        "Nevim",
        "Submissive",
        "Dominant",
        "Fetish",
      ].map((tag) => {
        return (
          <Chip
            variant={isTagToggled(tag) ? "solid" : "bordered"}
            key={tag}
            onClick={() => onTagToggle(tag)}
            className="cursor-pointer bg-opacity-70 w-fit mt-2 mx-auto"
          >
            {tag}
          </Chip>
        );
      })}
    </div>
  );
};
