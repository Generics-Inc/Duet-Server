/*
  Warnings:

  - You are about to drop the column `profileId` on the `MoviesRatings` table. All the data in the column will be lost.
  - You are about to drop the `GroupMoviesWatchedSeries` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `providerName` on table `MoviesRatings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GroupMoviesWatchedSeries" DROP CONSTRAINT "GroupMoviesWatchedSeries_groupMovieId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMoviesWatchedSeries" DROP CONSTRAINT "GroupMoviesWatchedSeries_seriaId_fkey";

-- DropForeignKey
ALTER TABLE "MoviesRatings" DROP CONSTRAINT "MoviesRatings_profileId_fkey";

-- AlterTable
ALTER TABLE "MoviesRatings" DROP COLUMN "profileId",
ALTER COLUMN "providerName" SET NOT NULL;

-- DropTable
DROP TABLE "GroupMoviesWatchedSeries";

-- CreateTable
CREATE TABLE "GroupsMoviesWatchedSeries" (
    "seriaId" INTEGER NOT NULL,
    "groupMovieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GroupsMoviesRatings" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "groupMovieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupsMoviesRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupsMoviesWatchedSeries_groupMovieId_seriaId_key" ON "GroupsMoviesWatchedSeries"("groupMovieId", "seriaId");

-- AddForeignKey
ALTER TABLE "GroupsMoviesWatchedSeries" ADD CONSTRAINT "GroupsMoviesWatchedSeries_groupMovieId_fkey" FOREIGN KEY ("groupMovieId") REFERENCES "GroupsMovies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMoviesWatchedSeries" ADD CONSTRAINT "GroupsMoviesWatchedSeries_seriaId_fkey" FOREIGN KEY ("seriaId") REFERENCES "MoviesSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMoviesRatings" ADD CONSTRAINT "GroupsMoviesRatings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMoviesRatings" ADD CONSTRAINT "GroupsMoviesRatings_groupMovieId_fkey" FOREIGN KEY ("groupMovieId") REFERENCES "GroupsMovies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
