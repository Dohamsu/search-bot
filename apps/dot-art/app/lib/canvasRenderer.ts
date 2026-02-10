import { DotGrid } from "./dotArt";

export interface RenderOptions {
  dotSize: number;
  gap: number;
  dotShape: "square" | "circle";
  bgColor: string;
  transparentBg?: boolean;
}

/**
 * DotGrid를 Canvas에 렌더링
 */
export function renderDotGrid(
  canvas: HTMLCanvasElement,
  grid: DotGrid,
  options: RenderOptions
): void {
  const { dotSize, gap, dotShape, bgColor, transparentBg } = options;
  const gridSize = grid.length;
  if (gridSize === 0) return;
  const totalSize = gridSize * (dotSize + gap) - gap;

  canvas.width = totalSize;
  canvas.height = totalSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 배경
  if (transparentBg) {
    ctx.clearRect(0, 0, totalSize, totalSize);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalSize, totalSize);
  }

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
 * Canvas를 클립보드에 복사
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error("Canvas to Blob 변환 실패"));
    }, "image/png");
  });
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob }),
  ]);
}

/**
 * 컨테이너 너비에 정확히 맞는 dotSize 계산
 * totalSize = gridSize * (dotSize + gap) - gap = containerWidth
 * → dotSize = (containerWidth + gap) / gridSize - gap
 */
export function fitDotSize(gridSize: number, gap: number, containerWidth: number): number {
  const dotSize = Math.floor((containerWidth + gap) / gridSize) - gap;
  return Math.max(2, dotSize);
}
