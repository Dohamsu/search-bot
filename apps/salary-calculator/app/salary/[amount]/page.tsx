import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  TableProperties,
  Clock,
  TrendingUp,
  Wallet,
  PieChart,
} from "lucide-react";
import { calculateSalary } from "../../lib/salary";
import Footer from "../../components/Footer";

const SITE_URL = "https://salary.onekit.co.kr";

const SALARY_AMOUNTS: number[] = [];
for (let i = 2000; i <= 15000; i += 500) {
  SALARY_AMOUNTS.push(i);
}

const MIN_WAGE_2026 = 10320;

export function generateStaticParams() {
  return SALARY_AMOUNTS.map((amount) => ({
    amount: String(amount),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { amount: string };
}): Metadata {
  const amount = Number(params.amount);
  const formatted = amount.toLocaleString("ko-KR");

  return {
    title: `연봉 ${formatted}만원 실수령액 | 2026 세금 공제 상세`,
    description: `연봉 ${formatted}만원의 월 실수령액, 4대보험, 소득세 상세 분석. 2026년 기준 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세 공제 내역을 확인하세요.`,
    keywords: [
      `연봉 ${formatted}만원`,
      `연봉 ${formatted}만원 실수령액`,
      "연봉 실수령액",
      "4대보험 공제",
      "소득세 계산",
      "2026 연봉",
      "월급 실수령액",
    ],
    alternates: {
      canonical: `${SITE_URL}/salary/${amount}`,
    },
    openGraph: {
      title: `연봉 ${formatted}만원 실수령액 | 2026 세금 공제 상세`,
      description: `연봉 ${formatted}만원의 월 실수령액, 4대보험, 소득세 상세 분석. 2026년 기준.`,
      type: "article",
      url: `${SITE_URL}/salary/${amount}`,
      locale: "ko_KR",
      siteName: "연봉 실수령액 계산기",
    },
    twitter: {
      card: "summary_large_image",
      title: `연봉 ${formatted}만원 실수령액 2026`,
      description: `연봉 ${formatted}만원의 월 실수령액과 세금 공제 상세를 확인하세요.`,
    },
  };
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function formatManWon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0
      ? `${eok}억 ${rest.toLocaleString("ko-KR")}만`
      : `${eok}억`;
  }
  return `${manwon.toLocaleString("ko-KR")}만`;
}

export default function SalaryDetailPage({
  params,
}: {
  params: { amount: string };
}) {
  const amount = Number(params.amount);
  const annualSalary = amount * 10000;

  const result = calculateSalary({
    annualSalary,
    nonTaxableAmount: 100000,
    dependents: 1,
    childrenUnder20: 0,
  });

  const annualNetSalary = result.monthlyNetSalary * 12;
  const annualTotalDeduction = result.totalDeduction * 12;

  // 시급/일급 (209시간 기준: 주 40시간 + 주휴 8시간 = 48시간 * 365/7/12 = 약 209시간)
  const hourlyWage = Math.round(result.monthlyNetSalary / 209);
  const dailyWage = hourlyWage * 8;
  const minWageRatio = ((hourlyWage / MIN_WAGE_2026) * 100).toFixed(1);

  // 이전/다음 연봉
  const prevAmount = amount - 500;
  const nextAmount = amount + 500;
  const hasPrev = prevAmount >= 2000;
  const hasNext = nextAmount <= 15000;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `연봉 ${amount.toLocaleString("ko-KR")}만원 실수령액 분석`,
    description: `연봉 ${amount.toLocaleString("ko-KR")}만원의 월 실수령액은 ${formatCurrency(result.monthlyNetSalary)}원입니다. 2026년 기준 4대보험, 소득세 공제 상세 분석.`,
    author: {
      "@type": "Organization",
      name: "연봉계산기",
      url: SITE_URL,
    },
    datePublished: "2026-01-01",
    dateModified: "2026-01-01",
    mainEntityOfPage: `${SITE_URL}/salary/${amount}`,
  };

  return (
    <main className="min-h-screen bg-[var(--salary-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 상단 네비게이션 */}
      <nav className="flex h-16 items-center justify-between border-b border-[var(--salary-border)] bg-white px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--salary-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-primary)]">
              연봉계산기
            </span>
          </Link>
          <div className="hidden items-center gap-1.5 md:flex">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-[var(--salary-text)]">
              연봉 {formatManWon(amount)}원 분석
            </span>
          </div>
        </div>
        <Link
          href="/salary-table"
          className="flex items-center gap-1.5 rounded-lg border border-[var(--salary-border)] px-4 py-2 text-sm font-medium text-[var(--salary-text)] transition-colors hover:bg-slate-50"
        >
          <TableProperties className="h-4 w-4" />
          <span className="hidden sm:inline">실수령표</span>
        </Link>
      </nav>

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        {/* 뒤로가기 */}
        <Link
          href="/salary-table"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[var(--salary-primary)]"
        >
          <ChevronLeft className="h-4 w-4" />
          실수령표로 돌아가기
        </Link>

        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--salary-text)] md:text-3xl">
            연봉 {formatManWon(amount)}원 실수령액 분석
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            2026년 기준 | 비과세 월 10만원, 부양가족 1명(본인), 자녀 0명
          </p>
        </header>

        {/* 1. 핵심 요약 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-slate-500">
              월급 (세전)
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-text)]">
              {formatCurrency(result.monthlySalary)}
              <span className="text-sm font-normal text-slate-400">원</span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[var(--salary-primary)] bg-blue-50 p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-[var(--salary-primary)]">
              월 실수령액 (세후)
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-2xl font-bold text-[var(--salary-primary)]">
              {formatCurrency(result.monthlyNetSalary)}
              <span className="text-sm font-normal text-blue-400">원</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-slate-500">
              실수령률
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-success)]">
              {result.netRatio.toFixed(1)}
              <span className="text-sm font-normal text-green-400">%</span>
            </div>
          </div>
        </div>

        {/* 2. 공제 상세 테이블 */}
        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--salary-border)] px-5 py-4">
            <PieChart className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              공제 상세 내역
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--salary-border)] bg-slate-50">
                  <th className="px-5 py-3 text-left font-semibold text-[var(--salary-text)]">
                    공제 항목
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-[var(--salary-text)]">
                    월 공제액
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-[var(--salary-text)]">
                    연 공제액
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.deductions.map((d, idx) => (
                  <tr
                    key={d.label}
                    className={`border-b border-[var(--salary-border)] last:border-b-0 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <td className="px-5 py-2.5 text-[var(--salary-text)]">
                      {d.label}
                    </td>
                    <td className="px-5 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-500">
                      -{formatCurrency(d.amount)}원
                    </td>
                    <td className="px-5 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-400">
                      -{formatCurrency(d.amount * 12)}원
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--salary-border)] bg-red-50/50 font-semibold">
                  <td className="px-5 py-3 text-[var(--salary-text)]">
                    공제 합계
                  </td>
                  <td className="px-5 py-3 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-600">
                    -{formatCurrency(result.totalDeduction)}원
                  </td>
                  <td className="px-5 py-3 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-600">
                    -{formatCurrency(annualTotalDeduction)}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 3. 연간 비교 카드 */}
        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              연간 비교
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <div className="mb-1 text-xs text-slate-500">연봉 (세전)</div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(annualSalary)}원
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mb-1 text-xs text-[var(--salary-primary)]">
                연간 실수령액
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-primary)]">
                {formatCurrency(annualNetSalary)}원
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="mb-1 text-xs text-red-500">연간 공제액</div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-red-600">
                -{formatCurrency(annualTotalDeduction)}원
              </div>
            </div>
          </div>
        </div>

        {/* 4. 시급/일급 환산 */}
        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              시급 / 일급 환산
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                시급 (209시간 기준)
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(hourlyWage)}원
              </div>
            </div>
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                일급 (8시간 기준)
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(dailyWage)}원
              </div>
            </div>
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                2026 최저시급 대비
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-success)]">
                {minWageRatio}%
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                최저시급 {formatCurrency(MIN_WAGE_2026)}원
              </div>
            </div>
          </div>
        </div>

        {/* 5. 근처 연봉 네비게이션 */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {hasPrev ? (
            <Link
              href={`/salary/${prevAmount}`}
              className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--salary-border)] bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">이전 연봉</div>
                <div className="text-sm font-semibold text-[var(--salary-text)] truncate">
                  연봉 {formatManWon(prevAmount)}원
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {hasNext ? (
            <Link
              href={`/salary/${nextAmount}`}
              className="flex flex-1 items-center justify-end gap-2 rounded-xl border border-[var(--salary-border)] bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="min-w-0 text-right">
                <div className="text-[10px] text-slate-400">다음 연봉</div>
                <div className="text-sm font-semibold text-[var(--salary-text)] truncate">
                  연봉 {formatManWon(nextAmount)}원
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* 6. 하단 링크 */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/salary-table"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--salary-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--salary-text)] transition-colors hover:bg-slate-50 sm:w-auto"
          >
            <TableProperties className="h-4 w-4" />
            연봉 실수령표 전체 보기
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--salary-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
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
