/*
  Warnings:

  - A unique constraint covering the columns `[profileId,groupMovieId]` on the table `GroupsMoviesRatings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupsMoviesRatings_profileId_groupMovieId_key" ON "GroupsMoviesRatings"("profileId", "groupMovieId");
