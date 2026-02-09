import { DotGrid, imageToDotGrid, DotArtOptions } from "./dotArt";

interface DalleResponse {
  data: { b64_json: string }[];
}

export async function generateWithDalle(
  prompt: string,
  apiKey: string,
  options: DotArtOptions
): Promise<DotGrid> {
  const enhancedPrompt = `Pixel art of ${prompt}, 16-bit retro style, clean pixels, solid colors, no gradients, centered on white background`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API 오류: ${response.status}`);
  }

  const data: DalleResponse = await response.json();
  const b64 = data.data[0].b64_json;

  // base64 → Image → DotGrid
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
