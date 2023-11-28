import { api } from "@/lib/api";
import { t } from "@lingui/macro";
import { Select, SelectItem } from "@nextui-org/react";
import { CharacterTag } from "@prisma/client";
import { useSession } from "@providers/SessionProvider";
import parse from "parse-duration";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = {
  onSelectTagIds: (tagIds: CharacterTag[]) => void;
} & HTMLAttributes<HTMLSelectElement>;

export const TagMultiSelect = ({ onSelectTagIds, ...props }: Props) => {
  const [selected, setSelected] = useState(new Set([]));
  const session = useSession();

  useEffect(() => onSelectTagIds(Array.from(selected)), [selected]);

  const { data, isLoading } = api.bots.getPopularTags.useQuery(
    {
      limit: 10,
    },
    {
      staleTime: parse("1h"),
      enabled: session.status !== "unauthenticated",
      retry: 2,
    },
  );

  const items =
    data &&
    Object.keys(data).map((el) => {
      return (
        <SelectItem key={el} value={el}>
          {data[el as keyof typeof data]}
        </SelectItem>
      );
    });

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
      {items ?? []}
    </Select>
  );
};
