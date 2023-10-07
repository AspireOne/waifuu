import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { prisma } from "~/server/lib/db";

/**
 * Gets the current user from DB.
 * */
export async function getUser(req: NextApiRequest) {
  // TODO: Optimize this.
  try {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(req.headers.authorization!);
    if (!decodedToken.uid) return null;
    return await prisma.user.findUnique({
      where: {
        id: decodedToken.uid,
      },
    });
  } catch (e) {
    return null;
  }
}
