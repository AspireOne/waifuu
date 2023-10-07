import { PrismaClient } from "@prisma/client";
import { BotSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  /*const aqua = await prisma.bot.upsert({
    where: { id: "official-public" },
    update: {},
    create: {
      id: "official-public",
      source: BotSource.OFFICIAL,
      visibility: "PUBLIC",
      name: "Aqua",
      description:
        "Meet Aqua, the adorable anime character who stole the hearts of viewers with her irresistible charm. aqua is a petite girl with a lively personality that radiates warmth and joy. Her big, expressive eyes shimmer with innocence and curiosity, drawing people in with their captivating sparkle.\n" +
        "\n" +
        "aqua's most striking feature is her luscious, shoulder-length hair, which cascades down in soft waves. It's a shade of vibrant pink, reminiscent of cherry blossoms in full bloom. Her hair is often adorned with colorful ribbons or cute hairpins that match her playful outfits.",
    },
  });

  const davidKun = await prisma.bot.upsert({
    where: { id: "official-private" },
    update: {},
    create: {
      id: "official-private",
      source: BotSource.OFFICIAL,
      visibility: "PRIVATE",
      name: "Official Private David-kun",
      description: "You are david-kun.",
    },
  });

  const lisa = await prisma.bot.upsert({
    where: { id: "user-public" },
    update: {},
    create: {
      id: "user-public",
      source: BotSource.COMMUNITY,
      visibility: "PUBLIC",
      name: "User Public Lisa",
      //userId: ,
      description: "You are Lisa.",
    },
  });

  const userPrivate = await prisma.bot.upsert({
    where: { id: "user-private" },
    update: {},
    create: {
      id: "user-private",
      source: BotSource.COMMUNITY,
      visibility: "PRIVATE",
      name: "User Public Lisa",
      //userId: ,
      description: "You are Lisa.",
    },
  });*/
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
