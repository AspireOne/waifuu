/*
  Warnings:

  - You are about to drop the column `source` on the `Bot` table. All the data in the column will be lost.
  - Added the required column `public` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `BotMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BotChatRole" AS ENUM ('USER', 'BOT');

-- DropForeignKey
ALTER TABLE "BotMessage" DROP CONSTRAINT "BotMessage_userId_fkey";

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "source",
ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "BotMessage" DROP COLUMN "role",
ADD COLUMN     "role" "BotChatRole" NOT NULL;

-- DropEnum
DROP TYPE "BotSource";

-- DropEnum
DROP TYPE "ChatbotRole";

-- AddForeignKey
ALTER TABLE "BotMessage" ADD CONSTRAINT "BotMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
