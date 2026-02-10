import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e40af, #f97316)",
          borderRadius: 36,
          position: "relative",
        }}
      >
        {/* 파일 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* 왼쪽 파일 */}
          <div
            style={{
              width: 52,
              height: 64,
              background: "rgba(255,255,255,0.25)",
              borderRadius: 8,
              border: "2px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* 파일 꺾임 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 14,
                height: 14,
                background: "rgba(255,255,255,0.3)",
                borderBottomLeftRadius: 4,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#ffffff",
                display: "flex",
              }}
            >
              A
            </div>
          </div>

          {/* 화살표 */}
          <div
            style={{
              fontSize: 28,
              color: "#fbbf24",
              fontWeight: 800,
              display: "flex",
            }}
          >
            {">"}
          </div>

          {/* 오른쪽 파일 */}
          <div
            style={{
              width: 52,
              height: 64,
              background: "rgba(255,255,255,0.4)",
              borderRadius: 8,
              border: "2px solid rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 14,
                height: 14,
                background: "rgba(255,255,255,0.5)",
                borderBottomLeftRadius: 4,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#ffffff",
                display: "flex",
              }}
            >
              B
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
