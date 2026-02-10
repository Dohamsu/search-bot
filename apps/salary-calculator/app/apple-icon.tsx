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
          background: "linear-gradient(135deg, #10b981, #3b82f6)",
          borderRadius: 36,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: -10,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
          }}
        />
        {/* 원화 심볼 (W + 가로줄 2개) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              color: "#ffffff",
              display: "flex",
              lineHeight: 1,
            }}
          >
            W
          </div>
          <div
            style={{
              position: "absolute",
              top: 38,
              left: -4,
              right: -4,
              height: 5,
              background: "#ffffff",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 50,
              left: -4,
              right: -4,
              height: 5,
              background: "#ffffff",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
