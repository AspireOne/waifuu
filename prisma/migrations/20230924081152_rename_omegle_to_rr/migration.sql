/*
  Warnings:

  - You are about to drop the `OmegleChatQueue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OmegleChatQueue" DROP CONSTRAINT "OmegleChatQueue_userId_fkey";

-- DropTable
DROP TABLE "OmegleChatQueue";

-- CreateTable
CREATE TABLE "RRChatQueue" (
    "userId" TEXT NOT NULL,
    "channel" TEXT,
    "topic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RRChatQueue_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "RRChatQueue" ADD CONSTRAINT "RRChatQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
