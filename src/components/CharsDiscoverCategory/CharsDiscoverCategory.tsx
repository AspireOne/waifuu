import { discoveredBotStore } from "@/stores";
import { CharacterCard } from "@components/CharacterCard";
import { NsfwConfirmDialog } from "@components/NsfwConfirmDialog";
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
import { TagMultiSelect } from "../ui/TagMultiSelect";

import { Preferences } from "@capacitor/preferences";

type SearchBotsFilters = {
  textFilter?: string;
  source?: BotSource | null;
  tags: CharacterTag[];
  cursor: number;
  nsfw?: boolean;
};

let textFilterTimer: NodeJS.Timeout | null = null;

const stringifyFilters = (filters: SearchBotsFilters) => {
  return JSON.stringify({
    textFilter: filters.textFilter,
    source: filters.source,
    tags: filters.tags,
    nsfw: filters.nsfw,
  });
};

export const CharsDiscoverCategory = () => {
  const discoveredBots = discoveredBotStore.getState();

  const [filters, setFilters] = useState<SearchBotsFilters>({
    textFilter: undefined,
    source: "OFFICIAL",
    tags: [],
    cursor: 0,
  });

  const onFilterChange = <T,>(key: keyof SearchBotsFilters, value: T) => {
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
        const existingCache = discoveredBots.cache[stringifyFilters(filters)];
        if (existingCache?.page === filters.cursor + 1) return;

        discoveredBots.setCacheData(stringifyFilters(filters), {
          page: filters.cursor + 1,
          characters: existingCache ? [...existingCache.characters, ...data.bots] : data.bots,
          hasNextPage: data.hasNextPage,
        });
      },
    },
  );

  const { register, watch } = useForm<SearchBotsFilters>();

  useEffect(() => {
    const subscription = watch((value, info) => {
      if (info.name === "textFilter") {
        if (textFilterTimer) clearTimeout(textFilterTimer);
        textFilterTimer = setTimeout(reload, 500);
        return;
      }

      reload();
      function reload() {
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
        onOnlyOfficialChange={(value) =>
          onFilterChange("source", value ? "OFFICIAL" : "COMMUNITY")
        }
        onTagsChange={(value) => onFilterChange("tags", value)}
        onNsfwChange={(value) => onFilterChange("nsfw", value)}
        register={register}
        searchData={filters}
      />

      <Spacer y={6} />

      <div className="flex w-full flex-wrap gap-5">
        {/*{isRefetching && <CharacterCardSkeleton inline count={5} />}*/}

        {/*&& !isRefetching*/}
        {discoveredBots.cache[stringifyFilters(filters)]?.characters.length === 0 && (
          <p className="">
            <Trans>No characters found. Try changing your search term.</Trans>
          </p>
        )}

        <div className="gap-4 flex flex-wrap w-full mx-auto">
          {discoveredBots.cache[stringifyFilters(filters)]?.characters.map((bot) => {
            return <CharacterCard bottom key={bot.id} bot={bot} />;
          })}
        </div>

        {discoveredBots.cache[stringifyFilters(filters)]?.hasNextPage && (
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
  searchData: SearchBotsFilters;
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
            <Tooltip content={_(msg`Create a new character`)}>
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
          <TagMultiSelect className="w-full sm:hidden" onSelectTagIds={props.onTagsChange} />
          <div className="flex flex-row gap-6">
            <Switch
              onValueChange={(value) => props.onOnlyOfficialChange(value)}
              isSelected={props.searchData.source === "OFFICIAL"}
            >
              Official
            </Switch>

            <Switch
              isSelected={props.searchData.nsfw}
              onValueChange={async (value) => {
                if (!value) return props.onNsfwChange(false);
                const { value: nsfwAllowed } = await Preferences.get({ key: "allow-nsfw" });
                nsfwAllowed === "true" ? props.onNsfwChange(true) : onNsfwOpenChange();
              }}
            >
              NSFW
            </Switch>

            <TagMultiSelect
              className="w-48 hidden sm:block"
              onSelectTagIds={props.onTagsChange}
            />
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      <NsfwConfirmDialog
        onConfirm={async () => {
          props.onNsfwChange(true);
          onNsfwOpenChange();
          await Preferences.set({ key: "allow-nsfw", value: "true" });
        }}
        isOpen={isNsfwOpen}
        onOpenChange={onNsfwOpenChange}
      />
    </div>
  );
};
