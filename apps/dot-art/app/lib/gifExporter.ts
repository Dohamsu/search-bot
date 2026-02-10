import { DotGrid } from "./dotArt";
import { RenderOptions, renderDotGrid } from "./canvasRenderer";

export type GifEffect = "blink" | "bounce" | "rotate" | "rainbow" | "fade";

export const GIF_EFFECTS: { id: GifEffect; name: string; emoji: string }[] = [
  { id: "blink", name: "깜빡임", emoji: "✨" },
  { id: "bounce", name: "바운스", emoji: "⬆️" },
  { id: "rotate", name: "회전", emoji: "🔄" },
  { id: "rainbow", name: "무지개", emoji: "🌈" },
  { id: "fade", name: "페이드", emoji: "🌗" },
];

/**
 * 그리드를 90도 시계방향으로 회전
 */
function rotateGrid90(grid: DotGrid): DotGrid {
  const size = grid.length;
  const rotated: DotGrid = [];
  for (let row = 0; row < size; row++) {
    const newRow: (string | null)[] = [];
    for (let col = 0; col < size; col++) {
      newRow.push(grid[size - 1 - col][row]);
    }
    rotated.push(newRow);
  }
  return rotated;
}

/**
 * hex 색상의 hue를 shift
 */
function shiftHue(hex: string, degrees: number): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  h = (h + degrees / 360) % 1;
  if (h < 0) h += 1;

  // HSV to RGB
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let rr: number, gg: number, bb: number;
  switch (i % 6) {
    case 0: rr = v; gg = t; bb = p; break;
    case 1: rr = q; gg = v; bb = p; break;
    case 2: rr = p; gg = v; bb = t; break;
    case 3: rr = p; gg = q; bb = v; break;
    case 4: rr = t; gg = p; bb = v; break;
    default: rr = v; gg = p; bb = q; break;
  }

  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
}

/**
 * 색상에 opacity를 적용 (bgColor와 블렌딩)
 */
function applyOpacity(hex: string, opacity: number, bgHex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bgR = parseInt(bgHex.slice(1, 3), 16);
  const bgG = parseInt(bgHex.slice(3, 5), 16);
  const bgB = parseInt(bgHex.slice(5, 7), 16);

  const blend = (fg: number, bg: number) => Math.round(fg * opacity + bg * (1 - opacity));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(blend(r, bgR))}${toHex(blend(g, bgG))}${toHex(blend(b, bgB))}`;
}

/**
 * 효과별 프레임 그리드 시퀀스 생성
 */
function generateFrames(grid: DotGrid, effect: GifEffect, bgColor: string): DotGrid[] {
  const size = grid.length;
  const frames: DotGrid[] = [];

  switch (effect) {
    case "blink": {
      const emptyGrid: DotGrid = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
      );
      for (let i = 0; i < 8; i++) {
        frames.push(i % 2 === 0 ? grid : emptyGrid);
      }
      break;
    }

    case "bounce": {
      for (let i = 0; i < 12; i++) {
        const offset = Math.round(Math.sin((i / 12) * Math.PI * 2) * (size * 0.15));
        const bounced: DotGrid = Array.from({ length: size }, () =>
          Array.from({ length: size }, () => null)
        );
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const srcRow = row - offset;
            if (srcRow >= 0 && srcRow < size) {
              bounced[row][col] = grid[srcRow][col];
            }
          }
        }
        frames.push(bounced);
      }
      break;
    }

    case "rotate": {
      let current = grid;
      for (let i = 0; i < 8; i++) {
        frames.push(current);
        if (i % 2 === 1) {
          current = rotateGrid90(current);
        }
      }
      break;
    }

    case "rainbow": {
      for (let i = 0; i < 12; i++) {
        const hueShift = (i / 12) * 360;
        const shifted: DotGrid = grid.map((row) =>
          row.map((color) => (color ? shiftHue(color, hueShift) : null))
        );
        frames.push(shifted);
      }
      break;
    }

    case "fade": {
      for (let i = 0; i < 12; i++) {
        // 0 -> 1 -> 0 over 12 frames
        const opacity = i < 6 ? i / 6 : (12 - i) / 6;
        const faded: DotGrid = grid.map((row) =>
          row.map((color) =>
            color ? applyOpacity(color, Math.max(0, Math.min(1, opacity)), bgColor) : null
          )
        );
        frames.push(faded);
      }
      break;
    }
  }

  return frames;
}

/**
 * DotGrid를 GIF 애니메이션으로 내보내기
 */
export async function exportDotArtGif(
  grid: DotGrid,
  effect: GifEffect,
  options: RenderOptions
): Promise<Blob> {
  const { encode } = await import("modern-gif");

  const frameGrids = generateFrames(grid, effect, options.bgColor);
  if (frameGrids.length === 0) {
    throw new Error("GIF 프레임 생성 실패");
  }
  const canvas = document.createElement("canvas");
  renderDotGrid(canvas, frameGrids[0], options);
  const width = canvas.width;
  const height = canvas.height;

  const frames: Array<{ data: CanvasImageSource; delay: number }> = [];

  for (const frameGrid of frameGrids) {
    const frameCanvas = document.createElement("canvas");
    renderDotGrid(frameCanvas, frameGrid, options);
    frames.push({ data: frameCanvas, delay: 100 });
  }

  const result = await encode({
    width,
    height,
    frames,
  });

  return new Blob([result], { type: "image/gif" });
}
