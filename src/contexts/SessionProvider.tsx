import { api } from "@/lib/api";
import { getOrInitFirebaseAuth } from "@/lib/firebase";
import { User } from "@prisma/client";
import "firebase/compat/auth";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

type SessionUser = User;
type SessionStatus = "loading" | "authenticated" | "unauthenticated";

let authSubscribed = false;
let fbTimeMeasured = false;
let queryTimeMeasured = false;

type SessionState = {
  user: SessionUser | null | undefined;
  status: SessionStatus;
  refetch: () => void;
};

const SessionContext = createContext<SessionState>({
  user: undefined,
  status: "loading",
  refetch: () => {},
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
    const fbStart = performance.now();

    auth.onAuthStateChanged((fbUser) => {
      const status = fbUser ? "authenticated" : "unauthenticated";
      if (!fbUser) setUser(null);
      setFbStatus(status);

      console.log(`Auth state changed: ${status}`);

      const fbEnd = performance.now();
      if (!fbTimeMeasured) {
        console.log(`Firebase initial Auth state change took: ${fbEnd - fbStart}ms`);
        fbTimeMeasured = true;
      }

      userQuery.refetch().then(() => {
        const queryEnd = performance.now();
        if (!queryTimeMeasured) {
          console.log(`User fetch from our backend took: ${queryEnd - fbEnd}ms`);
          queryTimeMeasured = true;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (userQuery.data) {
      setUser({
        ...userQuery.data,
        name: userQuery.data.name!,
        email: userQuery.data.email!,
        image: userQuery.data.image ?? "/assets/default_user.jpg",
        username: userQuery.data.username!,
      });
    }

    if (!userQuery.data && !userQuery.isLoading) {
      setUser(null);
      setFbStatus("unauthenticated");
    }
  }, [userQuery.data]);

  return (
    <SessionContext.Provider value={{ user, status: fbStatus, refetch: userQuery.refetch }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
