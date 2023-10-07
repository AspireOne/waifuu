import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/lib/db";
import getServerFirebaseAuth from "~/server/lib/getServerFirebaseAuth";

/**
 * Gets the current user from DB.
 * */
export async function getUser(req: NextApiRequest) {
  // TODO: Optimize this.

  const session = req.cookies["session"];
  if (!session) return null;

  try {
    const decodedToken =
      await getServerFirebaseAuth().verifySessionCookie(session);

    if (!decodedToken.uid) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.uid,
      },
    });
    console.log("User:", user);
    return user;
  } catch (e) {
    console.log("Error getting user:", e);
    return null;
  }
}
