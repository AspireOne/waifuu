//useIsOnline.ts

import { useEffect, useState } from "react";

let online = true;
export const getIsOnline = () => online;

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const setOnline = () => {
      setIsOnline(true);
      online = true;
    };
    const setOffline = () => {
      setIsOnline(false);
      online = false;
    };

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return isOnline;
};
