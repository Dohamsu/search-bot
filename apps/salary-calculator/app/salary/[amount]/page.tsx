import type { Metadata } from "next";
import { calculateSalary } from "../../lib/salary";
import SalaryDetailClient from "./SalaryDetailClient";

const SITE_URL = "https://salary.onekit.co.kr";

export function generateStaticParams() {
  const params = [];
  for (let i = 2000; i <= 15000; i += 100) {
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
  const amount = Number(amountStr);
  const result = calculateSalary({
    annualSalary: amount * 10000,
    nonTaxableAmount: 100000,
    dependents: 1,
    childrenUnder20: 0,
  });

  const monthlyNetMan = Math.round(result.monthlyNetSalary / 10000);
  const monthlySalaryMan = Math.round(result.monthlySalary / 10000);

  const title = `연봉 ${formatManWonKo(amount)}원 실수령액 - 월 ${monthlyNetMan}만원 (2026)`;
  const description = `2026년 연봉 ${formatManWonKo(amount)}원 실수령액: 월급 ${monthlySalaryMan}만원에서 4대보험·소득세 공제 후 월 실수령 약 ${monthlyNetMan}만원 (실수령률 ${result.netRatio.toFixed(1)}%). 공제 항목별 상세 내역.`;

  return {
    title,
    description,
    keywords: [
      `연봉 ${amount}만원`,
      `연봉 ${amount}만원 실수령액`,
      `연봉 ${formatManWonKo(amount)}원 월급`,
      `연봉 ${amount}만원 세후`,
      "연봉 계산기 2026",
      "실수령액",
    ],
    alternates: {
      canonical: `${SITE_URL}/salary/${amount}`,
    },
    openGraph: {
      title: `연봉 ${formatManWonKo(amount)}원 실수령액 | 월 ${monthlyNetMan}만원`,
      description,
      type: "article",
      url: `${SITE_URL}/salary/${amount}`,
      locale: "ko_KR",
      siteName: "연봉 실수령액 계산기",
    },
    twitter: {
      card: "summary_large_image",
      title: `연봉 ${formatManWonKo(amount)}원 실수령액 - 월 ${monthlyNetMan}만원`,
      description,
    },
  };
}

export default async function SalaryDetailPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount: amountStr } = await params;
  const amount = Number(amountStr);

  const result = calculateSalary({
    annualSalary: amount * 10000,
    nonTaxableAmount: 100000,
    dependents: 1,
    childrenUnder20: 0,
  });

  const monthlyNetMan = Math.round(result.monthlyNetSalary / 10000);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `연봉 ${formatManWonKo(amount)}원 실수령액 분석 (2026년)`,
    description: `연봉 ${formatManWonKo(amount)}원의 월 실수령액은 약 ${Math.round(result.monthlyNetSalary).toLocaleString("ko-KR")}원(약 ${monthlyNetMan}만원)입니다.`,
    url: `${SITE_URL}/salary/${amount}`,
    datePublished: "2026-01-01",
    dateModified: "2026-01-01",
    publisher: {
      "@type": "Organization",
      name: "연봉계산기",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/salary/${amount}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SalaryDetailClient amount={amount} result={result} />
    </>
  );
}
