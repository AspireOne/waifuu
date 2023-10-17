import { getOrInitFirebaseAuth } from "@/lib/firebase/getOrInitFirebaseAuth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export const getIdToken = async (): Promise<string | undefined> => {
  const result = await FirebaseAuthentication.getIdToken();
  return result.token;
};
