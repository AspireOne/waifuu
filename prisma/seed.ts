import {
  ChatMode,
  BotSource,
  PrismaClient,
  BotVisibility,
  CharacterTag,
} from "@prisma/client";
import Bots from "./bots";

const prisma = new PrismaClient();

const adminEmails = [
  "matejpesl1@gmail.com",
  "jakub.dornicak@seznam.cz",
  "jakub.dornicak@blindspot.ai",
  "administrator@administrator.cz",
  process.env["ADMIN_EMAIL"] ?? "test@seznam.cz",
];

type BotProps = {
  id: string;
  title: string;
  description: string;
  name: string;
  persona: string;
  nsfw: boolean;
  avatar: string;
  characterImage: string;
  initialMessage: string;
  backgroundImage: string;
  tags: CharacterTag[];
  blushedImageId?: string;
  sadImageId?: string;
  neutralImageId?: string;
  happyImageId?: string;
  dynamicBackgroundsEnabled?: boolean;
  moodImagesEnabled?: boolean;
};

async function main() {
  let isDev = process.env.NODE_ENV === "development";
  let isProd =
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "test" ||
    // @ts-ignore
    process.env.NODE_ENV === "staging";

  // If seed command is run directly, NODE_ENV is not specified.
  if (isProd === isDev) {
    isProd = false;
    isDev = true;
    console.warn(
      "seed: NODE_ENV is not specified. Defaulting to development mode."
    );
  }

  isProd ? await seedProduction() : await seedDevelopment();
}

async function seedProduction() {
  let jobs = [];
  jobs.push(Bots.map((bot) => upsertBot(bot as any)));
  jobs.push(adminEmails.map(upsertAdminEmail));

  await Promise.all(jobs);
}

async function seedDevelopment() {
  let jobs = [];
  jobs.push(Bots.map((bot) => upsertBot(bot as any)));
  jobs.push(adminEmails.map(upsertAdminEmail));

  await Promise.all(jobs);
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

async function upsertAdminEmail(email: string) {
  await prisma.adminEmail.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

async function upsertBot(props: BotProps) {
  const bot = await prisma.bot.upsert({
    where: { id: props.id },
    update: {},
    create: {
      id: props.id,
      title: props.title,
      description: props.description,
      name: props.title,
      persona: props.persona,
      backgroundImage: props.backgroundImage,
      nsfw: props.nsfw,
      visibility: BotVisibility.PUBLIC,
      source: BotSource.OFFICIAL,
      avatar: props.avatar,
      characterImage: props.characterImage,
      tags: props.tags,
      // add dynamic mood images if present and other options related to optional content
      blushedImageId: props.blushedImageId,
      sadImageId: props.sadImageId,
      neutralImageId: props.neutralImageId,
      happyImageId: props.happyImageId,
      dynamicBackgroundsEnabled: props.dynamicBackgroundsEnabled ?? false,
      moodImagesEnabled: props.moodImagesEnabled ?? false,
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
