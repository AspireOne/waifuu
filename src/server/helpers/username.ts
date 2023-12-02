// Generate an username based on user.name if present, user.email if user.name is not present, and random
// if neither are present. The username should be checked using prisma for uniqueness.
import { prisma } from "@/server/clients/db";

// prettier-ignore
const usernameBases: string[] = [
  "star",
  "wolf",
  "stone",
  "steel",
  "shadow",
  "light",
  "magic",
  "legend",
  "myth",
  "blade",
  "shield",
  "cupcake",
  "giant",
  "phoenix",
  "raven",
  "saber",
  "thunder",
  "master",
  "king",
  "queen",
  "prince",
  "princess",
  "warrior",
  "wizard",
  "witch",
  "hunter",
  "hero",
  "angel",
  "ghost",
  "spirit",
  "soul",
  "sage",
  "saint",
  "reaper",
  "rebel",
  "rogue",
  "ranger",
  "paladin",
  "ninja",
  "monk",
  "mage",
  "knight",
  "jedi",
  "guardian",
  "goddess",
  "god",
  "goblin",
  "elf",
  "dwarf",
  "dragon",
  "demon",
  "jester",
  "joker",
  "juggler",
];

/**
 * Generates a unique username based on the given user information.
 * @param name - The user's name.
 * @param email - The user's email.
 * @returns A promise that resolves to the generated unique username.
 */
export async function generateUniqueUsername(name?: string, email?: string): Promise<string> {
  let base = "";

  // First try to choose a base based on the user's name or email.
  if (name) {
    base = normalize(name);
  } else if (email?.includes("@")) {
    base = normalize(email.split("@")[0]!);
  }

  // If the normalized base is too short, choose a random base.
  if (!base || base.length < 3) {
    base = usernameBases[Math.floor(Math.random() * usernameBases.length)]!;
  }

  // Now generate a random suffix and append it to the base until we find a unique username.
  const usedSuffixes: string[] = [];
  for (let i = 0; i < 100; i++) {
    const suffix = generateSuffix(usedSuffixes);
    const username = base + suffix;
    const unique = await isUsernameUnique(username);
    if (unique) return username;
  }

  // If we couldn't find a unique username after 100 tries...
  console.error(
    "Couldn't generate a unique username after a lot of tries. This might be a bug in the algorithm. Returning an extra-long surely-unique username.",
  );
  // generate a number between 100_000 and 999_999.
  return base + Math.floor(Math.random() * 900_000 + 100_000).toString();
}

function generateSuffix(used: string[]) {
  let suffix: string;
  do {
    // generate random number between 1000 and 9999.
    suffix = Math.floor(Math.random() * 9000 + 1000).toString();
  } while (used.includes(suffix));

  used.push(suffix);
  return suffix;
}

function normalize(text: string) {
  // Convert all non-ASCII characters to their closest ASCII equivalent (diacritics etc.)
  // and leave only simple alphanumeric characters (both upper and lower case) and numbers.
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
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
