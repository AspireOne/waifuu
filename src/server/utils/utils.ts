// Generate an username based on user.name if present, user.email if user.name is not present, and random
// if neither are present. The username should be checked using prisma for uniqueness.
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { prisma } from "~/server/db";

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
 *
 * @param {User | AdapterUser} user - The user object containing the name and email properties.
 *
 * @return {Promise<string>} A promise that resolves to the generated unique username.
 */
export async function generateUniqueUsername(user: User | AdapterUser) {
  let username;

  if (user.name) {
    username = user.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } else if (user.email) {
    username = user.email.split("@")[0]!;
  } else {
    username = usernameBases[Math.floor(Math.random() * usernameBases.length)]!;
  }

  username = username.replace(/[^a-z0-9]/g, "");

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
