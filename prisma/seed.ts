import { ChatMode, BotSource, PrismaClient, BotVisibility, Tag } from "@prisma/client";
import Bots from './bots';

const prisma = new PrismaClient();
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
  tags: string[];
};

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
      nsfw: props.nsfw,
      visibility: BotVisibility.PUBLIC,
      source: BotSource.OFFICIAL,
      avatar: props.avatar,
      characterImage: props.characterImage,
      tags: {
        connectOrCreate: props.tags.map(tag => ({
          where: { name: tag },
          create: { name: tag },
        })),
      }
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
  await Promise.all(Bots.map(bot => {
    return upsertBot(bot);
  }));
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
