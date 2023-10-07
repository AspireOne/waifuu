/*
  Warnings:

  - The values [BORED] on the enum `Mood` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `moodId` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `botId` on the `BotChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `botMode` on the `BotChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BotChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Moods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `BotChatMessage` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Mood_new" AS ENUM ('NEUTRAL', 'ANGRY', 'HAPPY', 'SAD', 'CONFIDENT', 'CONFUSED', 'SHY', 'EXCITED', 'SCARED');
ALTER TABLE "BotChatMessage" ALTER COLUMN "mood" TYPE "Mood_new" USING ("mood"::text::"Mood_new");
ALTER TYPE "Mood" RENAME TO "Mood_old";
ALTER TYPE "Mood_new" RENAME TO "Mood";
DROP TYPE "Mood_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_moodId_fkey";

-- DropForeignKey
ALTER TABLE "BotChatMessage" DROP CONSTRAINT "BotChatMessage_botId_fkey";

-- DropForeignKey
ALTER TABLE "BotChatMessage" DROP CONSTRAINT "BotChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Bot_moodId_key";

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "moodId";

-- AlterTable
ALTER TABLE "BotChatMessage" DROP COLUMN "botId",
DROP COLUMN "botMode",
DROP COLUMN "userId",
ADD COLUMN     "chatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "addressedAs" TEXT DEFAULT 'Senpai',
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Moods";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

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
CREATE TABLE "BotChat" (
    "id" TEXT NOT NULL,
    "botMode" "BotMode" NOT NULL,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BotChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoodTable_botId_key" ON "MoodTable"("botId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "MoodTable" ADD CONSTRAINT "MoodTable_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChat" ADD CONSTRAINT "BotChat_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChat" ADD CONSTRAINT "BotChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChatMessage" ADD CONSTRAINT "BotChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "BotChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
