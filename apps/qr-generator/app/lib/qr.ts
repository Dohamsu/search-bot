import QRCode from 'qrcode';

export async function generateQR(text: string): Promise<string> {
  if (!text || !text.trim()) {
    throw new Error('QR 코드를 생성할 텍스트가 비어 있습니다.');
  }
  return await QRCode.toDataURL(text, {
    width: 200,
    margin: 2,
    color: {
      dark: '#111827',
      light: '#FFFFFF',
    },
  });
}
