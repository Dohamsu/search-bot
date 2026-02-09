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
 * 이미지 URL을 도트 그리드로 변환 (Pro 모드용)
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
  // 이미지를 정사각형으로 중앙 맞춤
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
