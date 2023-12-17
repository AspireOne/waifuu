-- CreateTable
CREATE TABLE "GeneralFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneralFeedback" ADD CONSTRAINT "GeneralFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
