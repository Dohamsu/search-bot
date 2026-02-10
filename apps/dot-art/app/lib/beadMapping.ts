export interface BeadColor {
  code: string;
  name: string;
  hex: string;
}

export interface BeadInfo {
  code: string;
  name: string;
  hex: string;
  count: number;
}

// 아이로비즈(Artkal) 기반 색상표 — 주요 48색
export const BEAD_COLORS: BeadColor[] = [
  { code: "C01", name: "흰색", hex: "#FFFFFF" },
  { code: "C02", name: "크림", hex: "#FFF8DC" },
  { code: "C03", name: "연노랑", hex: "#FFFACD" },
  { code: "C04", name: "노랑", hex: "#FFD700" },
  { code: "C05", name: "주황", hex: "#FFA500" },
  { code: "C06", name: "연주황", hex: "#FFDAB9" },
  { code: "C07", name: "살구", hex: "#FFCBA4" },
  { code: "C08", name: "분홍", hex: "#FFB6C1" },
  { code: "C09", name: "핫핑크", hex: "#FF69B4" },
  { code: "C10", name: "빨강", hex: "#FF0000" },
  { code: "C11", name: "진빨강", hex: "#CC0000" },
  { code: "C12", name: "와인", hex: "#800020" },
  { code: "C13", name: "보라", hex: "#800080" },
  { code: "C14", name: "연보라", hex: "#DDA0DD" },
  { code: "C15", name: "라벤더", hex: "#E6E6FA" },
  { code: "C16", name: "파랑", hex: "#0000FF" },
  { code: "C17", name: "진파랑", hex: "#00008B" },
  { code: "C18", name: "하늘", hex: "#87CEEB" },
  { code: "C19", name: "연하늘", hex: "#B0E0E6" },
  { code: "C20", name: "청록", hex: "#008080" },
  { code: "C21", name: "초록", hex: "#008000" },
  { code: "C22", name: "연초록", hex: "#90EE90" },
  { code: "C23", name: "라임", hex: "#32CD32" },
  { code: "C24", name: "올리브", hex: "#808000" },
  { code: "C25", name: "갈색", hex: "#8B4513" },
  { code: "C26", name: "연갈색", hex: "#D2B48C" },
  { code: "C27", name: "베이지", hex: "#F5F5DC" },
  { code: "C28", name: "카키", hex: "#BDB76B" },
  { code: "C29", name: "회색", hex: "#808080" },
  { code: "C30", name: "연회색", hex: "#C0C0C0" },
  { code: "C31", name: "진회색", hex: "#404040" },
  { code: "C32", name: "검정", hex: "#000000" },
  { code: "C33", name: "금색", hex: "#DAA520" },
  { code: "C34", name: "민트", hex: "#98FF98" },
  { code: "C35", name: "코랄", hex: "#FF7F50" },
  { code: "C36", name: "자홍", hex: "#FF00FF" },
  { code: "C37", name: "네이비", hex: "#000080" },
  { code: "C38", name: "아이보리", hex: "#FFFFF0" },
  { code: "C39", name: "피치", hex: "#FFCCCB" },
  { code: "C40", name: "터콰이즈", hex: "#40E0D0" },
  { code: "C41", name: "인디고", hex: "#4B0082" },
  { code: "C42", name: "마젠타", hex: "#CA1F7B" },
  { code: "C43", name: "차콜", hex: "#36454F" },
  { code: "C44", name: "로즈", hex: "#FF007F" },
  { code: "C45", name: "탄제린", hex: "#FF9966" },
  { code: "C46", name: "에메랄드", hex: "#50C878" },
  { code: "C47", name: "루비", hex: "#E0115F" },
  { code: "C48", name: "사파이어", hex: "#0F52BA" },
];

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

export function findClosestBead(hex: string): BeadColor {
  let closest = BEAD_COLORS[0];
  let minDist = Infinity;
  for (const bead of BEAD_COLORS) {
    const dist = colorDistance(hex, bead.hex);
    if (dist < minDist) {
      minDist = dist;
      closest = bead;
    }
  }
  return closest;
}

// DotGrid 타입: (string | null)[][]
export function gridToBeadGuide(grid: (string | null)[][]): BeadInfo[] {
  const counts = new Map<string, { bead: BeadColor; count: number }>();

  for (const row of grid) {
    for (const cell of row) {
      if (!cell) continue;
      const bead = findClosestBead(cell);
      const existing = counts.get(bead.code);
      if (existing) {
        existing.count++;
      } else {
        counts.set(bead.code, { bead, count: 1 });
      }
    }
  }

  return Array.from(counts.values())
    .map(({ bead, count }) => ({
      code: bead.code,
      name: bead.name,
      hex: bead.hex,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// 그리드의 각 셀을 비즈 번호로 매핑한 2D 배열 반환
export function gridToBeadGrid(grid: (string | null)[][]): (BeadColor | null)[][] {
  return grid.map((row) =>
    row.map((cell) => (cell ? findClosestBead(cell) : null))
  );
}

export function getTotalBeadCount(grid: (string | null)[][]): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell) count++;
    }
  }
  return count;
}
