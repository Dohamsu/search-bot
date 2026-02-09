import type { MetadataRoute } from "next";
import { getAllTypes } from "./lib/results";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mbti.example.com";

  const typePages = getAllTypes().map((type) => ({
    url: `${baseUrl}/result/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...typePages,
  ];
}
