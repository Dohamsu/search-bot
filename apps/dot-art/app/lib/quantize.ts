/**
 * Median Cut 색상 양자화 — 이미지에서 최적 N색 팔레트 자동 추출
 */

interface ColorBucket {
  colors: [number, number, number][];
}

function rangeOfChannel(
  colors: [number, number, number][],
  ch: 0 | 1 | 2
): number {
  let min = 255, max = 0;
  for (const c of colors) {
    if (c[ch] < min) min = c[ch];
    if (c[ch] > max) max = c[ch];
  }
  return max - min;
}

function widestChannel(colors: [number, number, number][]): 0 | 1 | 2 {
  const rRange = rangeOfChannel(colors, 0);
  const gRange = rangeOfChannel(colors, 1);
  const bRange = rangeOfChannel(colors, 2);
  if (gRange >= rRange && gRange >= bRange) return 1;
  if (rRange >= bRange) return 0;
  return 2;
}

function averageColor(colors: [number, number, number][]): string {
  let tR = 0, tG = 0, tB = 0;
  for (const [r, g, b] of colors) {
    tR += r;
    tG += g;
    tB += b;
  }
  const n = colors.length;
  const aR = Math.round(tR / n);
  const aG = Math.round(tG / n);
  const aB = Math.round(tB / n);
  return (
    "#" +
    aR.toString(16).padStart(2, "0") +
    aG.toString(16).padStart(2, "0") +
    aB.toString(16).padStart(2, "0")
  ).toUpperCase();
}

/**
 * 이미지 데이터에서 Median Cut으로 N색 팔레트 추출
 * @param data - RGBA Uint8ClampedArray (canvas.getImageData().data)
 * @param colorCount - 추출할 색상 수 (8, 12, 16, 24 등)
 */
export function medianCut(
  data: Uint8ClampedArray,
  colorCount: number
): string[] {
  // 고유 색상 수집 (투명 픽셀 제외, 5비트 양자화로 성능 확보)
  const seen = new Set<number>();
  const colors: [number, number, number][] = [];

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // 투명 픽셀 건너뜀
    const r = data[i] >> 3 << 3;
    const g = data[i + 1] >> 3 << 3;
    const b = data[i + 2] >> 3 << 3;
    const key = (r << 16) | (g << 8) | b;
    if (!seen.has(key)) {
      seen.add(key);
      colors.push([r, g, b]);
    }
  }

  if (colors.length === 0) return ["#000000"];
  if (colors.length <= colorCount) {
    return colors.map(([r, g, b]) => averageColor([[r, g, b]]));
  }

  // 초기 버킷
  let buckets: ColorBucket[] = [{ colors }];

  // 버킷을 colorCount 개가 될 때까지 분할
  while (buckets.length < colorCount) {
    // 가장 큰 버킷 찾기
    let maxIdx = 0;
    let maxSize = 0;
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].colors.length > maxSize) {
        maxSize = buckets[i].colors.length;
        maxIdx = i;
      }
    }

    const bucket = buckets[maxIdx];
    if (bucket.colors.length <= 1) break;

    // 가장 넓은 축으로 정렬 후 중앙에서 분할
    const ch = widestChannel(bucket.colors);
    bucket.colors.sort((a, b) => a[ch] - b[ch]);
    const mid = Math.floor(bucket.colors.length / 2);

    buckets.splice(maxIdx, 1, {
      colors: bucket.colors.slice(0, mid),
    }, {
      colors: bucket.colors.slice(mid),
    });
  }

  return buckets.map((b) => averageColor(b.colors));
}
