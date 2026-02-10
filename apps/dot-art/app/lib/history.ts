import { DotGrid } from "./dotArt";

export interface HistoryItem {
  id: string;
  grid: DotGrid;
  gridSize: number;
  mode: "auto" | "editor" | "pro";
  label: string;
  timestamp: number;
}

const STORAGE_KEY = "dot-art-history";
const MAX_ITEMS = 20;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function addHistoryItem(
  items: HistoryItem[],
  grid: DotGrid,
  mode: "auto" | "editor" | "pro",
  label: string
): HistoryItem[] {
  const newItem: HistoryItem = {
    id: generateId(),
    grid,
    gridSize: grid.length,
    mode,
    label: label.slice(0, 20),
    timestamp: Date.now(),
  };

  const next = [newItem, ...items].slice(0, MAX_ITEMS);

  if (!saveHistory(next)) {
    // 저장 실패 시 oldest 제거 후 재시도
    const reduced = next.slice(0, Math.max(1, next.length - 1));
    saveHistory(reduced);
    return reduced;
  }

  return next;
}

export function deleteHistoryItem(
  items: HistoryItem[],
  id: string
): HistoryItem[] {
  const next = items.filter((item) => item.id !== id);
  saveHistory(next);
  return next;
}

export function clearHistory(): HistoryItem[] {
  saveHistory([]);
  return [];
}
