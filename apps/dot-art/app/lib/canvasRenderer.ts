import { DotGrid } from "./dotArt";

export interface RenderOptions {
  dotSize: number;
  gap: number;
  dotShape: "square" | "circle";
  bgColor: string;
}

/**
 * DotGrid를 Canvas에 렌더링
 */
export function renderDotGrid(
  canvas: HTMLCanvasElement,
  grid: DotGrid,
  options: RenderOptions
): void {
  const { dotSize, gap, dotShape, bgColor } = options;
  const gridSize = grid.length;
  const totalSize = gridSize * (dotSize + gap) - gap;

  canvas.width = totalSize;
  canvas.height = totalSize;
  const ctx = canvas.getContext("2d")!;

  // 배경
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalSize, totalSize);

  // 도트 렌더링
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const color = grid[row][col];
      if (!color) continue;

      const x = col * (dotSize + gap);
      const y = row * (dotSize + gap);

      ctx.fillStyle = color;

      if (dotShape === "circle") {
        ctx.beginPath();
        ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, dotSize, dotSize);
      }
    }
  }
}

/**
 * Canvas를 PNG로 다운로드
 */
export function downloadCanvasAsPNG(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * 미리보기용 고해상도 렌더링
 */
export function getPreviewDotSize(gridSize: number, maxCanvasWidth: number): number {
  const targetDotSize = Math.floor(maxCanvasWidth / gridSize);
  return Math.max(4, Math.min(targetDotSize, 32));
}
