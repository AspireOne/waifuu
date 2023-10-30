import Title from "@components/ui/Title";
import { BiTrendingUp } from "react-icons/bi";
import { Trans } from "@lingui/macro";
import { Tooltip } from "@nextui-org/tooltip";
import { Button, Checkbox, Input, Spacer, Switch } from "@nextui-org/react";
import { useRouter } from "next/router";
import { paths } from "@lib/paths";
import { AiOutlinePlus } from "react-icons/ai";
import { TagSelect } from "@components/ui/TagSelect";
import { CharacterCard } from "@components/CharacterCard";
import { BotSource } from "@prisma/client";
import { discoveredBotStore } from "@/stores";
import { api } from "@lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SearchType = {
  textFilter?: string;
  nsfw: boolean;
  officialBots?: BotSource | null;
  cursor: number;
  categories: string[];
};

export const PopularCharactersDiscoverCategory = () => {
  const discoveredBots = discoveredBotStore.getState();

  const [searchData, setSearchData] = useState<SearchType>({
    textFilter: undefined,
    nsfw: true,
    officialBots: "OFFICIAL",
    categories: [],
    cursor: 0,
  });

  const toggleNsfw = () => {
    discoveredBots.clearDiscoveredBots();
    setSearchData({
      ...searchData,
      nsfw: !searchData.nsfw,
      cursor: 0,
    });
  };

  const onCategoryChange = (value: string[]) => {
    discoveredBots.clearDiscoveredBots();
    setSearchData({
      ...searchData,
      categories: value,
      cursor: 0,
    });
  };

  const toggleOfficialBots = () => {
    discoveredBots.clearDiscoveredBots();
    setSearchData({
      ...searchData,
      officialBots:
        searchData.officialBots === null ? BotSource.OFFICIAL : null,
      cursor: 0,
    });
  };

  const CURSOR_LIMIT = 10;

  const skipPage = () => {
    setSearchData({
      ...searchData,
      cursor: searchData.cursor + CURSOR_LIMIT,
    });
  };

  api.bots.getAllBots.useQuery(
    {
      ...searchData,
      sourceFilter: searchData.officialBots,
      limit: CURSOR_LIMIT,
    },
    {
      onSuccess: (data) => {
        discoveredBots.addDiscoveredBots(data.bots);
        discoveredBots.setHasNextDiscoveredPage(data.hasNextPage);
      },
    },
  );

  const { register, watch } = useForm<SearchType>();

  useEffect(() => {
    const subscription = watch((value) => {
      discoveredBots.clearDiscoveredBots();
      setSearchData({
        textFilter: value.textFilter,
        nsfw: value.nsfw as boolean,
        officialBots: value.officialBots,
        cursor: 0,
        categories: [],
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div>
      <form>
        <ParametersHeader
          onNsfwChange={toggleNsfw}
          onOnlyOfficialChange={toggleOfficialBots}
          register={register}
          searchData={searchData}
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
            {discoveredBots.discovered.map((bot, index) => {
              return <CharacterCard bottom key={index} bot={bot} />;
            })}
          </div>

          {discoveredBots.hasNextDiscoveredPage && (
            <Button
              onClick={skipPage}
              variant="faded"
              className="w-full sm:w-[200px] mx-auto"
            >
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
  register: any;
  onOnlyOfficialChange: (value: boolean) => void;
  onNsfwChange: (value: boolean) => void;
  /*onTextFilterChange: (value: string) => void;*/
  searchData: SearchType;
}) => {
  const router = useRouter();

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
            /*onValueChange={props.onTextFilterChange}*/
            label="Search by name"
            placeholder="Enter your search term..."
            className="flex-1 rounded-lg sm:w-96 text-white"
            type="text"
          />

          <div className={"flex flex-row gap-3"}>
            <Checkbox
              onValueChange={props.onOnlyOfficialChange}
              checked={props.searchData.officialBots === BotSource.OFFICIAL}
            >
              <Trans>Only display official characters</Trans>
            </Checkbox>

            <Switch
              isSelected={props.searchData.nsfw}
              onValueChange={props.onNsfwChange}
              className="ml-auto w-fit"
            >
              <Trans>NSFW</Trans>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};
