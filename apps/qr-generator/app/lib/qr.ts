import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function generateQR(text: string, options?: QROptions): Promise<string> {
  if (!text || !text.trim()) {
    throw new Error('QR 코드를 생성할 텍스트가 비어 있습니다.');
  }
  return await QRCode.toDataURL(text, {
    width: options?.width ?? 200,
    margin: options?.margin ?? 2,
    errorCorrectionLevel: options?.errorCorrectionLevel ?? 'M',
    color: {
      dark: options?.darkColor ?? '#111827',
      light: options?.lightColor ?? '#FFFFFF',
    },
  });
}

export async function generateQRSvg(text: string, options?: QROptions): Promise<string> {
  if (!text || !text.trim()) {
    throw new Error('QR 코드를 생성할 텍스트가 비어 있습니다.');
  }
  return await QRCode.toString(text, {
    type: 'svg',
    width: options?.width ?? 200,
    margin: options?.margin ?? 2,
    errorCorrectionLevel: options?.errorCorrectionLevel ?? 'M',
    color: {
      dark: options?.darkColor ?? '#111827',
      light: options?.lightColor ?? '#FFFFFF',
    },
  });
}
