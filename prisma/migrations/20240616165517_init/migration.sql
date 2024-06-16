/*
  Warnings:

  - Added the required column `scope` to the `GroupsMoviesRatings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupsMoviesRatings" ADD COLUMN     "scope" DOUBLE PRECISION NOT NULL;
