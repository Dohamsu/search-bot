"use client";

import { useState } from "react";

const navLinks = [
  { label: "변환기", href: "#", active: true },
  { label: "도구", href: "#", active: false },
  { label: "가격", href: "#", active: false },
  { label: "도움말", href: "#", active: false },
];

export default function NavBar() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleNavClick = (link: (typeof navLinks)[number], e: React.MouseEvent) => {
    e.preventDefault();
    if (link.active) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast(`"${link.label}" 기능은 준비 중입니다`);
    }
  };

  const handleAuthClick = (label: string) => {
    showToast(`"${label}" 기능은 준비 중입니다`);
  };

  return (
    <nav className="hidden md:flex h-16 items-center justify-between border-b border-[#E7E5E4] bg-white px-8 relative">
      <div className="flex items-center gap-8">
        <span className="text-[22px] font-bold text-[var(--file-primary)]">
          FileFlow
        </span>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(link, e)}
              className={`text-sm font-medium transition-colors ${
                link.active
                  ? "text-[var(--file-primary)]"
                  : "text-[#57534E] hover:text-[var(--file-primary)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleAuthClick("로그인")}
          className="text-sm font-medium text-[#57534E] hover:text-[var(--file-primary)]"
        >
          로그인
        </button>
        <button
          onClick={() => handleAuthClick("시작하기")}
          className="rounded-lg bg-[var(--file-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0A5A5A]"
        >
          시작하기
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 rounded-lg bg-[#1C1917] px-4 py-2.5 text-sm text-white shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </nav>
  );
}
