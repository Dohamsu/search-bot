import { ImageResponse } from 'next/og'

export const alt = '개발자 도구'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontData = await fetch(
    'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff'
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'KoreanFont',
        padding: '60px',
        position: 'relative',
      }}>
        {/* Top-left brand */}
        <div style={{
          position: 'absolute',
          top: 40,
          left: 60,
          fontSize: 20,
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
        }}>
          onekit.co.kr
        </div>

        {/* Emoji icon */}
        <div style={{ fontSize: 80, marginBottom: 20, display: 'flex' }}>
          🛠️
        </div>

        {/* Title */}
        <div style={{
          fontSize: 56,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          marginBottom: 16,
          display: 'flex',
        }}>
          개발자 도구
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'center',
          display: 'flex',
        }}>
          JSON·Base64·UUID·해시·정규식
        </div>

        {/* Bottom decoration line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'rgba(255,255,255,0.3)',
          display: 'flex',
        }} />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'KoreanFont', data: fontData, style: 'normal' as const, weight: 700 }],
    }
  )
}
