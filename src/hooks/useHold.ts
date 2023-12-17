import { useCallback, useEffect, useRef, useState } from "react";

function useHold(onHold: () => void, holdDuration = 500) {
  const [isHeld, setIsHeld] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const startHold = useCallback(() => {
    holdTimerRef.current = setTimeout(() => {
      onHold();
      setIsHeld(true);
    }, holdDuration);
  }, [onHold, holdDuration]);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setIsHeld(false);
  }, []);

  useEffect(() => {
    const targetElement = targetRef.current;

    if (targetElement) {
      targetElement.addEventListener("mousedown", startHold);
      targetElement.addEventListener("mouseup", endHold);
      targetElement.addEventListener("mouseleave", endHold);
      targetElement.addEventListener("touchstart", startHold);
      targetElement.addEventListener("touchend", endHold);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener("mousedown", startHold);
        targetElement.removeEventListener("mouseup", endHold);
        targetElement.removeEventListener("mouseleave", endHold);
        targetElement.removeEventListener("touchstart", startHold);
        targetElement.removeEventListener("touchend", endHold);
      }
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, [startHold, endHold]);

  return { isHeld, targetRef };
}

export default useHold;
