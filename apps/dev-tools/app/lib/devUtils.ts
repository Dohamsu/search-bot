/* ============================================
 * 개발자 도구 유틸리티 함수
 * ============================================ */

// ─── JSON 관련 ──────────────────────────────────

export interface JSONValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export function formatJSON(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJSON(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJSON(input: string): JSONValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const error = e as SyntaxError;
    const message = error.message;

    // 줄 번호 추출 시도
    const posMatch = message.match(/position\s+(\d+)/i);
    let line: number | undefined;
    let column: number | undefined;

    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.substring(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: message,
      line,
      column,
    };
  }
}

// ─── Base64 관련 (UTF-8 safe) ─────────────────────

export function base64Encode(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64Decode(input: string): string {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// ─── URL 인코딩/디코딩 ─────────────────────────────

export type URLEncodeMode = "component" | "uri";

export function urlEncode(input: string, mode: URLEncodeMode = "component"): string {
  if (mode === "component") {
    return encodeURIComponent(input);
  }
  return encodeURI(input);
}

export function urlDecode(input: string, mode: URLEncodeMode = "component"): string {
  if (mode === "component") {
    return decodeURIComponent(input);
  }
  return decodeURI(input);
}

// ─── UUID 생성 ─────────────────────────────────────

export interface UUIDOptions {
  uppercase: boolean;
  hyphen: boolean;
}

export function generateUUID(options: UUIDOptions = { uppercase: false, hyphen: true }): string {
  let uuid: string;

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    uuid = crypto.randomUUID();
  } else {
    // 수동 구현 (fallback)
    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  if (!options.hyphen) {
    uuid = uuid.replace(/-/g, "");
  }

  if (options.uppercase) {
    uuid = uuid.toUpperCase();
  }

  return uuid;
}

export function generateMultipleUUIDs(
  count: number,
  options: UUIDOptions = { uppercase: false, hyphen: true }
): string[] {
  const result: string[] = [];
  const clampedCount = Math.min(Math.max(1, count), 100);
  for (let i = 0; i < clampedCount; i++) {
    result.push(generateUUID(options));
  }
  return result;
}

// ─── 해시 생성 (Web Crypto API) ────────────────────

export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function generateHash(
  input: string,
  algorithm: HashAlgorithm
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateAllHashes(
  input: string
): Promise<Record<HashAlgorithm, string>> {
  const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
  const results = await Promise.all(
    algorithms.map(async (alg) => {
      const hash = await generateHash(input, alg);
      return [alg, hash] as [HashAlgorithm, string];
    })
  );
  return Object.fromEntries(results) as Record<HashAlgorithm, string>;
}

// ─── 정규식 테스터 ─────────────────────────────────

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  error?: string;
}

export function testRegex(
  pattern: string,
  flags: string,
  testString: string
): RegexResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes("g")) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(testString)) !== null) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        // 무한 루프 방지: 빈 문자열 매치 시 인덱스 전진
        if (m[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const m = regex.exec(testString);
      if (m) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        });
      }
    }

    return { matches };
  } catch (e) {
    return {
      matches: [],
      error: (e as Error).message,
    };
  }
}

export function highlightMatches(
  testString: string,
  matches: RegexMatch[]
): { text: string; isMatch: boolean }[] {
  if (matches.length === 0) {
    return [{ text: testString, isMatch: false }];
  }

  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;

  // 인덱스 순으로 정렬
  const sorted = [...matches].sort((a, b) => a.index - b.index);

  for (const m of sorted) {
    if (m.index > lastIndex) {
      segments.push({
        text: testString.slice(lastIndex, m.index),
        isMatch: false,
      });
    }
    segments.push({
      text: m.match,
      isMatch: true,
    });
    lastIndex = m.index + m.match.length;
  }

  if (lastIndex < testString.length) {
    segments.push({
      text: testString.slice(lastIndex),
      isMatch: false,
    });
  }

  return segments;
}

// ─── 정규식 예제 ──────────────────────────────────

