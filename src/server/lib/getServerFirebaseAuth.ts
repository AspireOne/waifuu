import getServerFirebaseApp from "~/server/lib/getServerFirebaseApp";
import { getAuth } from "firebase-admin/auth";

export default function getServerFirebaseAuth() {
  const app = getServerFirebaseApp();
  return getAuth(app!);
}
