import { Capacitor } from "@capacitor/core";
import { getApp } from "firebase/app";
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import getOrInitFirebaseApp from "~/lib/firebase/getOrInitFirebaseApp";

let auth: Auth | undefined;

export default function getOrInitFirebaseAuth() {
  if (auth) return auth;

  getOrInitFirebaseApp();

  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(getApp(), {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    auth = getAuth();
    auth.setPersistence(indexedDBLocalPersistence);
  }

  return auth;
}
