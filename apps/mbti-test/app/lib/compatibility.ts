import { getResult } from "./results";

export interface CompatibilityResult {
  type1: string;
  type2: string;
  score: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  tip: string;
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

  // 5점: 서로의 compatible에 포함
  const mutualCompat =
    result1.compatible.includes(type2) && result2.compatible.includes(type1);
  if (mutualCompat) return 5;

  // 같은 유형
  if (type1 === type2) return 3;

  const diffCount = getAxisDifferences(type1, type2).length;

  // 4점: 한쪽만 compatible에 포함되거나, 1개 축만 다른 경우
  const oneWayCompat =
    result1.compatible.includes(type2) || result2.compatible.includes(type1);
  if (oneWayCompat) return 4;
  if (diffCount === 1) return 4;

  // 3점: 2개 축 다름
  if (diffCount === 2) return 3;

  // 2점: 3개 축 다름
  if (diffCount === 3) return 2;

  // 1점: 4개 축 다름 (완전 반대)
  return 1;
}

// 점수별 title 풀
const TITLES: Record<number, string[]> = {
  5: ["환상의 콤비", "천생연분", "최고의 파트너"],
  4: ["좋은 관계", "서로를 보완하는 관계", "발전하는 관계"],
  3: ["무난한 관계", "노력하면 좋은 관계", "적응하는 관계"],
  2: ["도전적인 관계", "성장의 관계", "인내가 필요한 관계"],
  1: ["반대의 매력", "많은 이해가 필요한 관계"],
};

function pickFromArray<T>(arr: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return arr[Math.abs(hash) % arr.length];
}

function generateTitle(score: number, type1: string, type2: string): string {
  const key = `${type1}-${type2}`;
  return pickFromArray(TITLES[score], key);
}

// 같은 축에 대한 강점 설명
const SAME_AXIS_STRENGTHS: Record<string, string[]> = {
  EI: [
    "에너지의 방향이 같아 생활 리듬이 잘 맞습니다",
    "사회적 활동에 대한 기대치가 비슷합니다",
  ],
  SN: [
    "정보를 받아들이는 방식이 같아 대화가 잘 통합니다",
    "세상을 바라보는 관점이 비슷합니다",
  ],
  TF: [
    "의사결정 방식이 비슷해 갈등이 적습니다",
    "가치 판단의 기준이 유사합니다",
  ],
  JP: [
    "생활 패턴과 계획성이 잘 맞습니다",
    "일을 처리하는 스타일이 비슷합니다",
  ],
};

// 다른 축에 대한 보완적 강점
const DIFF_AXIS_STRENGTHS: Record<string, string[]> = {
  EI: [
    "외향과 내향이 만나 균형 잡힌 사회생활을 합니다",
    "서로의 에너지 방향이 달라 다양한 관점을 제공합니다",
  ],
  SN: [
    "현실적 관점과 미래지향적 관점이 조화를 이룹니다",
    "구체적인 것과 큰 그림을 함께 볼 수 있습니다",
  ],
  TF: [
    "논리와 감정의 균형으로 더 나은 결정을 내립니다",
    "이성적 분석과 공감 능력이 서로를 보완합니다",
  ],
  JP: [
    "계획성과 유연성이 만나 적응력이 높아집니다",
    "구조와 자유 사이에서 균형을 찾습니다",
  ],
};

// 다른 축에 대한 주의점
const DIFF_AXIS_CHALLENGES: Record<string, string[]> = {
  EI: [
    "혼자만의 시간과 함께하는 시간의 균형을 찾아야 합니다",
    "사회적 활동에 대한 기대치 차이를 이해해야 합니다",
  ],
  SN: [
    "대화 스타일의 차이를 인식하고 존중해야 합니다",
    "구체적인 사실 vs 가능성 중심 사고의 차이를 이해해야 합니다",
  ],
  TF: [
    "감정 표현 방식의 차이를 서로 존중해야 합니다",
    "결정을 내릴 때 논리와 감정의 균형이 필요합니다",
  ],
  JP: [
    "계획 변경에 대한 유연성을 서로 배려해야 합니다",
    "일의 마감과 자유로움 사이에서 타협이 필요합니다",
  ],
};

// 점수별 관계 팁
const TIPS: Record<number, string[]> = {
  5: [
    "서로의 장점을 인정하고 자연스럽게 흘러가는 관계를 즐기세요.",
    "이미 잘 맞는 관계이지만, 서로를 당연하게 여기지 않는 것이 중요합니다.",
    "서로의 차이점이 오히려 관계를 더 풍요롭게 만듭니다.",
  ],
  4: [
    "서로 다른 점을 약점이 아닌 보완점으로 바라보세요.",
    "상대방의 강점을 배우려는 열린 마음이 관계를 더 깊게 만듭니다.",
    "작은 차이를 존중하면 큰 시너지가 생깁니다.",
  ],
  3: [
    "비슷한 점을 기반으로 다른 점을 이해하려 노력하세요.",
    "서로의 관점을 경청하는 습관이 관계의 질을 높입니다.",
    "공통 관심사를 찾아 함께 시간을 보내보세요.",
  ],
  2: [
    "차이를 인정하고, 서로에게 배울 점을 찾아보세요.",
    "인내심을 갖고 상대방의 방식을 이해하려 노력하면 크게 성장할 수 있습니다.",
    "명확한 의사소통이 오해를 줄이는 핵심입니다.",
  ],
  1: [
    "완전히 다른 관점은 새로운 세상을 열어줄 수 있습니다. 열린 마음을 유지하세요.",
    "서로의 다름을 존중하고, 작은 공통점부터 찾아보세요.",
    "상대방이 나와 다르다는 것 자체를 흥미롭게 받아들여 보세요.",
  ],
};

