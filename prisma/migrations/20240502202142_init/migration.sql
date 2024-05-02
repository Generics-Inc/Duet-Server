/*
  Warnings:

  - You are about to drop the column `groupAsMainId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `groupAsSecondId` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "groupAsMainId",
DROP COLUMN "groupAsSecondId";
