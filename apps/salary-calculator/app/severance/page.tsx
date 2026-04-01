"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, Briefcase, Calendar, TrendingUp } from "lucide-react";
import NavBar from "../components/NavBar";
import InputField from "../components/InputField";
import BottomTabBar from "../components/BottomTabBar";
import Footer from "../components/Footer";
import {
  calculateSeverance,
  type SeveranceResult,
} from "../lib/severance";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

function parseNumber(value: string): number {
  const raw = value.replace(/,/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function getDefaultStartDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 3);
  return d.toISOString().split("T")[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function SeverancePage() {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [recentSalary, setRecentSalary] = useState("9,000,000");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [leaveAllowance, setLeaveAllowance] = useState("0");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  const formatWorkingPeriod = useCallback((days: number): string => {
    const years = Math.floor(days / 365);
    const remainDays = days % 365;
    const months = Math.floor(remainDays / 30);
    const d = remainDays % 30;

    const parts: string[] = [];
    if (years > 0) parts.push(t("workingPeriod.years", { n: years }));
    if (months > 0) parts.push(t("workingPeriod.months", { n: months }));
    if (d > 0) parts.push(t("workingPeriod.days", { n: d }));
    return parts.length > 0 ? parts.join(" ") : t("workingPeriod.zeroDays");
  }, [t]);

  const validate = useCallback((): string | null => {
    if (!startDate) return t("severanceValidation.enterStartDate");
    if (!endDate) return t("severanceValidation.enterEndDate");
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return t("severanceValidation.endAfterStart");
    const diffDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 365)
      return t("severanceValidation.minOneYear");
    const salary = parseNumber(recentSalary);
    if (salary <= 0) return t("severanceValidation.enterRecentSalary");
    return null;
  }, [startDate, endDate, recentSalary, t]);

  const compute = useCallback(() => {
    const msg = validate();
    setValidationMsg(msg);
    if (msg) {
      setResult(null);
      return;
    }

    const res = calculateSeverance({
      startDate,
      endDate,
      recentThreeMonthSalary: parseNumber(recentSalary),
      annualBonus: parseNumber(annualBonus),
      annualLeaveAllowance: parseNumber(leaveAllowance),
    });
    setResult(res);
  }, [startDate, endDate, recentSalary, annualBonus, leaveAllowance, validate]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      compute();
    }, 200);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [compute]);

  useEffect(() => {
    document.title = t("severance.title") + " 2026";
  }, [t]);

  const handleCalculate = () => {
    compute();
    if (!validate() && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "퇴직금 계산기 2026",
    url: "https://salary.onekit.co.kr/severance",
    description:
      "2026년 기준 퇴직금과 퇴직소득세를 자동으로 계산하는 무료 온라인 도구입니다. 근속기간, 평균임금 기반으로 퇴직금 실수령액을 계산합니다.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    featureList: [
      "퇴직금 계산",
      "퇴직소득세 계산",
      "근속연수공제 계산",
      "환산급여 계산",
      "실수령액 계산",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };

  return (
    <main className="min-h-screen bg-[var(--salary-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd),
        }}
      />
      <NavBar />

      <div className="flex h-14 items-center justify-between border-b border-[var(--salary-border)] bg-white px-4 md:hidden">
        <button
          onClick={handleBackClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
          aria-label={t("common.backToTop")}
        >
          <ChevronLeft className="h-5 w-5 text-[var(--salary-text)]" />
        </button>
        <span className="font-[family-name:var(--font-space-grotesk-var)] text-base font-bold text-[var(--salary-primary)]">
          {t("severance.mobileTitle")}
        </span>
        <LanguageSwitcher />
      </div>

      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        <section
          className="w-full shrink-0 border-b border-[var(--salary-border)] bg-white p-6 md:w-[480px] md:border-b-0 md:border-r md:p-8"
          aria-label={t("severance.inputSection")}
        >
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-[var(--salary-text)]">
              {t("severance.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("severance.desc")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--salary-text)]">
                {t("severance.startDate")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--salary-border)] bg-white px-3 text-sm text-[var(--salary-text)] outline-none transition-colors focus:border-[var(--salary-primary)] focus:ring-1 focus:ring-[var(--salary-primary)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--salary-text)]">
                {t("severance.endDate")}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--salary-border)] bg-white px-3 text-sm text-[var(--salary-text)] outline-none transition-colors focus:border-[var(--salary-primary)] focus:ring-1 focus:ring-[var(--salary-primary)]"
              />
            </div>

            <InputField
              label={t("severance.recentSalary")}
              value={recentSalary}
              placeholder="9,000,000"
              onChange={setRecentSalary}
            />

            <InputField
              label={t("severance.annualBonus")}
              value={annualBonus}
              placeholder="0"
              onChange={setAnnualBonus}
            />

            <InputField
              label={t("severance.leaveAllowance")}
              value={leaveAllowance}
              placeholder="0"
              onChange={setLeaveAllowance}
            />
          </div>

          {validationMsg && (
            <p className="mt-3 text-sm text-red-500">{validationMsg}</p>
          )}

          <button
            onClick={handleCalculate}
            className="mt-6 h-12 w-full rounded-lg bg-[var(--salary-primary)] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t("severance.calculateBtn")}
          </button>

          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-xs leading-relaxed text-blue-700">
              <strong>{t("severance.salaryHintLabel")}</strong>
              {" "}{t("severance.salaryHint")}
            </p>
          </div>
        </section>

        <section
          ref={resultRef}
          className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8"
          aria-label={t("severance.resultSection")}
        >
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            <div className="rounded-xl bg-[var(--salary-primary)] p-6">
              <div className="flex items-start justify-between">
                <p className="text-sm text-white/80">{t("severance.netSeverancePay")}</p>
                <Briefcase className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-2 font-[family-name:var(--font-space-grotesk-var)] text-[32px] font-bold leading-tight text-white md:text-[40px]">
                {result ? formatCurrency(result.netSeverancePay) : "0"}
                <span className="ml-1 text-lg font-normal text-white/80">
                  {t("common.won")}
                </span>
              </p>
              {result && result.severancePay > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-white/70">
                    {t("severance.grossSeverancePay", { amount: formatCurrency(result.severancePay) })}
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                    {t("severance.taxRate", {
                      rate: result.severancePay > 0
                        ? ((result.totalTax / result.severancePay) * 100).toFixed(1)
                        : "0",
                    })}
                  </span>
                </div>
              )}
            </div>

            {result && result.workingDays > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--salary-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                    {t("severance.workingPeriod")}
                  </h3>
                </div>
                <p className="mt-3 font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-text)]">
                  {formatWorkingPeriod(result.workingDays)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("severance.totalDays", {
                    days: formatCurrency(result.workingDays),
                    years: result.workingYears,
                  })}
                </p>
              </div>
            )}

            {result && result.severancePay > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--salary-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                    {t("severance.calculationDetail")}
                  </h3>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      {t("severance.dailyAvgWage")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(result.dailyAvgWage)}{t("common.won")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      {t("severance.severanceTotal")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(result.severancePay)}{t("common.won")}
                    </span>
                  </div>
                  <div className="border-t border-[var(--salary-border)] pt-3">
                    <p className="mb-2 text-xs font-medium text-slate-400">
                      {t("severance.severanceTaxCalc")}
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          {t("severance.servicePeriodDeduction")}
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.servicePeriodDeduction)}{t("common.won")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          {t("severance.convertedSalary")}
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedSalary)}{t("common.won")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          {t("severance.convertedSalaryDeduction")}
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedSalaryDeduction)}{t("common.won")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          {t("severance.taxBase")}
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.taxBase)}{t("common.won")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          {t("severance.convertedTax")}
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedTax)}{t("common.won")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && result.severancePay > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                  {t("severance.taxDeductionDetail")}
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      {t("severance.severanceTax")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-red-500">
                      -{formatCurrency(result.severanceTax)}{t("common.won")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      {t("severance.localTax")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-red-500">
                      -{formatCurrency(result.localTax)}{t("common.won")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-[var(--salary-border)] pt-3">
                    <span className="text-[13px] font-semibold text-[var(--salary-text)]">
                      {t("severance.totalTaxDeduction")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-bold text-red-500">
                      -{formatCurrency(result.totalTax)}{t("common.won")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[var(--salary-primary)]">
                      {t("severance.netAmount")}
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-bold text-[var(--salary-primary)]">
                      {formatCurrency(result.netSeverancePay)}{t("common.won")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              {t("severance.disclaimer")}
            </p>
          </div>
        </section>
      </div>

      <Footer />
      <BottomTabBar />
    </main>
  );
}