export const REGEX_EXAMPLES = [
  { name: "이메일", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { name: "전화번호 (한국)", pattern: "0\\d{1,2}-\\d{3,4}-\\d{4}", flags: "g" },
  { name: "URL", pattern: "https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*", flags: "g" },
  { name: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { name: "HTML 태그", pattern: "<[^>]+>", flags: "g" },
  { name: "숫자만", pattern: "\\d+", flags: "g" },
  { name: "한글만", pattern: "[가-힣]+", flags: "g" },
];

// ─── Lorem Ipsum 생성기 ────────────────────────────

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore",
  "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam",
  "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
  "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero",
  "eos", "accusamus", "iusto", "odio", "dignissimos", "ducimus",
  "blanditiis", "praesentium", "voluptatum", "deleniti", "atque",
  "corrupti", "quos", "dolores", "quas", "molestias", "excepturi",
  "obcaecati", "cupiditate", "provident", "similique", "architecto",
  "beatae", "vitae", "dicta", "explicabo", "nemo", "ipsam",
  "voluptatem", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "ratione", "sequi", "nesciunt",
];

const KOREAN_SENTENCES = [
  "다람쥐 헌 쳇바퀴에 타고파.",
  "키스의 고유조건은 입술끼리 만나야 하고 특, 별한 기술은 , 필요치 않다.",
  "그는 깊은 산속에서 홀로 수련을 시작했다.",
  "오래된 서점에서 먼지 쌓인 책 한 권을 발견했다.",
  "맑은 하늘 아래 펼쳐진 들판이 끝없이 이어졌다.",
  "새벽 안개가 걷히자 아름다운 호수가 드러났다.",
  "우리는 함께 걸으며 오래된 이야기를 나누었다.",
  "겨울 밤하늘에 별들이 유난히 밝게 빛나고 있었다.",
  "아이들의 웃음소리가 골목길에 울려 퍼졌다.",
  "따뜻한 차 한 잔이 마음을 편안하게 해주었다.",
  "도시의 불빛 너머로 노을이 붉게 물들어갔다.",
  "바람이 불어와 나뭇잎들이 춤을 추기 시작했다.",
  "작은 카페에서 흘러나오는 음악이 거리를 채웠다.",
  "봄비가 내린 후 세상은 한층 더 싱그러워졌다.",
  "오랜 친구와의 만남은 언제나 즐거운 일이다.",
  "높은 산 정상에서 바라본 세상은 너무나 넓었다.",
  "할머니의 손맛이 그리운 가을 저녁이었다.",
  "신선한 아침 공기를 마시며 하루를 시작했다.",
  "잔잔한 파도 소리가 마음의 평화를 가져다주었다.",
  "낡은 다리 위에서 석양을 바라보며 생각에 잠겼다.",
];

function getRandomWords(count: number, words: string[]): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  // 첫 단어 대문자
  if (result.length > 0) {
    result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  }
  return result.join(" ") + ".";
}

function generateParagraph(wordCount: number = 50): string {
  const sentences: string[] = [];
  let remaining = wordCount;

  while (remaining > 0) {
    const sentenceLength = Math.min(remaining, 8 + Math.floor(Math.random() * 10));
    sentences.push(getRandomWords(sentenceLength, LOREM_WORDS));
    remaining -= sentenceLength;
  }

  return sentences.join(" ");
}

function generateKoreanParagraph(sentenceCount: number = 5): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(
      KOREAN_SENTENCES[Math.floor(Math.random() * KOREAN_SENTENCES.length)]
    );
  }
  return sentences.join(" ");
}

export interface LoremOptions {
  paragraphs: number;
  wordsPerParagraph: number;
  korean: boolean;
  htmlTags: boolean;
}

export function generateLoremIpsum(options: LoremOptions): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < options.paragraphs; i++) {
    if (options.korean) {
      const sentenceCount = Math.max(2, Math.floor(options.wordsPerParagraph / 8));
      paragraphs.push(generateKoreanParagraph(sentenceCount));
    } else {
      paragraphs.push(generateParagraph(options.wordsPerParagraph));
    }
  }

  if (options.htmlTags) {
    return paragraphs.map((p) => `<p>${p}</p>`).join("\n\n");
  }

  return paragraphs.join("\n\n");
}
