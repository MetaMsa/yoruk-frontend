import { isAllowed } from "../../translations/[country]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { country: string } }
) {
    const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "unknown";

    if(!(await isAllowed(ip, 12)))
        return NextResponse.json({error: "Çok fazla istek yapıldı." }, {status: 429})

    const { country } = await params;
    
    const searchText = country;

    const res = await fetch(
                    `https://api.restcountries.com/countries/v5/names.official/${searchText}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REST_COUNTRIES_API}`
                        }
                    }               
                );

    const data = await res.json();

    return NextResponse.json(data.data.objects);
}