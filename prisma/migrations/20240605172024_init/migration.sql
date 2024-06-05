/*
  Warnings:

  - The values [ANUME] on the enum `MovieType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[groupId,name]` on the table `MoviesTags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovieType_new" AS ENUM ('FILM', 'SERIAL', 'ANIME', 'CARTOON');
ALTER TABLE "Movies" ALTER COLUMN "type" TYPE "MovieType_new" USING ("type"::text::"MovieType_new");
ALTER TYPE "MovieType" RENAME TO "MovieType_old";
ALTER TYPE "MovieType_new" RENAME TO "MovieType";
DROP TYPE "MovieType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "MoviesTags_groupId_name_key" ON "MoviesTags"("groupId", "name");
