"use client";

import Link from "next/link";
import { Calculator, ArrowLeft, TableProperties } from "lucide-react";
import { calculateSalary } from "../lib/salary";
import Footer from "../components/Footer";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function formatManWon(amount: number, locale: string): string {
  if (locale === "en") {
    const million = amount / 10000;
    if (million >= 10000) {
      const billion = (million / 10000).toFixed(0);
      const rest = million % 10000;
      return rest > 0 ? `${billion}B ${rest.toLocaleString("en")}M` : `${billion}B`;
    }
    return `${(amount / 10000).toLocaleString("en")}M`;
  }
  const man = amount / 10000;
  if (man >= 10000) {
    const eok = Math.floor(man / 10000);
    const rest = man % 10000;
    return rest > 0 ? `${eok}\uc5b5 ${rest.toLocaleString("ko-KR")}\ub9cc` : `${eok}\uc5b5`;
  }
  return `${man.toLocaleString("ko-KR")}\ub9cc`;
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
  const { t, locale } = useTranslation();

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
            <TableProperties className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-[var(--salary-text)]">
              {t("salaryTable.navLabel")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--salary-border)] px-4 py-2 text-sm font-medium text-[var(--salary-text)] transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToCalculator")}
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-4 py-8 md:px-8" aria-label={t("salaryTable.sectionLabel")}>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--salary-text)] md:text-3xl">
            {t("salaryTable.pageTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
            {t("salaryTable.pageDesc")}
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-[var(--salary-border)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--salary-border)] bg-slate-50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-[var(--salary-text)] md:px-6">
                  {t("salaryTable.thAnnualSalary")}
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-text)] md:px-6">
                  {t("salaryTable.thMonthlySalary")}
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-red-500 md:px-6">
                  {t("salaryTable.thTotalDeduction")}
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-primary)] md:px-6">
                  {t("salaryTable.thNetSalary")}
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[var(--salary-text)] md:px-6">
                  {t("salaryTable.thNetRatio")}
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
                          {formatManWon(row.annualSalary, locale)}{t("common.won")}
                        </Link>
                      ) : (
                        <>{formatManWon(row.annualSalary, locale)}{t("common.won")}</>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-[var(--salary-text)] md:px-6">
                      {formatCurrency(row.monthlySalary)}{t("common.won")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] text-red-500 md:px-6">
                      -{formatCurrency(row.totalDeduction)}{t("common.won")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-[family-name:var(--font-space-grotesk-var)] font-semibold text-[var(--salary-primary)] md:px-6">
                      {formatCurrency(row.monthlyNetSalary)}{t("common.won")}
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

        <aside className="mt-8 rounded-xl border border-[var(--salary-border)] bg-white p-6" aria-label={t("salaryTable.calcGuideTitle")}>
          <h2 className="text-lg font-bold text-[var(--salary-text)]">
            {t("salaryTable.calcGuideTitle")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.nationalPension")}:
              </span>{" "}
              {t("salaryTable.guideNPS")}
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.healthInsurance")}:
              </span>{" "}
              {t("salaryTable.guideHealth")}
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.longTermCare")}:
              </span>{" "}
              {t("salaryTable.guideLongTerm")}
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.employmentInsurance")}:
              </span>{" "}
              {t("salaryTable.guideEmployment")}
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.incomeTax")}:
              </span>{" "}
              {t("salaryTable.guideIncomeTax")}
            </li>
            <li>
              <span className="font-medium text-[var(--salary-text)]">
                {t("deductions.localIncomeTax")}:
              </span>{" "}
              {t("salaryTable.guideLocalTax")}
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            {t("salaryTable.guideNote")}
          </p>
        </aside>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--salary-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Calculator className="h-4 w-4" />
            {t("salaryTable.calcMyOwn")}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
