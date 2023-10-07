import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import serviceAccountJson from "~/server/service-account.json";

/**
 * Returns the firebase app instance for the server. If it doesn't exist, it will create it.
 * If it does exist, it will return the existing one.
 */
export default function getServerFirebaseApp() {
  if (admin.apps.length > 0) return admin.apps[0];

  return initializeApp({
    credential: admin.credential.cert({
      privateKey: serviceAccountJson.private_key,
      clientEmail: serviceAccountJson.client_email,
      projectId: serviceAccountJson.project_id,
    }),
  });
}
