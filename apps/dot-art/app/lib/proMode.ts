import { DotGrid, imageToDotGrid, DotArtOptions } from "./dotArt";

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

interface DalleResponse {
  data: { b64_json: string }[];
}

const KOREAN_RE = /[\uAC00-\uD7A3\u3131-\u318E]/;

async function translatePrompt(prompt: string, apiKey: string): Promise<string> {
  if (!KOREAN_RE.test(prompt)) return prompt;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 120,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Convert the user's Korean text into a concise English description suitable for an image generation prompt. Output ONLY the English translation, nothing else.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) return prompt; // 번역 실패 시 원문 사용
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || prompt;
}

export async function generateWithDalle(
  prompt: string,
  apiKey: string,
  options: DotArtOptions,
  modelOption: ModelOption
): Promise<DotGrid> {
  const translated = await translatePrompt(prompt, apiKey);
  const enhancedPrompt = `Pixel art of ${translated}, 16-bit retro style, clean pixels, solid colors, no gradients, centered on white background`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelOption.model,
      prompt: enhancedPrompt,
      n: 1,
      size: modelOption.size,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API 오류: ${response.status}`);
  }

  const data: DalleResponse = await response.json();
  const b64 = data.data[0].b64_json;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const grid = imageToDotGrid(img, options);
      resolve(grid);
    };
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = `data:image/png;base64,${b64}`;
  });
}
