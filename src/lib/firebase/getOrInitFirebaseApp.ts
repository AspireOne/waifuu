import { FirebaseApp, initializeApp } from "firebase/app";
import { options } from "~/lib/firebase/firebaseConfig";

let firebaseApp: FirebaseApp | undefined;

export const getOrInitFirebaseApp = () => {
  if (!firebaseApp) firebaseApp = initializeApp(options);
  return firebaseApp;
};
