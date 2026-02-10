import { ImageResponse } from "next/og";

export const alt = "Dot Art Studio - 무료 도트 아트 생성기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const dotColors = [
    ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"],
    ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
    ["#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3", "#fdf2f8"],
    ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7", "#fffbeb"],
    ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5", "#ecfdf5"],
    ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"],
  ];

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
          background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #fdf2f8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 도트 그리드 배경 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 40,
          }}
        >
          {dotColors.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", gap: 6 }}>
              {row.map((color, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 타이틀 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              backgroundClip: "text",
              color: "#4f46e5",
              letterSpacing: -1,
            }}
          >
            Dot Art Studio
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            무료 도트 아트 생성기 | 픽셀 아트 메이커
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
