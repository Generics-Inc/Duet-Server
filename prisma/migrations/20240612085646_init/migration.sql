/*
  Warnings:

  - You are about to drop the column `rating` on the `Movies` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MoviesSeasons` table. All the data in the column will be lost.
  - Added the required column `ageRating` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Made the column `photo` on table `Movies` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `number` to the `MoviesSeasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `MoviesSeasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `MoviesSeries` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `MoviesSeries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GroupsArchives" ADD COLUMN     "partnerId" INTEGER;

-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "rating",
ADD COLUMN     "ageRating" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slogan" TEXT,
ADD COLUMN     "time" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "photo" SET NOT NULL,
ALTER COLUMN "photo" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MoviesSeasons" DROP COLUMN "name",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MoviesSeries" ADD COLUMN     "number" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "MoviesRatings" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "countOfScopes" INTEGER NOT NULL,
    "scope" INTEGER NOT NULL,
    "profileId" INTEGER,
    "providerName" TEXT,

    CONSTRAINT "MoviesRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesParts" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" "MovieType" NOT NULL,
    "rating" INTEGER,
    "current" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MoviesParts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupsArchives" ADD CONSTRAINT "GroupsArchives_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesRatings" ADD CONSTRAINT "MoviesRatings_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesRatings" ADD CONSTRAINT "MoviesRatings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesParts" ADD CONSTRAINT "MoviesParts_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
