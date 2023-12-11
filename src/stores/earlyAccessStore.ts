import { Preferences } from "@capacitor/preferences";
import { useEffect } from "react";
import { create } from "zustand";

interface EarlyAccessState {
  requested: boolean;
  setRequested: (value: boolean) => void;
  markRequested: () => Promise<void>;
}

export const useEarlyAccessStore = create<EarlyAccessState>((set) => ({
  requested: false,
  setRequested: (value: boolean) => set({ requested: value }),
  markRequested: async () => {
    await Preferences.set({ key: "requested-early-access", value: "true" });
    set({ requested: true });
  },
}));

// React component or custom hook to initialize the store state on the client side
export const useInitializeEarlyAccess = () => {
  const setRequested = useEarlyAccessStore((state) => state.setRequested);

  useEffect(() => {
    // This effect will only run on the client side after mounting
    const initialize = async () => {
      const result = await Preferences.get({ key: "requested-early-access" });
      if (result.value === "true") {
        setRequested(true);
      }
    };

    initialize();
  }, [setRequested]); // Passing setRequested as dependency to avoid re-running the effect
};
