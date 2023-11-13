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

      // TODO: Add tags to seed script až se ten zkurvený vypíčený kuba posraný uráči kurva odpovědět typíčo
      // aeFJK FDFADKS DJKASL DKLAWDM ASKLD WKLD wklwsmkqos n kqsn JKS NakosnqKOSNqkaosn
       /*sAS AKSD KADKS DKLa k  q keo qe  qEOKQeěkšěkšěkeqklamsMALSamlsaam K kA Sa skA SAsklASLAks aSK Alks aLSs KURVA AS a sj aA a A a A ALS aklsAKS a?Ad */
      /*MRDKA ZKURVENÁ KUEWNDAD AAAAA!!!!!!!!! DOPÍČI ZASRANÉ */
      /*tags: {
        connectOrCreate: connectableTags,
      },*/
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
      avatar: "https://static.vecteezy.com/system/resources/previews/024/212/234/non_2x/ai-generated-sticker-anime-girl-with-pink-and-blue-hair-png.png",
      characterImage: "https://static.vecteezy.com/system/resources/previews/024/212/234/non_2x/ai-generated-sticker-anime-girl-with-pink-and-blue-hair-png.png",
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
      avatar: "https://i.pinimg.com/originals/aa/f5/bb/aaf5bb1a61602f65a68d5e955f917cde.jpg",
      characterImage: "https://static.wikia.nocookie.net/anime/images/2/20/Megumin.png/revision/latest?cb=20200915231146",
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
      avatar: "https://www.pngkey.com/png/detail/179-1798079_kirito-anime-character.png",
      characterImage: "https://www.seekpng.com/png/full/386-3864827_vampire-girl-no-background-princess-of-darkness-anime.png",
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
      characterImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8b86721e-3c43-417d-946f-cf97b81490db/dg5pfug-67c7ad85-debb-49ed-aa22-97f44775778f.png/v1/fill/w_1280,h_2260,q_80,strp/hot_and_sexy_nude_anime_girl_by_mrgraphics90_dg5pfug-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI2MCIsInBhdGgiOiJcL2ZcLzhiODY3MjFlLTNjNDMtNDE3ZC05NDZmLWNmOTdiODE0OTBkYlwvZGc1cGZ1Zy02N2M3YWQ4NS1kZWJiLTQ5ZWQtYWEyMi05N2Y0NDc3NTc3OGYucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.CDJMRRZKN3tZT4L5MzN7LSwuBI_HqzKpIX3lYTapVO8",
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
      avatar: "https://static.wikia.nocookie.net/anime/images/2/20/Megumin.png/revision/latest?cb=20200915231146",
      characterImage: "https://xxgasm.com/wp-content/upload/2019/06/cute_nude_-5960.jpg",
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
      avatar: "https://xxgasm.com/wp-content/upload/2017/04/anime_girl_s-7334.jpg",
      characterImage: "https://xxgasm.com/wp-content/upload/2017/04/anime_girl_s-7334.jpg",
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
      characterImage: "https://xxgasm.com/wp-content/upload/2017/04/anime_girl_s-7334.jpg",
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
