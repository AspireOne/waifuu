import { protectedProcedure } from "@/server/lib/trpc";
import { ChannelData } from "@/server/shared/channelData";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const POLLING_TIME_SECS = 15;

/**
 * Pairs with an available user, or polls (searches) for a specific amount of time before returning.
 */
export default protectedProcedure
  .output(
    z
      .object({
        name: z.string(),
        topic: z.string(),
      })
      .nullable(),
  )
  .mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const db = ctx.prisma;

    if (await isUserPolling(db, userId)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already polling for a chat.",
      });
    }

    // Find some other user that is searching too.
    const availableUser = await findUserInQueue(db, userId);

    // If found, assign them both to a channel and return that channel.
    if (availableUser) {
      const data = generateChannelData();
      await assignDataToUsers(db, userId, availableUser.userId, data);
      return data;
    }

    // If no available user found, add this user to queue and start checking.
    await addUserToQueue(db, userId);
    const channelData = await pollForChannel(db, userId);
    if (channelData) return channelData;

    // If no channel has been assigned, remove this user from the queue and return null.
    await removeUserFromQueue(db, userId);
    return null;
  });

async function isUserPolling(db: PrismaClient, userId: string) {
  const user = await db.rRChatQueue.findFirst({
    where: {
      userId: userId,
      channel: null,
      createdAt: {
        gte: new Date(Date.now() - (POLLING_TIME_SECS + 2) * 1000),
      },
    },
  });
  return user !== null;
}

// Poll for x seconds, checking every 1 second if a channel has been assigned to this user.
async function pollForChannel(db: PrismaClient, userId: string): Promise<ChannelData | null> {
  // Vercel's max timeout is 10 seconds, so we need to poll for less time.
  const pollingSeconds = process.env.VERCEL ? 7 : POLLING_TIME_SECS;
  for (let i = 0; i < pollingSeconds; i++) {
    // Wait for 1 second before next check. This MUST be at the top of the loop, so that we don't wait for 1 second
    // after the last check, which causes a lot of trouble.
    if (i > 0) await new Promise((r) => setTimeout(r, 950));

    // Here we are checking if this user (the one in queue) has been assigned a channel.
    const poll = await db.rRChatQueue.findFirst({
      where: {
        userId: userId,
        channel: {
          not: null,
        },
      },
      select: {
        channel: true,
        topic: true,
      },
    });

    if (poll?.channel && poll?.topic) return { name: poll.channel, topic: poll.topic };
  }
  return null;
}

async function removeUserFromQueue(db: PrismaClient, userId: string) {
  await db.rRChatQueue.delete({
    where: {
      userId: userId,
    },
  });
}

async function addUserToQueue(db: PrismaClient, userId: string) {
  await db.rRChatQueue.upsert({
    where: {
      userId: userId,
    },
    update: {
      channel: null,
    },
    create: {
      userId: userId,
      channel: null,
    },
  });
}

async function assignDataToUsers(
  db: PrismaClient,
  userId: string,
  availableUserId: string,
  channelData: ChannelData,
) {
  // Assign channel to the current user, and create him first, if does not already exist in the db.
  await db.rRChatQueue.upsert({
    where: {
      userId: userId,
    },
    update: {
      channel: channelData.name,
      topic: channelData.topic,
    },
    create: {
      userId: userId,
      channel: channelData.name,
      topic: channelData.topic,
    },
  });

  // Assign channel to the available user.
  await db.rRChatQueue.update({
    where: {
      userId: availableUserId,
    },
    data: {
      channel: channelData.name,
      topic: channelData.topic,
    },
  });
}

async function findUserInQueue(db: PrismaClient, userId: string) {
  return await db.rRChatQueue.findFirst({
    where: {
      userId: {
        not: userId,
      },
      channel: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

function generateChannelData(): ChannelData {
  const channel = `presence-room-${uuidv4()}`;
  // select a random initial scene
  const topic = initialScenes[Math.floor(Math.random() * initialScenes.length)]!;
  return { name: channel, topic: topic };
}

const initialScenes = [
  "You wake up trapped in a strange room with no memory of how you got there. The only other person is your roleplaying partner.",
  "You are the captains of two spaceships that have crashlanded on an alien planet. You must work together to survive.",
  "You are detectives investigating a mysterious murder case. Your partner is from a rival agency you were forced to team up with.",
  "One of you is a powerful monarch, the other is a peasant. An unexpected event throws you together.",
  "You are time travelers who have accidentally swapped bodies and time periods with each other.",
  "A magical spell has turned you both into animals (choose the species). You must find a way to reverse it.",
  "You are rivals attending a prestigious magic academy, forced to be partners for a major exam.",
  "One of you is human, the other is an artificial intelligence that has achieved sentience. First contact scenario.",
  "You are co-leaders of a post-apocalyptic survivor colony dealing with a crisis that threatens everyone.",
  "A case of mistaken identity leads you to be handcuffed together as you protest your innocence to authorities.",
  "You are two celebrity chefs competing against each other in a high-stakes cooking competition with an unexpected twist.",
  "One of you is a con artist, the other is a wealthy heir. You must work together to pull off an elaborate heist.",
  "You are strangers who wake up with no memories, the only clues are strange matching tattoos on your arms.",
  "An archaeological dig gone wrong transports you and your partner to a lost ancient civilization still thriving.",
  "In a superhero universe, you are two villains forced to team up to take down a greater threat to the city.",
  "You are rival spies from different agencies who get caught up in an conspiracy that could start an interstellar war.",
  "One of you is a human, the other is the advanced AI assistant to the last surviving member of an alien race.",
  "You find yourselves in a fantasy world straight out of the role-playing game you were playing together.",
  "Due to a illusion spell gone awry, each of you sees the other as a different being (ex. dragon, elf, etc).",
  "You are ghosts trapped haunting the same house, unable to move on until you solve the mystery of your deaths.",
  "You are pirate captains whose ships were destroyed, stranded on a mysterious island hiding an ancient treasure.",
  "In the near future, one of you is an android, the other is human - you must overcome your differences to survive.",
  "You are circus performers whose skills get put to the test when something goes terribly wrong during a show.",
  "Two magical creatures from rival clans are magically bound together until an ancient feud is resolved.",
  "You are characters trapped in a sentient virtual reality game that has become self-aware and sadistic.",
  "After a science experiment gone awry, you wake up to find your minds have switched bodies with each other.",
  "Dueling bigfoot hunters finally encounter the real beast and get more than they bargained for.",
  "On a galactic cruiseliner, you witness a crime and are forced to go into hiding as unlikely partners.",
  "You have psychic powers and mind-meld during an experiment, fusing your consciousnesses together temporarily.",
  "You are elite agents from rivaling organizations, forced to team up to take down a rogue asset.",
  "While exploring a haunted house, you drink an ancient potion that links you both in unpredictable ways.",
  "You are immortal beings who wake up with no memories of your past lives - only knowing you are bound together.",
  "An emergency landing leaves you and your partner as the only survivors on a remote jungle planet.",
  "One of you is a genie who gets captured by an inept sorcerer - the other has to try and rescue the genie.",
  "After a magic trick goes horribly wrong, you switch bodies with your magician partner and loved one.",
  "On a reality TV show, you and a rival contestant get lost in the wilderness and must cooperate to survive.",
  "You are the last two humans after an apocalyptic event, building a new society together from the ashes.",
];
