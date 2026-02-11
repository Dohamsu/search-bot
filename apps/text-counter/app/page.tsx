"use client";

import { useState, useCallback } from "react";
import {
  Type,
  Hash,
  FileText,
  Clock,
  Copy,
  Check,
  ArrowUpAZ,
  ArrowDownAZ,
  RemoveFormatting,
  WrapText,
  Space,
  MessageSquare,
  BarChart3,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import {
  analyzeText,
  checkSnsLimits,
  toUpperCase,
  toLowerCase,
  trimText,
  removeDuplicateSpaces,
  removeLineBreaks,
} from "./lib/textAnalyzer";

export default function TextCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = analyzeText(text);
  const snsLimits = checkSnsLimits(text, stats);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  const handleTransform = useCallback(
    (transformer: (t: string) => string) => {
      setText((prev) => transformer(prev));
    },
    []
  );


  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-[var(--text-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: "var(--text-primary)" }}
          >
            <Type size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-space-grotesk-var)]">
              글자수 세기
            </h1>
            <p className="text-xs text-gray-500">
              실시간 글자수 / 단어수 / 바이트수 카운터
            </p>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 왼쪽: 텍스트 입력 */}
          <div className="flex-1 space-y-4">
            {/* 텍스트 영역 */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--text-border)] bg-gray-50/50">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FileText size={16} />
                  텍스트 입력
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {stats.charWithSpaces.toLocaleString()}자
                  </span>
                  <span>|</span>
                  <span>{stats.wordCount.toLocaleString()}단어</span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
                className="w-full min-h-[240px] p-4 text-base leading-relaxed outline-none bg-white placeholder-gray-300 resize-y"
                autoFocus
              />
            </div>

            {/* 텍스트 변환 도구 */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wrench size={16} style={{ color: "var(--text-primary)" }} />
                텍스트 변환 도구
              </h2>
              <div className="flex flex-wrap gap-2">
                <TransformButton
                  icon={<ArrowUpAZ size={14} />}
                  label="대문자 변환"
                  onClick={() => handleTransform(toUpperCase)}
                />
                <TransformButton
                  icon={<ArrowDownAZ size={14} />}
                  label="소문자 변환"
                  onClick={() => handleTransform(toLowerCase)}
                />
                <TransformButton
                  icon={<RemoveFormatting size={14} />}
                  label="앞뒤 공백 제거"
                  onClick={() => handleTransform(trimText)}
                />
                <TransformButton
                  icon={<Space size={14} />}
                  label="중복 공백 제거"
                  onClick={() => handleTransform(removeDuplicateSpaces)}
                />
                <TransformButton
                  icon={<WrapText size={14} />}
                  label="줄바꿈 제거"
                  onClick={() => handleTransform(removeLineBreaks)}
                />
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed
                    bg-[var(--text-primary)] text-white hover:opacity-90 active:scale-95"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "복사 완료!" : "클립보드 복사"}
                </button>
              </div>
            </div>

            {/* SNS 글자수 체크 */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MessageSquare
                  size={16}
                  style={{ color: "var(--text-accent)" }}
                />
                SNS 글자수 체크
              </h2>
              <div className="space-y-3">
                {snsLimits.map((sns) => (
                  <SnsLimitBar key={sns.name} sns={sns} />
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 통계 카드 */}
          <div className="lg:w-[360px] space-y-4">
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3
                  size={16}
                  style={{ color: "var(--text-primary)" }}
                />
                텍스트 통계
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Type size={18} />}
                  label="글자수 (공백 포함)"
                  value={stats.charWithSpaces.toLocaleString()}
                  color="var(--text-primary)"
                />
                <StatCard
                  icon={<Type size={18} />}
                  label="글자수 (공백 제외)"
                  value={stats.charWithoutSpaces.toLocaleString()}
                  color="var(--text-primary)"
                />
                <StatCard
                  icon={<FileText size={18} />}
                  label="단어 수"
                  value={stats.wordCount.toLocaleString()}
                  color="var(--text-accent)"
                />
                <StatCard
                  icon={<Hash size={18} />}
                  label="바이트 (UTF-8)"
                  value={stats.byteUtf8.toLocaleString()}
                  color="#8B5CF6"
                />
                <StatCard
                  icon={<Hash size={18} />}
                  label="바이트 (EUC-KR)"
                  value={stats.byteEucKr.toLocaleString()}
                  color="#8B5CF6"
                />
                <StatCard
                  icon={<WrapText size={18} />}
                  label="줄 수"
                  value={stats.lineCount.toLocaleString()}
                  color="#F59E0B"
                />
                <StatCard
                  icon={<MessageSquare size={18} />}
                  label="문장 수"
                  value={stats.sentenceCount.toLocaleString()}
                  color="#EF4444"
                />
                <StatCard
                  icon={<FileText size={18} />}
                  label="원고지 매수"
                  value={`${stats.manuscriptPages.toLocaleString()}매`}
                  color="#10B981"
                  subtitle="200자 원고지"
                />
                <StatCard
                  icon={<Clock size={18} />}
                  label="읽는 시간"
                  value={
                    stats.readingTimeMin === 0
                      ? "0분"
                      : `약 ${stats.readingTimeMin}분`
                  }
                  color="#6366F1"
                  subtitle="분당 500자 기준"
                  fullWidth
                />
              </div>
            </div>

            {/* 사용 가이드 */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                사용 가이드
              </h3>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  텍스트를 입력하면 실시간으로 모든 통계가 업데이트됩니다.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  SNS 플랫폼별 글자수 제한을 확인할 수 있습니다.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  텍스트 변환 도구로 대소문자 변환, 공백 제거 등이 가능합니다.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  EUC-KR 바이트 수는 SMS/LMS 전송 시 기준이 됩니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-[var(--text-border)] bg-white/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>&copy; 2026 글자수 세기. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-gray-600 transition-colors">
                개인정보처리방침
              </a>
              <a href="/terms" className="hover:text-gray-600 transition-colors">
                이용약관
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────────── 하위 컴포넌트 ───────────── */

function StatCard({
  icon,
  label,
  value,
  color,
  subtitle,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtitle?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-100 p-3 flex flex-col gap-1 ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p
        className="text-lg font-bold font-[family-name:var(--font-space-grotesk-var)]"
        style={{ color }}
      >
        {value}
      </p>
      {subtitle && (
        <span className="text-[10px] text-gray-400">{subtitle}</span>
      )}
    </div>
  );
}

function TransformButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
        border border-[var(--text-border)] bg-gray-50 text-gray-700
        hover:bg-[var(--text-primary)] hover:text-white hover:border-transparent
        active:scale-95 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

function SnsLimitBar({ sns }: { sns: ReturnType<typeof checkSnsLimits>[number] }) {
  const pct = Math.min(sns.percentage, 100);
  const exceeded = sns.exceeded;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{sns.name}</span>
        <span
          className={`text-xs font-medium ${
            exceeded ? "text-red-500" : "text-gray-500"
          }`}
        >
          {sns.current.toLocaleString()} / {sns.limit.toLocaleString()}
          {sns.unit}
          {exceeded && (
            <span className="inline-flex items-center gap-0.5 ml-1">
              <AlertTriangle size={11} />
              초과
            </span>
          )}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar"
          style={{
            width: `${pct}%`,
            backgroundColor: exceeded ? "#EF4444" : "var(--text-primary)",
          }}
        />
      </div>
    </div>
  );
}
