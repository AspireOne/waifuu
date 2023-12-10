import { generateUniqueUsername } from "@/server/helpers/username";
import { PrismaClient } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Creates a user if they don't exist.
 * @param prisma
 * @param decodedIdToken
 * @returns True if the user was created. False if the user already existed.
 */
export async function upsertUser(
  prisma: PrismaClient,
  decodedIdToken: DecodedIdToken,
): Promise<{ alreadyExisted: boolean }> {
  // Check if user already exists.
  const exists = await prisma.user.findUnique({
    where: {
      id: decodedIdToken.uid,
    },
  });

  if (exists) return { alreadyExisted: true };

  if (!decodedIdToken.email) throw new Error("No email found in decodedIdToken.");

  const username = await generateUniqueUsername(decodedIdToken.name, decodedIdToken.email);

  await prisma.user.create({
    data: {
      id: decodedIdToken.uid,
      email: decodedIdToken.email,
      name: decodedIdToken.name,
      username: username,
      image: decodedIdToken.picture,
    },
  });

  return { alreadyExisted: false };
}
