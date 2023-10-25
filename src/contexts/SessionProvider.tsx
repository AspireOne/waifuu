import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import "firebase/compat/auth";
import { api } from "@/lib/api";
import { User } from "@prisma/client";
import { getOrInitFirebaseAuth } from "@/lib/firebase/getOrInitFirebaseAuth";

type SessionUser = User;
type SessionStatus = "loading" | "authenticated" | "unauthenticated";

let authSubscribed: boolean = false;
let initialTimeMeasured: boolean = false;

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

export const SessionProvider = (props: PropsWithChildren<{}>) => {
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

    const now = performance.now();
    auth.onAuthStateChanged((fbUser) => {
      const status = fbUser ? "authenticated" : "unauthenticated";
      if (status === "unauthenticated") setUser(null);
      setFbStatus(status);

      const authEnd = performance.now();
      if (!initialTimeMeasured) {
        console.log(`Auth state changed: ${status}`);
        console.log(`Firebase auth state change took: ${authEnd - now}ms`);
      }

      userQuery.refetch().then(() => {
        const queryEnd = performance.now();
        if (!initialTimeMeasured) {
          console.log(
            `User fetch from our backend took: ${queryEnd - authEnd}ms`,
          );
          initialTimeMeasured = true;
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
    <SessionContext.Provider
      value={{ user, status: fbStatus, refetch: userQuery.refetch }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
