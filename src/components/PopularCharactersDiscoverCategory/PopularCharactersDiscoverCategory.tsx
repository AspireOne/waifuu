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
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";

type SearchType = {
  textFilter?: string;
  nsfw: boolean;
  onlyOfficial?: boolean;
  categories?: string[];
};

const CURSOR_LIMIT = 1;

export const PopularCharactersDiscoverCategory = () => {
  const [searchData, setSearchData] = useImmer<SearchType>({
    textFilter: undefined,
    nsfw: true,
    onlyOfficial: false,
    categories: [],
  });
  const [cursor, setCursor] = useState<number>(0);

  const bots = discoveredBotStore.getState();

  useEffect(() => {
    bots.clearDiscoveredBots();
    setCursor(0);
  }, [searchData]);

  const { isRefetching } = api.bots.getAllBots.useQuery(
    {
      ...searchData,
      cursor,
      sourceFilter: searchData.onlyOfficial ? BotSource.OFFICIAL : undefined,
      limit: CURSOR_LIMIT,
    },
    {
      onSuccess: (data) => {
        bots.addDiscoveredBots(data.bots);
        bots.setHasNextDiscoveredPage(data.hasNextPage);
      },
    },
  );

  const skipPage = () => setCursor((prev) => prev + CURSOR_LIMIT);

  return (
    <div>
      <ParametersHeader
        searchData={searchData}
        // prettier-ignore
        onTagsChange={value => setSearchData(prev => {
          prev.categories = value;
        })}
        // prettier-ignore
        onOnlyOfficialChange={value => setSearchData(prev => {
          prev.onlyOfficial = value;
        })}
        // prettier-ignore
        onNsfwChange={value => setSearchData(prev => {
          prev.nsfw = value;
        })}
        // prettier-ignore
        onTextFilterChange={value => setSearchData(prev => {
          prev.textFilter = value;
        })}
      />

      <Spacer y={6} />

      <div className="flex w-full flex-wrap gap-5">
        {/*{isRefetching && <CharacterCardSkeleton inline count={5} />}*/}

        {bots.discovered?.length === 0 && !isRefetching && (
          <p className="">
            <Trans>No characters found. Try changing your search term.</Trans>
          </p>
        )}

        <div className="gap-4 flex flex-wrap w-full mx-auto">
          {bots.discovered.map((bot, index) => {
            return <CharacterCard bottom key={index} bot={bot} />;
          })}
        </div>

        {bots.hasNextDiscoveredPage && (
          <Button
            onClick={skipPage}
            variant="solid"
            className="w-full sm:w-[200px] mx-auto"
          >
            <Trans>Load more</Trans>
          </Button>
        )}
      </div>
    </div>
  );
};

const ParametersHeader = (props: {
  onTagsChange: (tags: string[]) => void;
  onOnlyOfficialChange: (value: boolean) => void;
  onNsfwChange: (value: boolean) => void;
  onTextFilterChange: (value: string) => void;
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
            onValueChange={props.onTextFilterChange}
            label="Search by name"
            placeholder="Enter your search term..."
            className="flex-1 rounded-lg text-white"
            type="text"
          />

          <div className={"flex flex-row gap-3"}>
            <Checkbox
              onValueChange={props.onOnlyOfficialChange}
              checked={props.searchData.onlyOfficial}
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
