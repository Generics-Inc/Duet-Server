/*
  Warnings:

  - Added the required column `inviteCode` to the `GroupsRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupsRequests" ADD COLUMN     "inviteCode" TEXT NOT NULL;
