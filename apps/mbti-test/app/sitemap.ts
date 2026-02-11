import type { MetadataRoute } from "next";
import { getAllTypes } from "./lib/results";
import { getAllCompatibilityPairs } from "./lib/compatibility";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mbti.onekit.co.kr";

  const typePages = getAllTypes().map((type) => ({
    url: `${baseUrl}/result/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const compatPages = getAllCompatibilityPairs().map(([t1, t2]) => ({
    url: `${baseUrl}/compatibility/${t1}-${t2}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/compatibility`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    ...typePages,
    ...compatPages,
  ];
}
