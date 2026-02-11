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

  const fromUnitDef = category.units.find((u) => u.id === fromUnit);
  const toUnitDef = category.units.find((u) => u.id === toUnit);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--unit-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space)] text-[var(--unit-primary)]">
            단위 변환기
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            길이, 무게, 넓이, 부피, 온도, 속도, 데이터, 시간 단위를 빠르게
            변환하세요
          </p>
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
                  {cat.label}
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
                변환할 값
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-2xl font-bold font-[family-name:var(--font-space)] bg-amber-50 border border-[var(--unit-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--unit-primary)] focus:border-transparent transition"
                  placeholder="0"
                />
                <div className="relative">
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="appearance-none bg-amber-50 border border-[var(--unit-border)] rounded-xl pl-4 pr-9 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--unit-primary)] cursor-pointer h-full"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.symbol}
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
              aria-label="단위 교환"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>

            {/* To */}
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                변환 결과
              </label>
              <div className="flex gap-2">
                <div className="flex-1 text-2xl font-bold font-[family-name:var(--font-space)] bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[var(--unit-success)] truncate">
                  {formatNumber(result)}
                </div>
                <div className="relative">
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="appearance-none bg-green-50 border border-green-200 rounded-xl pl-4 pr-9 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--unit-success)] cursor-pointer h-full"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.symbol}
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
            {numericValue !== 0 && fromUnitDef && toUnitDef && (
              <span>
                {formatNumber(numericValue)} {fromUnitDef.symbol} ={" "}
                <span className="font-semibold text-[var(--unit-text)]">
                  {formatNumber(result)} {toUnitDef.symbol}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* All Conversions Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-[family-name:var(--font-space)] text-[var(--unit-text)]">
            모든 단위 변환 결과
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
                    {unit.label}
                  </div>
                  <div className="text-base font-bold font-[family-name:var(--font-space)] truncate">
                    {val !== undefined ? formatNumber(val) : "—"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {unit.symbol}
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
            빠른 변환
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickConverts.map((qc) => (
              <button
                key={qc.label}
                onClick={() => handleQuickConvert(qc)}
                className="text-left p-4 rounded-xl bg-white border border-gray-200 hover:border-[var(--unit-primary)] hover:shadow-md transition-all group"
              >
                <div className="text-base font-bold font-[family-name:var(--font-space)] group-hover:text-[var(--unit-primary)] transition-colors">
                  {qc.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {qc.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl border border-[var(--unit-border)] p-6 space-y-4">
          <h2 className="text-lg font-bold font-[family-name:var(--font-space)]">
            자주 묻는 단위 변환
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                1평은 몇 제곱미터(㎡)?
              </h3>
              <p className="text-sm text-gray-600">
                1평은 약 3.3058 ㎡입니다. 부동산에서 자주 쓰이는 면적 단위로,
                정확히는 400/121 ㎡입니다.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                1근은 몇 kg?
              </h3>
              <p className="text-sm text-gray-600">
                한국에서 1근은 600g(0.6kg)입니다. 고기나 채소 등 식재료 무게를
                나타낼 때 주로 사용합니다.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                섭씨(°C)와 화씨(°F) 변환
              </h3>
              <p className="text-sm text-gray-600">
                °F = °C x 9/5 + 32. 예: 0°C = 32°F, 100°C = 212°F. 미국 등에서
                주로 화씨를 사용합니다.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
                1마일(mile)은 몇 km?
              </h3>
              <p className="text-sm text-gray-600">
                1마일은 약 1.6093 km입니다. 미국과 영국 등에서 거리를 나타낼 때
                사용하는 단위입니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--unit-border)] bg-white/80 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex gap-4 justify-center text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition">
              개인정보처리방침
            </a>
            <a href="/terms" className="hover:text-gray-600 transition">
              이용약관
            </a>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            &copy; {new Date().getFullYear()} 단위 변환기. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
