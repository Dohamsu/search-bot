export interface TextStats {
  /** 총 글자수 (공백 포함) */
  charWithSpaces: number;
  /** 글자수 (공백 제외) */
  charWithoutSpaces: number;
  /** 단어 수 */
  wordCount: number;
  /** UTF-8 바이트 수 */
  byteUtf8: number;
  /** EUC-KR 바이트 수 (추정) */
  byteEucKr: number;
  /** 줄 수 */
  lineCount: number;
  /** 문장 수 */
  sentenceCount: number;
  /** 원고지 매수 (200자 기준) */
  manuscriptPages: number;
  /** 예상 읽는 시간 (분) */
  readingTimeMin: number;
}

/**
 * UTF-8 바이트 수 계산
 */
function getUtf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * EUC-KR 바이트 수 추정
 * - ASCII (0x00~0x7F): 1바이트
 * - 한글 및 기타 멀티바이트: 2바이트
 */
function getEucKrByteLength(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code <= 0x7f) {
      bytes += 1;
    } else {
      bytes += 2;
    }
  }
  return bytes;
}

/**
 * 단어 수 계산
 * - 공백 기준 분리 후 빈 문자열 제외
 */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  // 연속 공백/줄바꿈을 하나로 합쳐서 분리
  const words = trimmed.split(/\s+/);
  return words.length;
}

/**
 * 문장 수 계산 (. ! ? 기준)
 */
function countSentences(text: string): number {
  if (text.trim().length === 0) return 0;
  // 문장 종결 부호로 분리
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return Math.max(sentences.length, 0);
}

/**
 * 텍스트 분석 결과 반환
 */
export function analyzeText(text: string): TextStats {
  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s/g, "").length;
  const wordCount = countWords(text);
  const byteUtf8 = getUtf8ByteLength(text);
  const byteEucKr = getEucKrByteLength(text);

  // 줄 수: 빈 텍스트면 0, 아니면 줄바꿈 + 1
  const lineCount =
    text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

  const sentenceCount = countSentences(text);

  // 원고지 매수 (200자 원고지)
  const manuscriptPages =
    charWithoutSpaces === 0 ? 0 : Math.ceil(charWithoutSpaces / 200);

  // 읽는 시간 (한국어 평균 분당 500자)
  const readingTimeMin =
    charWithoutSpaces === 0
      ? 0
      : Math.max(Math.ceil(charWithoutSpaces / 500), 1);

  return {
    charWithSpaces,
    charWithoutSpaces,
    wordCount,
    byteUtf8,
    byteEucKr,
    lineCount,
    sentenceCount,
    manuscriptPages,
    readingTimeMin,
  };
}

/** SNS 플랫폼별 글자수 제한 정보 */
export interface SnsLimit {
  name: string;
  limit: number;
  current: number;
  unit: string;
  /** 초과 여부 */
  exceeded: boolean;
  /** 사용 비율 (0~100+) */
  percentage: number;
}

/**
 * SNS 글자수 체크
 */
export function checkSnsLimits(text: string, stats: TextStats): SnsLimit[] {
  // 트위터: 한글/일본어/중국어는 2 weight, 나머지 1 weight, 총 280 weight
  const twitterWeight = calculateTwitterWeight(text);

  return [
    {
      name: "카카오톡 메시지",
      limit: 1000,
      current: stats.charWithSpaces,
      unit: "자",
      exceeded: stats.charWithSpaces > 1000,
      percentage:
        stats.charWithSpaces === 0
          ? 0
          : Math.round((stats.charWithSpaces / 1000) * 100),
    },
    {
      name: "SMS",
      limit: 80,
      current: stats.byteEucKr,
      unit: "바이트",
      exceeded: stats.byteEucKr > 80,
      percentage:
        stats.byteEucKr === 0
          ? 0
          : Math.round((stats.byteEucKr / 80) * 100),
    },
    {
      name: "LMS",
      limit: 2000,
      current: stats.byteEucKr,
      unit: "바이트",
      exceeded: stats.byteEucKr > 2000,
      percentage:
        stats.byteEucKr === 0
          ? 0
          : Math.round((stats.byteEucKr / 2000) * 100),
    },
    {
      name: "트위터/X",
      limit: 280,
      current: twitterWeight,
      unit: "가중치",
      exceeded: twitterWeight > 280,
      percentage:
        twitterWeight === 0
          ? 0
          : Math.round((twitterWeight / 280) * 100),
    },
    {
      name: "인스타그램 캡션",
      limit: 2200,
      current: stats.charWithSpaces,
      unit: "자",
      exceeded: stats.charWithSpaces > 2200,
      percentage:
        stats.charWithSpaces === 0
          ? 0
          : Math.round((stats.charWithSpaces / 2200) * 100),
    },
  ];
}

/**
 * 트위터 가중치 계산
 * CJK 문자 (한글, 일본어, 중국어)는 2, 나머지 1
 */
function calculateTwitterWeight(text: string): number {
  let weight = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    // 한글: AC00-D7AF (완성형), 3130-318F (자모)
    // CJK: 4E00-9FFF, 3400-4DBF, F900-FAFF
    // 히라가나: 3040-309F, 카타카나: 30A0-30FF
    if (
      (code >= 0xac00 && code <= 0xd7af) ||
      (code >= 0x3130 && code <= 0x318f) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0x3040 && code <= 0x309f) ||
      (code >= 0x30a0 && code <= 0x30ff)
    ) {
      weight += 2;
    } else {
      weight += 1;
    }
  }
  return weight;
}

/**
 * 텍스트 변환 함수들
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function trimText(text: string): string {
  return text.trim();
}

export function removeDuplicateSpaces(text: string): string {
  return text.replace(/ {2,}/g, " ");
}

export function removeLineBreaks(text: string): string {
  return text.replace(/(\r\n|\r|\n)/g, " ");
}
