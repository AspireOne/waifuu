import { Bot, ChatMode } from "@prisma/client";
import { createStore } from "zustand";

export type ExtendedBot = Bot & {
  chatType?: ChatMode;
  chatId?: string;
};

export type DiscoveredBotStore = {
  discovered: ExtendedBot[];
  addDiscoveredBots: (bots: ExtendedBot[]) => void;
  clearDiscoveredBots: VoidFunction;
  hasNextDiscoveredPage: boolean;
  setHasNextDiscoveredPage: (hasNext: boolean) => void;
};

const addDiscoveredBots = (bots: ExtendedBot[]) => {
  discoveredBotStore.setState((state) => {
    const final = [
      ...state.discovered,
      ...bots.filter((bot) => !state.discovered.find((b) => b.id === bot.id)),
    ];

    return { discovered: final };
  });
};

const clearDiscoveredBots = () => {
  discoveredBotStore.setState({ discovered: [] });
};

const setHasNextDiscoveredPage = (hasNext: boolean) => {
  discoveredBotStore.setState({ hasNextDiscoveredPage: hasNext });
};

export const discoveredBotStore = createStore<DiscoveredBotStore>((set) => ({
  discovered: [],
  hasNextDiscoveredPage: false,
  addDiscoveredBots,
  clearDiscoveredBots,
  setHasNextDiscoveredPage,
}));
