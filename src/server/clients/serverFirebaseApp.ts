import { env } from "@/server/env";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import {unescapeQuotes} from "@lib/utils";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export const serverFirebaseApp = () => {
  if (admin.apps.length > 0) {
    console.log("Returning existing firebase app (admin.apps.length > 0)");
    return admin.apps[0]!;
  }
  
  // The env.SERVICE_ACCOUNT_JSON might be 

  console.log("Creating new firebase app (admin.apps.length === 0)");
  console.log("Raw credential: ", env.SERVICE_ACCOUNT_JSON);
  console.log("Unescaped credential: ", unescapeQuotes(env.SERVICE_ACCOUNT_JSON));
  console.log("JSON Parsed credential: ", JSON.parse(unescapeQuotes(env.SERVICE_ACCOUNT_JSON)));
  
  let credential: admin.credential.Credential;
  try {
    credential = admin.credential.cert(JSON.parse(unescapeQuotes(env.SERVICE_ACCOUNT_JSON))); 
  } catch (e) {
    console.error("Error parsing service account JSON or adding admin.credential.cert():", e);
    throw new Error("Error parsing service account JSON OR adding firebase admin credential");
  }
  
  console.log("Sucesfully added firebase credential");
  
  return initializeApp({
    credential: credential,
  });
};
