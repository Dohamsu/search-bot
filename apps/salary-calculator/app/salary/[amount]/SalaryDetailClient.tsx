"use client";

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
import type { SalaryResult, DeductionItem } from "../../lib/salary";
import Footer from "../../components/Footer";
import { useTranslation } from "../../i18n";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import RelatedTools from "../../components/RelatedTools";

interface SalaryDetailClientProps {
  amount: number;
  result: SalaryResult;
}

const MIN_WAGE_2026 = 10320;

const DEDUCTION_LABEL_MAP: Record<string, string> = {
  "국민연금": "deductions.nationalPension",
  "건강보험": "deductions.healthInsurance",
  "장기요양보험": "deductions.longTermCare",
  "고용보험": "deductions.employmentInsurance",
  "소득세": "deductions.incomeTax",
  "지방소득세": "deductions.localIncomeTax",
};

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function formatManWon(manwon: number, locale: string): string {
  if (locale === "en") {
    return `${manwon.toLocaleString("en")}M`;
  }
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0
      ? `${eok}억 ${rest.toLocaleString("ko-KR")}만`
      : `${eok}억`;
  }
  return `${manwon.toLocaleString("ko-KR")}만`;
}

function translateDeductions(deductions: DeductionItem[], t: (key: string) => string): DeductionItem[] {
  return deductions.map((d) => ({
    ...d,
    label: DEDUCTION_LABEL_MAP[d.label] ? t(DEDUCTION_LABEL_MAP[d.label]) : d.label,
  }));
}

