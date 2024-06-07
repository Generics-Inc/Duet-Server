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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupsArchives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HDRezkaMirror" (
    "url" TEXT NOT NULL,
    "status" "HDRezkaMirrorStatus" NOT NULL DEFAULT 'WORKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Movies" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MovieType" NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "isWatched" BOOLEAN NOT NULL DEFAULT false,
    "photo" TEXT DEFAULT 'loading',
    "profileId" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesSeasons" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "isWatched" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,

    CONSTRAINT "MoviesSeasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesSeries" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "isWatched" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,

    CONSTRAINT "MoviesSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesTags" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "profileId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesTags_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_movieTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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
CREATE UNIQUE INDEX "HDRezkaMirror_url_key" ON "HDRezkaMirror"("url");

-- CreateIndex
CREATE UNIQUE INDEX "MoviesTags_groupId_name_key" ON "MoviesTags"("groupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_movieTags_AB_unique" ON "_movieTags"("A", "B");

-- CreateIndex
CREATE INDEX "_movieTags_B_index" ON "_movieTags"("B");

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
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSeasons" ADD CONSTRAINT "MoviesSeasons_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSeries" ADD CONSTRAINT "MoviesSeries_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "MoviesSeasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesTags" ADD CONSTRAINT "MoviesTags_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesTags" ADD CONSTRAINT "MoviesTags_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movieTags" ADD CONSTRAINT "_movieTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movieTags" ADD CONSTRAINT "_movieTags_B_fkey" FOREIGN KEY ("B") REFERENCES "MoviesTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
