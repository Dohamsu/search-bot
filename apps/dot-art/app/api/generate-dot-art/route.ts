import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY || "";

const DAILY_LIMIT = 20;
const COOLDOWN_MS = 5 * 60 * 1000;

const MODEL_MAP: Record<string, { model: string; size: string }> = {
  "d2-256": { model: "dall-e-2", size: "256x256" },
  "d2-512": { model: "dall-e-2", size: "512x512" },
  "d3-1024": { model: "dall-e-3", size: "1024x1024" },
};

// 인메모리 rate limit (Vercel 서버리스에서는 cold start 시 리셋됨)
// 프로덕션에서는 Vercel KV 등으로 교체 권장
const rateLimitMap = new Map<string, { count: number; resetAt: number; lastGen: number }>();

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000, lastGen: now });
    return { allowed: true };
  }

  if (now - entry.lastGen < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - entry.lastGen)) / 1000);
    return { allowed: false, reason: `${remaining}초 후에 다시 시도해주세요` };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, reason: `일일 생성 한도(${DAILY_LIMIT}회)를 초과했습니다` };
  }

  entry.count++;
  entry.lastGen = now;
  return { allowed: true };
}

const KOREAN_RE = /[\uAC00-\uD7A3\u3131-\u318E]/;

async function translatePrompt(prompt: string): Promise<string> {
  if (!KOREAN_RE.test(prompt)) return prompt;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
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

  if (!res.ok) return prompt;
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || prompt;
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "서버에 API 키가 설정되지 않았습니다" }, { status: 500 });
  }

  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: rateCheck.reason }, { status: 429 });
  }

  let body: { prompt?: string; modelId?: string; gridSize?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  const { prompt, modelId, gridSize = 16 } = body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "프롬프트를 입력해주세요" }, { status: 400 });
  }

  if (prompt.length > 500) {
    return NextResponse.json({ error: "프롬프트는 500자 이하로 입력해주세요" }, { status: 400 });
  }

  // 그리드 크기에 따라 모델 자동 제한 (저해상도에 고화질 모델 사용 방지)
  let effectiveModelId = modelId || "d2-256";
  if (gridSize <= 16) {
    effectiveModelId = "d2-256";
  } else if (gridSize <= 32 && effectiveModelId === "d3-1024") {
    effectiveModelId = "d2-512";
  }

  const modelConfig = MODEL_MAP[effectiveModelId];
  if (!modelConfig) {
    return NextResponse.json({ error: "지원하지 않는 모델입니다" }, { status: 400 });
  }

  try {
    const translated = await translatePrompt(prompt.trim());

    // 그리드 크기에 맞는 프롬프트 생성
    let enhancedPrompt: string;
    if (gridSize <= 16) {
      enhancedPrompt = `Simple ${gridSize}x${gridSize} pixel art sprite of ${translated}, extremely low resolution, blocky shapes, maximum 8 colors, no gradients, no anti-aliasing, no shading, flat solid colors only, centered on plain white background`;
    } else if (gridSize <= 32) {
      enhancedPrompt = `${gridSize}x${gridSize} pixel art of ${translated}, low resolution retro style, blocky, limited color palette, no gradients, no anti-aliasing, solid colors, centered on white background`;
    } else {
      enhancedPrompt = `Pixel art of ${translated}, 16-bit retro style, clean pixels, solid colors, no gradients, centered on white background`;
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelConfig.model,
        prompt: enhancedPrompt,
        n: 1,
        size: modelConfig.size,
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `OpenAI API 오류: ${response.status}`;
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const data = await response.json();
    const b64 = data.data[0].b64_json;

    return NextResponse.json({ imageDataUrl: `data:image/png;base64,${b64}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "이미지 생성 실패" },
      { status: 500 }
    );
  }
}
