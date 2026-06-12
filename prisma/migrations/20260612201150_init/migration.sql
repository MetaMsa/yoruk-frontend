/*
  Warnings:

  - Added the required column `stale` to the `countryNames` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stale` to the `countryTranslations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countryNames" ADD COLUMN     "stale" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "countryTranslations" ADD COLUMN     "stale" TIMESTAMP(3) NOT NULL;
