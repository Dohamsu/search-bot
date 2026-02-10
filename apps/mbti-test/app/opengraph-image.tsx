import { ImageResponse } from "next/og";

export const alt = "16가지 성격 유형 테스트 - MBTI 무료 검사";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const mbtiTypes = [
    ["INTJ", "INTP", "ENTJ", "ENTP"],
    ["INFJ", "INFP", "ENFJ", "ENFP"],
    ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    ["ISTP", "ISFP", "ESTP", "ESFP"],
  ];

  const groupColors: Record<string, { bg: string; text: string }> = {
    // Analysts (NT) - purple
    INTJ: { bg: "#7C3AED", text: "#EDE9FE" },
    INTP: { bg: "#8B5CF6", text: "#EDE9FE" },
    ENTJ: { bg: "#6D28D9", text: "#EDE9FE" },
    ENTP: { bg: "#9333EA", text: "#EDE9FE" },
    // Diplomats (NF) - green
    INFJ: { bg: "#059669", text: "#D1FAE5" },
    INFP: { bg: "#10B981", text: "#D1FAE5" },
    ENFJ: { bg: "#047857", text: "#D1FAE5" },
    ENFP: { bg: "#34D399", text: "#064E3B" },
    // Sentinels (SJ) - blue
    ISTJ: { bg: "#2563EB", text: "#DBEAFE" },
    ISFJ: { bg: "#3B82F6", text: "#DBEAFE" },
    ESTJ: { bg: "#1D4ED8", text: "#DBEAFE" },
    ESFJ: { bg: "#60A5FA", text: "#1E3A5F" },
    // Explorers (SP) - amber/orange
    ISTP: { bg: "#D97706", text: "#FEF3C7" },
    ISFP: { bg: "#F59E0B", text: "#78350F" },
    ESTP: { bg: "#B45309", text: "#FEF3C7" },
    ESFP: { bg: "#FBBF24", text: "#78350F" },
  };

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
          background:
            "linear-gradient(135deg, #8B5CF6 0%, #A855F7 40%, #EC4899 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: -1,
              textShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            16가지 성격 유형 테스트
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            MBTI 무료 검사 &middot; 궁합 &middot; 유형 분석
          </div>
        </div>

        {/* 4x4 MBTI Type Grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {mbtiTypes.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", gap: 10 }}>
              {row.map((type) => {
                const colors = groupColors[type];
                return (
                  <div
                    key={type}
                    style={{
                      width: 120,
                      height: 60,
                      borderRadius: 14,
                      backgroundColor: colors.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 800,
                      color: colors.text,
                      letterSpacing: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Label */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "#7C3AED",
              }}
            />
            분석가
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "#059669",
              }}
            />
            외교관
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "#2563EB",
              }}
            />
            관리자
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "#D97706",
              }}
            />
            탐험가
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
