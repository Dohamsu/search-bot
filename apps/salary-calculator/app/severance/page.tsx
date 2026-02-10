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

function parseNumber(value: string): number {
  const raw = value.replace(/,/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

function formatWorkingPeriod(days: number): string {
  const years = Math.floor(days / 365);
  const remainDays = days % 365;
  const months = Math.floor(remainDays / 30);
  const d = remainDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}년`);
  if (months > 0) parts.push(`${months}개월`);
  if (d > 0) parts.push(`${d}일`);
  return parts.length > 0 ? parts.join(" ") : "0일";
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
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [recentSalary, setRecentSalary] = useState("9,000,000");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [leaveAllowance, setLeaveAllowance] = useState("0");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  const validate = useCallback((): string | null => {
    if (!startDate) return "입사일을 입력해 주세요";
    if (!endDate) return "퇴사일을 입력해 주세요";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return "퇴사일은 입사일 이후여야 합니다";
    const diffDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 365)
      return "퇴직금은 1년 이상 근무한 경우에 발생합니다";
    const salary = parseNumber(recentSalary);
    if (salary <= 0) return "최근 3개월 급여 총액을 입력해 주세요";
    return null;
  }, [startDate, endDate, recentSalary]);

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
    document.title =
      "퇴직금 계산기 2026 | 퇴직소득세 자동 계산 - 연봉계산기";
  }, []);

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
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://salary.example.com"}/severance`,
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
          aria-label="맨 위로 이동"
        >
          <ChevronLeft className="h-5 w-5 text-[var(--salary-text)]" />
        </button>
        <span className="font-[family-name:var(--font-space-grotesk-var)] text-base font-bold text-[var(--salary-primary)]">
          퇴직금계산기
        </span>
        <div className="h-9 w-9" />
      </div>

      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        {/* 입력 패널 */}
        <section
          className="w-full shrink-0 border-b border-[var(--salary-border)] bg-white p-6 md:w-[480px] md:border-b-0 md:border-r md:p-8"
          aria-label="퇴직금 정보 입력"
        >
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-[var(--salary-text)]">
              퇴직금 계산
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              근무 정보를 입력하면 퇴직금 실수령액을 계산해 드립니다
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* 입사일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--salary-text)]">
                입사일
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--salary-border)] bg-white px-3 text-sm text-[var(--salary-text)] outline-none transition-colors focus:border-[var(--salary-primary)] focus:ring-1 focus:ring-[var(--salary-primary)]"
              />
            </div>

            {/* 퇴사일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--salary-text)]">
                퇴사일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--salary-border)] bg-white px-3 text-sm text-[var(--salary-text)] outline-none transition-colors focus:border-[var(--salary-primary)] focus:ring-1 focus:ring-[var(--salary-primary)]"
              />
            </div>

            {/* 최근 3개월 급여 총액 */}
            <InputField
              label="최근 3개월 급여 총액 (원)"
              value={recentSalary}
              placeholder="9,000,000"
              onChange={setRecentSalary}
            />

            {/* 연간 상여금 */}
            <InputField
              label="연간 상여금 (원)"
              value={annualBonus}
              placeholder="0"
              onChange={setAnnualBonus}
            />

            {/* 연차수당 */}
            <InputField
              label="연차수당 (원)"
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
            퇴직금 계산하기
          </button>

          {/* 안내 */}
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-xs leading-relaxed text-blue-700">
              <strong>최근 3개월 급여 총액</strong>은 퇴직 전 3개월간 받은
              기본급 + 각종 수당의 합계입니다. 월급이 300만원이라면 약
              900만원을 입력하세요.
            </p>
          </div>
        </section>

        {/* 결과 패널 */}
        <section
          ref={resultRef}
          className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8"
          aria-label="퇴직금 계산 결과"
        >
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            {/* 히어로 카드: 퇴직금 실수령액 */}
            <div className="rounded-xl bg-[var(--salary-primary)] p-6">
              <div className="flex items-start justify-between">
                <p className="text-sm text-white/80">퇴직금 실수령액</p>
                <Briefcase className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-2 font-[family-name:var(--font-space-grotesk-var)] text-[32px] font-bold leading-tight text-white md:text-[40px]">
                {result ? formatCurrency(result.netSeverancePay) : "0"}
                <span className="ml-1 text-lg font-normal text-white/80">
                  원
                </span>
              </p>
              {result && result.severancePay > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-white/70">
                    퇴직금 총액{" "}
                    {formatCurrency(result.severancePay)}원
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                    세금{" "}
                    {result.severancePay > 0
                      ? (
                          (result.totalTax / result.severancePay) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
              )}
            </div>

            {/* 근속기간 카드 */}
            {result && result.workingDays > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--salary-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                    근속기간
                  </h3>
                </div>
                <p className="mt-3 font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-text)]">
                  {formatWorkingPeriod(result.workingDays)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  총 {formatCurrency(result.workingDays)}일 (근속연수{" "}
                  {result.workingYears}년)
                </p>
              </div>
            )}

            {/* 퇴직금 상세 */}
            {result && result.severancePay > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--salary-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                    퇴직금 산정 내역
                  </h3>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      1일 평균임금
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(result.dailyAvgWage)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      퇴직금 총액
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(result.severancePay)}원
                    </span>
                  </div>
                  <div className="border-t border-[var(--salary-border)] pt-3">
                    <p className="mb-2 text-xs font-medium text-slate-400">
                      퇴직소득세 계산
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          근속연수공제
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.servicePeriodDeduction)}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          환산급여
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedSalary)}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          환산급여공제
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedSalaryDeduction)}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          과세표준
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.taxBase)}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                          환산산출세액
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-500">
                          {formatCurrency(result.convertedTax)}원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 공제 상세 카드 */}
            {result && result.severancePay > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                  세금 공제 내역
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      퇴직소득세
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-red-500">
                      -{formatCurrency(result.severanceTax)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">
                      지방소득세
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-red-500">
                      -{formatCurrency(result.localTax)}원
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-[var(--salary-border)] pt-3">
                    <span className="text-[13px] font-semibold text-[var(--salary-text)]">
                      총 공제액
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-bold text-red-500">
                      -{formatCurrency(result.totalTax)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[var(--salary-primary)]">
                      실수령액
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-bold text-[var(--salary-primary)]">
                      {formatCurrency(result.netSeverancePay)}원
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              본 계산 결과는 2026년 퇴직소득세 기준 참고용이며, 법적 효력이
              없습니다. 실제 퇴직금은 회사의 퇴직급여 규정, 퇴직연금 가입
              여부 등에 따라 달라질 수 있으므로, 정확한 계산은 회사 인사부서
              또는 세무 전문가에게 문의하시기 바랍니다.
            </p>
          </div>
        </section>
      </div>

      <Footer />
      <BottomTabBar />
    </main>
  );
}
