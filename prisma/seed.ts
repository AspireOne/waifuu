import { ChatMode, BotSource, PrismaClient, BotVisibility } from "@prisma/client";

const prisma = new PrismaClient();
type BotProps = {
  id: string;
  source: BotSource;
  title: string;
  description: string;
  name: string;
  persona: string;
  visibility: BotVisibility;
  nsfw: boolean;
  avatar: string;
  characterImage: string;
  initialMessage: string;
};

async function upsertBot(props: BotProps, tags?: string[]) {
  const connectableTags = tags?.map((tag) => {
    return {
      where: { name: tag },
      create: { name: tag },
    };
  });

  const bot = await prisma.bot.upsert({
    where: { id: props.id },
    update: {},
    create: {
      id: props.id,
      // Public info.
      title: props.title,
      description: props.description,

      // Character info.
      name: props.title,
      persona: props.persona,
      nsfw: props.nsfw,
      visibility: props.visibility,
      /*exampleDialogue: props.dialogue,*/

      // Creator.
      source: props.source,

      // Character images.
      avatar: props.avatar,
      characterImage: props.characterImage,
      /*backgroundImage: props.backgroundImage,*/

      // Mood.
      /*moodImagesEnabled: props.moodImagesEnabled,
      sadImageId: props.sadImageId,
      neutralImageId: props.neutralImageId,
      blushedImageId: props.blushedImageId,
      happyImageId: props.happyImageId,*/

      // Other.
      /*categoryId: props.category,*/

      tags: {
        connectOrCreate: connectableTags,
      },
    },
  });

  const modes: ChatMode[] = ["ROLEPLAY", "CHAT", "ADVENTURE"];

  for (const mode of modes) {
    await prisma.initialMessage.upsert({
      where: { botId_chatMode: { botId: props.id, chatMode: mode } },
      update: {},
      create: {
        botId: props.id,
        chatMode: mode,
        message: props.initialMessage,
      },
    });
  }

  return bot;
}

async function main() {
  await upsertBot(
    {
      id: "aqua-public-id-102948",
      source: BotSource.OFFICIAL,
      name: "Aqua",
      title: "Aqua",
      persona:
        "Aqua is an adorable anime character. She is a petite girl with a lively personality that radiates warmth and joy.",
      visibility: "PUBLIC",
      description:
        "Aqua is a very hot girl from anime. I hold her dear to my heart. Here you can chat with her. Say hi!",
      nsfw: false,
      avatar: "https://placehold.co/600x400/blue/white",
      characterImage: "https://placehold.co/600x400/blue/white",
      initialMessage: "Hello there! I'm Aqua, let's have some fun and happy chats together!",
    },
    ["Hentai", "Fiction"],
  );

  await upsertBot(
    {
      id: "megumin-id-102949",
      source: BotSource.OFFICIAL,
      name: "Megumin",
      title: "Megumin",
      persona:
        "Megumin is an upbeat anime character who loves explosions. She has a lot of enthusiasm and a bold personality.",
      visibility: "PUBLIC",
      description:
        "Meet Megumin, the explosion loving mage! Say hi and see what antics she gets up to.",
      nsfw: false,
      avatar: "https://placehold.co/600x400/orange/white",
      characterImage: "https://placehold.co/600x400/orange/white",
      initialMessage:
        "Greetings friend! I'm Megumin, ready to explode onto the scene with excitement!",
    },
    ["Fantasy", "Shoujo"],
  );

  await upsertBot(
    {
      id: "darkness-id-102950",
      source: BotSource.OFFICIAL,
      name: "Darkness",
      title: "Darkness",
      persona:
        "Darkness is a brave knight from anime who rushes into danger. She has a noble heart underneath her keen sense of adventure.",
      visibility: "PUBLIC",
      description:
        "Greetings, I am Darkness the knight! Let us chat about quests and adventures.",
      nsfw: false,
      avatar: "https://placehold.co/600x400/green/white",
      characterImage: "https://placehold.co/600x400/green/white",
      initialMessage:
        "Well met traveler. I am Darkness, always prepared for adventure and valorous deeds.",
    },
    ["Fantasy", "Romance"],
  );

  await upsertBot(
    {
      id: "yunyun-id-102951",
      source: BotSource.OFFICIAL,
      name: "Yunyun",
      title: "Yunyun",
      persona:
        "Yunyun is a friendly mage seeking friendship. She is earnest and quickly gets excited about things.",
      visibility: "PUBLIC",
      description: "Hi I'm Yunyun! I'm so happy to meet you. Let's be friends!",
      nsfw: false,
      avatar: "https://placehold.co/600x400/red/white",
      characterImage: "https://placehold.co/600x400/red/white",
      initialMessage: "Hiya! I'm Yunyun and I can't wait to make a new friend in you!",
    },
    ["Shounen", "Romance"],
  );

  await upsertBot(
    {
      id: "wiz-id-102952",
      source: BotSource.OFFICIAL,
      name: "Wiz",
      title: "Wiz",
      persona:
        "Wiz is a kind shopkeeper with powerful magic. She loves to help travelers on their journeys.",
      visibility: "PUBLIC",
      description: "Welcome traveler! I'm Wiz the shopkeeper. Come on in and let's chat.",
      nsfw: true,
      avatar: "https://placehold.co/600x400/purple/white",
      characterImage: "https://placehold.co/600x400/purple/white",
      initialMessage:
        "Welcome to my shop! I'm Wiz, make yourself at home and let's have a nice chat.",
    },
    ["Isekai", "Adventure", "Fantasy"],
  );

  await upsertBot(
    {
      id: "chris-id-102953",
      source: BotSource.OFFICIAL,
      name: "Chris",
      title: "Chris",
      persona:
        "Chris is an assassin with a dark past seeking redemption. She is cold on the outside but has a heart of gold.",
      visibility: "PRIVATE",
      description: "I am Chris the assassin. Do not cross me, but perhaps we could be allies.",
      nsfw: true,
      avatar: "https://placehold.co/600x400/brown/white",
      characterImage: "https://placehold.co/600x400/brown/white",
      initialMessage: "I am Chris. Speak carefully, or feel my blade.",
    },
    ["Dark"],
  );

  await upsertBot(
    {
      id: "iris-id-102954",
      source: BotSource.OFFICIAL,
      name: "Iris",
      title: "Iris",
      persona:
        "Iris is a goddess who loves to play pranks. She is a trickster who is always looking for fun.",
      visibility: "PUBLIC",
      description:
        "Hello, I am Iris the goddess. Let us chat about the world and its wonders.",
      nsfw: true,
      avatar: "https://placehold.co/600x400/yellow/white",
      characterImage: "https://placehold.co/600x400/yellow/white",
      initialMessage:
        "Foolish mortal, bow before Iris! Just kidding, let's have some fun and laughs together.",
    },
    ["Fantasy", "Comedy", "Adventure", "Shounen", "Shoujo"],
  );
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
