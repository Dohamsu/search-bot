import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://salary.onekit.co.kr";

  // Forward salary detail pages: 100만원 increments
  const salaryPages: MetadataRoute.Sitemap = [];
  for (let i = 2000; i <= 15000; i += 100) {
    salaryPages.push({
      url: `${baseUrl}/salary/${i}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Reverse monthly pages: 10만원 increments
  const monthlyPages: MetadataRoute.Sitemap = [];
  for (let i = 150; i <= 800; i += 10) {
    monthlyPages.push({
      url: `${baseUrl}/monthly/${i}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/salary-table`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/severance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...salaryPages,
    ...monthlyPages,
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
