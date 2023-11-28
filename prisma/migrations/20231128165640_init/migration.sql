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
CREATE TYPE "Mood" AS ENUM ('NEUTRAL', 'HAPPY', 'SAD', 'BLUSHED');

-- CreateEnum
CREATE TYPE "BotVisibility" AS ENUM ('PUBLIC', 'LINK', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BotSource" AS ENUM ('OFFICIAL', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "ChatMode" AS ENUM ('ROLEPLAY', 'ADVENTURE', 'CHAT');

-- CreateEnum
CREATE TYPE "CharacterTag" AS ENUM ('GIRLFRIEND', 'BOYFRIEND', 'ROMANCE', 'FANTASY', 'SUPERNATURAL', 'FEMALE', 'MALE', 'HORROR', 'HERO', 'COMEDY', 'NERD', 'SHY', 'BAD', 'ANIME', 'GAME_CHARACTER', 'HISTORY', 'MOVIE', 'MONSTER', 'BOOKS', 'OC');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://github-production-user-asset-6210df.s3.amazonaws.com/57546404/280538836-8c16b1b3-391f-4cdf-889c-e2e279f3167b.png',
    "username" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "bio" TEXT,
    "botContext" TEXT,
    "addressedAs" TEXT DEFAULT 'Senpai',
    "planId" "PlanId",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "nsfw" BOOLEAN NOT NULL DEFAULT false,
    "exampleDialogue" TEXT,
    "visibility" "BotVisibility" NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'https://github-production-user-asset-6210df.s3.amazonaws.com/57546404/280540176-f3d0aacb-e4f7-472c-9bf5-b19a4058581d.jpg',
    "backgroundImage" TEXT NOT NULL DEFAULT 'https://i.pinimg.com/originals/60/cb/46/60cb4600ad2427938722b77faba6426a.png',
    "characterImage" TEXT,
    "creatorId" TEXT,
    "source" "BotSource" NOT NULL,
    "tags" "CharacterTag"[],
    "moodImagesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sadImageId" TEXT,
    "blushedImageId" TEXT,
    "neutralImageId" TEXT,
    "happyImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodTable" (
    "id" TEXT NOT NULL,
    "angry" TEXT,
    "happy" TEXT,
    "sad" TEXT,
    "confident" TEXT,
    "confused" TEXT,
    "shy" TEXT,
    "excited" TEXT,
    "scared" TEXT,
    "botId" TEXT NOT NULL,

    CONSTRAINT "MoodTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotLike" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotDislike" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotDislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotShares" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotShares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "mode" "ChatMode" NOT NULL,
    "userContext" TEXT,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" "Mood" NOT NULL DEFAULT 'NEUTRAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "ChatRole" NOT NULL,
    "remembered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitialMessage" (
    "chatMode" "ChatMode" NOT NULL,
    "message" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InitialMessage_pkey" PRIMARY KEY ("botId","chatMode")
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "RRChatQueue" (
    "userId" TEXT NOT NULL,
    "channel" TEXT,
    "topic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RRChatQueue_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "bannerImage" TEXT,
    "categoryname" TEXT,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likeCount" BIGINT NOT NULL DEFAULT 0,
    "viewCount" BIGINT NOT NULL DEFAULT 0,
    "parentPostId" TEXT,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPostLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumPostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpInfo" (
    "ip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "loc" TEXT,
    "timezone" TEXT,

    CONSTRAINT "IpInfo_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

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
CREATE UNIQUE INDEX "MoodTable_botId_key" ON "MoodTable"("botId");

-- CreateIndex
CREATE INDEX "BotLike_botId_idx" ON "BotLike"("botId");

-- CreateIndex
CREATE INDEX "BotDislike_botId_idx" ON "BotDislike"("botId");

-- CreateIndex
CREATE INDEX "BotShares_botId_idx" ON "BotShares"("botId");

-- CreateIndex
CREATE INDEX "Chat_botId_mode_idx" ON "Chat"("botId", "mode");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "RRChatQueue_userId_idx" ON "RRChatQueue"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_id_key" ON "Asset"("id");

-- CreateIndex
CREATE INDEX "Asset_authorId_idx" ON "Asset"("authorId");

-- CreateIndex
CREATE INDEX "ForumPostLike_postId_idx" ON "ForumPostLike"("postId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSession" ADD CONSTRAINT "StripeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanQuotaUsage" ADD CONSTRAINT "PlanQuotaUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodTable" ADD CONSTRAINT "MoodTable_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotLike" ADD CONSTRAINT "BotLike_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotLike" ADD CONSTRAINT "BotLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDislike" ADD CONSTRAINT "BotDislike_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDislike" ADD CONSTRAINT "BotDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotShares" ADD CONSTRAINT "BotShares_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotShares" ADD CONSTRAINT "BotShares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InitialMessage" ADD CONSTRAINT "InitialMessage_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRChatQueue" ADD CONSTRAINT "RRChatQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_categoryname_fkey" FOREIGN KEY ("categoryname") REFERENCES "Category"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "ForumPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPostLike" ADD CONSTRAINT "ForumPostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPostLike" ADD CONSTRAINT "ForumPostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
