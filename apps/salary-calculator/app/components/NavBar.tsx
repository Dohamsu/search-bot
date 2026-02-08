"use client";

import { useState } from "react";
import { Calculator, LogIn } from "lucide-react";

export default function NavBar() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <>
      <nav className="hidden md:flex h-16 items-center justify-between border-b border-[var(--salary-border)] bg-white px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--salary-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-primary)]">
              연봉계산기
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-medium text-[var(--salary-text)]"
            >
              급여계산
            </button>
            <button
              onClick={() => showToast("퇴직금 계산기는 준비 중입니다")}
              className="group relative text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              퇴직금
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                준비 중
              </span>
            </button>
            <button
              onClick={() => showToast("세금 가이드는 준비 중입니다")}
              className="group relative text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              세금가이드
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                준비 중
              </span>
            </button>
          </div>
        </div>
        <button
          onClick={() => showToast("로그인 기능은 준비 중입니다")}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--salary-border)] px-4 py-2 text-sm font-medium text-[var(--salary-text)] transition-colors hover:bg-slate-50"
        >
          <LogIn className="h-4 w-4" />
          로그인
        </button>
      </nav>

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg animate-[fadeInDown_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </>
  );
}
