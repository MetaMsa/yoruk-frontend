import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { isAllowed } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ country: string }> },
) {
  const { country } = await params;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!(await isAllowed(ip, 12)))
    return NextResponse.json(
      { error: "Çok fazla istek yapıldı." },
      { status: 429 },
    );

  const key = `countryTranslations:${country}`;
  const cached = await redis.get(key);

  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const countryTranslation = await prisma.countryTranslations.findUnique({
    where: {
      text_search: country,
    },
  });

  if (countryTranslation) {
    const stale =
      Date.now() - countryTranslation.last_update.getTime() > 30 * 24 * 60 * 60 * 1000;

    if (!stale) {
      await redis.set(key, JSON.stringify(countryTranslation.countries), "EX", 7 * 24 * 60 * 60);

      return NextResponse.json(countryTranslation);
    }
  }

  const res = await fetch(
    `https://api.restcountries.com/countries/v5?q=${country}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REST_COUNTRIES_API}`,
      },
    },
  );

  const data = await res.json();
  const countriesData = data.data.objects;

  await prisma.countryTranslations.upsert({
    where: {
      text_search: country,
    },
    update: {
      countries: countriesData,
      last_update: new Date(),
    },
    create: {
      text_search: country,
      countries: countriesData,
      last_update: new Date(),
    },
  });

  await redis.set(key, JSON.stringify(countriesData), "EX", 7 * 24 * 60 * 60);

  return NextResponse.json(countriesData);
}
