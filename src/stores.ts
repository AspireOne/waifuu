import {create} from "zustand";

type DrawerStore = {
  isOpen: boolean
  toggle: () => void
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))