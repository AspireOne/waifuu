import { serverFirebaseApp } from "@/server/clients/serverFirebaseApp";
import { getAuth } from "firebase-admin/auth";

export const serverFirebaseAuth = () => {
  const app = serverFirebaseApp();
  return getAuth(app);
};
