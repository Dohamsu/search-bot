import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowLeft, TableProperties } from "lucide-react";
import { calculateSalary } from "../lib/salary";
import Footer from "../components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://salary.example.com";

export const metadata: Metadata = {
  title: "연봉 실수령액 표 2026 | 1000만원~1억원 실수령액 총정리",
  description:
    "2026년 기준 연봉 1000만원부터 1억원까지 100만원 단위 실수령액 표입니다. 4대보험, 소득세 공제 후 실제 수령액을 한눈에 확인하세요.",
  alternates: {
    canonical: `${SITE_URL}/salary-table`,
  },
  openGraph: {
    title: "연봉 실수령액 표 2026 | 1000만원~1억원 실수령액 총정리",
    description:
      "2026년 기준 연봉 1000만원부터 1억원까지 100만원 단위로 월 실수령액을 계산한 표입니다. 4대보험, 소득세 공제 후 실제 수령액을 한눈에 확인하세요.",
    type: "website",
    url: `${SITE_URL}/salary-table`,
    locale: "ko_KR",
    siteName: "연봉 실수령액 계산기",
  },
  twitter: {
    card: "summary_large_image",
    title: "연봉 실수령액 표 2026",
    description:
      "연봉 1000만원~1억원까지 월 실수령액을 한눈에 비교하세요.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "연봉 5000만원의 월 실수령액은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "연봉 5000만원(비과세 월 10만원, 부양가족 1명 기준)의 월 실수령액은 약 350만원 내외입니다. 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세를 공제한 금액입니다.",
      },
    },
    {
      "@type": "Question",
      name: "4대보험은 연봉에서 얼마나 공제되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "4대보험 공제율은 국민연금 4.75%, 건강보험 3.595%, 장기요양보험 건강보험료의 13.14%, 고용보험 0.9%입니다. 총 약 9.7% 정도가 4대보험으로 공제됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "연봉과 월급의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "연봉은 1년간 받는 총 급여(세전)이고, 월급은 연봉을 12로 나눈 세전 월 급여입니다. 실수령액은 월급에서 4대보험과 소득세를 공제한 실제 통장에 들어오는 금액입니다.",
      },
    },
    {
      "@type": "Question",
      name: "비과세액이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "비과세액은 급여 중 세금이 부과되지 않는 항목으로, 대표적으로 식대(월 20만원 한도)가 있습니다. 비과세액이 클수록 실수령액이 늘어납니다. 일반적으로 월 10만~20만원 정도입니다.",
      },
    },
    {
      "@type": "Question",
      name: "연봉 실수령액 계산 시 부양가족 수는 어떤 영향을 주나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "부양가족 수는 소득세 계산에 영향을 줍니다. 부양가족이 많을수록 근로소득 간이세액표에 의해 소득세가 줄어들어 실수령액이 증가합니다. 본인도 부양가족 1명으로 포함됩니다.",
      },
    },
  ],
};

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function formatManWon(amount: number): string {
  const man = amount / 10000;
  if (man >= 10000) {
    const eok = Math.floor(man / 10000);
    const rest = man % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString("ko-KR")}만` : `${eok}억`;
  }
  return `${man.toLocaleString("ko-KR")}만`;
}

interface TableRow {
  annualSalary: number;
  monthlySalary: number;
  totalDeduction: number;
  monthlyNetSalary: number;
  netRatio: number;
}

function generateTableData(): TableRow[] {
  const rows: TableRow[] = [];
  for (let salary = 10_000_000; salary <= 100_000_000; salary += 1_000_000) {
    const result = calculateSalary({
      annualSalary: salary,
      nonTaxableAmount: 100_000,
      dependents: 1,
      childrenUnder20: 0,
    });
    rows.push({
      annualSalary: salary,
      monthlySalary: result.monthlySalary,
      totalDeduction: result.totalDeduction,
      monthlyNetSalary: result.monthlyNetSalary,
      netRatio: result.netRatio,
    });
  }
  return rows;
}

export default function SalaryTablePage() {
  const rows = generateTableData();

  return (
    <main className="min-h-screen bg-[var(--salary-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <nav className="flex h-16 items-center justify-between border-b border-[var(--salary-border)] bg-white px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--salary-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-primary)]">
              연봉계산기
            </span>
          </Link>
          <div className="hidden items-center gap-1.5 md:flex">
            <TableProperties className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-[var(--salary-text)]">
              실수령액 표
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-[var(--salary-border)] px-4 py-2 text-sm font-medium text-[var(--salary-text)] transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          계산기로 돌아가기
        </Link>
      </nav>

      <section className="mx-auto max-w-5xl px-4 py-8 md:px-8" aria-label="연봉 실수령액 표">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--salary-text)] md:text-3xl">
            2026 연봉 실수령액 표
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
            연봉 1,000만원부터 1억원까지 100만원 단위로 월 실수령액을 계산한
            표입니다. 비과세 월 10만원, 부양가족 1명(본인), 자녀 0명 기준입니다.
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-[var(--salary-border)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--salary-border)] bg-slate-50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-[var(--salary-text)] md:px-6">
                  연봉
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-text)] md:px-6">
                  월급
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-red-500 md:px-6">
                  공제합계
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-primary)] md:px-6">
                  실수령액
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-text)] md:px-6">
                  실수령률
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isHighlight =
                  row.annualSalary % 10_000_000 === 0;
                const amountInMan = row.annualSalary / 10000;
                const hasDetailPage =
                  amountInMan >= 2000 &&
                  amountInMan <= 15000 &&
                  amountInMan % 500 === 0;
                return (
                  <tr
                    key={row.annualSalary}
                    className={`border-b border-[var(--salary-border)] last:border-b-0 ${
                      isHighlight
                        ? "bg-blue-50/50 font-medium"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/30"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 text-left text-[var(--salary-text)] md:px-6">
                      {hasDetailPage ? (
                        <Link
                          href={`/salary/${amountInMan}`}
                          className="text-[var(--salary-primary)] underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                          {formatManWon(row.annualSalary)}원
                        </Link>
                      ) : (
                        <>{formatManWon(row.annualSalary)}원</>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-[var(--salary-text)] md:px-6">
                      {formatCurrency(row.monthlySalary)}원
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-500 md:px-6">
                      -{formatCurrency(row.totalDeduction)}원
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] font-semibold text-[var(--salary-primary)] md:px-6">
                      {formatCurrency(row.monthlyNetSalary)}원
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-[var(--salary-text)] md:px-6">
                      {row.netRatio.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="mt-8 rounded-xl border border-[var(--salary-border)] bg-white p-6" aria-label="계산 기준 안내">
          <h2 className="text-lg font-bold text-[var(--salary-text)]">
            계산 기준 안내
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                국민연금:
              </span>{" "}
              월 소득의 4.75% (상한 월 302,575원)
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                건강보험:
              </span>{" "}
              월 소득의 3.595%
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                장기요양보험:
              </span>{" "}
              건강보험료의 13.14%
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                고용보험:
              </span>{" "}
              월 소득의 0.9%
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                소득세:
              </span>{" "}
              근로소득 간이세액표 기준 (부양가족 1명, 자녀 0명)
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                지방소득세:
              </span>{" "}
              소득세의 10%
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            * 비과세 월 100,000원 기준이며, 실제 수령액은 개인별 공제 항목에 따라
            달라질 수 있습니다.
          </p>
        </aside>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--salary-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Calculator className="h-4 w-4" />
            내 연봉으로 직접 계산하기
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
