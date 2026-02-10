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
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          borderRadius: 36,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", width: 100, height: 100, gap: 8 }}>
          <div style={{ width: 44, height: 44, background: "#fbbf24", borderRadius: 8 }} />
          <div style={{ width: 44, height: 44, background: "#34d399", borderRadius: 8 }} />
          <div style={{ width: 44, height: 44, background: "#f87171", borderRadius: 8 }} />
          <div style={{ width: 44, height: 44, background: "#60a5fa", borderRadius: 8 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
