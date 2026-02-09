"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ArrowRightLeft } from "lucide-react";
import NavBar from "./components/NavBar";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import BreakdownCard from "./components/BreakdownCard";
import BottomTabBar from "./components/BottomTabBar";
import CrossLinks from "./components/CrossLinks";
import { calculateSalary, type SalaryResult } from "./lib/salary";

function parseNumber(value: string): number {
  const raw = value.replace(/,/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

type CalcMode = "normal" | "reverse";

const STANDARD_MONTHLY_HOURS = 209;
const MINIMUM_HOURLY_WAGE_2025 = 10_030;

function findAnnualSalaryForNetPay(
  targetMonthlyNet: number,
  nonTaxableAmount: number,
  dependents: number,
  childrenUnder20: number
): { annualSalary: number; result: SalaryResult } {
  let low = targetMonthlyNet * 12;
  let high = targetMonthlyNet * 12 * 2;

  let checkHigh = calculateSalary({
    annualSalary: high,
    nonTaxableAmount,
    dependents,
    childrenUnder20,
  });
  while (checkHigh.monthlyNetSalary < targetMonthlyNet) {
    high *= 2;
    checkHigh = calculateSalary({
      annualSalary: high,
      nonTaxableAmount,
      dependents,
      childrenUnder20,
    });
  }

  let bestResult = checkHigh;
  let bestSalary = high;

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const res = calculateSalary({
      annualSalary: mid,
      nonTaxableAmount,
      dependents,
      childrenUnder20,
    });

    if (
      Math.abs(res.monthlyNetSalary - targetMonthlyNet) <
      Math.abs(bestResult.monthlyNetSalary - targetMonthlyNet)
    ) {
      bestResult = res;
      bestSalary = mid;
    }

    if (res.monthlyNetSalary < targetMonthlyNet) {
      low = mid + 1;
    } else if (res.monthlyNetSalary > targetMonthlyNet) {
      high = mid - 1;
    } else {
      break;
    }
  }

  return { annualSalary: bestSalary, result: bestResult };
}

export default function Home() {
  const [mode, setMode] = useState<CalcMode>("normal");
  const [annualSalary, setAnnualSalary] = useState("50,000,000");
  const [desiredMonthlyNet, setDesiredMonthlyNet] = useState("3,000,000");
  const [nonTaxable, setNonTaxable] = useState("100,000");
  const [dependents, setDependents] = useState("1");
  const [children, setChildren] = useState("0");
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [reverseAnnual, setReverseAnnual] = useState<number | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const validate = useCallback((): string | null => {
    if (mode === "normal") {
      const salary = parseNumber(annualSalary);
      if (salary <= 0) return "연봉을 입력해 주세요";
      if (salary < 1_000_000) return "연봉은 100만원 이상이어야 합니다";
      if (salary > 10_000_000_000) return "연봉이 너무 큽니다";
    } else {
      const desired = parseNumber(desiredMonthlyNet);
      if (desired <= 0) return "희망 월 실수령액을 입력해 주세요";
      if (desired < 100_000) return "월 실수령액은 10만원 이상이어야 합니다";
      if (desired > 100_000_000) return "월 실수령액이 너무 큽니다";
    }
    const nonTax = parseNumber(nonTaxable);
    if (nonTax < 0) return "비과세액은 0 이상이어야 합니다";
    const deps = parseNumber(dependents);
    if (deps < 1) return "부양가족 수는 본인 포함 1명 이상이어야 합니다";
    const child = parseNumber(children);
    if (child < 0) return "자녀 수는 0 이상이어야 합니다";
    return null;
  }, [mode, annualSalary, desiredMonthlyNet, nonTaxable, dependents, children]);

  const compute = useCallback(() => {
    const msg = validate();
    setValidationMsg(msg);
    if (msg) return;

    if (mode === "normal") {
      const salary = parseNumber(annualSalary);
      const nonTax = parseNumber(nonTaxable);
      if (nonTax > salary / 12) {
        setValidationMsg("비과세액이 월 급여보다 큽니다");
        return;
      }
      const res = calculateSalary({
        annualSalary: salary,
        nonTaxableAmount: nonTax,
        dependents: parseNumber(dependents) || 1,
        childrenUnder20: parseNumber(children),
      });
      setResult(res);
      setReverseAnnual(null);
    } else {
      const desired = parseNumber(desiredMonthlyNet);
      const { annualSalary: foundSalary, result: res } =
        findAnnualSalaryForNetPay(
          desired,
          parseNumber(nonTaxable),
          parseNumber(dependents) || 1,
          parseNumber(children)
        );
      setResult(res);
      setReverseAnnual(foundSalary);
    }
  }, [mode, annualSalary, desiredMonthlyNet, nonTaxable, dependents, children, validate]);

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

  const handleCalculate = () => {
    compute();
    if (!validate() && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayResult = result ?? {
    monthlySalary: 0,
    monthlyNetSalary: 0,
    totalDeduction: 0,
    netRatio: 0,
    deductions: [
      { label: "국민연금", amount: 0 },
      { label: "건강보험", amount: 0 },
      { label: "장기요양보험", amount: 0 },
      { label: "고용보험", amount: 0 },
      { label: "소득세", amount: 0 },
      { label: "지방소득세", amount: 0 },
    ],
  };

  const currentAnnualSalary =
    mode === "reverse" && reverseAnnual
      ? reverseAnnual
      : parseNumber(annualSalary);

  const hourlyRate = Math.round(currentAnnualSalary / 12 / STANDARD_MONTHLY_HOURS);
  const dailyRate = Math.round(hourlyRate * 8);

  return (
    <div className="min-h-screen bg-[var(--salary-bg)]">
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
          연봉계산기
        </span>
        <div className="h-9 w-9" />
      </div>

      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        <div className="w-full shrink-0 border-b border-[var(--salary-border)] bg-white p-6 md:w-[480px] md:border-b-0 md:border-r md:p-8">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-[var(--salary-text)]">
              {mode === "normal" ? "연봉 실수령액 계산" : "월급 → 연봉 역산"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "normal"
                ? "연봉 정보를 입력하면 월 실수령액을 계산해 드립니다"
                : "원하는 월 실수령액을 입력하면 필요한 연봉을 계산해 드립니다"}
            </p>
          </div>

          <div className="mb-5 flex rounded-lg border border-[var(--salary-border)] bg-slate-50 p-1">
            <button
              onClick={() => setMode("normal")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "normal"
                  ? "bg-white text-[var(--salary-primary)] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              연봉 → 실수령
            </button>
            <button
              onClick={() => setMode("reverse")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "reverse"
                  ? "bg-white text-[var(--salary-primary)] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              월급 → 연봉
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {mode === "normal" ? (
              <InputField
                label="연봉 (원)"
                value={annualSalary}
                placeholder="50,000,000"
                onChange={setAnnualSalary}
              />
            ) : (
              <InputField
                label="희망 세후 월 실수령액 (원)"
                value={desiredMonthlyNet}
                placeholder="3,000,000"
                onChange={setDesiredMonthlyNet}
              />
            )}
            <InputField
              label="비과세액 (원)"
              value={nonTaxable}
              placeholder="100,000"
              onChange={setNonTaxable}
            />
            <InputField
              label="부양가족 수 (본인 포함)"
              value={dependents}
              placeholder="1"
              onChange={setDependents}
            />
            <InputField
              label="20세 이하 자녀 수"
              value={children}
              placeholder="0"
              onChange={setChildren}
            />
          </div>

          {validationMsg && (
            <p className="mt-3 text-sm text-red-500">{validationMsg}</p>
          )}

          <button
            onClick={handleCalculate}
            className="mt-6 h-12 w-full rounded-lg bg-[var(--salary-primary)] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {mode === "normal" ? "계산하기" : "역산하기"}
          </button>
        </div>

        <div ref={resultRef} className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            {mode === "reverse" && reverseAnnual && (
              <div className="rounded-xl border border-[var(--salary-primary)]/20 bg-blue-50 p-5">
                <p className="text-sm font-medium text-[var(--salary-primary)]">
                  필요 연봉
                </p>
                <p className="mt-1 font-[family-name:var(--font-space-grotesk-var)] text-2xl font-bold text-[var(--salary-text)]">
                  {formatCurrency(reverseAnnual)}
                  <span className="ml-1 text-sm font-normal text-slate-500">원</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  희망 월 실수령액 {formatCurrency(parseNumber(desiredMonthlyNet))}원
                  기준
                </p>
              </div>
            )}
            <ResultCard
              monthlyNetSalary={displayResult.monthlyNetSalary}
              netRatio={displayResult.netRatio}
              monthlySalary={displayResult.monthlySalary}
              annualSalary={currentAnnualSalary}
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />
            <BreakdownCard
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />

            {currentAnnualSalary > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                  시급 / 일급 환산
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">시급 (209시간 기준)</span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(hourlyRate)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">일급 (8시간 기준)</span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(dailyRate)}원
                    </span>
                  </div>
                  <div className="mt-1 border-t border-[var(--salary-border)] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500">
                        2025 최저시급
                      </span>
                      <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-400">
                        {formatCurrency(MINIMUM_HOURLY_WAGE_2025)}원
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] text-slate-500">
                        최저시급 대비
                      </span>
                      <span
                        className={`font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium ${
                          hourlyRate >= MINIMUM_HOURLY_WAGE_2025
                            ? "text-[var(--salary-success)]"
                            : "text-red-500"
                        }`}
                      >
                        {(hourlyRate / MINIMUM_HOURLY_WAGE_2025 * 100).toFixed(0)}%
                        {hourlyRate >= MINIMUM_HOURLY_WAGE_2025 ? " (충족)" : " (미달)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <CrossLinks />
      </div>

      <BottomTabBar />
    </div>
  );
}
