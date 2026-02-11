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

type TabType = "electric" | "water" | "gas";


// ============================================================
// 절약 팁 데이터
// ============================================================
const TIPS: Record<TabType, { icon: React.ReactNode; tips: string[] }> = {
  electric: {
    icon: <Zap className="w-5 h-5 text-yellow-600" />,
    tips: [
      "대기전력 차단 멀티탭을 사용하면 월 평균 5~10% 전기요금을 절약할 수 있습니다.",
      "에어컨 적정 온도는 26~28도. 1도 올리면 약 7% 절감됩니다.",
      "LED 조명으로 교체하면 백열등 대비 약 80% 에너지를 절약합니다.",
      "냉장고 문을 자주 열지 않고, 벽에서 10cm 이상 띄워 놓으세요.",
      "세탁기/건조기는 모아서 한 번에 돌리는 것이 효율적입니다.",
    ],
  },
  water: {
    icon: <Droplets className="w-5 h-5 text-blue-600" />,
    tips: [
      "절수 샤워 헤드를 사용하면 물 사용량을 약 30~40% 줄일 수 있습니다.",
      "세탁기는 모아서 돌리고, 적정 수위를 설정하세요.",
      "양치할 때 컵을 사용하면 연간 약 12,000L의 물을 절약합니다.",
      "설거지할 때 물을 받아서 하면 흘려보내는 것보다 약 50% 절약됩니다.",
      "화장실 변기 수조에 물을 채운 페트병을 넣으면 매번 1~2L 절약됩니다.",
    ],
  },
  gas: {
    icon: <Flame className="w-5 h-5 text-orange-600" />,
    tips: [
      "보일러 외출모드를 활용하면 불필요한 난방을 줄일 수 있습니다.",
      "창문/문틈 단열테이프, 커튼을 활용하면 난방 효율이 올라갑니다.",
      "보일러 온수 온도를 낮추면 가스 사용량이 줄어듭니다.",
      "요리할 때 뚜껑을 덮으면 조리 시간이 단축되어 가스를 절약합니다.",
      "보일러 배관 청소를 정기적으로 하면 효율이 개선됩니다.",
    ],
  },
};

