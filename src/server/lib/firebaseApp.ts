import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import serviceAccountJson from "~/server/service-account.json";

export default function initializeFirebaseApp() {
  console.log("Initializing or returning existing firebase app...");
  if (admin.apps.length > 0) return admin.apps[0];

  return initializeApp({
    credential: admin.credential.cert({
      privateKey: serviceAccountJson.private_key,
      clientEmail: serviceAccountJson.client_email,
      projectId: serviceAccountJson.project_id,
    }),
  });
}
