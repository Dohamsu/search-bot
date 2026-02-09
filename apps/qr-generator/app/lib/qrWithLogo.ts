export async function applyLogoToQR(
  qrDataUrl: string,
  logoSource: File | string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      const canvas = document.createElement('canvas');
      const size = qrImg.width;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context를 가져올 수 없습니다.'));
        return;
      }

      ctx.drawImage(qrImg, 0, 0, size, size);

      const logoImg = new Image();
      logoImg.onload = () => {
        const logoSize = Math.floor(size * 0.2);
        const logoX = Math.floor((size - logoSize) / 2);
        const logoY = Math.floor((size - logoSize) / 2);

        const padding = 4;
        const radius = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(
          logoX - padding,
          logoY - padding,
          logoSize + padding * 2,
          logoSize + padding * 2,
          radius
        );
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, radius - 2);
        ctx.clip();
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      };
      logoImg.onerror = () => reject(new Error('로고 이미지를 불러올 수 없습니다.'));

      if (typeof logoSource === 'string') {
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = logoSource;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          logoImg.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('로고 파일을 읽을 수 없습니다.'));
        reader.readAsDataURL(logoSource);
      }
    };
    qrImg.onerror = () => reject(new Error('QR 이미지를 불러올 수 없습니다.'));
    qrImg.src = qrDataUrl;
  });
}
