import { findClosestColor } from "./palettes";
import { textToEmoji, isEmoji } from "./emojiMap";
import { applyDither, type DitherMode } from "./dither";
import { sobelEdgeMap, edgeWeightedBlockSample, addOutlineToGrid } from "./edge";

export type { DitherMode };
export type DotGrid = (string | null)[][];

export interface DotArtOptions {
  gridSize: number;
  palette: string[];
  alphaThreshold?: number;
  dither?: DitherMode;
  edgeEnhance?: boolean;
  outline?: boolean;
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
 *
 * 파이프라인:
 * 1. 이미지 → 캔버스 리사이즈
 * 2. [Sobel 엣지맵] 엣지 감지 (옵션)
 * 3. [디더링] 전체 이미지 레벨에서 적용 (옵션)
 * 4. 블록 샘플링 — 엣지 강조 시 가중 샘플링, 아니면 평균
 * 5. [아웃라인] 변환 후 인접 색차 기반 아웃라인 오버레이 (옵션)
 */
export function imageToDotGrid(
  img: HTMLImageElement,
  options: DotArtOptions
): DotGrid {
  const {
    gridSize, palette, alphaThreshold = 30,
    dither = "none", edgeEnhance = false, outline = false,
  } = options;
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

  // Sobel 엣지맵: 디더링/샘플링 전에 원본 데이터로 계산
  let edgeMap: Float32Array | null = null;
  if (edgeEnhance) {
    edgeMap = sobelEdgeMap(data, canvasSize, canvasSize);
  }

  // 디더링: 블록 샘플링 전에 전체 이미지 레벨에서 적용
  if (dither !== "none") {
    applyDither(data, canvasSize, canvasSize, palette, dither);
  }

  // 블록 샘플링
  let grid: DotGrid;
  if (edgeEnhance && edgeMap) {
    // (A) 엣지 가중 블록 샘플링
    grid = edgeWeightedBlockSample(data, edgeMap, canvasSize, gridSize, palette, alphaThreshold);
  } else {
    // 기존 블록 평균 샘플링
    const blockSize = Math.floor(canvasSize / gridSize);
    grid = [];
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
  }

  // (B) 아웃라인 오버레이
  if (outline) {
    grid = addOutlineToGrid(grid);
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
 * 이미지를 중간 크기로 축소하여 디테일을 사전 제거하는 전처리 단계.
 * 고해상도 이미지의 그라데이션, 안티앨리어싱, 미세 디테일을 제거한다.
 */
function simplifyImage(
  img: HTMLImageElement,
  targetSize: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d")!;

  // imageSmoothingEnabled를 끄면 nearest-neighbor 보간 → 더 블록감 있는 결과
  ctx.imageSmoothingEnabled = targetSize <= 64;
  ctx.imageSmoothingQuality = "low";

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetSize, targetSize);

  const scale = Math.min(targetSize / img.width, targetSize / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (targetSize - w) / 2, (targetSize - h) / 2, w, h);

  return { canvas, ctx };
}

/**
 * 캔버스 픽셀 데이터에 포스터라이즈(색상 단순화) 적용.
 * levels가 낮을수록 더 적은 색상으로 단순화됨.
 */
function posterize(
  data: Uint8ClampedArray,
  levels: number
): void {
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }
}

/**
 * 이미지를 도트 그리드로 변환 (Pro 모드 — 원본 색상 유지)
 *
 * 파이프라인:
 * 1. 이미지를 중간 크기(gridSize × 6~8)로 축소 → 디테일 사전 제거
 * 2. 포스터라이즈로 색상 수 축소 → 그라데이션/안티앨리어싱 제거
 * 3. 블록 내 최빈색(dominant color) 기반 샘플링
 * 4. 코너 샘플링으로 배경색 자동 감지 → 투명(null) 처리
 */
export function imageToDotGridPro(
  img: HTMLImageElement,
  gridSize: number,
  palette?: string[]
): DotGrid {
  // 그리드 크기에 따라 중간 캔버스 크기 결정
  // 저해상도(8~16): 작은 중간 캔버스로 디테일 강제 제거
  // 고해상도(64): 더 큰 캔버스로 디테일 보존
  const intermediateSize = Math.max(gridSize * 6, 96);
  const canvasSize = Math.min(intermediateSize, 512);

  const { canvas, ctx } = simplifyImage(img, canvasSize);

  // 포스터라이즈: 저해상도 그리드일수록 더 공격적으로 색상 축소
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data } = imageData;
  const posterizeLevels = gridSize <= 16 ? 6 : gridSize <= 32 ? 8 : 12;
  posterize(data, posterizeLevels);
  ctx.putImageData(imageData, 0, 0);

  // 포스터라이즈된 데이터로 다시 읽기
  const finalData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;
  const blockSize = Math.floor(canvasSize / gridSize);

  const bg = detectBgColor(finalData, canvasSize);
  const BG_THRESHOLD = 2500; // ~50 per channel

  // 저해상도 그리드에서는 더 공격적인 양자화 (64단위)
  const quantShift = gridSize <= 16 ? 6 : 5;

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
          const r = finalData[i];
          const g = finalData[i + 1];
          const b = finalData[i + 2];

          const key = `${(r >> quantShift) << quantShift},${(g >> quantShift) << quantShift},${(b >> quantShift) << quantShift}`;
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

      if (best.count === 0) {
        gridRow.push(null);
        continue;
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
        gridRow.push(
          palette
            ? findClosestColor(avgR, avgG, avgB, palette)
            : rgbToHex(avgR, avgG, avgB)
        );
      }
    }
    grid.push(gridRow);
  }

  // 캔버스 정리
  canvas.width = 0;
  canvas.height = 0;

  return grid;
}
