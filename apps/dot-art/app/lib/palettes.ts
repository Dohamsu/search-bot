export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

export const PALETTES: Palette[] = [
  {
    id: "mono",
    name: "흑백",
    colors: [
      "#000000", "#1A1A1A", "#333333", "#4D4D4D",
      "#666666", "#808080", "#999999", "#B3B3B3",
      "#CCCCCC", "#E6E6E6", "#F2F2F2", "#FFFFFF",
    ],
  },
  {
    id: "color",
    name: "컬러",
    colors: [
      "#000000", "#FFFFFF", "#FF0000", "#00FF00",
      "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
      "#808080", "#C0C0C0", "#800000", "#008000",
      "#000080", "#808000", "#800080", "#008080",
    ],
  },
];

/**
 * Compuphase weighted RGB 거리 — 인간 지각 반영
 * https://www.compuphase.com/cmetric.htm
 */
function weightedColorDist(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const rMean = (r1 + r2) >> 1;
  const dR = r1 - r2;
  const dG = g1 - g2;
  const dB = b1 - b2;
  return ((512 + rMean) * dR * dR >> 8) + 4 * dG * dG + ((767 - rMean) * dB * dB >> 8);
}

export function findClosestColor(r: number, g: number, b: number, palette: string[]): string {
  let minDist = Infinity;
  let closest = palette[0];
  for (const hex of palette) {
    const pr = parseInt(hex.slice(1, 3), 16);
    const pg = parseInt(hex.slice(3, 5), 16);
    const pb = parseInt(hex.slice(5, 7), 16);
    const dist = weightedColorDist(r, g, b, pr, pg, pb);
    if (dist < minDist) {
      minDist = dist;
      closest = hex;
    }
  }
  return closest;
}

/**
 * 기존 그리드의 모든 색상을 새 팔레트로 리매핑
 */
export function remapGridToPalette(grid: (string | null)[][], palette: string[]): (string | null)[][] {
  return grid.map((row) =>
    row.map((cell) => {
      if (!cell) return null;
      const r = parseInt(cell.slice(1, 3), 16);
      const g = parseInt(cell.slice(3, 5), 16);
      const b = parseInt(cell.slice(5, 7), 16);
      return findClosestColor(r, g, b, palette);
    })
  );
}
