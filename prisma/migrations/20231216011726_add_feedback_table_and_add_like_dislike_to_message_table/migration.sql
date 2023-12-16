-- CreateEnum
CREATE TYPE "Feedback" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "feedback" "Feedback";

-- CreateTable
CREATE TABLE "MessageFeedbackMetadata" (
    "messageId" INTEGER NOT NULL,
    "previousMessageId" INTEGER,
    "modelId" TEXT NOT NULL,
    "feedback" "Feedback" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageFeedbackMetadata_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE INDEX "MessageFeedbackMetadata_messageId_idx" ON "MessageFeedbackMetadata"("messageId");

-- AddForeignKey
ALTER TABLE "MessageFeedbackMetadata" ADD CONSTRAINT "MessageFeedbackMetadata_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
