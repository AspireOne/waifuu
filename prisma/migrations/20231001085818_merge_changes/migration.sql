/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moodId]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `moodId` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('ANGRY', 'HAPPY', 'SAD', 'CONFIDENT', 'CONFUSED', 'SHY', 'EXCITED', 'BORED', 'SCARED');

-- DropForeignKey
ALTER TABLE "_BotToTag" DROP CONSTRAINT "_BotToTag_B_fkey";

-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "moodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BotChatMessage" ADD COLUMN     "mood" "Mood";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("name");

-- CreateTable
CREATE TABLE "Moods" (
    "id" TEXT NOT NULL,
    "angry" TEXT,
    "happy" TEXT,
    "sad" TEXT,
    "confident" TEXT,
    "confused" TEXT,
    "shy" TEXT,
    "excited" TEXT,
    "bored" TEXT,
    "scared" TEXT,

    CONSTRAINT "Moods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_moodId_key" ON "Bot"("moodId");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Moods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotToTag" ADD CONSTRAINT "_BotToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
