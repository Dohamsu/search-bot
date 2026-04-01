import type { Metadata } from "next";
import { calculateSalary, findAnnualSalaryForMonthlyNet } from "../../lib/salary";
import MonthlyDetailClient from "./MonthlyDetailClient";

const SITE_URL = "https://salary.onekit.co.kr";

export function generateStaticParams() {
  const params = [];
  // Common monthly net amounts: 150만원 to 800만원, 10만원 increments
  for (let i = 150; i <= 800; i += 10) {
    params.push({ amount: String(i) });
  }
  return params;
}

function formatManWonKo(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString("ko-KR")}만` : `${eok}억`;
  }
  return `${manwon.toLocaleString("ko-KR")}만`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount: amountStr } = await params;
  const targetNet = Number(amountStr);
  const annualSalary = findAnnualSalaryForMonthlyNet(targetNet * 10000);
  const annualMan = annualSalary / 10000;

  const title = `세후 월 ${targetNet}만원 연봉은? 약 ${formatManWonKo(annualMan)}원 (2026)`;
  const description = `세후 월 ${targetNet}만원(실수령액)을 받으려면 연봉 약 ${formatManWonKo(annualMan)}원이 필요합니다. 2026년 4대보험·소득세 기준. 월급 역산 계산 결과와 공제 상세 내역.`;

  return {
    title,
    description,
    keywords: [
      `세후 ${targetNet}만원`,
      `월급 ${targetNet}만원 연봉`,
      `세후 월 ${targetNet}만원`,
      `실수령 ${targetNet}만원 연봉`,
      `월 ${targetNet}만원 연봉`,
      "연봉 역산 계산기",
    ],
    alternates: {
      canonical: `${SITE_URL}/monthly/${targetNet}`,
    },
    openGraph: {
      title: `세후 월 ${targetNet}만원 → 연봉 약 ${formatManWonKo(annualMan)}원`,
      description,
      type: "article",
      url: `${SITE_URL}/monthly/${targetNet}`,
      locale: "ko_KR",
      siteName: "연봉 실수령액 계산기",
    },
    twitter: {
      card: "summary_large_image",
      title: `세후 월 ${targetNet}만원 연봉은? 약 ${formatManWonKo(annualMan)}원`,
      description,
    },
  };
}

export default async function MonthlyDetailPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount: amountStr } = await params;
  const targetNet = Number(amountStr);
  const annualSalary = findAnnualSalaryForMonthlyNet(targetNet * 10000);
  const annualMan = annualSalary / 10000;

  const result = calculateSalary({
    annualSalary,
    nonTaxableAmount: 100000,
    dependents: 1,
    childrenUnder20: 0,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `세후 월 ${targetNet}만원 받으려면 연봉 얼마? (2026년)`,
    description: `월 실수령 ${targetNet}만원을 받으려면 연봉 약 ${formatManWonKo(annualMan)}원이 필요합니다.`,
    url: `${SITE_URL}/monthly/${targetNet}`,
    datePublished: "2026-01-01",
    dateModified: "2026-01-01",
    publisher: {
      "@type": "Organization",
      name: "연봉계산기",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MonthlyDetailClient
        targetNet={targetNet}
        annualSalary={annualSalary}
        result={result}
      />
    </>
  );
}
