import { discoveredBotStore } from "@/stores";
import { CharacterCard } from "@components/CharacterCard";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, Divider, Input, Spacer, Switch, useDisclosure } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { BotSource, CharacterTag } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { NsfwConfirmDialog } from "../NsfwConfirmDialog/NsfwConfirmDialog";
import { TagMultiSelect } from "../ui/TagMultiSelect";

type Filters = {
  textFilter?: string;
  source?: BotSource | null;
  tags: CharacterTag[];
  cursor: number;
  nsfw?: boolean;
};

let textFilterTimer: NodeJS.Timeout | null = null;

export const PopularCharactersDiscoverCategory = () => {
  const discoveredBots = discoveredBotStore.getState();

  const [filters, setFilters] = useState<Filters>({
    textFilter: undefined,
    source: "OFFICIAL",
    tags: [],
    cursor: 0,
  });

  const onFilterChange = <T,>(key: keyof Filters, value: T) => {
    discoveredBots.clearDiscoveredBots();

    return setFilters({
      ...filters,
      [key]: value,
      cursor: 0,
    });
  };

  const skipPage = () => {
    setFilters({
      ...filters,
      cursor: filters.cursor + 10,
    });
  };

  api.bots.getAllBots.useQuery(
    {
      ...filters,
      tags: filters.tags,
      sourceFilter: filters.source,
      nsfw: filters.nsfw,
      limit: 10,
    },
    {
      onSuccess: (data) => {
        discoveredBots.addDiscoveredBots(data.bots);
        discoveredBots.setHasNextDiscoveredPage(data.hasNextPage);
      },
    },
  );

  const { register, watch } = useForm<Filters>();

  useEffect(() => {
    const subscription = watch((value, info) => {
      if (info.name === "textFilter") {
        if (textFilterTimer) clearTimeout(textFilterTimer);
        textFilterTimer = setTimeout(reload, 500);
        return;
      }

      reload();
      function reload() {
        discoveredBots.clearDiscoveredBots();

        setFilters({
          textFilter: value.textFilter,
          source: value.source,
          cursor: 0,
          tags: [],
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, discoveredBots]);

  return (
    <form>
      <ParametersHeader
        onOnlyOfficialChange={(value) => onFilterChange("source", value ? "OFFICIAL" : null)}
        onTagsChange={(value) => onFilterChange("tags", value)}
        onNsfwChange={(value) => onFilterChange("nsfw", value)}
        register={register}
        searchData={filters}
      />

      <Spacer y={6} />

      <div className="flex w-full flex-wrap gap-5">
        {/*{isRefetching && <CharacterCardSkeleton inline count={5} />}*/}

        {/*&& !isRefetching*/}
        {discoveredBots.discovered.length === 0 && (
          <p className="">
            <Trans>No characters found. Try changing your search term.</Trans>
          </p>
        )}

        <div className="gap-4 flex flex-wrap w-full mx-auto">
          {discoveredBots.discovered.map((bot) => {
            return <CharacterCard bottom key={bot.id} bot={bot} />;
          })}
        </div>

        {discoveredBots.hasNextDiscoveredPage && (
          <Button onClick={skipPage} variant="faded" className="w-full sm:w-[200px] mx-auto">
            <Trans>Load more</Trans>
          </Button>
        )}
      </div>
    </form>
  );
};

const ParametersHeader = (props: {
  onTagsChange: (tags: string[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny:
  register: (name: any) => UseFormRegisterReturn;
  onOnlyOfficialChange: (value: boolean) => void;
  onNsfwChange: (value: boolean) => void;
  searchData: Filters;
}) => {
  const router = useRouter();
  const { _ } = useLingui();

  const { isOpen: isNsfwOpen, onOpenChange: onNsfwOpenChange } = useDisclosure();

  return (
    <div>
      <div className="xl:flex flex-col xl:flex-row gap-3">
        <div className="mb-4">
          <Title
            description="Browse recently popular characters"
            className="mb-3"
            icon={BiTrendingUp}
            bold
          >
            <Trans>Popular Characters</Trans>
            <Tooltip>
              <Button
                className={"ml-auto md:ml-0"}
                size="sm"
                onClick={() => router.push(paths.createBot)}
                isIconOnly
              >
                <AiOutlinePlus fontSize={25} />
              </Button>
            </Tooltip>
          </Title>

          <Input
            {...props.register("textFilter")}
            label={_(msg`Search by name`)}
            placeholder={_(msg`Enter your search term...`)}
            className={"flex-1 rounded-lg sm:w-96 text-white"}
            type="text"
          />
        </div>

        <div className="mx-auto mr-0 flex flex-col gap-3">
          <div className="flex flex-row gap-6">
            <Switch onValueChange={(value) => props.onOnlyOfficialChange(value)}>
              Official
            </Switch>

            <Switch
              isSelected={props.searchData.nsfw}
              onValueChange={(value) => {
                if (!value) return props.onNsfwChange(false);
                onNsfwOpenChange();
              }}
            >
              NSFW
            </Switch>
            <TagMultiSelect className="w-48" onSelectTagIds={props.onTagsChange} />
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      <NsfwConfirmDialog
        onConfirm={() => {
          props.onNsfwChange(true);
          onNsfwOpenChange();
        }}
        isOpen={isNsfwOpen}
        onOpenChange={onNsfwOpenChange}
      />
    </div>
  );
};
