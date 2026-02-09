import { ImageResponse } from "next/og";
import { getResult } from "../../lib/results";

export const runtime = "edge";
export const alt = "16가지 성격 유형 테스트 결과";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const upperType = type.toUpperCase();
  const result = getResult(upperType);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 40%, #EC4899 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: 32,
            padding: "48px 80px",
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#6B7280",
              marginBottom: 12,
            }}
          >
            나의 성격 유형 결과
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            {result.type}
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#1E1B4B",
              marginTop: 8,
              marginBottom: 24,
            }}
          >
            {result.title}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {result.traits.map((trait) => (
              <div
                key={trait}
                style={{
                  backgroundColor: "#F3E8FF",
                  color: "#7C3AED",
                  padding: "8px 20px",
                  borderRadius: 999,
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {trait}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 20,
            marginTop: 32,
          }}
        >
          16가지 성격 유형 테스트 | 전체 인구의 {result.percentage}%
        </div>
      </div>
    ),
    { ...size }
  );
}
