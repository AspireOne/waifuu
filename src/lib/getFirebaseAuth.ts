import { Capacitor } from "@capacitor/core";
import { getApp } from "firebase/app";
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { Preferences } from "@capacitor/preferences";

let auth: Auth | undefined;

export default async function getOrInitFirebaseAuth() {
  if (auth) return auth;

  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(getApp(), {
      persistence: indexedDBLocalPersistence,
    });
    return auth;
  } else {
    auth = getAuth();
    await auth.setPersistence(indexedDBLocalPersistence);
    return auth;
  }
}
