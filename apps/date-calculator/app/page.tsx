"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CalendarDays,
  CalendarPlus,
  User,
  Clock,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import {
  getDaysBetween,
  getSignedDaysBetween,
  getBusinessDays,
  addDays,
  addYearsMonthsDays,
  addBusinessDays,
  getKoreanAge,
  getKoreanTraditionalAge,
  getZodiacAnimal,
  getDaysUntilNextBirthday,
  getDateDifference,
  formatDateToString,
  formatDateKorean,
  formatNumber,
} from "./lib/dateCalc";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import DateInfoSection from "./components/DateInfoSection";

type TabId = "dday" | "diff" | "addSub" | "age";

function todayString(): string {
  return formatDateToString(new Date());
}

/* ────────────────────────── D-Day Tab ────────────────────────── */
function DDayTab() {
  const { t } = useTranslation();
  const [targetDate, setTargetDate] = useState("");

  const result = useMemo(() => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate + "T00:00:00");
    const signedDays = getSignedDaysBetween(today, target);
    const totalDays = getDaysBetween(today, target);
    const weeks = Math.floor(totalDays / 7);
    const remainDays = totalDays % 7;
    const months = totalDays / 30.44;
    const years = totalDays / 365.25;

    return {
      signedDays,
      totalDays,
      weeks,
      remainDays,
      months,
      years,
      formattedTarget: formatDateKorean(target, t),
      isPast: signedDays < 0,
      isToday: signedDays === 0,
    };
  }, [targetDate, t]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t("dday.selectDate")}
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
        />
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--date-border)] text-center">
          <p className="text-sm text-gray-500 mb-2">{result.formattedTarget}</p>

          {result.isToday ? (
            <div>
              <p className="text-6xl font-bold font-[family-name:var(--font-space)] text-[var(--date-primary)]">
                D-Day
              </p>
              <p className="text-lg text-gray-600 mt-3">
                {t("dday.isToday")}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-6xl font-bold font-[family-name:var(--font-space)] text-[var(--date-primary)]">
                {result.isPast ? "D+" : "D-"}
                {formatNumber(result.totalDays)}
              </p>
              <p className="text-lg text-gray-600 mt-3">
                {result.isPast
                  ? t("dday.daysPassed", {
                      count: formatNumber(result.totalDays),
                    })
                  : t("dday.daysLeft", {
                      count: formatNumber(result.totalDays),
                    })}
              </p>
            </div>
          )}

          {!result.isToday && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-[var(--date-primary)] font-[family-name:var(--font-space)]">
                  {result.weeks > 0
                    ? t("dday.weeksAndDays", {
                        weeks: formatNumber(result.weeks),
                        days: result.remainDays,
                      })
                    : t("dday.onlyDays", { days: result.remainDays })}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("dday.weekUnit")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--date-accent)] font-[family-name:var(--font-space)]">
                  {t("dday.months", { count: result.months.toFixed(1) })}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("dday.monthUnit")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--date-success)] font-[family-name:var(--font-space)]">
                  {t("dday.years", { count: result.years.toFixed(2) })}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("dday.yearUnit")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Date Diff Tab ────────────────────────── */
