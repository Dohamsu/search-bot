"use client";

import { useState, useCallback } from "react";
import {
  Zap,
  Droplets,
  Flame,
  Calculator,
  TrendingDown,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  calculateElectricBill,
  calculateWaterBill,
  calculateGasBill,
  formatNumber,
  type ElectricType,
  type Season,
  type DiscountType,
  type ElectricBillResult,
  type WaterPurpose,
  type WaterBillResult,
  type GasPurpose,
  type GasBillResult,
} from "./lib/billCalc";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import BillInfoSection from "./components/BillInfoSection";

type TabType = "electric" | "water" | "gas";

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function UtilityBillPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("electric");
  const [showTips, setShowTips] = useState(false);

  // 전기 입력
  const [elUsage, setElUsage] = useState<string>("350");
  const [elType, setElType] = useState<ElectricType>("residential");
  const [elSeason, setElSeason] = useState<Season>("other");
  const [elDiscount, setElDiscount] = useState<DiscountType>("none");
  const [elResult, setElResult] = useState<ElectricBillResult | null>(null);

  // 수도 입력
  const [wtUsage, setWtUsage] = useState<string>("20");
  const [wtPurpose, setWtPurpose] = useState<WaterPurpose>("household");
  const [wtResult, setWtResult] = useState<WaterBillResult | null>(null);

  // 가스 입력
  const [gsUsage, setGsUsage] = useState<string>("30");
  const [gsPurpose, setGsPurpose] = useState<GasPurpose>("heating");
  const [gsResult, setGsResult] = useState<GasBillResult | null>(null);

  const calcElectric = useCallback(() => {
    const usage = parseFloat(elUsage) || 0;
    if (usage <= 0) return;
    setElResult(calculateElectricBill(usage, elType, elSeason, elDiscount));
  }, [elUsage, elType, elSeason, elDiscount]);

  const calcWater = useCallback(() => {
    const usage = parseFloat(wtUsage) || 0;
    if (usage <= 0) return;
    setWtResult(calculateWaterBill(usage, wtPurpose));
  }, [wtUsage, wtPurpose]);

  const calcGas = useCallback(() => {
    const usage = parseFloat(gsUsage) || 0;
    if (usage <= 0) return;
    setGsResult(calculateGasBill(usage, gsPurpose));
  }, [gsUsage, gsPurpose]);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    {
      key: "electric",
      label: t("tabs.electric"),
      icon: <Zap className="w-5 h-5" />,
    },
    {
      key: "water",
      label: t("tabs.water"),
      icon: <Droplets className="w-5 h-5" />,
    },
    {
      key: "gas",
      label: t("tabs.gas"),
      icon: <Flame className="w-5 h-5" />,
    },
  ];

  const tipIcons: Record<TabType, React.ReactNode> = {
    electric: <Zap className="w-5 h-5 text-yellow-600" />,
    water: <Droplets className="w-5 h-5 text-blue-600" />,
    gas: <Flame className="w-5 h-5 text-orange-600" />,
  };

  const tipTitleKeys: Record<TabType, string> = {
    electric: "tips.electricTitle",
    water: "tips.waterTitle",
    gas: "tips.gasTitle",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-yellow-200 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold font-[family-name:var(--font-space-grotesk-var)] text-gray-900">
              {t("header.title")}
            </h1>
            <p className="text-xs text-gray-500">
              {t("header.subtitle")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex rounded-xl overflow-hidden border border-yellow-200 bg-white shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-yellow-500 text-white shadow-inner"
                  : "bg-white text-gray-600 hover:bg-yellow-50"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            {t("disclaimer")}
          </p>
        </div>

        {/* Electric Tab */}
        {activeTab === "electric" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                {t("electric.title")}
              </h2>

              {/* 사용량 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("electric.usageLabel")}
                </label>
                <input
                  type="number"
                  value={elUsage}
                  onChange={(e) => setElUsage(e.target.value)}
                  placeholder={t("electric.usagePlaceholder")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* 용도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("electric.purposeLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["residential", t("electric.residential")],
                      ["commercial", t("electric.commercial")],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setElType(val as ElectricType)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-colors cursor-pointer ${
                        elType === val
                          ? "border-yellow-500 bg-yellow-50 text-yellow-800 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-yellow-300"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 계절 (주택용만) */}
              {elType === "residential" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("electric.seasonLabel")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["other", t("electric.seasonOther")],
                        ["summer", t("electric.seasonSummer")],
                      ] as const
                    ).map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setElSeason(val as Season)}
                        className={`py-2 px-3 rounded-lg text-sm border transition-colors cursor-pointer ${
                          elSeason === val
                            ? "border-yellow-500 bg-yellow-50 text-yellow-800 font-medium"
                            : "border-gray-200 text-gray-600 hover:border-yellow-300"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 복지할인 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("electric.discountLabel")}
                </label>
                <select
                  value={elDiscount}
                  onChange={(e) =>
                    setElDiscount(e.target.value as DiscountType)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
                >
                  <option value="none">{t("electric.discountNone")}</option>
                  <option value="disability">{t("electric.discountDisability")}</option>
                  <option value="basicLiving">{t("electric.discountBasicLiving")}</option>
                  <option value="nextLowest">{t("electric.discountNextLowest")}</option>
                  <option value="largeFam">{t("electric.discountLargeFam")}</option>
                  <option value="newborn">{t("electric.discountNewborn")}</option>
                </select>
              </div>

              <button
                onClick={calcElectric}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                {t("electric.calcButton")}
              </button>
            </div>

            {/* 전기 결과 */}
            {elResult && <ElectricResult result={elResult} />}
          </section>
        )}

        {/* Water Tab */}
        {activeTab === "water" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                {t("water.title")}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  {t("water.seoulBasis")}
                </span>
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("water.usageLabel")}
                </label>
                <input
                  type="number"
                  value={wtUsage}
                  onChange={(e) => setWtUsage(e.target.value)}
                  placeholder={t("water.usagePlaceholder")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("water.purposeLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["household", t("water.household")],
                      ["business", t("water.business")],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setWtPurpose(val as WaterPurpose)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-colors cursor-pointer ${
                        wtPurpose === val
                          ? "border-blue-500 bg-blue-50 text-blue-800 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={calcWater}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                {t("water.calcButton")}
              </button>
            </div>

            {wtResult && <WaterResult result={wtResult} />}
          </section>
        )}

        {/* Gas Tab */}
        {activeTab === "gas" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                {t("gas.title")}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  {t("gas.seoulBasis")}
                </span>
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("gas.usageLabel")}
                </label>
                <input
                  type="number"
                  value={gsUsage}
                  onChange={(e) => setGsUsage(e.target.value)}
                  placeholder={t("gas.usagePlaceholder")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("gas.purposeLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["cooking", t("gas.cooking")],
                      ["heating", t("gas.heating")],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setGsPurpose(val as GasPurpose)}
                      className={`py-2 px-3 rounded-lg text-sm border transition-colors cursor-pointer ${
                        gsPurpose === val
                          ? "border-orange-500 bg-orange-50 text-orange-800 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-orange-300"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={calcGas}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                {t("gas.calcButton")}
              </button>
            </div>

            {gsResult && <GasResult result={gsResult} />}
          </section>
        )}

        {/* 절약 팁 */}
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-green-50/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-sm">
                {t("tips.title")}
              </span>
            </div>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showTips && (
            <div className="px-5 pb-5 space-y-4">
              {(["electric", "water", "gas"] as const).map((type) => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    {tipIcons[type]}
                    <h3 className="font-medium text-sm">
                      {t(tipTitleKeys[type])}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <TrendingDown className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-500" />
                        {t(`tips.${type}.${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BillInfoSection />

      <RelatedTools currentToolId="bill" />

      {/* Footer */}
      <footer className="border-t border-yellow-200 bg-white/60 mt-8">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">
              {t("footer.privacy")}
            </a>
            <a href="/terms" className="hover:text-gray-600">
              {t("footer.terms")}
            </a>
          </div>

          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            {t("footer.footerNote")}
            <br />
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// 전기요금 결과 컴포넌트
// ============================================================
function ElectricResult({ result }: { result: ElectricBillResult }) {
  const { t, locale } = useTranslation();
  const maxTierAmount = Math.max(...result.tiers.map((t) => t.amount), 1);
  const currencyUnit = t("result.won");

  return (
    <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 space-y-5">
      {/* 총액 */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">{t("result.estimatedElectric")}</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-yellow-700">
          {locale === "en" && <span className="text-lg mr-1">{currencyUnit}</span>}
          {formatNumber(result.total)}
          {locale === "ko" && <span className="text-lg ml-1">{currencyUnit}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.type === "residential" ? t("result.residentialLabel") : t("result.commercialLabel")} &middot;{" "}
          {result.season === "summer" ? t("result.summerLabel") : t("result.otherSeasonLabel")} &middot; {result.usage}
          kWh
        </p>
      </div>

      {/* 누진 구간 시각화 */}
      {result.type === "residential" && result.tiers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("result.progressiveTiers")}
          </h3>
          {result.tiers.map((tier, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{tier.label}</span>
                <span className="font-medium">
                  {formatNumber(tier.usage)}kWh &times;{" "}
                  {tier.unitPrice}{currencyUnit} ={" "}
                  <span className="text-yellow-700">
                    {formatNumber(tier.amount)}{currencyUnit}
                  </span>
                </span>
              </div>
              <div className="w-full bg-yellow-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${Math.max(
                      (tier.amount / maxTierAmount) * 100,
                      4
                    )}%`,
                    backgroundColor:
                      i === 0
                        ? "#22C55E"
                        : i === 1
                        ? "#F59E0B"
                        : "#DC2626",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 상세 내역 */}
      <div className="space-y-2 text-sm">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t("result.feeDetail")}
        </h3>
        <Row label={t("result.baseFee")} value={result.baseFee} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.energyCharge")} value={result.energyCharge} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.climateCharge")} value={result.climateCharge} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.fuelAdjust")} value={result.fuelAdjust} currencyUnit={currencyUnit} locale={locale} />
        {result.discount > 0 && (
          <Row
            label={t("result.welfareDiscount", { label: result.discountLabel })}
            value={-result.discount}
            highlight
            currencyUnit={currencyUnit}
            locale={locale}
          />
        )}
        <div className="border-t border-gray-100 pt-2">
          <Row label={t("result.subtotal")} value={result.subtotal} currencyUnit={currencyUnit} locale={locale} />
        </div>
        <Row label={t("result.vat")} value={result.vat} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.elecFund")} value={result.fund} currencyUnit={currencyUnit} locale={locale} />
        <div className="border-t border-yellow-200 pt-2">
          <Row label={t("result.totalSum")} value={result.total} bold currencyUnit={currencyUnit} locale={locale} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 수도요금 결과 컴포넌트
// ============================================================
function WaterResult({ result }: { result: WaterBillResult }) {
  const { t, locale } = useTranslation();
  const maxTierAmount = Math.max(...result.tiers.map((t) => t.amount), 1);
  const currencyUnit = t("result.won");

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">{t("result.estimatedWater")}</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-blue-700">
          {locale === "en" && <span className="text-lg mr-1">{currencyUnit}</span>}
          {formatNumber(result.total)}
          {locale === "ko" && <span className="text-lg ml-1">{currencyUnit}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.purpose === "household" ? t("result.householdLabel") : t("result.businessLabel")} &middot; {t("result.seoulCity")} &middot;{" "}
          {result.usage}m&sup3;
        </p>
      </div>

      {/* 구간별 */}
      {result.purpose === "household" && result.tiers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("result.usageTiers")}
          </h3>
          {result.tiers.map((tier, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{tier.label}</span>
                <span className="font-medium">
                  {formatNumber(tier.usage)}m&sup3; &times;{" "}
                  {formatNumber(tier.unitPrice)}{currencyUnit} ={" "}
                  <span className="text-blue-700">
                    {formatNumber(tier.amount)}{currencyUnit}
                  </span>
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${Math.max(
                      (tier.amount / maxTierAmount) * 100,
                      4
                    )}%`,
                    opacity: 0.5 + i * 0.25,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 text-sm">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t("result.feeDetail")}
        </h3>
        <Row label={t("result.waterBaseFee")} value={result.baseFee} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.waterUsageCharge")} value={result.usageCharge} currencyUnit={currencyUnit} locale={locale} />
        <Row label={t("result.sewerCharge")} value={result.sewerCharge} currencyUnit={currencyUnit} locale={locale} />
        <Row
          label={t("result.waterUseFee")}
          value={result.waterUseFee}
          currencyUnit={currencyUnit}
          locale={locale}
        />
        <div className="border-t border-blue-200 pt-2">
          <Row label={t("result.totalSum")} value={result.total} bold currencyUnit={currencyUnit} locale={locale} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 가스요금 결과 컴포넌트
// ============================================================
function GasResult({ result }: { result: GasBillResult }) {
  const { t, locale } = useTranslation();
  const currencyUnit = t("result.won");

  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">{t("result.estimatedGas")}</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-orange-700">
          {locale === "en" && <span className="text-lg mr-1">{currencyUnit}</span>}
          {formatNumber(result.total)}
          {locale === "ko" && <span className="text-lg ml-1">{currencyUnit}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.purpose === "cooking" ? t("result.cookingLabel") : t("result.heatingLabel")} &middot; {t("result.seoulGas")} &middot;{" "}
          {result.usage}m&sup3;
        </p>
      </div>

      <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
        <p>
          {t("result.gasConversion", { mj: result.mjPerCubic, price: result.unitPricePerMJ })}
          <strong>{t("result.gasConversionResult", { unitPrice: formatNumber(result.effectiveUnitPrice) })}</strong>
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t("result.feeDetail")}
        </h3>
        <Row label={t("result.baseFee")} value={result.baseFee} currencyUnit={currencyUnit} locale={locale} />
        <Row
          label={t("result.gasUsageCharge", { usage: result.usage, unitPrice: formatNumber(result.effectiveUnitPrice) })}
          value={result.usageCharge}
          currencyUnit={currencyUnit}
          locale={locale}
        />
        <div className="border-t border-gray-100 pt-2">
          <Row label={t("result.subtotal")} value={result.subtotal} currencyUnit={currencyUnit} locale={locale} />
        </div>
        <Row label={t("result.vat")} value={result.vat} currencyUnit={currencyUnit} locale={locale} />
        <div className="border-t border-orange-200 pt-2">
          <Row label={t("result.totalSum")} value={result.total} bold currencyUnit={currencyUnit} locale={locale} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 공통 행 컴포넌트
// ============================================================
function Row({
  label,
  value,
  bold,
  highlight,
  currencyUnit,
  locale,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  currencyUnit: string;
  locale: string;
}) {
  return (
    <div
      className={`flex justify-between items-center ${
        bold ? "font-bold text-base" : ""
      }`}
    >
      <span
        className={highlight ? "text-green-700" : "text-gray-600"}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <span
        className={
          highlight
            ? "text-green-700 font-medium"
            : bold
            ? "text-gray-900"
            : "text-gray-800"
        }
      >
        {value < 0 ? "-" : ""}
        {locale === "en" && `${currencyUnit} `}
        {formatNumber(Math.abs(value))}
        {locale === "ko" && currencyUnit}
      </span>
    </div>
  );
}
