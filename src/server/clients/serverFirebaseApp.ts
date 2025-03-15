import { env } from "@/server/env";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export const serverFirebaseApp = () => {
  if (admin.apps.length > 0) {
    console.log("Returning existing firebase app (admin.apps.length > 0)");
    return admin.apps[0]!;
  }

  console.log("Creating new firebase app (admin.apps.length === 0)");
  console.log("Raw credential: ", env.SERVICE_ACCOUNT_JSON);
  console.log(`Raw credential interpolated string: ${env.SERVICE_ACCOUNT_JSON}`)
  console.log("JSON Parsed credential: ", JSON.parse(env.SERVICE_ACCOUNT_JSON));
  console.log("JSON Parsed credential interpolated string: ", JSON.parse(env.SERVICE_ACCOUNT_JSON))
  
  let credential: admin.credential.Credential;
  try {
    credential = admin.credential.cert(JSON.parse(env.SERVICE_ACCOUNT_JSON)); 
  } catch (e) {
    console.error("Error parsing service account JSON or adding admin.credential.cert():", e);
    throw new Error("Error parsing service account JSON OR adding firebase admin credential");
  }
  
  console.log("Sucesfully added firebase credential");
  
  return initializeApp({
    credential: credential,
  });
};
