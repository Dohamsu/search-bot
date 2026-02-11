import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://salary.onekit.co.kr";

  // 연봉별 상세 페이지: 2000만원 ~ 15000만원, 500만원 단위 (27개)
  const salaryAmounts: number[] = [];
  for (let i = 2000; i <= 15000; i += 500) {
    salaryAmounts.push(i);
  }

  const salaryDetailPages: MetadataRoute.Sitemap = salaryAmounts.map((amount) => ({
    url: `${baseUrl}/salary/${amount}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/salary-table`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/severance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...salaryDetailPages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
