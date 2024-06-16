-- CreateTable
CREATE TABLE "GroupMoviesWatchedSeries" (
    "groupMovieId" INTEGER NOT NULL,
    "seriaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMoviesWatchedSeries_groupMovieId_seriaId_key" ON "GroupMoviesWatchedSeries"("groupMovieId", "seriaId");

-- AddForeignKey
ALTER TABLE "GroupMoviesWatchedSeries" ADD CONSTRAINT "GroupMoviesWatchedSeries_groupMovieId_fkey" FOREIGN KEY ("groupMovieId") REFERENCES "GroupsMovies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMoviesWatchedSeries" ADD CONSTRAINT "GroupMoviesWatchedSeries_seriaId_fkey" FOREIGN KEY ("seriaId") REFERENCES "MoviesSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
