/**
 * Edge Detection — Sobel 엣지맵 + 가중 블록 샘플링 + 아웃라인 오버레이
 */

import { findClosestColor } from "./palettes";

/**
 * Sobel 엣지맵 계산
 * RGBA 데이터를 그레이스케일 변환 후 3x3 Sobel 커널 적용.
 * 반환값은 0~255 정규화된 Float32Array (width * height).
 */
export function sobelEdgeMap(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Float32Array {
  // 1. 그레이스케일 변환 (luminance 가중치)
  const gray = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // 2. Sobel 커널 적용
  const edgeMap = new Float32Array(width * height);
  let maxVal = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      // Gx (수직 엣지)
      const gx =
        -gray[idx - width - 1] - 2 * gray[idx - 1] - gray[idx + width - 1] +
         gray[idx - width + 1] + 2 * gray[idx + 1] + gray[idx + width + 1];
      // Gy (수평 엣지)
      const gy =
        -gray[idx - width - 1] - 2 * gray[idx - width] - gray[idx - width + 1] +
         gray[idx + width - 1] + 2 * gray[idx + width] + gray[idx + width + 1];

      edgeMap[idx] = Math.sqrt(gx * gx + gy * gy);
      if (edgeMap[idx] > maxVal) maxVal = edgeMap[idx];
    }
  }

  // 3. 0~255 정규화
  if (maxVal > 0) {
    const scale = 255 / maxVal;
    for (let i = 0; i < edgeMap.length; i++) {
      edgeMap[i] *= scale;
    }
  }

  return edgeMap;
}

/**
 * (A) Edge-Weighted Block Sampling
 * Sobel 엣지맵을 사용하여 블록 내 엣지 픽셀에 가중치를 부여한 색상 평균.
 * 엣지 부근 색상이 평균에서 사라지지 않고 보존됨.
 */
export function edgeWeightedBlockSample(
  data: Uint8ClampedArray,
  edgeMap: Float32Array,
  canvasSize: number,
  gridSize: number,
  palette: string[],
  alphaThreshold: number = 30,
  edgeBoost: number = 2.5
): (string | null)[][] {
  const blockSize = Math.floor(canvasSize / gridSize);
  const grid: (string | null)[][] = [];

  for (let row = 0; row < gridSize; row++) {
    const gridRow: (string | null)[] = [];
    for (let col = 0; col < gridSize; col++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let totalW = 0;
      let count = 0;

      for (let y = row * blockSize; y < (row + 1) * blockSize && y < canvasSize; y++) {
        for (let x = col * blockSize; x < (col + 1) * blockSize && x < canvasSize; x++) {
          const pixIdx = (y * canvasSize + x) * 4;
          const edgeIdx = y * canvasSize + x;

          // 엣지 강도에 따른 가중치: 1.0(평탄) ~ 1+edgeBoost(강한 엣지)
          const w = 1.0 + edgeBoost * (edgeMap[edgeIdx] / 255);

          totalR += data[pixIdx] * w;
          totalG += data[pixIdx + 1] * w;
          totalB += data[pixIdx + 2] * w;
          totalA += data[pixIdx + 3];
          totalW += w;
          count++;
        }
      }

      const avgA = totalA / count;
      if (avgA < alphaThreshold) {
        gridRow.push(null);
      } else {
        const avgR = Math.round(totalR / totalW);
        const avgG = Math.round(totalG / totalW);
        const avgB = Math.round(totalB / totalW);
        gridRow.push(findClosestColor(avgR, avgG, avgB, palette));
      }
    }
    grid.push(gridRow);
  }

  return grid;
}

/**
 * 가중 RGB 색상 거리 (palettes.ts의 weightedColorDist와 동일 로직)
 */
function colorDistHex(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const rMean = (r1 + r2) >> 1;
  const dR = r1 - r2;
  const dG = g1 - g2;
  const dB = b1 - b2;
  return ((512 + rMean) * dR * dR >> 8) + 4 * dG * dG + ((767 - rMean) * dB * dB >> 8);
}

/**
 * (B) Post-Conversion Outline Overlay
 * 변환 완료된 그리드에서 인접 셀 색상 차이가 큰 곳 또는
 * 투명 셀과의 경계에 어두운 아웃라인을 추가.
 */
export function addOutlineToGrid(
  grid: (string | null)[][],
  outlineColor?: string
): (string | null)[][] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const result = grid.map((r) => [...r]);

  // 아웃라인 색상 미지정 시 그리드에서 가장 어두운 색상 사용
  const effectiveOutline = outlineColor ?? findDarkestColor(grid);

  // 색상 거리 임계값 (가중 RGB 기준)
  const threshold = 8000;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      if (!cell) continue;

      const neighbors: [number, number][] = [
        [row - 1, col], [row + 1, col],
        [row, col - 1], [row, col + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const neighbor = grid[nr][nc];

        // 투명 셀과 인접하면 아웃라인
        if (!neighbor) {
          result[row][col] = effectiveOutline;
          break;
        }

        // 색상 차이가 크면 아웃라인
        if (colorDistHex(cell, neighbor) > threshold) {
          // 현재 셀을 더 어둡게 만들어서 아웃라인 효과
          result[row][col] = darkenColor(cell, 0.4);
          break;
        }
      }
    }
  }

  return result;
}

/**
 * 그리드에서 가장 어두운 (luminance가 낮은) 색상 찾기
 */
function findDarkestColor(grid: (string | null)[][]): string {
  let darkest = "#000000";
  let minLum = Infinity;

  for (const row of grid) {
    for (const cell of row) {
      if (!cell) continue;
      const r = parseInt(cell.slice(1, 3), 16);
      const g = parseInt(cell.slice(3, 5), 16);
      const b = parseInt(cell.slice(5, 7), 16);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < minLum) {
        minLum = lum;
        darkest = cell;
      }
    }
  }

  return darkest;
}

/**
 * 색상을 어둡게 (factor: 0=완전검정, 1=원본)
 */
function darkenColor(hex: string, factor: number): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  ).toUpperCase();
}
