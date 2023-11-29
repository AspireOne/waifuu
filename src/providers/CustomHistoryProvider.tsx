import React, { createContext, useContext, useEffect, useState, FC, ReactNode } from "react";
import { useRouter } from "next/router";

// Type for the custom history context value
interface CustomHistoryContextValue {
  historyStack: string[];
  push: (url: string) => void;
}

// Creating the context with a default value
const CustomHistoryContext = createContext<CustomHistoryContextValue>({
  historyStack: [],
  push: () => {},
});

// Custom hook for accessing the context
export const useCustomHistory = () => useContext(CustomHistoryContext);

// Provider component type
type CustomHistoryProviderProps = {
  children: ReactNode;
};

// Provider component implementation
export const CustomHistoryProvider: FC<CustomHistoryProviderProps> = ({ children }) => {
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log("route changed: ", url)
      setHistoryStack((prevStack) => [...prevStack, url]);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const push = (url: string) => {
    setHistoryStack((prevStack) => [...prevStack, url]);
  };

  return (
    <CustomHistoryContext.Provider value={{ historyStack, push }}>
      {children}
    </CustomHistoryContext.Provider>
  );
};
