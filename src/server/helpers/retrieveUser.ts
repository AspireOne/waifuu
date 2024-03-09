import { prisma } from "@/server/clients/db";
import { serverFirebaseAuth } from "@/server/lib/serverFirebaseAuth";
import { User } from "@prisma/client";
import { NextApiRequest } from "next";

/**
 * Gets the current user from DB.
 * */
export async function retrieveUser(req: NextApiRequest): Promise<User | null> {
  // Get Authorization header.
  const idToken =
    req.headers.authorization?.split(" ")[1] ?? (req.query.idToken as string | undefined);

  if (!idToken) return null;

  try {
    const decodedToken = await serverFirebaseAuth().verifyIdToken(idToken);

    if (!decodedToken.uid) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.uid,
      },
    });
    return user;
  } catch (e) {
    console.error("Error getting user:", e);
    return null;
  }
}
