/*
  Warnings:

  - A unique constraint covering the columns `[country_name]` on the table `countryNames` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country_name` to the `countryNames` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countryNames" ADD COLUMN     "country_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "countryNames_country_name_key" ON "countryNames"("country_name");
