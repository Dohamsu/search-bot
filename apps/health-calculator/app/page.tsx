"use client";

import { useState, useMemo } from "react";
import { Heart, Activity, Flame, Scale, Target } from "lucide-react";
import {
  type Gender,
  getBMIResult,
  getBMRResult,
  calculateTDEE,
  calculateBodyFat,
  calculateStandardWeight,
  ACTIVITY_LEVELS,
} from "./lib/healthCalc";

type Tab = "bmi" | "bmr" | "tdee" | "bodyfat" | "standard";

const TABS: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: "bmi", label: "BMI", icon: Heart },
  { id: "bmr", label: "기초대사량", icon: Activity },
  { id: "tdee", label: "TDEE", icon: Flame },
  { id: "bodyfat", label: "체지방률", icon: Scale },
  { id: "standard", label: "표준체중", icon: Target },
];


export default function HealthCalculator() {
  const [tab, setTab] = useState<Tab>("bmi");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Body fat extras
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");

  // TDEE activity
  const [activityIdx, setActivityIdx] = useState(2);

  const ageNum = Number(age) || 0;
  const heightNum = Number(height) || 0;
  const weightNum = Number(weight) || 0;
  const waistNum = Number(waist) || 0;
  const neckNum = Number(neck) || 0;
  const hipNum = Number(hip) || 0;

  const canCalcBase = heightNum > 0 && weightNum > 0;
  const canCalcAge = canCalcBase && ageNum > 0;

  const bmiResult = useMemo(
    () => (canCalcBase ? getBMIResult(weightNum, heightNum) : null),
    [canCalcBase, weightNum, heightNum]
  );

  const bmrResult = useMemo(
    () =>
      canCalcAge ? getBMRResult(gender, weightNum, heightNum, ageNum) : null,
    [canCalcAge, gender, weightNum, heightNum, ageNum]
  );

  const tdeeResult = useMemo(() => {
    if (!bmrResult) return null;
    return calculateTDEE(bmrResult.average, ACTIVITY_LEVELS[activityIdx].value);
  }, [bmrResult, activityIdx]);

  const bodyFatResult = useMemo(() => {
    if (heightNum <= 0 || waistNum <= 0 || neckNum <= 0) return null;
    if (gender === "female" && hipNum <= 0) return null;
    if (gender === "male" && waistNum - neckNum <= 0) return null;
    if (gender === "female" && waistNum + hipNum - neckNum <= 0) return null;
    return calculateBodyFat(gender, heightNum, waistNum, neckNum, hipNum);
  }, [gender, heightNum, waistNum, neckNum, hipNum]);

  const standardResult = useMemo(
    () => (canCalcBase ? calculateStandardWeight(heightNum, weightNum) : null),
    [canCalcBase, heightNum, weightNum]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--health-border)] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Heart className="w-6 h-6 text-[var(--health-primary)]" fill="var(--health-primary)" />
          <h1 className="font-[family-name:var(--font-space)] text-lg font-bold text-[var(--health-primary)]">
            건강 계산기
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Common Inputs */}
        <section className="bg-white rounded-2xl border border-[var(--health-border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--health-primary)] mb-4">기본 정보</h2>

          {/* Gender Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                gender === "male"
                  ? "bg-[var(--health-primary)] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                gender === "female"
                  ? "bg-[var(--health-primary)] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              여성
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputField label="나이" value={age} onChange={setAge} unit="세" placeholder="25" />
            <InputField label="키" value={height} onChange={setHeight} unit="cm" placeholder="170" />
            <InputField label="체중" value={weight} onChange={setWeight} unit="kg" placeholder="65" />
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="flex gap-1 bg-white rounded-2xl border border-[var(--health-border)] p-1.5 shadow-sm overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                tab === id
                  ? "bg-[var(--health-primary)] text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <section className="bg-white rounded-2xl border border-[var(--health-border)] p-5 shadow-sm">
          {tab === "bmi" && <BMITab result={bmiResult} />}
          {tab === "bmr" && <BMRTab result={bmrResult} />}
          {tab === "tdee" && (
            <TDEETab
              result={tdeeResult}
              activityIdx={activityIdx}
              onActivityChange={setActivityIdx}
            />
          )}
          {tab === "bodyfat" && (
            <BodyFatTab
              result={bodyFatResult}
              gender={gender}
              waist={waist}
              neck={neck}
              hip={hip}
              onWaistChange={setWaist}
              onNeckChange={setNeck}
              onHipChange={setHip}
            />
          )}
          {tab === "standard" && <StandardTab result={standardResult} />}
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed px-2">
          이 계산기는 참고용이며, 정확한 건강 상담은 전문의와 상의하세요.
          <br />
          BMI 판정은 대한비만학회 아시아-태평양 기준을 따릅니다.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--health-border)] bg-white/60 backdrop-blur-sm mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:underline">
              개인정보처리방침
            </a>
            <a href="/terms" className="hover:underline">
              이용약관
            </a>
          </div>
          <p className="text-center text-xs text-gray-300 mt-3">
            &copy; {new Date().getFullYear()} 건강 계산기. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────── Input Field ────────────────────────── */

function InputField({
  label,
  value,
  onChange,
  unit,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[var(--health-border)] rounded-xl px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--health-primary)]/30 focus:border-[var(--health-primary)] transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── Result Card ────────────────────────── */

function ResultCard({
  value,
  unit,
  label,
  color,
  sub,
}: {
  value: string;
  unit?: string;
  label: string;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className="font-[family-name:var(--font-space)] text-3xl font-bold"
        style={{ color: color || "var(--health-primary)" }}
      >
        {value}
        {unit && <span className="text-base font-normal ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ────────────────────────── BMI Gauge ────────────────────────── */

function BMIGauge({ bmi }: { bmi: number }) {
  // Clamp BMI for display between 10 and 40
  const displayBmi = Math.max(10, Math.min(40, bmi));
  const percent = ((displayBmi - 10) / 30) * 100;

  const segments = [
    { label: "저체중", from: 0, to: ((18.5 - 10) / 30) * 100, color: "#3B82F6" },
    { label: "정상", from: ((18.5 - 10) / 30) * 100, to: ((23 - 10) / 30) * 100, color: "#22C55E" },
    { label: "과체중", from: ((23 - 10) / 30) * 100, to: ((25 - 10) / 30) * 100, color: "#EAB308" },
    { label: "비만1", from: ((25 - 10) / 30) * 100, to: ((30 - 10) / 30) * 100, color: "#F97316" },
    { label: "비만2", from: ((30 - 10) / 30) * 100, to: 100, color: "#EF4444" },
  ];

  return (
    <div className="mt-4">
      <div className="relative h-4 rounded-full overflow-hidden flex">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${s.to - s.from}%`,
              backgroundColor: s.color,
            }}
            className="h-full"
          />
        ))}
        {/* indicator */}
        <div
          className="absolute top-0 w-0.5 h-full bg-white"
          style={{ left: `${percent}%`, boxShadow: "0 0 4px rgba(0,0,0,0.5)" }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        <span>10</span>
        <span>18.5</span>
        <span>23</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}

/* ────────────────────────── Tab: BMI ────────────────────────── */

function BMITab({ result }: { result: ReturnType<typeof getBMIResult> | null }) {
  if (!result) {
    return <EmptyState message="키와 체중을 입력하면 BMI를 계산합니다." />;
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">BMI (체질량지수)</h3>
      <ResultCard
        value={result.bmi.toFixed(1)}
        unit="kg/m²"
        label="BMI"
        color={result.color}
        sub={result.category}
      />
      <BMIGauge bmi={result.bmi} />

      <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-medium">정상 체중 범위:</span>{" "}
          {result.normalWeightMin.toFixed(1)} ~ {result.normalWeightMax.toFixed(1)} kg
        </p>
        <p className="text-gray-400 mt-2">
          * 대한비만학회 아시아-태평양 기준 (WHO 기준: 과체중 25+, 비만 30+)
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-600">BMI 분류 기준 (아시아-태평양)</p>
        <div className="grid grid-cols-2 gap-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#3B82F6"}} />저체중: 18.5 미만</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#22C55E"}} />정상: 18.5 ~ 22.9</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#EAB308"}} />과체중: 23 ~ 24.9</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#F97316"}} />비만 1단계: 25 ~ 29.9</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#EF4444"}} />비만 2단계: 30 이상</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── Tab: BMR ────────────────────────── */

function BMRTab({ result }: { result: ReturnType<typeof getBMRResult> | null }) {
  if (!result) {
    return <EmptyState message="성별, 나이, 키, 체중을 입력하면 기초대사량을 계산합니다." />;
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">기초대사량 (BMR)</h3>
      <ResultCard
        value={result.average.toFixed(0)}
        unit="kcal/일"
        label="평균 기초대사량"
        sub="두 공식의 평균값"
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Harris-Benedict</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.harrisBenedict.toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">kcal/일</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Mifflin-St Jeor</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.mifflinStJeor.toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">kcal/일</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        * Mifflin-St Jeor 공식이 현대인 체형에 더 정확한 것으로 알려져 있습니다.
      </p>
    </div>
  );
}

/* ────────────────────────── Tab: TDEE ────────────────────────── */

function TDEETab({
  result,
  activityIdx,
  onActivityChange,
}: {
  result: ReturnType<typeof calculateTDEE> | null;
  activityIdx: number;
  onActivityChange: (i: number) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">TDEE (일일 총 에너지 소비량)</h3>

      {/* Activity level */}
      <label className="block text-xs text-gray-500 mb-2">활동 수준</label>
      <div className="space-y-1.5 mb-5">
        {ACTIVITY_LEVELS.map((level, i) => (
          <button
            key={i}
            onClick={() => onActivityChange(i)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border ${
              activityIdx === i
                ? "border-[var(--health-primary)] bg-[var(--health-primary)]/5 text-[var(--health-primary)] font-medium"
                : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
            }`}
          >
            {level.label}
            <span className="text-gray-400 ml-1">(&times;{level.value})</span>
          </button>
        ))}
      </div>

      {!result ? (
        <EmptyState message="성별, 나이, 키, 체중을 입력하면 TDEE를 계산합니다." />
      ) : (
        <>
          <ResultCard
            value={result.tdee.toFixed(0)}
            unit="kcal/일"
            label="일일 총 에너지 소비량"
          />
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-400 mb-0.5">감량 (-500)</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-blue-600">
                {result.deficit.toFixed(0)}
              </p>
              <p className="text-[10px] text-blue-400">kcal</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-green-400 mb-0.5">유지</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-green-600">
                {result.maintenance.toFixed(0)}
              </p>
              <p className="text-[10px] text-green-400">kcal</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-orange-400 mb-0.5">증량 (+500)</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-orange-600">
                {result.surplus.toFixed(0)}
              </p>
              <p className="text-[10px] text-orange-400">kcal</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * 주당 약 0.45kg 감량/증량 목표 기준 (500kcal 조절)
          </p>
        </>
      )}
    </div>
  );
}

