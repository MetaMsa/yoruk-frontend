/*
  Warnings:

  - You are about to drop the column `stale` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `stale` on the `countryTranslations` table. All the data in the column will be lost.
  - Added the required column `last_update` to the `countryNames` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_update` to the `countryTranslations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countryNames" DROP COLUMN "stale",
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "countryTranslations" DROP COLUMN "stale",
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;
