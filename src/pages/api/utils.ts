import { NextApiRequest } from "next";
import { prisma } from "~/server/lib/db";

/**
 * Gets the user from db based on session token in cookies.
 * */
export async function getUser(req: NextApiRequest) {
  const token = req.headers.cookie
    ?.split("; ")
    .find((c) => c.startsWith("next-auth.session-token"))
    ?.split("=")[1];

  console.log("Could not get session token from cookies.");
  if (!token) return null;

  // I need to find a record in the Session table that has the sessionToken equal to "token",
  // get "userId", and then get an user from the "User" table whose id is equal to the userId.
  const session = await prisma.session.findFirst({
    where: {
      sessionToken: token,
    },
    include: {
      user: true, // Include the related User
    },
  });

  console.log(
    session?.user
      ? "Got user from session token from cookies."
      : "Could not get user based on session token from cookies.",
  );

  return session?.user || null;
}