/* ────────────────────────── Tab: Body Fat ────────────────────────── */

function BodyFatTab({
  result,
  gender,
  waist,
  neck,
  hip,
  onWaistChange,
  onNeckChange,
  onHipChange,
}: {
  result: ReturnType<typeof calculateBodyFat> | null;
  gender: Gender;
  waist: string;
  neck: string;
  hip: string;
  onWaistChange: (v: string) => void;
  onNeckChange: (v: string) => void;
  onHipChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">체지방률 (미 해군 공식)</h3>

      <div className={`grid ${gender === "female" ? "grid-cols-3" : "grid-cols-2"} gap-3 mb-5`}>
        <InputField label="허리둘레" value={waist} onChange={onWaistChange} unit="cm" placeholder="80" />
        <InputField label="목둘레" value={neck} onChange={onNeckChange} unit="cm" placeholder="37" />
        {gender === "female" && (
          <InputField label="엉덩이둘레" value={hip} onChange={onHipChange} unit="cm" placeholder="95" />
        )}
      </div>

      {!result ? (
        <EmptyState message="키와 추가 측정값을 입력하면 체지방률을 계산합니다." />
      ) : result.bodyFatPercent < 0 || result.bodyFatPercent > 70 ? (
        <EmptyState message="입력값을 확인해주세요. 측정값이 올바르지 않습니다." />
      ) : (
        <>
          <ResultCard
            value={result.bodyFatPercent.toFixed(1)}
            unit="%"
            label="체지방률"
            color={result.color}
            sub={result.category}
          />
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">체지방률 분류 기준</p>
            {gender === "male" ? (
              <div className="grid grid-cols-2 gap-1">
                <span>필수 지방: 2-5%</span>
                <span>운동선수: 6-13%</span>
                <span>피트니스: 14-17%</span>
                <span>보통: 18-24%</span>
                <span>비만: 25% 이상</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                <span>필수 지방: 10-13%</span>
                <span>운동선수: 14-20%</span>
                <span>피트니스: 21-24%</span>
                <span>보통: 25-31%</span>
                <span>비만: 32% 이상</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────── Tab: Standard Weight ────────────────────────── */

function StandardTab({
  result,
}: {
  result: ReturnType<typeof calculateStandardWeight> | null;
}) {
  if (!result) {
    return <EmptyState message="키와 체중을 입력하면 표준 체중을 계산합니다." />;
  }

  const avg = (result.broca + result.bmiBase) / 2;
  const diffSign = result.difference > 0 ? "+" : "";
  const diffColor =
    Math.abs(result.differencePercent) <= 10
      ? "var(--health-success)"
      : Math.abs(result.differencePercent) <= 20
      ? "var(--health-warning)"
      : "var(--health-danger)";

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">표준 체중</h3>
      <ResultCard
        value={avg.toFixed(1)}
        unit="kg"
        label="표준 체중 (평균)"
        sub={`현재 체중과의 차이: ${diffSign}${result.difference.toFixed(1)}kg`}
        color={diffColor}
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">브로카 변법</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.broca.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-400">kg</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">BMI 기준 (22)</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.bmiBase.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-400">kg</p>
        </div>
      </div>
      <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
        <p>
          <span className="font-medium">현재 체중 대비:</span>{" "}
          <span style={{ color: diffColor, fontWeight: 600 }}>
            {diffSign}{result.differencePercent.toFixed(1)}%
          </span>
        </p>
        <p className="text-gray-400 mt-1">
          * 브로카 변법: (키 - 100) &times; 0.9 / BMI 기준: 22 &times; (키m)&sup2;
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────── Empty State ────────────────────────── */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
