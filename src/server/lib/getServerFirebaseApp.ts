import { applicationDefault, initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export default function getServerFirebaseApp() {
  if (admin.apps.length > 0) return admin.apps[0];

  return initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
    ),
  });
}
