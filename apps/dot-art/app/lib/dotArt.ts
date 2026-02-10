import { findClosestColor } from "./palettes";
import { textToEmoji, isEmoji } from "./emojiMap";

export type DotGrid = (string | null)[][];

export interface DotArtOptions {
  gridSize: number;
  palette: string[];
  alphaThreshold?: number;
}

/**
 * 이모지 또는 텍스트를 오프스크린 Canvas에 렌더링 → 도트 그리드로 변환
 */
function renderCharToDotGrid(char: string, options: DotArtOptions): DotGrid {
  const { gridSize, palette, alphaThreshold = 30 } = options;
  const canvasSize = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.font = `200px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, canvasSize / 2, canvasSize / 2);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data } = imageData;
  const blockSize = Math.floor(canvasSize / gridSize);

  const grid: DotGrid = [];
  for (let row = 0; row < gridSize; row++) {
    const gridRow: (string | null)[] = [];
    for (let col = 0; col < gridSize; col++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let count = 0;

      for (let y = row * blockSize; y < (row + 1) * blockSize && y < canvasSize; y++) {
        for (let x = col * blockSize; x < (col + 1) * blockSize && x < canvasSize; x++) {
          const i = (y * canvasSize + x) * 4;
          totalR += data[i];
          totalG += data[i + 1];
          totalB += data[i + 2];
          totalA += data[i + 3];
          count++;
        }
      }

      const avgA = totalA / count;
      if (avgA < alphaThreshold) {
        gridRow.push(null);
      } else {
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        gridRow.push(findClosestColor(avgR, avgG, avgB, palette));
      }
    }
    grid.push(gridRow);
  }

  return grid;
}

/**
 * 텍스트 입력 → 도트 그리드 변환 파이프라인
 * 1. 프리셋 keywords 정확 매칭 → 수작업 grid 반환 (외부에서 처리)
 * 2. emojiMap 매칭 → 이모지→픽셀 변환
 * 3. 입력 자체가 이모지 → 직접 변환
 * 4. 매칭 실패 → 첫 글자를 도트화
 */
export function generateDotArt(text: string, options: DotArtOptions): DotGrid {
  const emoji = textToEmoji(text);
  if (emoji) {
    return renderCharToDotGrid(emoji, options);
  }

  if (isEmoji(text)) {
    return renderCharToDotGrid(text, options);
  }

  // 매칭 실패 → 첫 글자 도트화
  const firstChar = text.trim().charAt(0);
  if (firstChar) {
    return renderCharToDotGrid(firstChar, options);
  }

  return createEmptyGrid(options.gridSize);
}

export function createEmptyGrid(gridSize: number): DotGrid {
  return Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => null)
  );
}

/**
 * 이미지를 도트 그리드로 변환 (자동 모드 — 팔레트 양자화)
 */
export function imageToDotGrid(
  img: HTMLImageElement,
  options: DotArtOptions
): DotGrid {
  const { gridSize, palette, alphaThreshold = 30 } = options;
  const canvasSize = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data } = imageData;
  const blockSize = Math.floor(canvasSize / gridSize);

  const grid: DotGrid = [];
  for (let row = 0; row < gridSize; row++) {
    const gridRow: (string | null)[] = [];
    for (let col = 0; col < gridSize; col++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let count = 0;

      for (let y = row * blockSize; y < (row + 1) * blockSize && y < canvasSize; y++) {
        for (let x = col * blockSize; x < (col + 1) * blockSize && x < canvasSize; x++) {
          const i = (y * canvasSize + x) * 4;
          totalR += data[i];
          totalG += data[i + 1];
          totalB += data[i + 2];
          totalA += data[i + 3];
          count++;
        }
      }

      const avgA = totalA / count;
      if (avgA < alphaThreshold) {
        gridRow.push(null);
      } else {
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        gridRow.push(findClosestColor(avgR, avgG, avgB, palette));
      }
    }
    grid.push(gridRow);
  }

  return grid;
}

/* ── Pro 모드 전용 변환 ─────────────────────────── */

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  ).toUpperCase();
}

/** 코너 픽셀들을 샘플링하여 배경색 추정 */
function detectBgColor(
  data: Uint8ClampedArray,
  size: number
): [number, number, number] {
  const offsets = [
    [0, 0], [1, 0], [0, 1],
    [size - 1, 0], [size - 2, 0], [size - 1, 1],
    [0, size - 1], [1, size - 1], [0, size - 2],
    [size - 1, size - 1], [size - 2, size - 1], [size - 1, size - 2],
  ];
  let tR = 0, tG = 0, tB = 0;
  for (const [x, y] of offsets) {
    const i = (y * size + x) * 4;
    tR += data[i];
    tG += data[i + 1];
    tB += data[i + 2];
  }
  const n = offsets.length;
  return [Math.round(tR / n), Math.round(tG / n), Math.round(tB / n)];
}

/**
 * 이미지를 도트 그리드로 변환 (Pro 모드 — 원본 색상 유지)
 *
 * 개선점:
 * 1. 팔레트 양자화 없이 DALL-E 원본 색상 사용
 * 2. 블록 내 최빈색(dominant color) 기반 — 안티앨리어싱/그라데이션 노이즈 제거
 * 3. 코너 샘플링으로 배경색 자동 감지 → 투명(null) 처리
 * 4. 512×512 캔버스로 해상도 향상
 */
export function imageToDotGridPro(
  img: HTMLImageElement,
  gridSize: number
): DotGrid {
  const canvasSize = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data } = imageData;
  const blockSize = Math.floor(canvasSize / gridSize);

  const bg = detectBgColor(data, canvasSize);
  const BG_THRESHOLD = 2500; // ~50 per channel

  const grid: DotGrid = [];
  for (let row = 0; row < gridSize; row++) {
    const gridRow: (string | null)[] = [];
    for (let col = 0; col < gridSize; col++) {
      // 블록 내 픽셀을 양자화 키로 그룹핑하여 최빈색 추출
      const groups = new Map<
        string,
        { count: number; tR: number; tG: number; tB: number }
      >();

      for (
        let y = row * blockSize;
        y < (row + 1) * blockSize && y < canvasSize;
        y++
      ) {
        for (
          let x = col * blockSize;
          x < (col + 1) * blockSize && x < canvasSize;
          x++
        ) {
          const i = (y * canvasSize + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 32단위로 양자화 → 유사색 그룹핑
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

      // 가장 많이 등장한 색상 그룹 선택
      let best = { count: 0, tR: 0, tG: 0, tB: 0 };
      for (const entry of groups.values()) {
        if (entry.count > best.count) best = entry;
      }

      const avgR = Math.round(best.tR / best.count);
      const avgG = Math.round(best.tG / best.count);
      const avgB = Math.round(best.tB / best.count);

      // 배경색과 거리 비교 → 투명 처리
      const bgDist =
        (avgR - bg[0]) ** 2 + (avgG - bg[1]) ** 2 + (avgB - bg[2]) ** 2;
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
