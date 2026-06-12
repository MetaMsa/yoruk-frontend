/*
  Warnings:

  - You are about to drop the column `alpha2_code` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `commonName` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `commonTurTranslationName` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `officialName` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `officialTurTranslationName` on the `countryNames` table. All the data in the column will be lost.
  - You are about to drop the column `urlSvgFlag` on the `countryNames` table. All the data in the column will be lost.
  - Added the required column `country` to the `countryNames` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "countryNames_alpha2_code_key";

-- DropIndex
DROP INDEX "countryNames_officialName_key";

-- AlterTable
ALTER TABLE "countryNames" DROP COLUMN "alpha2_code",
DROP COLUMN "commonName",
DROP COLUMN "commonTurTranslationName",
DROP COLUMN "officialName",
DROP COLUMN "officialTurTranslationName",
DROP COLUMN "urlSvgFlag",
ADD COLUMN     "country" JSONB NOT NULL;
