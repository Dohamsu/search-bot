import { DotGrid, imageToDotGridPro } from "./dotArt";

export interface ModelOption {
  id: string;
  label: string;
  model: "dall-e-2" | "dall-e-3";
  size: string;
  price: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "d2-256", label: "빠른 생성", model: "dall-e-2", size: "256x256", price: "$0.016", description: "DALL-E 2 · 256px · 가장 저렴" },
  { id: "d2-512", label: "균형 모드", model: "dall-e-2", size: "512x512", price: "$0.018", description: "DALL-E 2 · 512px · 적절한 균형" },
  { id: "d3-1024", label: "고품질", model: "dall-e-3", size: "1024x1024", price: "$0.040", description: "DALL-E 3 · 1024px · 최고 품질" },
];

export const COOLDOWN_MS = 5 * 60 * 1000; // 5분

export async function generateWithDalle(
  prompt: string,
  options: { gridSize: number },
  modelOption: ModelOption
): Promise<{ grid: DotGrid; imageDataUrl: string }> {
  const response = await fetch("/api/generate-dot-art", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, modelId: modelOption.id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API 오류: ${response.status}`);
  }

  const imageDataUrl: string = data.imageDataUrl;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const grid = imageToDotGridPro(img, options.gridSize);
      resolve({ grid, imageDataUrl });
    };
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = imageDataUrl;
  });
}
