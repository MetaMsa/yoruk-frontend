-- CreateTable
CREATE TABLE "countryNames" (
    "id" SERIAL NOT NULL,
    "alpha2_code" TEXT NOT NULL,
    "officialName" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "officialTurTranslationName" TEXT NOT NULL,
    "commonTurTranslationName" TEXT NOT NULL,
    "urlSvgFlag" TEXT NOT NULL,

    CONSTRAINT "countryNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countryTranslations" (
    "id" SERIAL NOT NULL,
    "text_search" TEXT NOT NULL,
    "countries" JSONB NOT NULL,

    CONSTRAINT "countryTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countryNames_alpha2_code_key" ON "countryNames"("alpha2_code");

-- CreateIndex
CREATE UNIQUE INDEX "countryNames_officialName_key" ON "countryNames"("officialName");

-- CreateIndex
CREATE UNIQUE INDEX "countryTranslations_text_search_key" ON "countryTranslations"("text_search");
