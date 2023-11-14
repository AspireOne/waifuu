// Import the hook with its type
import { usePersistedScrollPosition } from "@providers/PersistedScrollPositionProvider";
import { NextRouter, useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

type ScrollYPosition = {
  getScrollYPosition: (path: string) => number;
  setScrollYPosition: (path: string, scrollY: number) => void;
};

/** Use this to persist page scroll position between re-mounts. */
export function usePersistentScrollPositionHandler(): void {
  const { getScrollYPosition, setScrollYPosition }: ScrollYPosition =
    usePersistedScrollPosition();
  const router: NextRouter = useRouter();
  const pathnameRef = useRef<string>(router.pathname);
  const debounceTimerRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (pathnameRef.current) {
      setScrollYPosition(pathnameRef.current, window.scrollY);
    }
  }, [setScrollYPosition]);

  useEffect(() => {
    const scrollY: number = getScrollYPosition(pathnameRef.current);
    window.scrollTo(0, scrollY);

    const debouncedHandleScroll = () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        handleScroll();
      }, 250);
    };

    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll, getScrollYPosition]);
}
