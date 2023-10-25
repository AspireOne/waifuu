import {BotSource, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bot.upsert({
    where: { id: "official-public" },
    update: {},
    create: {
      id: "official-public",
      source: BotSource.OFFICIAL,
      characterName: "Aqua",
      characterPersona: "Meet Aqua, the adorable anime character who stole the hearts of viewers with her irresistible charm. aqua is a petite girl with a lively personality that radiates warmth and joy. Her big, expressive eyes shimmer with innocence and curiosity, drawing people in with their captivating sparkle.\n" +
        "\n" +
        "aqua's most striking feature is her luscious, shoulder-length hair, which cascades down in soft waves. It's a shade of vibrant pink, reminiscent of cherry blossoms in full bloom. Her hair is often adorned with colorful ribbons or cute hairpins that match her playful outfits.",

      visibility: "PUBLIC",
      name: "Aqua",
      description:
        "Aqua is a very hot girl. She is a girl from the anime Konosuba, which I hold dear to my heart. Here you can chat with her. say hi!",
    },
  });
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
