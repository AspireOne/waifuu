import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { TRPCError } from "@trpc/server";
import pusherServer from "~/server/lib/pusherServer";

export type ChannelData = {
  name: string;
  topic: string;
};

export const omegleChatRouter = createTRPCRouter({
  // user starts searching
  // -> if someone already exists, remove him and assign them to a chat. Return ChatId.
  // -> if no one exists, add to the db and start polling.
  // -> If assigned to a chat during search, it will be polled. Return chatID.
  // -> If not assigned to a chat, remove from the db and return null.
  /**
   * Pairs with an available user, or polls (searches) for a specific amount of time before returning.
   */
  searchUser: protectedProcedure
    .output(
      z
        .object({
          name: z.string(),
          topic: z.string(),
        })
        .nullable(),
    )
    .mutation(async ({ ctx }) => {
      const { id: userId } = ctx.session.user;
      const db = ctx.prisma;

      if (await isUserPolling(db, userId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
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
    }),

  sendMessage: protectedProcedure
    .input(z.object({ channel: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await pusherServer.trigger(input.channel, "message", {
        message: input.message,
        from: ctx.session.user.id,
      });
    }),
});

async function isUserPolling(db: PrismaClient, userId: string) {
  const user = await db.omegleChatQueue.findFirst({
    where: {
      userId: userId,
      channel: null,
    },
  });
  return user !== null;
}

// Poll for x seconds, checking every 1 second if a channel has been assigned to this user.
async function pollForChannel(
  db: PrismaClient,
  userId: string,
): Promise<ChannelData | null> {
  for (let i = 0; i < 10; i++) {
    // Wait for 1 second before next check. This MUST be at the top of the loop, so that we don't wait for 1 second
    // after the last check, which causes a lot of trouble.
    if (i > 0) await new Promise((r) => setTimeout(r, 950));

    // Here we are checking if this user (the one in queue) has been assigned a channel.
    const poll = await db.omegleChatQueue.findFirst({
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

    if (poll?.channel && poll?.topic)
      return { name: poll.channel, topic: poll.topic };
  }
  return null;
}

async function removeUserFromQueue(db: PrismaClient, userId: string) {
  await db.omegleChatQueue.delete({
    where: {
      userId: userId,
    },
  });
}

async function addUserToQueue(db: PrismaClient, userId: string) {
  await db.omegleChatQueue.upsert({
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
  await db.omegleChatQueue.upsert({
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
  await db.omegleChatQueue.update({
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
  return await db.omegleChatQueue.findFirst({
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

export function generateChannelData(): ChannelData {
  const channel = "presence-room-" + uuidv4();
  const topic =
    "You land in a room with a stranger. You find out it is kiss-shot wokuna blade-under-heart";
  return { name: channel, topic: topic };
}
