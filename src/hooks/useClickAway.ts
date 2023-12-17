import { RefObject, useEffect } from "react";

// Type definition for useClickAway hook
type Event = MouseEvent | TouchEvent;

function useClickAway<T extends HTMLElement>(
  ref: RefObject<T>,
  onClickAway: (event: Event) => void,
): void {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      onClickAway(event);
    };

    // Add event listeners
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, onClickAway]); // Only re-call the effect if ref or onClickAway changes
}

export default useClickAway;
