/** @type {import('next-sitemap').IConfig} */

import fs from "fs";
import path from "path";

const config = {
  siteUrl: "https://yoruk.benserhat.com",

  additionalPaths: async () => {
    const dataset = JSON.parse(
      fs.readFileSync(path.resolve("./dataset.json"), "utf-8")
    );

    const passports = ["Ordinary", "Special", "Service", "Diplomatic"];

    const names =
      dataset.features
        ?.map((f) => f.properties?.FORMAL_EN)
        .filter(Boolean) ?? [];

    return names.flatMap((name) =>
      passports.map((passport) => ({
        loc: `/${encodeURI(name)}/${passport}`,
        changefreq: "daily",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }))
    );
  },
};

export default config;