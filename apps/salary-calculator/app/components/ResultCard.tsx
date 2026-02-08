"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import type { DeductionItem } from "../lib/salary";

interface ResultCardProps {
  monthlyNetSalary: number;
  netRatio: number;
  monthlySalary: number;
  annualSalary?: number;
  deductions?: DeductionItem[];
  totalDeduction?: number;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

export default function ResultCard({
  monthlyNetSalary,
  netRatio,
  monthlySalary,
  annualSalary,
  deductions,
  totalDeduction,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const buildShareText = () => {
    let text = `[연봉 실수령액 계산 결과]\n`;
    if (annualSalary) {
      text += `연봉: ${formatCurrency(annualSalary)}원\n`;
    }
    text += `월 급여: ${formatCurrency(monthlySalary)}원\n`;
    text += `월 실수령액: ${formatCurrency(monthlyNetSalary)}원\n`;
    text += `실수령 비율: ${netRatio.toFixed(1)}%\n`;
    if (deductions && deductions.length > 0) {
      text += `\n[공제 내역]\n`;
      deductions.forEach((d) => {
        text += `${d.label}: ${formatCurrency(d.amount)}원\n`;
      });
    }
    if (totalDeduction !== undefined) {
      text += `총 공제액: ${formatCurrency(totalDeduction)}원\n`;
    }
    return text;
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "연봉 실수령액 계산 결과", text });
      } catch {
        // user cancelled share
      }
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-[var(--salary-primary)] p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm text-white/80">월 실수령액</p>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            title="결과 복사"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            title="결과 공유"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 font-[family-name:var(--font-space-grotesk-var)] text-[32px] font-bold leading-tight text-white md:text-[40px]">
        {formatCurrency(monthlyNetSalary)}
        <span className="ml-1 text-lg font-normal text-white/80">원</span>
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-white/70">
          월 급여 {formatCurrency(monthlySalary)}원
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
          실수령 {netRatio.toFixed(1)}%
        </span>
      </div>
      {copied && (
        <p className="mt-2 text-xs text-white/70">
          클립보드에 복사되었습니다
        </p>
      )}
    </div>
  );
}
