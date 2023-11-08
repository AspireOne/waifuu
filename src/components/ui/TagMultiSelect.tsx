import { api } from "@/lib/api";
import { t } from "@lingui/macro";
import { Select, SelectItem } from "@nextui-org/react";
import { HTMLAttributes, useEffect, useState } from "react";
import { Skeleton } from "../Skeleton";
import { CharacterTag } from "@prisma/client";

type Props = {
  onSelectTagIds: (tagIds: CharacterTag[]) => void;
} & HTMLAttributes<HTMLSelectElement>;

export const TagMultiSelect = ({ onSelectTagIds, ...props }: Props) => {
  const [selected, setSelected] = useState(new Set([]));

  useEffect(() => onSelectTagIds(Array.from(selected)), [selected]);

  const { data, isLoading } = api.bots.getPopularTags.useQuery({
    limit: 10,
  });

  if (!data || isLoading) {
    return <Skeleton width={200} height={50} />;
  }

  return (
    <Select
      selectionMode="multiple"
      defaultSelectedKeys="all"
      // @ts-ignore --- Library type bug
      onSelectionChange={setSelected}
      selectedKeys={selected}
      label={t`Select tags`}
      {...props}
    >
      {Object.keys(data).map(el => {
        return (
          <SelectItem key={el} value={el}>
            {data[el as keyof typeof data]}
          </SelectItem>
        );
      })}
    </Select>
  );
};
