import dataset from "@/dataset.json";
import { notFound } from "next/navigation";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import Client from "./Client";

const countries = (dataset as unknown) as FeatureCollection<Geometry, GeoJsonProperties>;

export default async function Page({
    params,
}: {
    params: Promise<{ country: string[] }>;
}) {
    let { country } = await params;
    country[0] = decodeURIComponent(country[0]);

    const find = countries.features.find(
        f => f.properties?.FORMAL_EN === country[0]
    );

    if(!find) {
        return notFound();
    }

    return <Client country={country[0]} passport={country[1]} />;
}