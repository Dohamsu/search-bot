import { ImageResponse } from "next/og";

export const alt = "연봉 실수령액 계산기 2026 | 4대보험 세금 공제 자동 계산";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function WonSymbol({ fontSize }: { fontSize: number }) {
  return (
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
          fontSize,
          fontWeight: 800,
          color: "#ffffff",
          display: "flex",
          lineHeight: 1,
        }}
      >
        W
      </div>
      {/* 가로줄 두 개로 원화 표현 */}
      <div
        style={{
          position: "absolute",
          top: Math.round(fontSize * 0.42),
          left: -2,
          right: -2,
          height: Math.max(2, Math.round(fontSize * 0.06)),
          background: "#ffffff",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: Math.round(fontSize * 0.56),
          left: -2,
          right: -2,
          height: Math.max(2, Math.round(fontSize * 0.06)),
          background: "#ffffff",
          display: "flex",
        }}
      />
    </div>
  );
}

export default function OGImage() {
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
            "linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 40%, #e0f2fe 70%, #ecfdf5 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 원 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12))",
            display: "flex",
          }}
        />

        {/* 돈/코인 심볼 영역 */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 40,
            alignItems: "center",
          }}
        >
          {/* 코인 1 */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            }}
          >
            <WonSymbol fontSize={32} />
          </div>
          {/* 코인 2 (큰) */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
              marginTop: -20,
            }}
          >
            <WonSymbol fontSize={44} />
          </div>
          {/* 코인 3 */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #14b8a6, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(20,184,166,0.3)",
            }}
          >
            <WonSymbol fontSize={32} />
          </div>
        </div>

        {/* 타이틀 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            연봉 실수령액 계산기
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#64748b",
              fontWeight: 500,
              display: "flex",
            }}
          >
            2026 연봉 계산 · 퇴직금 · 실수령표
          </div>
        </div>

        {/* 하단 태그들 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
          }}
        >
          {["4대보험", "소득세", "월급 역산", "퇴직금"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 600,
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
