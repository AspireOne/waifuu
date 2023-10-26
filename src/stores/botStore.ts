import { Bot, BotMode } from "@prisma/client";
import { createStore } from "zustand";

export type ExtendedBot = Bot & {
  chatType?: BotMode;
  chatId?: string;
};

export type DiscoveredBotStore = {
  discovered: ExtendedBot[];
  addDiscoveredBots: (bots: ExtendedBot[]) => void;
  clearDiscoveredBots: VoidFunction;
  hasNextDiscoveredPage: boolean;
  setHasNextDiscoveredPage: (hasNext: boolean) => void;
  cursor: number;
  setCursor: (cursor: number) => void;
};

export const discoveredBotStore = createStore<DiscoveredBotStore>((set) => ({
  discovered: [],
  addDiscoveredBots: (bots: ExtendedBot[]) =>
    set((state) => {
      const final = [
        ...state.discovered,
        ...bots.filter((bot) => !state.discovered.find((b) => b.id === bot.id)),
      ];

      return { discovered: final };
    }),
  clearDiscoveredBots: () => set({ discovered: [] }),
  hasNextDiscoveredPage: false,
  setHasNextDiscoveredPage: (hasNext: boolean) =>
    set({ hasNextDiscoveredPage: hasNext }),
  cursor: 0,
  setCursor: (cursor: number) =>
    set((state) => {
      return { cursor, discovered: state.discovered };
    }),
}));
