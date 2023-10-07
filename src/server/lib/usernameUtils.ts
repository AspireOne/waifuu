// Generate an username based on user.name if present, user.email if user.name is not present, and random
// if neither are present. The username should be checked using prisma for uniqueness.
import { prisma } from "~/server/lib/db";

// prettier-ignore
const usernameBases: string[] = [
  "star", "wolf", "stone",
  "steel", "shadow", "light",
  "magic", "legend", "myth",
  "blade", "shield", "dragon",
  "cupcake", "giant", "phoenix",
  "raven", "saber", "thunder",
  "master", "king", "mage",
  "queen", "prince", "princess",
  "warrior", "wizard", "witch",
  "hunter", "hero", "demon",
  "angel", "ghost", "spirit",
  "soul", "sage", "saint",
  "reaper", "rebel", "rogue",
  "ranger", "paladin", "ninja",
  "monk", "mage", "knight",
  "jedi", "guardian", "goddess",
  "god", "goblin", "elf",
  "dwarf", "dragon", "demon",
  "jester", "joker", "juggler",
];

/**
 * Generates a unique username based on the given user information.
 * @param name - The user's name.
 * @param email - The user's email.
 * @returns A promise that resolves to the generated unique username.
 */
export async function generateUniqueUsername(
  name?: string,
  email?: string,
): Promise<string> {
  let username;

  if (name) {
    username = name;
  } else if (email) {
    username = email.split("@")[0]!;
  } else {
    username = usernameBases[Math.floor(Math.random() * usernameBases.length)]!;
  }

  // Convert all non-ASCII characters to their closest ASCII equivalent (diacritics etc.)
  // and leave only simple alphanumeric characters (both upper and lower case) and numbers.
  username = username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");

  if (username.length < 3) {
    username = usernameBases[Math.floor(Math.random() * usernameBases.length)]!;
  }

  let unique;
  let suffix = undefined;
  while (true) {
    username = suffix ? `${username}${suffix}` : username;
    unique = await isUsernameUnique(username);
    if (unique) return username;

    suffix = suffix ? suffix + 1 : 0;
  }
}

async function isUsernameUnique(username: string) {
  const count = await prisma.user.count({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
  return count === 0;
}
