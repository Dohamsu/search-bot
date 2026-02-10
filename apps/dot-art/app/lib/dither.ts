/**
 * 디더링 알고리즘 — Floyd-Steinberg (오류 확산) + Ordered (Bayer 4x4)
 */

import { findClosestColor } from "./palettes";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/**
 * Floyd-Steinberg 디더링 — 양자화 오류를 인접 픽셀에 확산
 * data를 in-place로 수정하여 디더링된 결과를 반환
 */
export function floydSteinberg(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[]
): void {
  // float 버퍼로 복사 (오류 누적 시 클램핑 방지)
  const buf = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) buf[i] = data[i];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (buf[i + 3] < 128) continue; // 투명 픽셀 건너뜀

      const oldR = Math.max(0, Math.min(255, Math.round(buf[i])));
      const oldG = Math.max(0, Math.min(255, Math.round(buf[i + 1])));
      const oldB = Math.max(0, Math.min(255, Math.round(buf[i + 2])));

      const newHex = findClosestColor(oldR, oldG, oldB, palette);
      const [newR, newG, newB] = hexToRgb(newHex);

      // 양자화된 색상 기록
      buf[i] = newR;
      buf[i + 1] = newG;
      buf[i + 2] = newB;

      // 오류 계산
      const errR = oldR - newR;
      const errG = oldG - newG;
      const errB = oldB - newB;

      // 오류 분배: 오른쪽(7/16), 왼아래(3/16), 아래(5/16), 오른아래(1/16)
      const spread = [
        [x + 1, y, 7 / 16],
        [x - 1, y + 1, 3 / 16],
        [x, y + 1, 5 / 16],
        [x + 1, y + 1, 1 / 16],
      ] as const;

      for (const [sx, sy, w] of spread) {
        if (sx >= 0 && sx < width && sy < height) {
          const si = (sy * width + sx) * 4;
          buf[si] += errR * w;
          buf[si + 1] += errG * w;
          buf[si + 2] += errB * w;
        }
      }
    }
  }

  // float 버퍼를 다시 Uint8로 기록
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.max(0, Math.min(255, Math.round(buf[i])));
  }
}

// Bayer 4x4 매트릭스 (정규화: 0~1 범위)
const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];

/**
 * Ordered 디더링 (Bayer 4x4) — 레트로 크로스해치 패턴
 * data를 in-place로 수정
 */
export function orderedDither(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[]
): void {
  const spread = 64; // 디더 강도 (채널당 ±32)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 128) continue;

      const threshold = BAYER_4X4[y % 4][x % 4] - 0.5; // -0.5 ~ +0.5
      const bias = Math.round(threshold * spread);

      const r = Math.max(0, Math.min(255, data[i] + bias));
      const g = Math.max(0, Math.min(255, data[i + 1] + bias));
      const b = Math.max(0, Math.min(255, data[i + 2] + bias));

      const hex = findClosestColor(r, g, b, palette);
      const [nr, ng, nb] = hexToRgb(hex);
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
    }
  }
}

export type DitherMode = "none" | "floyd-steinberg" | "ordered";

/**
 * 디더링 적용 (디스패치)
 */
export function applyDither(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[],
  mode: DitherMode
): void {
  if (mode === "floyd-steinberg") {
    floydSteinberg(data, width, height, palette);
  } else if (mode === "ordered") {
    orderedDither(data, width, height, palette);
  }
}
