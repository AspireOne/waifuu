import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

const options: FirebaseOptions = {
  apiKey: "AIzaSyDSu6zz8K4iopKgrCaN22DKC2WUUjcq7Xw",
  authDomain: "companion-400217.firebaseapp.com",
  projectId: "companion-400217",
  storageBucket: "companion-400217.appspot.com",
  messagingSenderId: "24288336305",
  appId: "1:24288336305:web:da711ae4d0bd1966d80590",
  measurementId: "G-N3WCYQ93GT",
};

const getOrInitFirebaseApp = () => {
  if (!app) app = initializeApp(options);
  return app;
};

const getOrInitFirebaseAuth = () => {
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
};

const getIdToken = async (): Promise<string | undefined> => {
  await getOrInitFirebaseAuth().authStateReady();
  const result = await FirebaseAuthentication.getIdToken();
  return result.token;
};

export { getIdToken, getOrInitFirebaseApp, getOrInitFirebaseAuth };
