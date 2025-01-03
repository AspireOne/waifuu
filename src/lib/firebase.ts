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

const options: FirebaseOptions = process.env.NEXT_PUBLIC_FIREBASE_CONFIG as FirebaseOptions;

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
  // TODO: IF NOT SIGNED IN, RETURN UNDEFINED, NO ERROR.
  await getOrInitFirebaseAuth().authStateReady();
  try {
    const result = await FirebaseAuthentication.getIdToken();
    return result.token;
  } catch (e: any) {
    // If the user is not signed in, it is correct that we cannot get the token.
    // so do not throw error.
    if (e.message === "No user is signed in.") return undefined;
    throw e;
  }
};

export { getIdToken, getOrInitFirebaseApp, getOrInitFirebaseAuth };
