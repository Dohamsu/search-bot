/**
 * 기본 도트 아트 예시 생성 스크립트
 *
 * 사용법:
 *   node scripts/generate-dot-examples.mjs
 *
 * .env.local에서 OPENAI_API_KEY를 읽거나 환경변수로 전달
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

// ── .env.local 파싱 ──
const ENV_PATH = path.resolve("apps/dot-art/.env.local");
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return;
  const lines = fs.readFileSync(ENV_PATH, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY || API_KEY.includes("여기에")) {
  console.error("OPENAI_API_KEY가 설정되지 않았습니다.");
  process.exit(1);
}

// ── 생성할 예시 목록 ──
const EXAMPLES = [
  { label: "고양이", prompt: "a cute cat sitting" },
  { label: "강아지", prompt: "a happy dog" },
  { label: "나무", prompt: "a green tree with thick trunk" },
  { label: "꽃", prompt: "a red flower with petals" },
  { label: "해", prompt: "a bright yellow sun with rays" },
  { label: "별", prompt: "a golden star shape" },
  { label: "하트", prompt: "a red heart shape" },
  { label: "버섯", prompt: "a red mushroom with white spots" },
  { label: "펭귄", prompt: "a cute penguin standing" },
  { label: "로봇", prompt: "a small cute robot" },
  { label: "무지개", prompt: "a rainbow arc" },
  { label: "집", prompt: "a small cozy house" },
];

const GRID_SIZE = 16;
const CANVAS_SIZE = 512;

// ── DALL-E API 호출 ──
async function generateImage(prompt) {
  const enhancedPrompt = `Pixel art of ${prompt}, 16-bit retro style, clean pixels, solid bright colors, no gradients, centered on white background, simple and iconic`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-2",
      prompt: enhancedPrompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].b64_json;
}

// ── 이미지 → 도트 그리드 변환 (imageToDotGridPro 포팅) ──
function detectBgColor(data, width) {
  const offsets = [
    [0, 0], [1, 0], [0, 1],
    [width - 1, 0], [width - 2, 0], [width - 1, 1],
    [0, width - 1], [1, width - 1], [0, width - 2],
    [width - 1, width - 1], [width - 2, width - 1], [width - 1, width - 2],
  ];
  let tR = 0, tG = 0, tB = 0;
  for (const [x, y] of offsets) {
    const i = (y * width + x) * 3; // RGB (no alpha from sharp .raw())
    tR += data[i];
    tG += data[i + 1];
    tB += data[i + 2];
  }
  const n = offsets.length;
  return [Math.round(tR / n), Math.round(tG / n), Math.round(tB / n)];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  ).toUpperCase();
}

function imageToDotGrid(pixelData, imageSize, gridSize) {
  const blockSize = Math.floor(imageSize / gridSize);
  const bg = detectBgColor(pixelData, imageSize);
  const BG_THRESHOLD = 2500;

  const grid = [];
  for (let row = 0; row < gridSize; row++) {
    const gridRow = [];
    for (let col = 0; col < gridSize; col++) {
      const groups = new Map();

      for (let y = row * blockSize; y < (row + 1) * blockSize && y < imageSize; y++) {
        for (let x = col * blockSize; x < (col + 1) * blockSize && x < imageSize; x++) {
          const i = (y * imageSize + x) * 3;
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];

          const key = `${(r >> 5) << 5},${(g >> 5) << 5},${(b >> 5) << 5}`;
          const entry = groups.get(key);
          if (entry) {
            entry.count++;
            entry.tR += r;
            entry.tG += g;
            entry.tB += b;
          } else {
            groups.set(key, { count: 1, tR: r, tG: g, tB: b });
          }
        }
      }

      let best = { count: 0, tR: 0, tG: 0, tB: 0 };
      for (const entry of groups.values()) {
        if (entry.count > best.count) best = entry;
      }

      const avgR = Math.round(best.tR / best.count);
      const avgG = Math.round(best.tG / best.count);
      const avgB = Math.round(best.tB / best.count);

      const bgDist = (avgR - bg[0]) ** 2 + (avgG - bg[1]) ** 2 + (avgB - bg[2]) ** 2;
      if (bgDist < BG_THRESHOLD) {
        gridRow.push(null);
      } else {
        gridRow.push(rgbToHex(avgR, avgG, avgB));
      }
    }
    grid.push(gridRow);
  }

  return grid;
}

// ── 메인 실행 ──
async function main() {
  console.log(`🎨 ${EXAMPLES.length}개 기본 예시 생성 시작...\n`);

  const results = [];

  for (let i = 0; i < EXAMPLES.length; i++) {
    const { label, prompt } = EXAMPLES[i];
    process.stdout.write(`[${i + 1}/${EXAMPLES.length}] "${label}" 생성 중...`);

    try {
      const b64 = await generateImage(prompt);
      const imgBuffer = Buffer.from(b64, "base64");

      // sharp로 512x512 RGB raw 픽셀 데이터 추출
      const { data: pixelData } = await sharp(imgBuffer)
        .resize(CANVAS_SIZE, CANVAS_SIZE, { fit: "contain", background: "#FFFFFF" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const grid = imageToDotGrid(pixelData, CANVAS_SIZE, GRID_SIZE);
      results.push({ label, grid });
      console.log(" ✅");
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }

    // rate limit 방지: 요청 간 1초 대기
    if (i < EXAMPLES.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // ── TypeScript 파일 출력 ──
  const outputPath = path.resolve("apps/dot-art/app/lib/defaultExamples.ts");

  let ts = `import { DotGrid } from "./dotArt";\n\n`;
  ts += `export interface DefaultExample {\n  label: string;\n  grid: DotGrid;\n}\n\n`;
  ts += `export const DEFAULT_EXAMPLES: DefaultExample[] = [\n`;

  for (const { label, grid } of results) {
    ts += `  {\n    label: ${JSON.stringify(label)},\n    grid: [\n`;
    for (const row of grid) {
      const cells = row.map((c) => (c === null ? "null" : `"${c}"`));
      ts += `      [${cells.join(",")}],\n`;
    }
    ts += `    ],\n  },\n`;
  }

  ts += `];\n`;

  fs.writeFileSync(outputPath, ts, "utf-8");
  console.log(`\n✅ ${results.length}개 예시 저장 완료: ${outputPath}`);
  console.log(`📦 파일 크기: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`);
}

main().catch((err) => {
  console.error("❌ 실행 오류:", err.message);
  process.exit(1);
});