function generateDescription(
  score: number,
  type1: string,
  type2: string
): string {
  const result1 = getResult(type1);
  const result2 = getResult(type2);
  const title1 = result1.title;
  const title2 = result2.title;

  if (type1 === type2) {
    return `같은 ${type1}(${title1}) 유형끼리는 서로를 깊이 이해할 수 있습니다. 비슷한 가치관과 사고방식을 공유하지만, 동일한 약점도 가질 수 있으므로 의식적으로 보완하는 것이 중요합니다.`;
  }

  switch (score) {
    case 5:
      return `${type1}(${title1})와 ${type2}(${title2})는 서로를 자연스럽게 보완하는 최고의 궁합입니다. 서로 다른 강점이 만나 시너지를 발휘하며, 함께 있으면 더 나은 모습으로 성장할 수 있는 관계입니다.`;
    case 4:
      return `${type1}(${title1})와 ${type2}(${title2})는 서로의 부족한 부분을 채워주는 좋은 관계입니다. 약간의 차이가 오히려 관계를 흥미롭게 만들며, 서로에게 새로운 관점을 제공합니다.`;
    case 3:
      return `${type1}(${title1})와 ${type2}(${title2})는 몇 가지 공통점과 차이점을 함께 가진 관계입니다. 서로를 이해하려는 노력이 있다면 안정적이고 균형 잡힌 관계를 만들 수 있습니다.`;
    case 2:
      return `${type1}(${title1})와 ${type2}(${title2})는 많은 부분이 다르지만, 그만큼 서로에게 배울 점이 많은 관계입니다. 인내심과 이해심을 바탕으로 함께 성장할 수 있습니다.`;
    default:
      return `${type1}(${title1})와 ${type2}(${title2})는 거의 모든 면에서 반대되는 성격입니다. 처음에는 이해하기 어려울 수 있지만, 서로의 다름을 받아들이면 가장 많이 성장할 수 있는 관계이기도 합니다.`;
  }
}

function generateStrengths(
  score: number,
  type1: string,
  type2: string
): string[] {
  const diffs = getAxisDifferences(type1, type2);
  const sames = getAxisSimilarities(type1, type2);
  const strengths: string[] = [];
  const key = `${type1}-${type2}`;

  if (type1 === type2) {
    return [
      "서로의 사고방식을 즉각적으로 이해할 수 있습니다",
      "비슷한 생활 리듬과 가치관을 공유합니다",
      "의사소통에서 오해가 적고 편안합니다",
    ];
  }

  // 같은 축의 강점
  for (const axis of sames) {
    const options = SAME_AXIS_STRENGTHS[axis];
    strengths.push(pickFromArray(options, key + axis));
  }

  // 다른 축의 보완적 강점
  for (const axis of diffs) {
    const options = DIFF_AXIS_STRENGTHS[axis];
    strengths.push(pickFromArray(options, key + axis));
  }

  // 점수 기반 추가 강점
  if (score >= 4) {
    strengths.push("자연스러운 역할 분담이 가능합니다");
  }

  return strengths.slice(0, 3);
}

function generateChallenges(
  score: number,
  type1: string,
  type2: string
): string[] {
  const diffs = getAxisDifferences(type1, type2);
  const challenges: string[] = [];
  const key = `${type1}-${type2}`;

  if (type1 === type2) {
    return [
      "같은 약점을 공유하여 서로 보완하기 어려울 수 있습니다",
      "비슷한 사고방식으로 인해 새로운 관점을 놓칠 수 있습니다",
    ];
  }

  for (const axis of diffs) {
    const options = DIFF_AXIS_CHALLENGES[axis];
    challenges.push(pickFromArray(options, key + axis));
  }

  if (challenges.length === 0) {
    challenges.push("큰 갈등 요소가 적은 관계입니다");
  }

  return challenges.slice(0, 2);
}

function generateTip(score: number, type1: string, type2: string): string {
  const key = `${type1}-${type2}`;
  return pickFromArray(TIPS[score], key);
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
    title: generateTitle(score, normalized1, normalized2),
    description: generateDescription(score, normalized1, normalized2),
    strengths: generateStrengths(score, normalized1, normalized2),
    challenges: generateChallenges(score, normalized1, normalized2),
    tip: generateTip(score, normalized1, normalized2),
  };
}

export function getAllCompatibilityPairs(): [string, string][] {
  const pairs: [string, string][] = [];

  for (let i = 0; i < MBTI_TYPES.length; i++) {
    // 같은 유형 조합
    pairs.push([MBTI_TYPES[i], MBTI_TYPES[i]]);
    // 다른 유형 조합 (중복 제거)
    for (let j = i + 1; j < MBTI_TYPES.length; j++) {
      const [t1, t2] = normalizeKey(MBTI_TYPES[i], MBTI_TYPES[j]);
      pairs.push([t1, t2]);
    }
  }

  return pairs;
}
