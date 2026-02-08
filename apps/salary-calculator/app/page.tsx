"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import NavBar from "./components/NavBar";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import BreakdownCard from "./components/BreakdownCard";
import BottomTabBar from "./components/BottomTabBar";
import { calculateSalary, type SalaryResult } from "./lib/salary";

function parseNumber(value: string): number {
  const raw = value.replace(/,/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

export default function Home() {
  const [annualSalary, setAnnualSalary] = useState("50,000,000");
  const [nonTaxable, setNonTaxable] = useState("100,000");
  const [dependents, setDependents] = useState("1");
  const [children, setChildren] = useState("0");
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const validate = useCallback((): string | null => {
    const salary = parseNumber(annualSalary);
    if (salary <= 0) return "연봉을 입력해 주세요";
    if (salary < 1_000_000) return "연봉은 100만원 이상이어야 합니다";
    if (salary > 10_000_000_000) return "연봉이 너무 큽니다";
    const nonTax = parseNumber(nonTaxable);
    if (nonTax < 0) return "비과세액은 0 이상이어야 합니다";
    if (nonTax > salary / 12) return "비과세액이 월 급여보다 큽니다";
    const deps = parseNumber(dependents);
    if (deps < 1) return "부양가족 수는 본인 포함 1명 이상이어야 합니다";
    const child = parseNumber(children);
    if (child < 0) return "자녀 수는 0 이상이어야 합니다";
    return null;
  }, [annualSalary, nonTaxable, dependents, children]);

  const compute = useCallback(() => {
    const msg = validate();
    setValidationMsg(msg);
    if (msg) return;

    const res = calculateSalary({
      annualSalary: parseNumber(annualSalary),
      nonTaxableAmount: parseNumber(nonTaxable),
      dependents: parseNumber(dependents) || 1,
      childrenUnder20: parseNumber(children),
    });
    setResult(res);
  }, [annualSalary, nonTaxable, dependents, children, validate]);

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

  return (
    <div className="min-h-screen bg-[var(--salary-bg)]">
      {/* Desktop NavBar */}
      <NavBar />

      {/* Mobile AppBar */}
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

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full shrink-0 border-b border-[var(--salary-border)] bg-white p-6 md:w-[480px] md:border-b-0 md:border-r md:p-8">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-[var(--salary-text)]">
              연봉 실수령액 계산
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              연봉 정보를 입력하면 월 실수령액을 계산해 드립니다
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <InputField
              label="연봉 (원)"
              value={annualSalary}
              placeholder="50,000,000"
              onChange={setAnnualSalary}
            />
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
            계산하기
          </button>
        </div>

        {/* Right Panel - Results */}
        <div ref={resultRef} className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            <ResultCard
              monthlyNetSalary={displayResult.monthlyNetSalary}
              netRatio={displayResult.netRatio}
              monthlySalary={displayResult.monthlySalary}
              annualSalary={parseNumber(annualSalary)}
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />
            <BreakdownCard
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
