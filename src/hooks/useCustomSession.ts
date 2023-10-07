import { useEffect, useState } from "react";
import firebase from "firebase/compat";
import { api } from "~/utils/api";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  bio: string | null;
};

export default function useCustomSession() {
  const userQuery = api.users.getSelf.useQuery({ includeBots: false }, {});
  // Get firebase user and cache it.
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      // refetch
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userQuery.data) {
      setUser({
        id: userQuery.data.id,
        name: userQuery.data.name!,
        email: userQuery.data.email!,
        image: userQuery.data.image ?? "/assets/default_user.jpg",
        username: userQuery.data.username!,
        bio: userQuery.data.bio,
      });
    }
  }, [userQuery.data]);
}
