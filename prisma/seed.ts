import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sakura = await prisma.bot.upsert({
    where: {id: "sakura-bot"},
    update: {},
    create: {
      id: "sakura-bot",
      name: "Sakura Kinomoto",
      description: "Meet Sakura, the adorable anime character who stole the hearts of viewers with her irresistible charm. Sakura is a petite girl with a lively personality that radiates warmth and joy. Her big, expressive eyes shimmer with innocence and curiosity, drawing people in with their captivating sparkle.\n" +
        "\n" +
        "Sakura's most striking feature is her luscious, shoulder-length hair, which cascades down in soft waves. It's a shade of vibrant pink, reminiscent of cherry blossoms in full bloom. Her hair is often adorned with colorful ribbons or cute hairpins that match her playful outfits.",
      source: "OFFICIAL",
    },
  })
  console.log({sakura})
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })