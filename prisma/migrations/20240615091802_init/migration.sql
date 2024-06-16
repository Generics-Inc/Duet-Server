-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('EMAIL', 'VK', 'TG');

-- CreateEnum
CREATE TYPE "MovieType" AS ENUM ('FILM', 'SERIAL', 'ANIME', 'CARTOON');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "HDRezkaMirrorStatus" AS ENUM ('WORKED', 'UPDATING', 'OLDEN');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" DEFAULT 'USER',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedAccounts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "UUID" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,

    CONSTRAINT "ConnectedAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "deviceUUID" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceOS" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "description" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mainProfileId" INTEGER,
    "secondProfileId" INTEGER,
    "inviteCode" TEXT,
    "photo" TEXT,
    "relationStartedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupsRequests" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupsRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupsArchives" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "partnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupsArchives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupsMovies" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "creatorId" INTEGER,
    "movieId" INTEGER,
    "isWatched" BOOLEAN NOT NULL DEFAULT false,
    "moreToWatch" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupsMovies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupsMoviesCreateTasks" (
    "id" SERIAL NOT NULL,
    "groupMovieId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addName" TEXT NOT NULL,
    "type" "MovieType" NOT NULL,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupsMoviesCreateTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MovieType" NOT NULL,
    "creatorId" INTEGER,
    "ageRating" INTEGER,
    "time" INTEGER,
    "country" TEXT,
    "originalName" TEXT,
    "slogan" TEXT,
    "description" TEXT,
    "link" TEXT,
    "photo" TEXT NOT NULL DEFAULT 'not set',
    "moderated" BOOLEAN NOT NULL DEFAULT false,
    "releaseDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genres" TEXT[],

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieModerate" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieModerate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesRatings" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "countOfScopes" INTEGER NOT NULL,
    "scope" DOUBLE PRECISION NOT NULL,
    "profileId" INTEGER,
    "providerName" TEXT,

    CONSTRAINT "MoviesRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesParts" (
    "link" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MovieType" NOT NULL,
    "rating" DOUBLE PRECISION,
    "partsListId" INTEGER,
    "movieId" INTEGER,
    "current" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "MoviesPartsLists" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MoviesPartsLists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesSeasons" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3),

    CONSTRAINT "MoviesSeasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesSeries" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),

    CONSTRAINT "MoviesSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HDRezkaMirror" (
    "url" TEXT NOT NULL,
    "status" "HDRezkaMirrorStatus" NOT NULL DEFAULT 'WORKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "useId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperSecret" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "SuperSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_username_key" ON "Users"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectedAccounts_userId_type_key" ON "ConnectedAccounts"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_userId_deviceUUID_key" ON "Sessions"("userId", "deviceUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_id_key" ON "Profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_username_key" ON "Profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_id_username_key" ON "Profiles"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_mainProfileId_key" ON "Groups"("mainProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_secondProfileId_key" ON "Groups"("secondProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_inviteCode_key" ON "Groups"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "GroupsRequests_profileId_groupId_key" ON "GroupsRequests"("profileId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupsArchives_groupId_profileId_key" ON "GroupsArchives"("groupId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupsMoviesCreateTasks_groupMovieId_key" ON "GroupsMoviesCreateTasks"("groupMovieId");

-- CreateIndex
CREATE UNIQUE INDEX "Movies_link_key" ON "Movies"("link");

-- CreateIndex
CREATE UNIQUE INDEX "MovieModerate_movieId_key" ON "MovieModerate"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "MoviesRatings_movieId_providerName_key" ON "MoviesRatings"("movieId", "providerName");

-- CreateIndex
CREATE UNIQUE INDEX "MoviesParts_link_key" ON "MoviesParts"("link");

-- CreateIndex
CREATE UNIQUE INDEX "MoviesParts_movieId_key" ON "MoviesParts"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "HDRezkaMirror_url_key" ON "HDRezkaMirror"("url");

-- AddForeignKey
ALTER TABLE "ConnectedAccounts" ADD CONSTRAINT "ConnectedAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ConnectedAccounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_id_username_fkey" FOREIGN KEY ("id", "username") REFERENCES "Users"("id", "username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_mainProfileId_fkey" FOREIGN KEY ("mainProfileId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_secondProfileId_fkey" FOREIGN KEY ("secondProfileId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsRequests" ADD CONSTRAINT "GroupsRequests_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsRequests" ADD CONSTRAINT "GroupsRequests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsArchives" ADD CONSTRAINT "GroupsArchives_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsArchives" ADD CONSTRAINT "GroupsArchives_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsArchives" ADD CONSTRAINT "GroupsArchives_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMovies" ADD CONSTRAINT "GroupsMovies_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMovies" ADD CONSTRAINT "GroupsMovies_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMovies" ADD CONSTRAINT "GroupsMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsMoviesCreateTasks" ADD CONSTRAINT "GroupsMoviesCreateTasks_groupMovieId_fkey" FOREIGN KEY ("groupMovieId") REFERENCES "GroupsMovies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieModerate" ADD CONSTRAINT "MovieModerate_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieModerate" ADD CONSTRAINT "MovieModerate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesRatings" ADD CONSTRAINT "MoviesRatings_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesRatings" ADD CONSTRAINT "MoviesRatings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesParts" ADD CONSTRAINT "MoviesParts_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesParts" ADD CONSTRAINT "MoviesParts_partsListId_fkey" FOREIGN KEY ("partsListId") REFERENCES "MoviesPartsLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSeasons" ADD CONSTRAINT "MoviesSeasons_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSeries" ADD CONSTRAINT "MoviesSeries_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "MoviesSeasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
