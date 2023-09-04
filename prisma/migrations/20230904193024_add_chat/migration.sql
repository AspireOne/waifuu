-- CreateEnum
CREATE TYPE "ChatbotType" AS ENUM ('ROLEPLAY', 'ADVENTURE', 'CHAT');

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatbotType" "ChatbotType" DEFAULT 'ROLEPLAY',
    "chatbotId" INTEGER,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "chatbotId" INTEGER,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatbot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL DEFAULT 'https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserChats" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserChats_AB_unique" ON "_UserChats"("A", "B");

-- CreateIndex
CREATE INDEX "_UserChats_B_index" ON "_UserChats"("B");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChats" ADD CONSTRAINT "_UserChats_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChats" ADD CONSTRAINT "_UserChats_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
