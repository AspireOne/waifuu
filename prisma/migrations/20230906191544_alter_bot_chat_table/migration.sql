/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chatbot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatbotRole" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "BotMode" AS ENUM ('ROLEPLAY', 'ADVENTURE', 'CHAT');

-- CreateEnum
CREATE TYPE "BotSource" AS ENUM ('OFFICIAL', 'COMMUNITY');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_B_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Chatbot";

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_UserChats";

-- DropEnum
DROP TYPE "ChatbotType";

-- CreateTable
CREATE TABLE "BotMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "botMode" "BotMode" NOT NULL,
    "role" "ChatbotRole" NOT NULL,

    CONSTRAINT "BotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "source" "BotSource" NOT NULL DEFAULT 'OFFICIAL',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL DEFAULT 'https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotMessage" ADD CONSTRAINT "BotMessage_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotMessage" ADD CONSTRAINT "BotMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
