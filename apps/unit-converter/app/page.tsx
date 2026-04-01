"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Ruler,
  Weight,
  Square,
  Thermometer,
  Gauge,
  HardDrive,
  Clock,
  ArrowLeftRight,
  ChevronDown,
  Zap,
  Droplets,
} from "lucide-react";
import {
  categories,
  quickConverts,
  type CategoryId,
  type CategoryDef,
} from "./lib/unitData";
import { convert, convertToAll, formatNumber } from "./lib/converter";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import UnitInfoSection from "./components/UnitInfoSection";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Ruler,
  Weight,
  Square,
  Thermometer,
  Gauge,
  HardDrive,
  Clock,
  Beaker: Droplets,
};


export default function UnitConverterPage() {
  const { t, locale } = useTranslation();
  const numberLocale = locale === "ko" ? "ko-KR" : "en-US";

  const [activeCategory, setActiveCategory] = useState<CategoryId>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("km");
  const [toUnit, setToUnit] = useState<string>("m");

  const category = useMemo(
    () => categories.find((c) => c.id === activeCategory) as CategoryDef,
    [activeCategory]
  );

  const numericValue = useMemo(() => {
    const v = parseFloat(inputValue);
    return isNaN(v) ? 0 : v;
  }, [inputValue]);

  const result = useMemo(
    () => convert(numericValue, fromUnit, toUnit, activeCategory),
    [numericValue, fromUnit, toUnit, activeCategory]
  );

  const allResults = useMemo(
    () => convertToAll(numericValue, fromUnit, activeCategory),
    [numericValue, fromUnit, activeCategory]
  );

  const handleCategoryChange = useCallback((catId: CategoryId) => {
    setActiveCategory(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].id);
      setToUnit(cat.units[1].id);
    }
    setInputValue("1");
  }, []);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  const handleQuickConvert = useCallback(
    (qc: (typeof quickConverts)[0]) => {
      setActiveCategory(qc.categoryId);
      setFromUnit(qc.fromUnit);
      setToUnit(qc.toUnit);
      setInputValue("1");
    },
    []
  );

  const getUnitLabel = (unitId: string) => t(`units.${unitId}.label`);
  const getUnitSymbol = (unitId: string) => t(`units.${unitId}.symbol`);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--unit-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-space)] text-[var(--unit-primary)]">
              {t("header.title")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("header.subtitle")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Category Tabs */}
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon];
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--unit-primary)] text-white shadow-md shadow-amber-200"
                      : "bg-white text-gray-600 hover:bg-amber-50 border border-gray-200"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {t(`categories.${cat.id}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Converter Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-amber-100 border border-[var(--unit-border)] p-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
            {/* From */}
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("converter.fromLabel")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-2xl font-bold font-[family-name:var(--font-space)] bg-amber-50 border border-[var(--unit-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--unit-primary)] focus:border-transparent transition"
                  placeholder={t("converter.placeholder")}
                />
                <div className="relative">
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="appearance-none bg-amber-50 border border-[var(--unit-border)] rounded-xl pl-4 pr-9 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--unit-primary)] cursor-pointer h-full"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {getUnitSymbol(u.id)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="self-center p-3 rounded-full bg-[var(--unit-primary)] text-white hover:bg-amber-700 transition shadow-md hover:shadow-lg"
              aria-label={t("converter.swapAriaLabel")}
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>

            {/* To */}
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("converter.toLabel")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 text-2xl font-bold font-[family-name:var(--font-space)] bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[var(--unit-success)] truncate">
                  {formatNumber(result, numberLocale)}
                </div>
                <div className="relative">
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="appearance-none bg-green-50 border border-green-200 rounded-xl pl-4 pr-9 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--unit-success)] cursor-pointer h-full"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {getUnitSymbol(u.id)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Description */}
          <div className="mt-4 text-center text-sm text-gray-500">
            {numericValue !== 0 && (
              <span>
                {formatNumber(numericValue, numberLocale)} {getUnitSymbol(fromUnit)} ={" "}
                <span className="font-semibold text-[var(--unit-text)]">
                  {formatNumber(result, numberLocale)} {getUnitSymbol(toUnit)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* All Conversions Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-[family-name:var(--font-space)] text-[var(--unit-text)]">
            {t("allResults.title")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {category.units.map((unit) => {
              const val = allResults[unit.id];
              const isFrom = unit.id === fromUnit;
              const isTo = unit.id === toUnit;
              return (
                <button
                  key={unit.id}
                  onClick={() => setToUnit(unit.id)}
                  className={`text-left p-4 rounded-xl border transition-all hover:shadow-md ${
                    isTo
                      ? "border-[var(--unit-success)] bg-green-50 ring-1 ring-[var(--unit-success)]"
                      : isFrom
                        ? "border-[var(--unit-primary)] bg-amber-50 ring-1 ring-[var(--unit-primary)]"
                        : "border-gray-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {getUnitLabel(unit.id)}
                  </div>
                  <div className="text-base font-bold font-[family-name:var(--font-space)] truncate">
                    {val !== undefined ? formatNumber(val, numberLocale) : "\u2014"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {getUnitSymbol(unit.id)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Converts */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-[family-name:var(--font-space)] flex items-center gap-2 text-[var(--unit-text)]">
            <Zap className="w-5 h-5 text-[var(--unit-primary)]" />
            {t("quickConvert.title")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickConverts.map((qc) => (
              <button
                key={qc.key}
                onClick={() => handleQuickConvert(qc)}
                className="text-left p-4 rounded-xl bg-white border border-gray-200 hover:border-[var(--unit-primary)] hover:shadow-md transition-all group"
              >
                <div className="text-base font-bold font-[family-name:var(--font-space)] group-hover:text-[var(--unit-primary)] transition-colors">
                  {t(`quickConverts.${qc.key}.label`)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t(`quickConverts.${qc.key}.description`)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl border border-[var(--unit-border)] p-6 space-y-4">
          <h2 className="text-lg font-bold font-[family-name:var(--font-space)]">
            {t("faq.title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                {t("faq.pyeong.question")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("faq.pyeong.answer")}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                {t("faq.geun.question")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("faq.geun.answer")}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                {t("faq.temperature.question")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("faq.temperature.answer")}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                {t("faq.mile.question")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("faq.mile.answer")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <UnitInfoSection />

      <RelatedTools currentToolId="unit" />

      {/* Footer */}
      <footer className="border-t border-[var(--unit-border)] bg-white/80 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex gap-4 justify-center text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition">
              {t("footer.privacy")}
            </a>
            <a href="/terms" className="hover:text-gray-600 transition">
              {t("footer.terms")}
            </a>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
