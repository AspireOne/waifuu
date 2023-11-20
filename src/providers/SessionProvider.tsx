import { api } from "@/lib/api";
import { getOrInitFirebaseAuth } from "@/lib/firebase";
import { Plan, getPlan, subscriptionPlans } from "@/server/shared/plans";
import { Preferences } from "@capacitor/preferences";
import { User } from "@prisma/client";
import "firebase/compat/auth";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

type SessionUser = User & { plan: Plan };
export type SessionStatus = "loading" | "authenticated" | "unauthenticated";
export type LastKnownStatus = "authenticated" | "unauthenticated";

let authSubscribed = false;
let fbTimeMeasured = false;

type SessionState = {
  user: SessionUser | null | undefined;
  status: SessionStatus;
  refetch: () => void;
  getLastKnownStatus: () => Promise<LastKnownStatus>;
};

const getLastKnownStatus = async () => {
  const result = await Preferences.get({ key: "lastKnownAuthStatus" });
  const value = result.value as LastKnownStatus | undefined;

  return value === "authenticated" ? "authenticated" : "unauthenticated";
};

const setLastKnownStatus = async (status: LastKnownStatus) => {
  await Preferences.set({ key: "lastKnownAuthStatus", value: status as string });
};

const SessionContext = createContext<SessionState>({
  user: undefined,
  status: "loading",
  refetch: () => {},
  getLastKnownStatus,
});

export const SessionProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  // Firebase status. This is separate from our backend user status.
  const [fbStatus, setFbStatus] = useState<SessionStatus>("loading");

  const userQuery = api.users.getSelf.useQuery(
    { includeBots: false },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      enabled: fbStatus === "authenticated",
      retry: false,
    },
  );

  useEffect(() => {
    if (authSubscribed) return;
    authSubscribed = true;

    const auth = getOrInitFirebaseAuth();

    console.time("firebase auth");
    auth.onAuthStateChanged((fbUser) => {
      const status = fbUser ? "authenticated" : "unauthenticated";
      if (!fbUser) setUser(null);
      setFbStatus(status);

      console.log(`Auth state changed: ${status}`);

      if (!fbTimeMeasured) {
        console.timeEnd("firebase auth");
        fbTimeMeasured = true;
      }

      console.time("user fetch");
      userQuery.refetch().then(() => {
        console.timeEnd("user fetch");
      });
    });
  }, []);

  useEffect(() => {
    if (userQuery.data) {
      setUser({
        ...userQuery.data,
        image: userQuery.data.image,
        plan: userQuery.data.planId
          ? getPlan(userQuery.data.planId)
          : subscriptionPlans().free,
      });
      setLastKnownStatus("authenticated");
    }

    if (!userQuery.data && !userQuery.isLoading) {
      setUser(null);
      setFbStatus("unauthenticated");
      setLastKnownStatus("unauthenticated");
    }
  }, [userQuery.data]);

  const contextValues = {
    user,
    status: fbStatus,
    refetch: userQuery.refetch,
    getLastKnownStatus,
  };

  return (
    <SessionContext.Provider value={contextValues}>{props.children}</SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