export default function SalaryDetailClient({ amount, result }: SalaryDetailClientProps) {
  const { t, locale } = useTranslation();
  const annualSalary = amount * 10000;
  const translatedDeductions = translateDeductions(result.deductions, t);
  const annualNetSalary = result.monthlyNetSalary * 12;
  const annualTotalDeduction = result.totalDeduction * 12;
  const hourlyWage = Math.round(result.monthlyNetSalary / 209);
  const dailyWage = hourlyWage * 8;
  const minWageRatio = ((hourlyWage / MIN_WAGE_2026) * 100).toFixed(1);

  // Navigation: 100만원 increments
  const prevAmount = amount - 100;
  const nextAmount = amount + 100;
  const hasPrev = prevAmount >= 2000;
  const hasNext = nextAmount <= 15000;

  return (
    <main className="min-h-screen bg-[var(--salary-bg)]">
      <nav className="flex h-16 items-center justify-between border-b border-[var(--salary-border)] bg-white px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--salary-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-primary)]">
              {t("common.siteName")}
            </span>
          </Link>
          <div className="hidden items-center gap-1.5 md:flex">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-[var(--salary-text)]">
              {t("salaryDetail.analysis", { amount: formatManWon(amount, locale) })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/salary-table"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--salary-border)] px-4 py-2 text-sm font-medium text-[var(--salary-text)] transition-colors hover:bg-slate-50"
          >
            <TableProperties className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.salaryTable")}</span>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <Link
          href="/salary-table"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[var(--salary-primary)]"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("common.backToTable")}
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--salary-text)] md:text-3xl">
            {t("salaryDetail.analysis", { amount: formatManWon(amount, locale) })}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("salaryDetail.basis")}
          </p>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-slate-500">
              {t("salaryDetail.monthlyPreTax")}
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-text)]">
              {formatCurrency(result.monthlySalary)}
              <span className="text-sm font-normal text-slate-400">{t("common.won")}</span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[var(--salary-primary)] bg-blue-50 p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-[var(--salary-primary)]">
              {t("salaryDetail.monthlyAfterTax")}
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-2xl font-bold text-[var(--salary-primary)]">
              {formatCurrency(result.monthlyNetSalary)}
              <span className="text-sm font-normal text-blue-400">{t("common.won")}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs font-medium text-slate-500">
              {t("salaryDetail.netRatioLabel")}
            </div>
            <div className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-success)]">
              {result.netRatio.toFixed(1)}
              <span className="text-sm font-normal text-green-400">%</span>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--salary-border)] px-5 py-4">
            <PieChart className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              {t("salaryDetail.deductionDetail")}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--salary-border)] bg-slate-50">
                  <th className="px-5 py-3 text-left font-semibold text-[var(--salary-text)]">
                    {t("salaryDetail.deductionItem")}
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-[var(--salary-text)]">
                    {t("salaryDetail.monthlyDeduction")}
                  </th>
                  <th className="px-5 py-3 text-right font-semibold text-[var(--salary-text)]">
                    {t("salaryDetail.annualDeduction")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {translatedDeductions.map((d, idx) => (
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
                      -{formatCurrency(d.amount)}{t("common.won")}
                    </td>
                    <td className="px-5 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-400">
                      -{formatCurrency(d.amount * 12)}{t("common.won")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--salary-border)] bg-red-50/50 font-semibold">
                  <td className="px-5 py-3 text-[var(--salary-text)]">
                    {t("salaryDetail.deductionTotal")}
                  </td>
                  <td className="px-5 py-3 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-600">
                    -{formatCurrency(result.totalDeduction)}{t("common.won")}
                  </td>
                  <td className="px-5 py-3 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-600">
                    -{formatCurrency(annualTotalDeduction)}{t("common.won")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              {t("salaryDetail.annualComparison")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <div className="mb-1 text-xs text-slate-500">{t("salaryDetail.annualPreTax")}</div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(annualSalary)}{t("common.won")}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mb-1 text-xs text-[var(--salary-primary)]">
                {t("salaryDetail.annualNetSalary")}
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-primary)]">
                {formatCurrency(annualNetSalary)}{t("common.won")}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="mb-1 text-xs text-red-500">{t("salaryDetail.annualTotalDeduction")}</div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-red-600">
                -{formatCurrency(annualTotalDeduction)}{t("common.won")}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--salary-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[var(--salary-primary)]" />
            <h2 className="text-base font-bold text-[var(--salary-text)]">
              {t("salaryDetail.hourlyDailyTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                {t("salaryDetail.hourlyRate")}
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(hourlyWage)}{t("common.won")}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                {t("salaryDetail.dailyRate")}
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-text)]">
                {formatCurrency(dailyWage)}{t("common.won")}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--salary-border)] p-4">
              <div className="mb-1 text-xs text-slate-500">
                {t("salaryDetail.vsMinWage2026")}
              </div>
              <div className="font-[family-name:var(--font-space-grotesk-var)] text-lg font-bold text-[var(--salary-success)]">
                {minWageRatio}%
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                {t("salaryDetail.minWage", { amount: formatCurrency(MIN_WAGE_2026) })}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          {hasPrev ? (
            <Link
              href={`/salary/${prevAmount}`}
              className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--salary-border)] bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">{t("salaryDetail.prevSalary")}</div>
                <div className="text-sm font-semibold text-[var(--salary-text)] truncate">
                  {t("salaryDetail.salaryAmount", { amount: formatManWon(prevAmount, locale) })}
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
                <div className="text-[10px] text-slate-400">{t("salaryDetail.nextSalary")}</div>
                <div className="text-sm font-semibold text-[var(--salary-text)] truncate">
                  {t("salaryDetail.salaryAmount", { amount: formatManWon(nextAmount, locale) })}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/salary-table"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--salary-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--salary-text)] transition-colors hover:bg-slate-50 sm:w-auto"
          >
            <TableProperties className="h-4 w-4" />
            {t("salaryDetail.viewFullTable")}
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--salary-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            <Calculator className="h-4 w-4" />
            {t("salaryDetail.calcMyOwn")}
          </Link>
        </div>
      </section>

      <RelatedTools currentToolId="salary" />
      <Footer />
    </main>
  );
}
