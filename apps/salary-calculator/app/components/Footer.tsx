import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--salary-border)] bg-slate-50 py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500 md:flex-row md:gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="underline transition-colors hover:text-[var(--salary-primary)]"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="underline transition-colors hover:text-[var(--salary-primary)]"
            >
              이용약관
            </Link>
          </div>
          <span className="hidden md:inline text-slate-300">|</span>
          <a
            href="mailto:rlawlsdnjswk@gmail.com"
            className="underline transition-colors hover:text-[var(--salary-primary)]"
          >
            rlawlsdnjswk@gmail.com
          </a>
          <span className="hidden md:inline text-slate-300">|</span>
          <span>© 2025 연봉계산기</span>
        </div>
      </div>
    </footer>
  );
}
