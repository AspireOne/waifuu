import { Bot, ChatMode } from "@prisma/client";
import { createStore } from "zustand";

export type ExtendedBot = Bot & {
  chatType?: ChatMode;
  chatId?: string;
};

export type CharacterCache = {
  page: number;
  hasNextPage: boolean;
  characters: ExtendedBot[];
};

export type DiscoveredBotStore = {
  // string is indentifying chosen categories
  cache: Record<string, CharacterCache>;
  setCacheData: (key: string, data: CharacterCache) => void;
};

const setCacheData = (key: string, data: CharacterCache) => {
  discoveredBotStore.setState((state) => {
    const cache = { ...state.cache };
    cache[key] = data;
    return { cache };
  });
};

export const discoveredBotStore = createStore<DiscoveredBotStore>((set) => ({
  cache: {},
  setCacheData,
}));
