import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', width: 20, height: 20, gap: 2 }}>
          <div style={{ width: 8, height: 8, background: '#fbbf24', borderRadius: 1 }} />
          <div style={{ width: 8, height: 8, background: '#34d399', borderRadius: 1 }} />
          <div style={{ width: 8, height: 8, background: '#f87171', borderRadius: 1 }} />
          <div style={{ width: 8, height: 8, background: '#60a5fa', borderRadius: 1 }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
