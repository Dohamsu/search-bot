"use client";

import type { DeductionItem } from "../lib/salary";

interface BreakdownCardProps {
  deductions: DeductionItem[];
  totalDeduction: number;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

export default function BreakdownCard({
  deductions,
  totalDeduction,
}: BreakdownCardProps) {
  return (
    <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--salary-text)]">
          공제 항목
        </h3>
        <span className="font-[family-name:var(--font-space-grotesk-var)] text-sm font-semibold text-red-500">
          -{formatCurrency(totalDeduction)}원
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {deductions.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-[13px] text-slate-500">{item.label}</span>
            <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-[var(--salary-text)]">
              {formatCurrency(item.amount)}원
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-[var(--salary-border)] pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--salary-text)]">
            총 공제액
          </span>
          <span className="font-[family-name:var(--font-space-grotesk-var)] text-sm font-bold text-red-500">
            {formatCurrency(totalDeduction)}원
          </span>
        </div>
      </div>
    </div>
  );
}
