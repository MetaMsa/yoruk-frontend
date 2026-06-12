import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function isAllowed(ip: string, limit: number){

    const key = "next:rate:ip:" + ip;

    const count = await redis.incr(key);

    if (count == 1) {
        await redis.expire(key, 60);
    }

    return count != null  && count <= limit;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { country: string } }
) {
    const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "unknown";

    if(!(await isAllowed(ip, 100)))
        return NextResponse.json({error: "Çok fazla istek yapıldı." }, {status: 429})

    const { country } = await params;
    
    const searchText = country;

    const res = await fetch(
                    `https://api.restcountries.com/countries/v5?q=${searchText}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REST_COUNTRIES_API}`
                        }
                    }               
                );

    const data = await res.json();

    return NextResponse.json(data);
}