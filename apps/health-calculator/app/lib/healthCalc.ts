export type Gender = "male" | "female";

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  normalWeightMin: number;
  normalWeightMax: number;
}

export interface BMRResult {
  harrisBenedict: number;
  mifflinStJeor: number;
  average: number;
}

export interface TDEEResult {
  tdee: number;
  deficit: number;
  maintenance: number;
  surplus: number;
}

export interface BodyFatResult {
  bodyFatPercent: number;
  category: string;
  color: string;
}

export interface StandardWeightResult {
  broca: number;
  bmiBase: number;
  difference: number;
  differencePercent: number;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: "저체중", color: "#3B82F6" };
  if (bmi < 23) return { category: "정상", color: "#22C55E" };
  if (bmi < 25) return { category: "과체중", color: "#EAB308" };
  if (bmi < 30) return { category: "비만 1단계", color: "#F97316" };
  return { category: "비만 2단계", color: "#EF4444" };
}

export function getBMIResult(weightKg: number, heightCm: number): BMIResult {
  const bmi = calculateBMI(weightKg, heightCm);
  const { category, color } = getBMICategory(bmi);
  const heightM = heightCm / 100;
  const normalWeightMin = 18.5 * heightM * heightM;
  const normalWeightMax = 22.9 * heightM * heightM;
  return { bmi, category, color, normalWeightMin, normalWeightMax };
}

export function calculateBMR_HarrisBenedict(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (gender === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

export function calculateBMR_MifflinStJeor(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function getBMRResult(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): BMRResult {
  const harrisBenedict = calculateBMR_HarrisBenedict(gender, weightKg, heightCm, age);
  const mifflinStJeor = calculateBMR_MifflinStJeor(gender, weightKg, heightCm, age);
  const average = (harrisBenedict + mifflinStJeor) / 2;
  return { harrisBenedict, mifflinStJeor, average };
}

export const ACTIVITY_LEVELS = [
  { label: "비활동적 (운동 거의 안 함)", value: 1.2 },
  { label: "가벼운 활동 (주 1-3회 운동)", value: 1.375 },
  { label: "보통 활동 (주 3-5회 운동)", value: 1.55 },
  { label: "활발한 활동 (주 6-7회 운동)", value: 1.725 },
  { label: "매우 활발 (고강도 매일 운동)", value: 1.9 },
] as const;

export function calculateTDEE(bmr: number, activityMultiplier: number): TDEEResult {
  const tdee = bmr * activityMultiplier;
  return {
    tdee,
    deficit: tdee - 500,
    maintenance: tdee,
    surplus: tdee + 500,
  };
}

export function calculateBodyFat(
  gender: Gender,
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm: number
): BodyFatResult {
  let bodyFatPercent: number;
  if (gender === "male") {
    bodyFatPercent =
      86.01 * Math.log10(waistCm - neckCm) -
      70.041 * Math.log10(heightCm) +
      36.76;
  } else {
    bodyFatPercent =
      163.205 * Math.log10(waistCm + hipCm - neckCm) -
      97.684 * Math.log10(heightCm) -
      78.387;
  }

  const { category, color } = getBodyFatCategory(gender, bodyFatPercent);
  return { bodyFatPercent, category, color };
}

function getBodyFatCategory(
  gender: Gender,
  percent: number
): { category: string; color: string } {
  if (gender === "male") {
    if (percent < 6) return { category: "필수 지방", color: "#3B82F6" };
    if (percent < 14) return { category: "운동선수", color: "#22C55E" };
    if (percent < 18) return { category: "피트니스", color: "#22C55E" };
    if (percent < 25) return { category: "보통", color: "#EAB308" };
    return { category: "비만", color: "#EF4444" };
  }
  if (percent < 14) return { category: "필수 지방", color: "#3B82F6" };
  if (percent < 21) return { category: "운동선수", color: "#22C55E" };
  if (percent < 25) return { category: "피트니스", color: "#22C55E" };
  if (percent < 32) return { category: "보통", color: "#EAB308" };
  return { category: "비만", color: "#EF4444" };
}

export function calculateStandardWeight(
  heightCm: number,
  weightKg: number
): StandardWeightResult {
  const broca = (heightCm - 100) * 0.9;
  const heightM = heightCm / 100;
  const bmiBase = 22 * heightM * heightM;
  const avg = (broca + bmiBase) / 2;
  const difference = weightKg - avg;
  const differencePercent = (difference / avg) * 100;
  return { broca, bmiBase, difference, differencePercent };
}
