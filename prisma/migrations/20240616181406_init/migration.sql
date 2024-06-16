-- AlterTable
ALTER TABLE "Movies" ADD COLUMN     "partsListId" INTEGER;

-- AddForeignKey
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_partsListId_fkey" FOREIGN KEY ("partsListId") REFERENCES "MoviesPartsLists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
