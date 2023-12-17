/*
  Warnings:

  - The values [GIRLFRIEND,BOYFRIEND] on the enum `CharacterTag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CharacterTag_new" AS ENUM ('MOVIE', 'ANIME', 'PRACTICAL', 'ROMANCE', 'FANTASY', 'SUPERNATURAL', 'FEMALE', 'MALE', 'HORROR', 'HERO', 'COMEDY', 'NERD', 'SHY', 'BAD', 'GAME_CHARACTER', 'HISTORY', 'MONSTER', 'BOOKS', 'OC');
ALTER TABLE "Bot" ALTER COLUMN "tags" TYPE "CharacterTag_new"[] USING ("tags"::text::"CharacterTag_new"[]);
ALTER TYPE "CharacterTag" RENAME TO "CharacterTag_old";
ALTER TYPE "CharacterTag_new" RENAME TO "CharacterTag";
DROP TYPE "CharacterTag_old";
COMMIT;
