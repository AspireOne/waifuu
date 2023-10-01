/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('NEUTRAL', 'ANGRY', 'HAPPY', 'SAD', 'CONFIDENT', 'CONFUSED', 'SHY', 'EXCITED', 'SCARED');

-- DropForeignKey
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_B_fkey";

-- AlterTable
ALTER TABLE "BotChatMessage" ADD COLUMN     "mood" "Mood";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("name");

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

-- CreateIndex
CREATE UNIQUE INDEX "MoodTable_botId_key" ON "MoodTable"("botId");

-- AddForeignKey
ALTER TABLE "MoodTable" ADD CONSTRAINT "MoodTable_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotToTag" ADD CONSTRAINT "_BotToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