// ============================================================
// 메인 컴포넌트
// ============================================================
export default function UtilityBillPage() {
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
      label: "전기요금",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      key: "water",
      label: "수도요금",
      icon: <Droplets className="w-5 h-5" />,
    },
    {
      key: "gas",
      label: "가스요금",
      icon: <Flame className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-yellow-200 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-[family-name:var(--font-space-grotesk-var)] text-gray-900">
              공과금 계산기
            </h1>
            <p className="text-xs text-gray-500">
              전기 · 수도 · 가스 요금 계산
            </p>
          </div>
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
            요금은 2026년 기준 근사치입니다. 실제 요금은 지역, 공급사, 계절 등에
            따라 다를 수 있습니다.
          </p>
        </div>

        {/* Electric Tab */}
        {activeTab === "electric" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                전기요금 계산기
              </h2>

              {/* 사용량 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전기 사용량 (kWh)
                </label>
                <input
                  type="number"
                  value={elUsage}
                  onChange={(e) => setElUsage(e.target.value)}
                  placeholder="예: 350"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* 용도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  용도
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["residential", "주택용 (저압)"],
                      ["commercial", "일반용 (갑) I"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setElType(val)}
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
                    계절
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["other", "기타 (3~6월, 9~2월)"],
                        ["summer", "여름 (7~8월)"],
                      ] as const
                    ).map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setElSeason(val)}
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
                  복지할인
                </label>
                <select
                  value={elDiscount}
                  onChange={(e) =>
                    setElDiscount(e.target.value as DiscountType)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
                >
                  <option value="none">없음</option>
                  <option value="disability">장애인 할인</option>
                  <option value="basicLiving">기초생활 수급자</option>
                  <option value="nextLowest">차상위 계층</option>
                  <option value="largeFam">대가족 할인</option>
                  <option value="newborn">출산가구 할인</option>
                </select>
              </div>

              <button
                onClick={calcElectric}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                전기요금 계산하기
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
                수도요금 계산기
                <span className="text-xs font-normal text-gray-400 ml-1">
                  (서울시 기준)
                </span>
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수도 사용량 (m&sup3;)
                </label>
                <input
                  type="number"
                  value={wtUsage}
                  onChange={(e) => setWtUsage(e.target.value)}
                  placeholder="예: 20"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  용도
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["household", "가정용"],
                      ["business", "업무용"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setWtPurpose(val)}
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
                수도요금 계산하기
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
                도시가스 요금 계산기
                <span className="text-xs font-normal text-gray-400 ml-1">
                  (서울도시가스 기준)
                </span>
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가스 사용량 (m&sup3;)
                </label>
                <input
                  type="number"
                  value={gsUsage}
                  onChange={(e) => setGsUsage(e.target.value)}
                  placeholder="예: 30"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  용도
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["cooking", "취사용"],
                      ["heating", "난방용"],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => setGsPurpose(val)}
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
                가스요금 계산하기
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
                공과금 절약 팁
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
                    {TIPS[type].icon}
                    <h3 className="font-medium text-sm">
                      {type === "electric"
                        ? "전기 절약"
                        : type === "water"
                        ? "수도 절약"
                        : "가스 절약"}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {TIPS[type].tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <TrendingDown className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-200 bg-white/60 mt-8">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">
              개인정보처리방침
            </a>
            <a href="/terms" className="hover:text-gray-600">
              이용약관
            </a>
          </div>

          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            이 계산기는 참고용이며, 실제 요금은 지역·공급사에 따라 다를 수
            있습니다.
            <br />
            &copy; 2026 공과금 계산기. All rights reserved.
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
  const maxTierAmount = Math.max(...result.tiers.map((t) => t.amount), 1);

  return (
    <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 space-y-5">
      {/* 총액 */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">예상 전기요금</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-yellow-700">
          {formatNumber(result.total)}
          <span className="text-lg ml-1">원</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.type === "residential" ? "주택용" : "일반용"} ·{" "}
          {result.season === "summer" ? "여름" : "기타계절"} · {result.usage}
          kWh
        </p>
      </div>

      {/* 누진 구간 시각화 */}
      {result.type === "residential" && result.tiers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            누진 구간별 요금
          </h3>
          {result.tiers.map((tier, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{tier.label}</span>
                <span className="font-medium">
                  {formatNumber(tier.usage)}kWh &times;{" "}
                  {tier.unitPrice}원 ={" "}
                  <span className="text-yellow-700">
                    {formatNumber(tier.amount)}원
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
          요금 상세
        </h3>
        <Row label="기본료" value={result.baseFee} />
        <Row label="전력량요금" value={result.energyCharge} />
        <Row label="기후환경요금 (9원/kWh)" value={result.climateCharge} />
        <Row label="연료비조정액 (5원/kWh)" value={result.fuelAdjust} />
        {result.discount > 0 && (
          <Row
            label={`복지할인 (${result.discountLabel})`}
            value={-result.discount}
            highlight
          />
        )}
        <div className="border-t border-gray-100 pt-2">
          <Row label="소계" value={result.subtotal} />
        </div>
        <Row label="부가가치세 (10%)" value={result.vat} />
        <Row label="전력산업기반기금 (3.7%)" value={result.fund} />
        <div className="border-t border-yellow-200 pt-2">
          <Row label="총 합계" value={result.total} bold />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 수도요금 결과 컴포넌트
// ============================================================
function WaterResult({ result }: { result: WaterBillResult }) {
  const maxTierAmount = Math.max(...result.tiers.map((t) => t.amount), 1);

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">예상 수도요금</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-blue-700">
          {formatNumber(result.total)}
          <span className="text-lg ml-1">원</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.purpose === "household" ? "가정용" : "업무용"} · 서울시 ·{" "}
          {result.usage}m&sup3;
        </p>
      </div>

      {/* 구간별 */}
      {result.purpose === "household" && result.tiers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            사용 구간별 요금
          </h3>
          {result.tiers.map((tier, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{tier.label}</span>
                <span className="font-medium">
                  {formatNumber(tier.usage)}m&sup3; &times;{" "}
                  {formatNumber(tier.unitPrice)}원 ={" "}
                  <span className="text-blue-700">
                    {formatNumber(tier.amount)}원
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
          요금 상세
        </h3>
        <Row label="상수도 기본료 (15mm)" value={result.baseFee} />
        <Row label="상수도 사용료" value={result.usageCharge} />
        <Row label="하수도요금 (470원/m&sup3;)" value={result.sewerCharge} />
        <Row
          label="물이용부담금 (170원/m&sup3;)"
          value={result.waterUseFee}
        />
        <div className="border-t border-blue-200 pt-2">
          <Row label="총 합계" value={result.total} bold />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 가스요금 결과 컴포넌트
// ============================================================
function GasResult({ result }: { result: GasBillResult }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">예상 가스요금</p>
        <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk-var)] text-orange-700">
          {formatNumber(result.total)}
          <span className="text-lg ml-1">원</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.purpose === "cooking" ? "취사용" : "난방용"} · 서울도시가스 ·{" "}
          {result.usage}m&sup3;
        </p>
      </div>

      <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
        <p>
          1m&sup3; = {result.mjPerCubic}MJ &times;{" "}
          {result.unitPricePerMJ}원/MJ ={" "}
          <strong>약 {formatNumber(result.effectiveUnitPrice)}원/m&sup3;</strong>
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          요금 상세
        </h3>
        <Row label="기본료" value={result.baseFee} />
        <Row
          label={`사용요금 (${result.usage}m\u00B3 \u00D7 ${formatNumber(result.effectiveUnitPrice)}원)`}
          value={result.usageCharge}
        />
        <div className="border-t border-gray-100 pt-2">
          <Row label="소계" value={result.subtotal} />
        </div>
        <Row label="부가가치세 (10%)" value={result.vat} />
        <div className="border-t border-orange-200 pt-2">
          <Row label="총 합계" value={result.total} bold />
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
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
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
        {formatNumber(Math.abs(value))}원
      </span>
    </div>
  );
}
