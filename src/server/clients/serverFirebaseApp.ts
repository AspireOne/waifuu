import { env } from "@/server/env";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export const serverFirebaseApp = () => {
  if (admin.apps.length > 0) return admin.apps[0]!;

  console.log("Parsing service account json: ", env.SERVICE_ACCOUNT_JSON);
  const json = JSON.parse(env.SERVICE_ACCOUNT_JSON);
  console.log("parsed service account json: ", json);

  return initializeApp({
    credential: admin.credential.cert(JSON.parse(env.SERVICE_ACCOUNT_JSON)),
  });
};
