import { env } from "@/server/env";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export const serverFirebaseApp = () => {
  if (admin.apps.length > 0) return admin.apps[0]!;

  const seviceAccountJson = env.SERVICE_ACCOUNT_JSON;
  console.log("Service Account JSON from .env: ", env.SERVICE_ACCOUNT_JSON);
  const unescapedServiceAccountJson = unescapeJsonString(seviceAccountJson);

  return initializeApp({
    credential: admin.credential.cert(unescapedServiceAccountJson),
  });
};

function unescapeJsonString(possiblyEscapedJsonString: string) {
  let correctedString = possiblyEscapedJsonString;

  // Check and conditionally remove leading and trailing single quotes
  if (correctedString.startsWith("'") && correctedString.endsWith("'")) {
    correctedString = correctedString.slice(1, -1);
  }

  // Replace escaped double quotes with actual double quotes only if needed
  if (correctedString.includes('\\"')) {
    correctedString = correctedString.replace(/\\"/g, '"');
  }

  // Replace escaped newlines with actual newline characters only if needed
  if (correctedString.includes("\\\\n")) {
    correctedString = correctedString.replace(/\\\\n/g, "\\n");
  }

  // Attempt to parse the corrected string into a JSON object
  try {
    return JSON.parse(correctedString);
  } catch (error) {
    throw new Error(`Error parsing service account JSON string: ${error}`);
  }
}
