import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // 미니 QR 패턴 (7x7 finder pattern 기반)
  const pattern = [
    [1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1],
  ];

  const cellSize = 14;
  const gap = 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #0d9488)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: gap,
            padding: 12,
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 12,
          }}
        >
          {pattern.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", gap: gap }}>
              {row.map((cell, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 2,
                    backgroundColor: cell === 1 ? "#0f172a" : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
