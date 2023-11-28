/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BotToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanId" AS ENUM ('SUBSCRIPTION_PLAN_FREE_V1', 'SUBSCRIPTION_PLAN_PLUS_V1');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'CZK', 'EUR');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('succeeded', 'pending', 'failed', 'canceled', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing');

-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('month', 'year');

-- CreateEnum
CREATE TYPE "CharacterTag" AS ENUM ('GIRLFRIEND', 'BOYFRIEND', 'ROMANCE', 'FANTASY', 'SUPERNATURAL', 'FEMALE', 'MALE', 'HORROR', 'HERO', 'COMEDY', 'NERD', 'SHY', 'BAD', 'ANIME', 'GAME_CHARACTER', 'HISTORY', 'MOVIE', 'MONSTER', 'BOOKS', 'OC');

-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_B_fkey";

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "categoryId",
ADD COLUMN     "tags" "CharacterTag"[];

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "planId" "PlanId",
ADD COLUMN     "stripeCustomerId" TEXT;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_BotToTag";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" "PlanId" NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "interval" "SubscriptionInterval" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planId" "PlanId" NOT NULL,
    "userId" TEXT NOT NULL,
    "interval" "SubscriptionInterval" NOT NULL,
    "stripeSubscriptionId" TEXT,

    CONSTRAINT "StripeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanQuotaUsage" (
    "userId" TEXT NOT NULL,
    "messagesSent" INTEGER NOT NULL DEFAULT 0,
    "botsCreated" INTEGER NOT NULL DEFAULT 0,
    "botsAccessedIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resetDay" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetMonth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanQuotaUsage_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Payment_stripeSubscriptionId_idx" ON "Payment"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSession_stripeSubscriptionId_key" ON "StripeSession"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanQuotaUsage_userId_key" ON "PlanQuotaUsage"("userId");

-- CreateIndex
CREATE INDEX "PlanQuotaUsage_userId_resetDay_resetMonth_idx" ON "PlanQuotaUsage"("userId", "resetDay", "resetMonth");

-- CreateIndex
CREATE INDEX "Asset_authorId_idx" ON "Asset"("authorId");

-- CreateIndex
CREATE INDEX "BotDislike_botId_idx" ON "BotDislike"("botId");

-- CreateIndex
CREATE INDEX "BotLike_botId_idx" ON "BotLike"("botId");

-- CreateIndex
CREATE INDEX "BotShares_botId_idx" ON "BotShares"("botId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Chat_botId_mode_idx" ON "Chat"("botId", "mode");

-- CreateIndex
CREATE INDEX "ForumPostLike_postId_idx" ON "ForumPostLike"("postId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "RRChatQueue_userId_idx" ON "RRChatQueue"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSession" ADD CONSTRAINT "StripeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanQuotaUsage" ADD CONSTRAINT "PlanQuotaUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
