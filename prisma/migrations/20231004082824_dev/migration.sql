/*
  Warnings:

  - You are about to drop the column `img` on the `Bot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "img",
ADD COLUMN     "avatar" TEXT DEFAULT 'https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg',
ADD COLUMN     "cover" TEXT DEFAULT 'https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg';

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_id_key" ON "Asset"("id");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
