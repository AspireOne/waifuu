import { NextApiRequest } from "next";
import { prisma } from "@/server/lib/db";
import getServerFirebaseAuth from "@/server/lib/getServerFirebaseAuth";
import { User } from "@prisma/client";

/**
 * Gets the current user from DB.
 * */
export async function retrieveUser(req: NextApiRequest): Promise<User | null> {
  // Get Authorization header.
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) return null;

  try {
    const decodedToken = await getServerFirebaseAuth().verifyIdToken(idToken);

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
