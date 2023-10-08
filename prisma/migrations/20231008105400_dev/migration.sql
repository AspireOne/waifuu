/*
  Warnings:

  - Added the required column `characterName` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characterPersona` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "characterDialogue" TEXT,
ADD COLUMN     "characterName" TEXT NOT NULL,
ADD COLUMN     "characterNsfw" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "characterPersona" TEXT NOT NULL;
