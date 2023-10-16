import { FirebaseApp, initializeApp } from "firebase/app";
import firebaseConfig from "~/lib/firebase/firebaseConfig";

let firebaseApp: FirebaseApp | undefined;

export default function getOrInitFirebaseApp() {
  if (!firebaseApp) firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
}
