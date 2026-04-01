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
  ACTIVITY_LEVEL_VALUES,
} from "./lib/healthCalc";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import HealthInfoSection from "./components/HealthInfoSection";

type Tab = "bmi" | "bmr" | "tdee" | "bodyfat" | "standard";

const TAB_ICONS: Record<Tab, typeof Heart> = {
  bmi: Heart,
  bmr: Activity,
  tdee: Flame,
  bodyfat: Scale,
  standard: Target,
};

export default function HealthCalculator() {
  const { t } = useTranslation();
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
    return calculateTDEE(bmrResult.average, ACTIVITY_LEVEL_VALUES[activityIdx]);
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

  const tabIds: Tab[] = ["bmi", "bmr", "tdee", "bodyfat", "standard"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--health-border)] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Heart className="w-6 h-6 text-[var(--health-primary)]" fill="var(--health-primary)" />
          <h1 className="font-[family-name:var(--font-space)] text-lg font-bold text-[var(--health-primary)] flex-1">
            {t("header.title")}
          </h1>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Common Inputs */}
        <section className="bg-white rounded-2xl border border-[var(--health-border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--health-primary)] mb-4">{t("common.basicInfo")}</h2>

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
              {t("common.male")}
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                gender === "female"
                  ? "bg-[var(--health-primary)] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t("common.female")}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputField label={t("common.age")} value={age} onChange={setAge} unit={t("common.ageUnit")} placeholder="25" />
            <InputField label={t("common.height")} value={height} onChange={setHeight} unit={t("common.cmUnit")} placeholder="170" />
            <InputField label={t("common.weight")} value={weight} onChange={setWeight} unit={t("common.kgUnit")} placeholder="65" />
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="flex gap-1 bg-white rounded-2xl border border-[var(--health-border)] p-1.5 shadow-sm overflow-x-auto">
          {tabIds.map((id) => {
            const Icon = TAB_ICONS[id];
            return (
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
                {t(`tabs.${id}`)}
              </button>
            );
          })}
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
          {t("disclaimer.line1")}
          <br />
          {t("disclaimer.line2")}
        </p>
      </main>

      <HealthInfoSection />
      <RelatedTools currentToolId="health" />

      {/* Footer */}
      <footer className="border-t border-[var(--health-border)] bg-white/60 backdrop-blur-sm mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </a>
            <a href="/terms" className="hover:underline">
              {t("footer.terms")}
            </a>
          </div>
          <p className="text-center text-xs text-gray-300 mt-3">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}. All rights reserved.
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
  const { t } = useTranslation();
  // Clamp BMI for display between 10 and 40
  const displayBmi = Math.max(10, Math.min(40, bmi));
  const percent = ((displayBmi - 10) / 30) * 100;

  const segments = [
    { label: t("bmiGauge.underweight"), from: 0, to: ((18.5 - 10) / 30) * 100, color: "#3B82F6" },
    { label: t("bmiGauge.normal"), from: ((18.5 - 10) / 30) * 100, to: ((23 - 10) / 30) * 100, color: "#22C55E" },
    { label: t("bmiGauge.overweight"), from: ((23 - 10) / 30) * 100, to: ((25 - 10) / 30) * 100, color: "#EAB308" },
    { label: t("bmiGauge.obese1"), from: ((25 - 10) / 30) * 100, to: ((30 - 10) / 30) * 100, color: "#F97316" },
    { label: t("bmiGauge.obese2"), from: ((30 - 10) / 30) * 100, to: 100, color: "#EF4444" },
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
  const { t } = useTranslation();

  if (!result) {
    return <EmptyState message={t("bmi.emptyState")} />;
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">{t("bmi.title")}</h3>
      <ResultCard
        value={result.bmi.toFixed(1)}
        unit={t("bmi.unit")}
        label={t("bmi.label")}
        color={result.color}
        sub={t(result.categoryKey)}
      />
      <BMIGauge bmi={result.bmi} />

      <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-medium">{t("bmi.normalWeightRange")}</span>{" "}
          {result.normalWeightMin.toFixed(1)} ~ {result.normalWeightMax.toFixed(1)} kg
        </p>
        <p className="text-gray-400 mt-2">
          {t("bmi.standardNote")}
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-600">{t("bmi.classificationTitle")}</p>
        <div className="grid grid-cols-2 gap-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#3B82F6"}} />{t("bmi.underweightRange")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#22C55E"}} />{t("bmi.normalRange")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#EAB308"}} />{t("bmi.overweightRange")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#F97316"}} />{t("bmi.obese1Range")}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#EF4444"}} />{t("bmi.obese2Range")}</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── Tab: BMR ────────────────────────── */

function BMRTab({ result }: { result: ReturnType<typeof getBMRResult> | null }) {
  const { t } = useTranslation();

  if (!result) {
    return <EmptyState message={t("bmr.emptyState")} />;
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">{t("bmr.title")}</h3>
      <ResultCard
        value={result.average.toFixed(0)}
        unit={t("common.kcalPerDay")}
        label={t("bmr.averageLabel")}
        sub={t("bmr.averageSub")}
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Harris-Benedict</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.harrisBenedict.toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">{t("common.kcalPerDay")}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Mifflin-St Jeor</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.mifflinStJeor.toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">{t("common.kcalPerDay")}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {t("bmr.note")}
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
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">{t("tdee.title")}</h3>

      {/* Activity level */}
      <label className="block text-xs text-gray-500 mb-2">{t("tdee.activityLevel")}</label>
      <div className="space-y-1.5 mb-5">
        {ACTIVITY_LEVEL_VALUES.map((value, i) => (
          <button
            key={i}
            onClick={() => onActivityChange(i)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border ${
              activityIdx === i
                ? "border-[var(--health-primary)] bg-[var(--health-primary)]/5 text-[var(--health-primary)] font-medium"
                : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
            }`}
          >
            {t(`tdee.activity${i}`)}
            <span className="text-gray-400 ml-1">(&times;{value})</span>
          </button>
        ))}
      </div>

      {!result ? (
        <EmptyState message={t("tdee.emptyState")} />
      ) : (
        <>
          <ResultCard
            value={result.tdee.toFixed(0)}
            unit={t("common.kcalPerDay")}
            label={t("tdee.resultLabel")}
          />
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-400 mb-0.5">{t("tdee.deficit")}</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-blue-600">
                {result.deficit.toFixed(0)}
              </p>
              <p className="text-[10px] text-blue-400">{t("common.kcal")}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-green-400 mb-0.5">{t("tdee.maintenance")}</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-green-600">
                {result.maintenance.toFixed(0)}
              </p>
              <p className="text-[10px] text-green-400">{t("common.kcal")}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-orange-400 mb-0.5">{t("tdee.surplus")}</p>
              <p className="font-[family-name:var(--font-space)] text-lg font-bold text-orange-600">
                {result.surplus.toFixed(0)}
              </p>
              <p className="text-[10px] text-orange-400">{t("common.kcal")}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {t("tdee.note")}
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
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">{t("bodyfat.title")}</h3>

      <div className={`grid ${gender === "female" ? "grid-cols-3" : "grid-cols-2"} gap-3 mb-5`}>
        <InputField label={t("bodyfat.waist")} value={waist} onChange={onWaistChange} unit={t("common.cmUnit")} placeholder="80" />
        <InputField label={t("bodyfat.neck")} value={neck} onChange={onNeckChange} unit={t("common.cmUnit")} placeholder="37" />
        {gender === "female" && (
          <InputField label={t("bodyfat.hip")} value={hip} onChange={onHipChange} unit={t("common.cmUnit")} placeholder="95" />
        )}
      </div>

      {!result ? (
        <EmptyState message={t("bodyfat.emptyState")} />
      ) : result.bodyFatPercent < 0 || result.bodyFatPercent > 70 ? (
        <EmptyState message={t("bodyfat.invalidInput")} />
      ) : (
        <>
          <ResultCard
            value={result.bodyFatPercent.toFixed(1)}
            unit={t("common.percent")}
            label={t("bodyfat.resultLabel")}
            color={result.color}
            sub={t(result.categoryKey)}
          />
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">{t("bodyfat.classificationTitle")}</p>
            {gender === "male" ? (
              <div className="grid grid-cols-2 gap-1">
                <span>{t("bodyfat.maleEssential")}</span>
                <span>{t("bodyfat.maleAthlete")}</span>
                <span>{t("bodyfat.maleFitness")}</span>
                <span>{t("bodyfat.maleAverage")}</span>
                <span>{t("bodyfat.maleObese")}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                <span>{t("bodyfat.femaleEssential")}</span>
                <span>{t("bodyfat.femaleAthlete")}</span>
                <span>{t("bodyfat.femaleFitness")}</span>
                <span>{t("bodyfat.femaleAverage")}</span>
                <span>{t("bodyfat.femaleObese")}</span>
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
  const { t } = useTranslation();

  if (!result) {
    return <EmptyState message={t("standard.emptyState")} />;
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
      <h3 className="font-semibold text-sm mb-4">{t("standard.title")}</h3>
      <ResultCard
        value={avg.toFixed(1)}
        unit={t("common.kgUnit")}
        label={t("standard.averageLabel")}
        sub={t("standard.diffSub", { diff: `${diffSign}${result.difference.toFixed(1)}` })}
        color={diffColor}
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">{t("standard.broca")}</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.broca.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-400">{t("common.kgUnit")}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">{t("standard.bmiBase")}</p>
          <p className="font-[family-name:var(--font-space)] text-xl font-bold text-[var(--health-primary)]">
            {result.bmiBase.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-400">{t("common.kgUnit")}</p>
        </div>
      </div>
      <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
        <p>
          <span className="font-medium">{t("standard.currentVs")}</span>{" "}
          <span style={{ color: diffColor, fontWeight: 600 }}>
            {diffSign}{result.differencePercent.toFixed(1)}%
          </span>
        </p>
        <p className="text-gray-400 mt-1">
          {t("standard.formulaNote")}
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
