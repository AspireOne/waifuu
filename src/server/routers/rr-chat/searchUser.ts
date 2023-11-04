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
  const topic =
    "You land in a room with a stranger. You find out it is kiss-shot wokuna blade-under-heart";
  return { name: channel, topic: topic };
}
