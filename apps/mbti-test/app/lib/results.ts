export interface MBTIResult {
  type: string;
  titleKey: string;
  descriptionKey: string;
  traitKeys: string[];
  compatible: string[];
  percentage: number;
  careerKeys: string[];
  celebrityKeys: string[];
}

const MBTI_TYPES = [
  "ENFP", "INTJ", "INFP", "ESTJ", "ISFJ", "ENTP",
  "ISFP", "ENTJ", "INTP", "ESFP", "ISTP", "ESFJ",
  "INFJ", "ENFJ", "ISTJ", "ESTP",
] as const;

export type MBTIType = (typeof MBTI_TYPES)[number];

export function getAllTypes(): MBTIType[] {
  return [...MBTI_TYPES];
}

function buildResult(type: string): MBTIResult {
  return {
    type,
    titleKey: `results.${type}.title`,
    descriptionKey: `results.${type}.description`,
    traitKeys: [0, 1, 2, 3].map((i) => `results.${type}.traits.${i}`),
    compatible: COMPAT_MAP[type] || ["ENFP", "INTJ"],
    percentage: PERCENTAGE_MAP[type] || 5,
    careerKeys: CAREER_COUNTS[type]
      ? Array.from({ length: CAREER_COUNTS[type] }, (_, i) => `results.${type}.careers.${i}`)
      : [`results.${type}.careers.0`],
    celebrityKeys: CELEB_COUNTS[type]
      ? Array.from({ length: CELEB_COUNTS[type] }, (_, i) => `results.${type}.celebrities.${i}`)
      : [],
  };
}

const COMPAT_MAP: Record<string, string[]> = {
  ENFP: ["INTJ", "INFJ"],
  INTJ: ["ENFP", "ENTP"],
  INFP: ["ENFJ", "ENTJ"],
  ESTJ: ["ISTP", "ISFP"],
  ISFJ: ["ESFP", "ESTP"],
  ENTP: ["INFJ", "INTJ"],
  ISFP: ["ESTJ", "ESFJ"],
  ENTJ: ["INFP", "INTP"],
  INTP: ["ENTJ", "ESTJ"],
  ESFP: ["ISFJ", "ISTJ"],
  ISTP: ["ESTJ", "ESFJ"],
  ESFJ: ["ISFP", "ISTP"],
  INFJ: ["ENFP", "ENTP"],
  ENFJ: ["INFP", "ISFP"],
  ISTJ: ["ESFP", "ESTP"],
  ESTP: ["ISFJ", "ISTJ"],
};

const PERCENTAGE_MAP: Record<string, number> = {
  ENFP: 8, INTJ: 2, INFP: 4, ESTJ: 9, ISFJ: 14, ENTP: 3,
  ISFP: 9, ENTJ: 2, INTP: 3, ESFP: 9, ISTP: 5, ESFJ: 12,
  INFJ: 2, ENFJ: 3, ISTJ: 11, ESTP: 4,
};

const CAREER_COUNTS: Record<string, number> = {
  ENFP: 5, INTJ: 5, INFP: 5, ESTJ: 5, ISFJ: 5, ENTP: 5,
  ISFP: 5, ENTJ: 5, INTP: 5, ESFP: 5, ISTP: 5, ESFJ: 5,
  INFJ: 5, ENFJ: 5, ISTJ: 5, ESTP: 5,
};

const CELEB_COUNTS: Record<string, number> = {
  ENFP: 3, INTJ: 3, INFP: 3, ESTJ: 3, ISFJ: 3, ENTP: 3,
  ISFP: 3, ENTJ: 3, INTP: 3, ESFP: 3, ISTP: 3, ESFJ: 3,
  INFJ: 3, ENFJ: 3, ISTJ: 3, ESTP: 3,
};

const resultsCache: Record<string, MBTIResult> = {};

export function getResult(type: string): MBTIResult {
  const upper = type.toUpperCase();
  if (resultsCache[upper]) return resultsCache[upper];

  if (MBTI_TYPES.includes(upper as MBTIType)) {
    const result = buildResult(upper);
    resultsCache[upper] = result;
    return result;
  }

  // fallback
  return {
    type: upper,
    titleKey: "results.fallback.title",
    descriptionKey: "results.fallback.description",
    traitKeys: [0, 1, 2, 3].map((i) => `results.fallback.traits.${i}`),
    compatible: ["ENFP", "INTJ"],
    percentage: 5,
    careerKeys: ["results.fallback.careers.0"],
    celebrityKeys: [],
  };
}
