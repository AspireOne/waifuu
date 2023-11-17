import { PrismaClient } from "@prisma/client";

export const retrieveQuotaUsageJob = async (db: PrismaClient, userId: string) => {
  const quota = await retrieveQuotaFromDb(db, userId);

  if (!quota) return await createQuotaInDb(db, userId);

  await resetUsageIfEligible(db, userId, quota.resetDay, quota.resetMonth);

  return quota;
};

const resetUsageIfEligible = async (
  db: PrismaClient,
  userId: string,
  resetDay: Date,
  resetMonth: Date,
) => {
  // Check if quota.thisDay still refers to the same day.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quotaResetDay = new Date(resetDay);
  const quotaResetMonth = new Date(resetMonth);

  if (!dayMatches(today, quotaResetDay)) {
    await db.planQuotaUsage.update({
      where: {
        userId: userId,
      },
      data: {
        resetDay: today,
        messagesSent: 0,
        botsAccessedIds: [],
      },
    });
  }

  if (!monthMatches(today, quotaResetMonth)) {
    await db.planQuotaUsage.update({
      where: {
        userId: userId,
      },
      data: {
        resetMonth: today,
        botsCreated: 0,
      },
    });
  }
};

const dayMatches = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const monthMatches = (date1: Date, date2: Date) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const retrieveQuotaFromDb = async (db: PrismaClient, userId: string) => {
  return await db.planQuotaUsage.findUnique({
    where: {
      userId: userId,
    },
    select: {
      botsCreated: true,
      resetDay: true,
      resetMonth: true,
      messagesSent: true,
      botsAccessedIds: true,
    },
  });
};

const createQuotaInDb = async (db: PrismaClient, userId: string) => {
  return await db.planQuotaUsage.create({
    data: {
      userId: userId,
      botsCreated: 0,
      messagesSent: 0,
      botsAccessedIds: [],
    },
  });
};
