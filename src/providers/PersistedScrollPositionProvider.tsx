import React, { ReactNode, createContext, useContext, useState } from "react";

// Define the shape of the scroll positions state
interface ScrollPositions {
  [pathname: string]: {
    scrollY: number;
  };
}

// Define the context shape
interface ScrollPositionContextProps {
  setScrollYPosition: (pathname: string, scrollY: number) => void;
  getScrollYPosition: (pathname: string) => number;
}

// Create the context with an initial dummy value
const ScrollPositionContext = createContext<ScrollPositionContextProps>({
  setScrollYPosition: () => {},
  getScrollYPosition: () => 0,
});

// Define the props for the ScrollYPosition component
interface ScrollYPositionProps {
  children: ReactNode;
}

export const PersistedScrollPositionProvider: React.FC<ScrollYPositionProps> = ({
  children,
}) => {
  const [scrollYPositions, setScrollYPositions] = useState<ScrollPositions>({});

  const setScrollYPosition = (pathname: string, scrollY: number) => {
    setScrollYPositions((prevScrollYPositions) => ({
      ...prevScrollYPositions,
      [pathname]: { scrollY },
    }));
  };

  const getScrollYPosition = (pathname: string): number => {
    if (!scrollYPositions[pathname]) {
      setScrollYPosition(pathname, 0);
      return 0;
    }
    // biome-ignore lint: it is checked above.
    return scrollYPositions[pathname]!.scrollY;
  };

  return (
    <ScrollPositionContext.Provider
      value={{
        setScrollYPosition,
        getScrollYPosition,
      }}
    >
      {children}
    </ScrollPositionContext.Provider>
  );
};

/** If you want to have a mount-persisted scroll, do not use this. This is just the bare bones. */
export const usePersistedScrollPosition = (): ScrollPositionContextProps =>
  useContext(ScrollPositionContext);
