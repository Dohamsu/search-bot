import { ImageResponse } from "next/og";

export const alt = "QR Studio - 무료 QR 코드 생성기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  // QR 코드 패턴 (1 = 채워진 셀, 0 = 빈 셀)
  const qrPattern = [
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  ];

  const cellSize = 18;
  const gap = 3;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #1e293b 100%)",
          fontFamily: "sans-serif",
          gap: 80,
        }}
      >
        {/* QR 코드 패턴 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: gap,
            padding: 28,
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          }}
        >
          {qrPattern.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", gap: gap }}>
              {row.map((cell, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 3,
                    backgroundColor: cell === 1 ? "#0f172a" : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 텍스트 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            QR Studio
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#5eead4",
              letterSpacing: -0.5,
            }}
          >
            무료 QR 코드 생성기
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#94a3b8",
              fontWeight: 400,
              gap: 8,
            }}
          >
            URL · 연락처 · Wi-Fi · 대량생성
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
