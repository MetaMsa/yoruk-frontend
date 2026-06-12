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

  const key = `countryName:${country}`;
  const cached = await redis.get(key);

  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const countryName = await prisma.countryNames.findUnique({
    where: {
      country_name: country,
    },
  });

  if (countryName) {
    const stale =
      Date.now() - countryName.last_update.getTime() > 30 * 24 * 60 * 60 * 1000;

    if (!stale) {
      await redis.set(key, JSON.stringify(countryName.country), "EX", 7 * 24 * 60 * 60);

      return NextResponse.json(countryName);
    }
  }

  const res = await fetch(
    `https://api.restcountries.com/countries/v5/names.official/${encodeURIComponent(country)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REST_COUNTRIES_API}`,
      },
    },
  );

  const data = await res.json();
  const countryData = data.data.objects;

  await prisma.countryNames.upsert({
    where: {
      country_name: country,
    },
    update: {
      country: countryData,
      last_update: new Date(),
    },
    create: {
      country_name: country,
      country: countryData,
      last_update: new Date(),
    },
  });

  await redis.set(key, JSON.stringify(countryData), "EX", 7 * 24 * 60 * 60);

  return NextResponse.json(countryData);
}
