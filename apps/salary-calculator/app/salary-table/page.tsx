import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowLeft, TableProperties } from "lucide-react";
import { calculateSalary } from "../lib/salary";

export const metadata: Metadata = {
  title: "연봉 실수령액 표 2025 | 1000만원~1억원 실수령액 총정리",
  description:
    "2025년 기준 연봉 1000만원부터 1억원까지 100만원 단위 실수령액 표입니다. 4대보험, 소득세 공제 후 실제 수령액을 한눈에 확인하세요.",
  openGraph: {
    title: "연봉 실수령액 표 2025",
    description: "연봉별 월 실수령액을 한눈에 비교",
    type: "website",
  },
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
    <div className="min-h-screen bg-[var(--salary-bg)]">
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

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--salary-text)] md:text-3xl">
            2025 연봉 실수령액 표
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
            연봉 1,000만원부터 1억원까지 100만원 단위로 월 실수령액을 계산한
            표입니다. 비과세 월 10만원, 부양가족 1명(본인), 자녀 0명 기준입니다.
          </p>
        </div>

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
                      {formatManWon(row.annualSalary)}원
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

        <div className="mt-8 rounded-xl border border-[var(--salary-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-[var(--salary-text)]">
            계산 기준 안내
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                국민연금:
              </span>{" "}
              월 소득의 4.5% (상한 월 265,500원)
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                건강보험:
              </span>{" "}
              월 소득의 3.545%
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                장기요양보험:
              </span>{" "}
              건강보험료의 12.81%
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
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--salary-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Calculator className="h-4 w-4" />
            내 연봉으로 직접 계산하기
          </Link>
        </div>
      </div>
    </div>
  );
}
