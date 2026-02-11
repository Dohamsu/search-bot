export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

// --- Conversion Functions ---

export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) {
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / d + 2) / 6;
    } else {
      h = ((rn - gn) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const hn = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let rn = 0,
    gn = 0,
    bn = 0;

  if (hn < 60) {
    rn = c;
    gn = x;
  } else if (hn < 120) {
    rn = x;
    gn = c;
  } else if (hn < 180) {
    gn = c;
    bn = x;
  } else if (hn < 240) {
    gn = x;
    bn = c;
  } else if (hn < 300) {
    rn = x;
    bn = c;
  } else {
    rn = c;
    bn = x;
  }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === rn) {
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / d + 2) / 6;
    } else {
      h = ((rn - gn) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const sn = s / 100;
  const vn = v / 100;
  const hn = ((h % 360) + 360) % 360;

  const c = vn * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = vn - c;

  let rn = 0,
    gn = 0,
    bn = 0;

  if (hn < 60) {
    rn = c;
    gn = x;
  } else if (hn < 120) {
    rn = x;
    gn = c;
  } else if (hn < 180) {
    gn = c;
    bn = x;
  } else if (hn < 240) {
    gn = x;
    bn = c;
  } else if (hn < 300) {
    rn = x;
    bn = c;
  } else {
    rn = c;
    bn = x;
  }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// --- Luminance & Contrast ---

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- Palette Generation ---

function hslShift(hex: string, hueOffset: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  return hslToHex((hsl.h + hueOffset + 360) % 360, hsl.s, hsl.l);
}

export function generateAnalogous(hex: string): string[] {
  return [
    hslShift(hex, -30),
    hslShift(hex, -15),
    hex,
    hslShift(hex, 15),
    hslShift(hex, 30),
  ];
}

export function generateComplementary(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex, hex, hex, hex];
  const comp = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const lighter = hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 95));
  const darker = hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 5));
  const compLighter = hslToHex(
    (hsl.h + 180) % 360,
    hsl.s,
    Math.min(hsl.l + 15, 95)
  );
  return [darker, hex, lighter, comp, compLighter];
}

export function generateTriadic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex, hex, hex, hex];
  const t1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const t2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  const lighter = hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95));
  const t1Lighter = hslToHex(
    (hsl.h + 120) % 360,
    hsl.s,
    Math.min(hsl.l + 20, 95)
  );
  return [hex, lighter, t1, t1Lighter, t2];
}

export function generateSplitComplementary(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex, hex, hex, hex];
  const s1 = hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l);
  const s2 = hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l);
  const lighter = hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 95));
  const darker = hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 5));
  return [darker, hex, lighter, s1, s2];
}

export function generateMonochromatic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex, hex, hex, hex];
  return [
    hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 5)),
    hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)),
    hex,
    hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)),
    hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 95)),
  ];
}

export function generateRandomHex(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

// --- Image Color Extraction ---

export function extractColorsFromImageData(
  imageData: ImageData,
  numColors: number = 6
): string[] {
  const { data, width, height } = imageData;
  const gridSize = Math.max(1, Math.floor(Math.sqrt((width * height) / 200)));
  const colorMap = new Map<string, number>();

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      const idx = (y * width + x) * 4;
      const r = Math.round(data[idx] / 32) * 32;
      const g = Math.round(data[idx + 1] / 32) * 32;
      const b = Math.round(data[idx + 2] / 32) * 32;
      const a = data[idx + 3];
      if (a < 128) continue;
      const key = `${r},${g},${b}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
  }

  const sorted = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors * 3);

  // Deduplicate: filter out colors too similar to each other
  const result: string[] = [];
  for (const [key] of sorted) {
    const [r, g, b] = key.split(",").map(Number);
    const hex = rgbToHex(r, g, b);
    const isDuplicate = result.some((existing) => {
      const er = hexToRgb(existing);
      if (!er) return false;
      return (
        Math.abs(er.r - r) < 40 &&
        Math.abs(er.g - g) < 40 &&
        Math.abs(er.b - b) < 40
      );
    });
    if (!isDuplicate) {
      result.push(hex);
    }
    if (result.length >= numColors) break;
  }

  return result;
}
