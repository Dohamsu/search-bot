import Link from "next/link";
import { Calculator } from "lucide-react";

export default function NavBar() {
  return (
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
          <Link
            href="/salary-table"
            className="text-sm font-medium text-[var(--salary-text)] transition-colors hover:text-[var(--salary-primary)]"
          >
            실수령표
          </Link>
        </div>
      </div>
      <div />
    </nav>
  );
}
