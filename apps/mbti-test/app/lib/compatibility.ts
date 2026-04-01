import { getResult } from "./results";

export interface CompatibilityResult {
  type1: string;
  type2: string;
  score: number;
  titleKey: string;
  descriptionKey: string;
  descriptionParams: Record<string, string>;
  strengthKeys: string[];
  challengeKeys: string[];
  tipKey: string;
}

const MBTI_TYPES = [
  "ENFP", "INTJ", "INFP", "ESTJ", "ISFJ", "ENTP",
  "ISFP", "ENTJ", "INTP", "ESFP", "ISTP", "ESFJ",
  "INFJ", "ENFJ", "ISTJ", "ESTP",
] as const;

function getAxisDifferences(type1: string, type2: string): string[] {
  const diffs: string[] = [];
  const axes = ["EI", "SN", "TF", "JP"];
  for (let i = 0; i < 4; i++) {
    if (type1[i] !== type2[i]) {
      diffs.push(axes[i]);
    }
  }
  return diffs;
}

function getAxisSimilarities(type1: string, type2: string): string[] {
  const sames: string[] = [];
  const axes = ["EI", "SN", "TF", "JP"];
  for (let i = 0; i < 4; i++) {
    if (type1[i] === type2[i]) {
      sames.push(axes[i]);
    }
  }
  return sames;
}

function normalizeKey(type1: string, type2: string): [string, string] {
  return [type1, type2].sort() as [string, string];
}

function calculateScore(type1: string, type2: string): number {
  const result1 = getResult(type1);
  const result2 = getResult(type2);

  const mutualCompat =
    result1.compatible.includes(type2) && result2.compatible.includes(type1);
  if (mutualCompat) return 5;

  if (type1 === type2) return 3;

  const diffCount = getAxisDifferences(type1, type2).length;

  const oneWayCompat =
    result1.compatible.includes(type2) || result2.compatible.includes(type1);
  if (oneWayCompat) return 4;
  if (diffCount === 1) return 4;

  if (diffCount === 2) return 3;
  if (diffCount === 3) return 2;

  return 1;
}

// Title pool sizes per score
const TITLE_COUNTS: Record<number, number> = { 5: 3, 4: 3, 3: 3, 2: 3, 1: 2 };

function pickIndex(arr_length: number, seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % arr_length;
}

function generateTitleKey(score: number, type1: string, type2: string): string {
  const key = `${type1}-${type2}`;
  const idx = pickIndex(TITLE_COUNTS[score], key);
  return `compatData.titles.score${score}.${idx}`;
}

// Same-axis strength: 2 options each
const SAME_AXIS_OPTIONS = 2;
// Diff-axis strength: 2 options each
const DIFF_AXIS_OPTIONS = 2;
// Diff-axis challenge: 2 options each
const DIFF_AXIS_CHALLENGE_OPTIONS = 2;
// Tips per score
const TIP_COUNTS: Record<number, number> = { 5: 3, 4: 3, 3: 3, 2: 3, 1: 3 };

function generateStrengthKeys(
  score: number,
  type1: string,
  type2: string
): string[] {
  const diffs = getAxisDifferences(type1, type2);
  const sames = getAxisSimilarities(type1, type2);
  const keys: string[] = [];
  const seed = `${type1}-${type2}`;

  if (type1 === type2) {
    return [
      "compatData.sameTypeStrengths.0",
      "compatData.sameTypeStrengths.1",
      "compatData.sameTypeStrengths.2",
    ];
  }

  for (const axis of sames) {
    const idx = pickIndex(SAME_AXIS_OPTIONS, seed + axis);
    keys.push(`compatData.sameAxisStrengths.${axis}.${idx}`);
  }

  for (const axis of diffs) {
    const idx = pickIndex(DIFF_AXIS_OPTIONS, seed + axis);
    keys.push(`compatData.diffAxisStrengths.${axis}.${idx}`);
  }

  if (score >= 4) {
    keys.push("compatData.highScoreStrength");
  }

  return keys.slice(0, 3);
}

function generateChallengeKeys(
  score: number,
  type1: string,
  type2: string
): string[] {
  const diffs = getAxisDifferences(type1, type2);
  const keys: string[] = [];
  const seed = `${type1}-${type2}`;

  if (type1 === type2) {
    return [
      "compatData.sameTypeChallenges.0",
      "compatData.sameTypeChallenges.1",
    ];
  }

  for (const axis of diffs) {
    const idx = pickIndex(DIFF_AXIS_CHALLENGE_OPTIONS, seed + axis);
    keys.push(`compatData.diffAxisChallenges.${axis}.${idx}`);
  }

  if (keys.length === 0) {
    keys.push("compatData.noChallenges");
  }

  return keys.slice(0, 2);
}

function generateTipKey(score: number, type1: string, type2: string): string {
  const seed = `${type1}-${type2}`;
  const idx = pickIndex(TIP_COUNTS[score], seed);
  return `compatData.tips.score${score}.${idx}`;
}

function generateDescriptionKey(
  score: number,
  type1: string,
  type2: string
): string {
  if (type1 === type2) return "compatData.descriptions.same";
  return `compatData.descriptions.score${score}`;
}

function generateDescriptionParams(
  type1: string,
  type2: string
): Record<string, string> {
  const result1 = getResult(type1);
  const result2 = getResult(type2);
  return {
    type1,
    type2,
    title1Key: result1.titleKey,
    title2Key: result2.titleKey,
  };
}

export function getCompatibility(
  type1: string,
  type2: string
): CompatibilityResult {
  const [normalized1, normalized2] = normalizeKey(
    type1.toUpperCase(),
    type2.toUpperCase()
  );
  const score = calculateScore(normalized1, normalized2);

  return {
    type1: normalized1,
    type2: normalized2,
    score,
    titleKey: generateTitleKey(score, normalized1, normalized2),
    descriptionKey: generateDescriptionKey(score, normalized1, normalized2),
    descriptionParams: generateDescriptionParams(normalized1, normalized2),
    strengthKeys: generateStrengthKeys(score, normalized1, normalized2),
    challengeKeys: generateChallengeKeys(score, normalized1, normalized2),
    tipKey: generateTipKey(score, normalized1, normalized2),
  };
}

export function getAllCompatibilityPairs(): [string, string][] {
  const pairs: [string, string][] = [];

  for (let i = 0; i < MBTI_TYPES.length; i++) {
    pairs.push([MBTI_TYPES[i], MBTI_TYPES[i]]);
    for (let j = i + 1; j < MBTI_TYPES.length; j++) {
      const [t1, t2] = normalizeKey(MBTI_TYPES[i], MBTI_TYPES[j]);
      pairs.push([t1, t2]);
    }
  }

  return pairs;
}
