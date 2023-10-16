import getOrInitFirebaseAuth from "~/lib/firebase/getOrInitFirebaseAuth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export async function getIdToken(): Promise<string | undefined> {
  const result = await FirebaseAuthentication.getIdToken();
  return result.token;
}