function DateDiffTab() {
  const { t } = useTranslation();
  const today = todayString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const totalDays = getDaysBetween(start, end);
    const businessDays = getBusinessDays(start, end);
    const diff = getDateDifference(start, end);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    return {
      totalDays,
      businessDays,
      diff,
      totalHours,
      totalMinutes,
      totalSeconds,
      startFormatted: formatDateKorean(start, t),
      endFormatted: formatDateKorean(end, t),
    };
  }, [startDate, endDate, t]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("diff.startDate")}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
            />
          </div>
          <div className="flex justify-center pb-3">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("diff.endDate")}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
            />
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--date-border)] text-center">
            <p className="text-sm text-gray-500 mb-1">
              {result.startFormatted}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ~ {result.endFormatted}
            </p>

            <p className="text-5xl font-bold font-[family-name:var(--font-space)] text-[var(--date-primary)]">
              {t("diff.days", { count: formatNumber(result.totalDays) })}
            </p>

            {(result.diff.years > 0 || result.diff.months > 0) && (
              <p className="text-lg text-gray-600 mt-2">
                {result.diff.years > 0 && `${result.diff.years}${t("addSub.year")} `}
                {result.diff.months > 0 && `${result.diff.months}${t("addSub.month")} `}
                {result.diff.days > 0 && `${result.diff.days}${t("addSub.day")}`}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)] text-center">
              <p className="text-3xl font-bold text-[var(--date-accent)] font-[family-name:var(--font-space)]">
                {t("diff.days", { count: formatNumber(result.businessDays) })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("diff.businessDays")}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)] text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[var(--date-success)]" />
                <span className="text-sm text-gray-500">
                  {t("diff.timeDiff")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-700">
                {t("diff.hours", { count: formatNumber(result.totalHours) })}
              </p>
              <p className="text-sm text-gray-500">
                {t("diff.minutes", {
                  count: formatNumber(result.totalMinutes),
                })}
              </p>
              <p className="text-xs text-gray-400">
                {t("diff.seconds", {
                  count: formatNumber(result.totalSeconds),
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────── Add/Subtract Tab ────────────────────────── */
function DateAddSubTab() {
  const { t } = useTranslation();
  const today = todayString();
  const [baseDate, setBaseDate] = useState(today);
  const [mode, setMode] = useState<"add" | "sub">("add");
  const [inputType, setInputType] = useState<"days" | "complex">("days");
  const [daysInput, setDaysInput] = useState("0");
  const [yearsInput, setYearsInput] = useState("0");
  const [monthsInput, setMonthsInput] = useState("0");
  const [daysComplexInput, setDaysComplexInput] = useState("0");
  const [useBusinessDays, setUseBusinessDays] = useState(false);

  const result = useMemo(() => {
    if (!baseDate) return null;
    const base = new Date(baseDate + "T00:00:00");
    const sign = mode === "add" ? 1 : -1;

    let resultDate: Date;

    if (inputType === "days") {
      const days = parseInt(daysInput) || 0;
      if (useBusinessDays) {
        resultDate = addBusinessDays(base, days * sign);
      } else {
        resultDate = addDays(base, days * sign);
      }
    } else {
      const years = (parseInt(yearsInput) || 0) * sign;
      const months = (parseInt(monthsInput) || 0) * sign;
      const days = (parseInt(daysComplexInput) || 0) * sign;
      resultDate = addYearsMonthsDays(base, years, months, days);
    }

    return {
      date: resultDate,
      formatted: formatDateKorean(resultDate, t),
      dateString: formatDateToString(resultDate),
    };
  }, [
    baseDate,
    mode,
    inputType,
    daysInput,
    yearsInput,
    monthsInput,
    daysComplexInput,
    useBusinessDays,
    t,
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t("addSub.baseDate")}
        </label>
        <input
          type="date"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
        {/* Add / Subtract toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("add")}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "add"
                ? "bg-[var(--date-primary)] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Plus className="w-4 h-4" />
            {t("addSub.add")}
          </button>
          <button
            onClick={() => setMode("sub")}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "sub"
                ? "bg-[var(--date-accent)] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Minus className="w-4 h-4" />
            {t("addSub.subtract")}
          </button>
        </div>

        {/* Input type toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType("days")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              inputType === "days"
                ? "bg-purple-100 text-[var(--date-primary)]"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t("addSub.daysOnly")}
          </button>
          <button
            onClick={() => setInputType("complex")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              inputType === "complex"
                ? "bg-purple-100 text-[var(--date-primary)]"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t("addSub.yearMonthDay")}
          </button>
        </div>

        {inputType === "days" ? (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("addSub.days")}
            </label>
            <input
              type="number"
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
            />
            <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={useBusinessDays}
                onChange={(e) => setUseBusinessDays(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--date-primary)]"
              />
              {t("addSub.businessDaysBasis")}
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t("addSub.year")}
              </label>
              <input
                type="number"
                value={yearsInput}
                onChange={(e) => setYearsInput(e.target.value)}
                min="0"
                className="w-full px-3 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t("addSub.month")}
              </label>
              <input
                type="number"
                value={monthsInput}
                onChange={(e) => setMonthsInput(e.target.value)}
                min="0"
                className="w-full px-3 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t("addSub.day")}
              </label>
              <input
                type="number"
                value={daysComplexInput}
                onChange={(e) => setDaysComplexInput(e.target.value)}
                min="0"
                className="w-full px-3 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg text-center"
              />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--date-border)] text-center">
          <p className="text-sm text-gray-500 mb-2">{t("addSub.result")}</p>
          <p className="text-4xl font-bold font-[family-name:var(--font-space)] text-[var(--date-primary)]">
            {result.formatted}
          </p>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Age Tab ────────────────────────── */
function AgeTab() {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate + "T00:00:00");
    const today = new Date();

    if (birth > today) return null;

    const manAge = getKoreanAge(birth, today);
    const traditionalAge = getKoreanTraditionalAge(birth, today);
    const zodiac = getZodiacAnimal(birth.getFullYear(), t);
    const daysUntilBirthday = getDaysUntilNextBirthday(birth, today);
    const livedDays = getDaysBetween(birth, today);
    const livedHours = livedDays * 24;
    const livedMinutes = livedHours * 60;

    // Check if today is the birthday
    const isBirthdayToday =
      today.getMonth() === birth.getMonth() &&
      today.getDate() === birth.getDate();

    return {
      manAge,
      traditionalAge,
      zodiac,
      daysUntilBirthday,
      livedDays,
      livedHours,
      livedMinutes,
      isBirthdayToday,
      birthFormatted: formatDateKorean(birth, t),
    };
  }, [birthDate, t]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t("age.birthDate")}
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={todayString()}
          className="w-full px-4 py-3 rounded-xl border border-[var(--date-border)] focus:outline-none focus:ring-2 focus:ring-[var(--date-primary)] text-lg"
        />
      </div>

      {result && (
        <>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--date-border)] text-center">
            <p className="text-sm text-gray-500 mb-2">
              {result.birthFormatted}
            </p>
            <p className="text-6xl font-bold font-[family-name:var(--font-space)] text-[var(--date-primary)]">
              {t("age.manAge", { age: result.manAge })}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              {t("age.koreanAge", { age: result.traditionalAge })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)] text-center">
              <p className="text-4xl mb-1">{result.zodiac.emoji}</p>
              <p className="text-xl font-bold text-[var(--date-primary)]">
                {result.zodiac.name}{t("age.zodiacSuffix")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("age.zodiacLabel")}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)] text-center">
              <Calendar className="w-8 h-8 text-[var(--date-accent)] mx-auto mb-1" />
              {result.isBirthdayToday ? (
                <>
                  <p className="text-xl font-bold text-[var(--date-accent)]">
                    {t("age.happyBirthday")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t("age.birthdayToday")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-[var(--date-accent)]">
                    {t("age.daysCount", {
                      count: formatNumber(result.daysUntilBirthday),
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t("age.daysUntilBirthday")}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--date-border)]">
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">
              {t("age.livedTime")}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[var(--date-success)] font-[family-name:var(--font-space)]">
                  {formatNumber(result.livedDays)}
                </p>
                <p className="text-xs text-gray-400">{t("age.livedDays")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--date-primary)] font-[family-name:var(--font-space)]">
                  {formatNumber(result.livedHours)}
                </p>
                <p className="text-xs text-gray-400">{t("age.livedHours")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--date-accent)] font-[family-name:var(--font-space)]">
                  {formatNumber(result.livedMinutes)}
                </p>
                <p className="text-xs text-gray-400">
                  {t("age.livedMinutes")}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────── Main Page ────────────────────────── */
export default function DateCalculatorPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("dday");

  const tabs: { id: TabId; labelKey: string; icon: React.ReactNode }[] = [
    {
      id: "dday",
      labelKey: "tabs.dday",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "diff",
      labelKey: "tabs.diff",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: "addSub",
      labelKey: "tabs.addSub",
      icon: <CalendarPlus className="w-4 h-4" />,
    },
    {
      id: "age",
      labelKey: "tabs.age",
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[var(--date-border)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--date-primary)] to-[var(--date-accent)] flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[var(--date-text)]">
                {t("header.title")}
              </h1>
              <p className="text-xs text-gray-500">
                {t("header.subtitle")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-[var(--date-border)] sticky top-[73px] z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--date-primary)] text-[var(--date-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {activeTab === "dday" && <DDayTab />}
        {activeTab === "diff" && <DateDiffTab />}
        {activeTab === "addSub" && <DateAddSubTab />}
        {activeTab === "age" && <AgeTab />}
      </main>

      <DateInfoSection />

      <RelatedTools currentToolId="date" />

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--date-border)] mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            <div className="flex gap-3">
              <a href="/privacy" className="hover:text-gray-600">
                {t("footer.privacy")}
              </a>
              <a href="/terms" className="hover:text-gray-600">
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
