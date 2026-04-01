"use client";

import { useState, useCallback, useMemo } from "react";
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
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import TextInfoSection from "./components/TextInfoSection";

export default function TextCounterPage() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = analyzeText(text);

  const snsLabels = useMemo(
    () => ({
      kakao: t("sns.kakao"),
      sms: t("sns.sms"),
      lms: t("sns.lms"),
      twitter: t("sns.twitter"),
      instagram: t("sns.instagram"),
      charUnit: t("sns.charUnit"),
      byteUnit: t("sns.byteUnit"),
      weightUnit: t("sns.weightUnit"),
    }),
    [t]
  );

  const snsLimits = checkSnsLimits(text, stats, snsLabels);

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
      {/* Header */}
      <header className="border-b border-[var(--text-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: "var(--text-primary)" }}
          >
            <Type size={22} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-[family-name:var(--font-space-grotesk-var)]">
              {t("header.title")}
            </h1>
            <p className="text-xs text-gray-500">
              {t("header.subtitle")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Text Input */}
          <div className="flex-1 space-y-4">
            {/* Text Area */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--text-border)] bg-gray-50/50">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FileText size={16} />
                  {t("input.label")}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {t("input.charCount", { count: stats.charWithSpaces.toLocaleString() })}
                  </span>
                  <span>|</span>
                  <span>{t("input.wordCount", { count: stats.wordCount.toLocaleString() })}</span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("input.placeholder")}
                className="w-full min-h-[240px] p-4 text-base leading-relaxed outline-none bg-white placeholder-gray-300 resize-y"
                autoFocus
              />
            </div>

            {/* Transform Tools */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wrench size={16} style={{ color: "var(--text-primary)" }} />
                {t("transform.title")}
              </h2>
              <div className="flex flex-wrap gap-2">
                <TransformButton
                  icon={<ArrowUpAZ size={14} />}
                  label={t("transform.toUpperCase")}
                  onClick={() => handleTransform(toUpperCase)}
                />
                <TransformButton
                  icon={<ArrowDownAZ size={14} />}
                  label={t("transform.toLowerCase")}
                  onClick={() => handleTransform(toLowerCase)}
                />
                <TransformButton
                  icon={<RemoveFormatting size={14} />}
                  label={t("transform.trim")}
                  onClick={() => handleTransform(trimText)}
                />
                <TransformButton
                  icon={<Space size={14} />}
                  label={t("transform.removeDuplicateSpaces")}
                  onClick={() => handleTransform(removeDuplicateSpaces)}
                />
                <TransformButton
                  icon={<WrapText size={14} />}
                  label={t("transform.removeLineBreaks")}
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
                  {copied ? t("transform.copied") : t("transform.copy")}
                </button>
              </div>
            </div>

            {/* SNS Character Limits */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MessageSquare
                  size={16}
                  style={{ color: "var(--text-accent)" }}
                />
                {t("sns.title")}
              </h2>
              <div className="space-y-3">
                {snsLimits.map((sns) => (
                  <SnsLimitBar key={sns.name} sns={sns} exceededLabel={t("sns.exceeded")} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Statistics */}
          <div className="lg:w-[360px] space-y-4">
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3
                  size={16}
                  style={{ color: "var(--text-primary)" }}
                />
                {t("stats.title")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Type size={18} />}
                  label={t("stats.charWithSpaces")}
                  value={stats.charWithSpaces.toLocaleString()}
                  color="var(--text-primary)"
                />
                <StatCard
                  icon={<Type size={18} />}
                  label={t("stats.charWithoutSpaces")}
                  value={stats.charWithoutSpaces.toLocaleString()}
                  color="var(--text-primary)"
                />
                <StatCard
                  icon={<FileText size={18} />}
                  label={t("stats.wordCount")}
                  value={stats.wordCount.toLocaleString()}
                  color="var(--text-accent)"
                />
                <StatCard
                  icon={<Hash size={18} />}
                  label={t("stats.byteUtf8")}
                  value={stats.byteUtf8.toLocaleString()}
                  color="#8B5CF6"
                />
                <StatCard
                  icon={<Hash size={18} />}
                  label={t("stats.byteEucKr")}
                  value={stats.byteEucKr.toLocaleString()}
                  color="#8B5CF6"
                />
                <StatCard
                  icon={<WrapText size={18} />}
                  label={t("stats.lineCount")}
                  value={stats.lineCount.toLocaleString()}
                  color="#F59E0B"
                />
                <StatCard
                  icon={<MessageSquare size={18} />}
                  label={t("stats.sentenceCount")}
                  value={stats.sentenceCount.toLocaleString()}
                  color="#EF4444"
                />
                <StatCard
                  icon={<FileText size={18} />}
                  label={t("stats.manuscriptPages")}
                  value={t("stats.manuscriptPagesValue", { count: stats.manuscriptPages.toLocaleString() })}
                  color="#10B981"
                  subtitle={t("stats.manuscriptSubtitle")}
                />
                <StatCard
                  icon={<Clock size={18} />}
                  label={t("stats.readingTime")}
                  value={
                    stats.readingTimeMin === 0
                      ? t("stats.readingTimeZero")
                      : t("stats.readingTimeValue", { min: stats.readingTimeMin })
                  }
                  color="#6366F1"
                  subtitle={t("stats.readingTimeSubtitle")}
                  fullWidth
                />
              </div>
            </div>

            {/* Usage Guide */}
            <div className="bg-white rounded-2xl border border-[var(--text-border)] shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {t("guide.title")}
              </h3>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  {t("guide.tip1")}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  {t("guide.tip2")}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  {t("guide.tip3")}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0" />
                  {t("guide.tip4")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <TextInfoSection />
      <RelatedTools currentToolId="text" />

      {/* Footer */}
      <footer className="border-t border-[var(--text-border)] bg-white/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>{t("footer.copyright")}</p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-gray-600 transition-colors">
                {t("footer.privacy")}
              </a>
              <a href="/terms" className="hover:text-gray-600 transition-colors">
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────────── Sub-components ───────────── */

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

function SnsLimitBar({ sns, exceededLabel }: { sns: ReturnType<typeof checkSnsLimits>[number]; exceededLabel: string }) {
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
              {exceededLabel}
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
