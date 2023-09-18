-- CreateTable
CREATE TABLE "OmegleChatQueue" (
    "userId" TEXT NOT NULL,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OmegleChatQueue_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "OmegleChatQueue" ADD CONSTRAINT "OmegleChatQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
