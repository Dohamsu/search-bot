import { DotGrid } from "./dotArt";

export type Tool = "pencil" | "eraser" | "bucket" | "eyedropper";

/**
 * 그리드의 특정 셀에 색상 적용
 */
export function setCell(grid: DotGrid, row: number, col: number, color: string | null): DotGrid {
  const newGrid = grid.map((r) => [...r]);
  if (newGrid.length > 0 && row >= 0 && row < newGrid.length && col >= 0 && col < newGrid[0].length) {
    newGrid[row][col] = color;
  }
  return newGrid;
}

/**
 * 플러드 필(Flood Fill) - 페인트통 도구
 */
export function floodFill(grid: DotGrid, row: number, col: number, fillColor: string): DotGrid {
  if (grid.length === 0 || grid[0].length === 0) return grid;
  const rows = grid.length;
  const cols = grid[0].length;
  const targetColor = grid[row][col];

  if (targetColor === fillColor) return grid;

  const newGrid = grid.map((r) => [...r]);
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newGrid[r][c] !== targetColor) continue;

    newGrid[r][c] = fillColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return newGrid;
}

/**
 * 수평 미러링
 */
export function mirrorHorizontal(grid: DotGrid): DotGrid {
  return grid.map((row) => [...row].reverse());
}

/**
 * 수직 미러링
 */
export function mirrorVertical(grid: DotGrid): DotGrid {
  return [...grid].reverse().map((row) => [...row]);
}

/**
 * 그리드 전체 클리어
 */
export function clearGrid(grid: DotGrid): DotGrid {
  return grid.map((row) => row.map(() => null));
}
