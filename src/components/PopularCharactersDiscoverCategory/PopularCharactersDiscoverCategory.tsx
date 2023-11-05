import { discoveredBotStore } from "@/stores";
import { CharacterCard } from "@components/CharacterCard";
import { TagSelect } from "@components/ui/TagSelect";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, Checkbox, Input, Spacer } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { BotSource } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";

type Filters = {
  textFilter?: string;
  source?: BotSource | null;
  categories: string[];
  cursor: number;
};

let textFilterTimer: NodeJS.Timeout | null = null;

export const PopularCharactersDiscoverCategory = () => {
  const discoveredBots = discoveredBotStore.getState();
  const [filters, setFilters] = useState<Filters>({
    textFilter: undefined,
    source: "OFFICIAL",
    categories: [],
    cursor: 0,
  });

  const onCategoryChange = (value: string[]) => {
    discoveredBots.clearDiscoveredBots();
    setFilters({
      ...filters,
      categories: value,
      cursor: 0,
    });
  };

  const toggleOfficialBots = () => {
    discoveredBots.clearDiscoveredBots();
    setFilters({
      ...filters,
      source: filters.source === null ? BotSource.OFFICIAL : null,
      cursor: 0,
    });
  };

  const CURSOR_LIMIT = 10;

  const skipPage = () => {
    setFilters({
      ...filters,
      cursor: filters.cursor + CURSOR_LIMIT,
    });
  };

  api.bots.getAllBots.useQuery(
    {
      ...filters,
      sourceFilter: filters.source,
      limit: CURSOR_LIMIT,
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
          source: value.officialBots,
          cursor: 0,
          categories: [],
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, discoveredBots]);

  return (
    <div>
      <form>
        <ParametersHeader
          onOnlyOfficialChange={toggleOfficialBots}
          register={register}
          searchData={filters}
          onTagsChange={onCategoryChange}
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
    </div>
  );
};

const ParametersHeader = (props: {
  onTagsChange: (tags: string[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny:
  register: (name: any) => UseFormRegisterReturn;

  onOnlyOfficialChange: (value: boolean) => void;
  onlyOfficial: boolean;

  searchData: Filters;
}) => {
  const router = useRouter();
  const { _ } = useLingui();

  return (
    <div>
      <Title icon={BiTrendingUp} bold>
        <Trans>Popular Characters</Trans>
        <Tooltip content={"Create a character"}>
          <Button
            className={"ml-auto md:ml-0"}
            onClick={() => router.push(paths.createBot)}
            isIconOnly={true}
          >
            <AiOutlinePlus fontSize={25} />
          </Button>
        </Tooltip>
      </Title>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col w-full gap-3">
          <TagSelect onChange={props.onTagsChange} />

          <Input
            {...props.register("textFilter")}
            label={_(msg`Search by name`)}
            placeholder={_(msg`Enter your search term...`)}
            className={"flex-1 rounded-lg sm:w-96 text-white"}
            type="text"
          />

          <div className={"flex flex-row gap-3"}>
            <Checkbox
              onValueChange={props.onOnlyOfficialChange}
              checked={props.searchData.source === BotSource.OFFICIAL}
            >
              <Trans>Only display official characters</Trans>
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
};
