import { api } from "@/lib/api";
import { t } from "@lingui/macro";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Skeleton } from "../Skeleton";

type Props = {
  onSelectTagIds: (tagIds: string[]) => void;
};

export const TagMultiSelect = ({ onSelectTagIds }: Props) => {
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
      placeholder={t`Select tags`}
      aria-label={t`Select tags`}
      className="w-48"
    >
      {data.map(({ name }) => {
        return <SelectItem key={name}>{name}</SelectItem>;
      })}
    </Select>
  );
};
