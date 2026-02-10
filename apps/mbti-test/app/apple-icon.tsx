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
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          borderRadius: 36,
        }}
      >
        {/* 4 quadrant brain/puzzle symbol representing MBTI's 4 groups */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 108,
            height: 108,
            gap: 8,
          }}
        >
          {/* Analysts - purple */}
          <div
            style={{
              width: 50,
              height: 50,
              background: "#7C3AED",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#EDE9FE",
              fontFamily: "sans-serif",
            }}
          >
            NT
          </div>
          {/* Diplomats - green */}
          <div
            style={{
              width: 50,
              height: 50,
              background: "#10B981",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#D1FAE5",
              fontFamily: "sans-serif",
            }}
          >
            NF
          </div>
          {/* Sentinels - blue */}
          <div
            style={{
              width: 50,
              height: 50,
              background: "#3B82F6",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#DBEAFE",
              fontFamily: "sans-serif",
            }}
          >
            SJ
          </div>
          {/* Explorers - amber */}
          <div
            style={{
              width: 50,
              height: 50,
              background: "#F59E0B",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#78350F",
              fontFamily: "sans-serif",
            }}
          >
            SP
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
