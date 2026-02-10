import { ImageResponse } from "next/og";

export const alt = "FileFlow - 무료 이미지 변환기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const fileTypes = [
    { ext: "PNG", color: "#3b82f6" },
    { ext: "JPG", color: "#60a5fa" },
    { ext: "WebP", color: "#2563eb" },
    { ext: "HEIC", color: "#1d4ed8" },
    { ext: "GIF", color: "#93c5fd" },
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
          background:
            "linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #f97316 100%)",
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
            background: "rgba(255,255,255,0.05)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
          }}
        />

        {/* 파일 변환 아이콘 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginBottom: 48,
          }}
        >
          {/* 원본 파일 아이콘 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 100,
                height: 120,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#ffffff",
                position: "relative",
              }}
            >
              {/* 파일 꺾임 표시 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  background: "rgba(255,255,255,0.2)",
                  borderBottomLeftRadius: 8,
                  display: "flex",
                }}
              />
              FILE
            </div>
          </div>

          {/* 변환 화살표 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 48,
                color: "#fbbf24",
                fontWeight: 800,
                display: "flex",
                letterSpacing: -4,
              }}
            >
              {">>>"}
            </div>
          </div>

          {/* 변환된 파일 타입들 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              width: 220,
            }}
          >
            {fileTypes.map((ft, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px 16px",
                  background: ft.color,
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  display: "flex",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {ft.ext}
              </div>
            ))}
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
              color: "#ffffff",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            FileFlow - 무료 이미지 변환기
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
              display: "flex",
              gap: 16,
            }}
          >
            포맷 변환 · 압축 · 리사이즈 · HEIC 변환
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 400,
              marginTop: 8,
              display: "flex",
            }}
          >
            100% 브라우저 처리 | 서버 업로드 없음 | 프라이버시 보호
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
