import { serverFirebaseApp } from "@/server/clients/serverFirebaseApp";
import { getAuth } from "firebase-admin/auth";

export const serverFirebaseAuth = () => {
  console.log("getting firebase app.");
  const app = serverFirebaseApp();
  console.log("getting firebase auth.");
  return getAuth(app);
};
