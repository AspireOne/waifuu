import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";

const globalForApp = globalThis as unknown as {
  app: FirebaseApp | undefined;
};

const globalForAuth = globalThis as unknown as {
  auth: Auth | undefined;
};

const options: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY as string,
  authDomain: "companion-400217.firebaseapp.com",
  projectId: "companion-400217",
  storageBucket: "companion-400217.appspot.com",
  messagingSenderId: "24288336305",
  appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID as string,
  measurementId: "G-N3WCYQ93GT",
};

const getOrInitFirebaseApp = () => {
  // biome-ignore lint: Shut up this is beatiful.
  return (globalForApp.app ??= initializeApp(options));
};

const getOrInitFirebaseAuth = () => {
  if (globalForAuth.auth) return globalForAuth.auth;

  getOrInitFirebaseApp();

  if (Capacitor.isNativePlatform()) {
    globalForAuth.auth = initializeAuth(getApp(), {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    globalForAuth.auth = getAuth();
    globalForAuth.auth.setPersistence(indexedDBLocalPersistence);
  }

  return globalForAuth.auth;
};

const getIdToken = async (): Promise<string | undefined> => {
  await getOrInitFirebaseAuth().authStateReady();
  const result = await FirebaseAuthentication.getIdToken();
  return result.token;
};

export { getIdToken, getOrInitFirebaseApp, getOrInitFirebaseAuth };
