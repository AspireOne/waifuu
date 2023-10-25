import { create } from "zustand";

export type DrawerStore = {
  isOpen: boolean;
  toggle: () => void;
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
