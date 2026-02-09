export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

export const PALETTES: Palette[] = [
  {
    id: "default",
    name: "기본 (16색)",
    colors: [
      "#000000", "#FFFFFF", "#FF0000", "#00FF00",
      "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
      "#808080", "#C0C0C0", "#800000", "#008000",
      "#000080", "#808000", "#800080", "#008080",
    ],
  },
  {
    id: "gameboy",
    name: "Game Boy (4색)",
    colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
  },
  {
    id: "nes",
    name: "NES (12색)",
    colors: [
      "#000000", "#FCFCFC", "#F83800", "#00B800",
      "#0058F8", "#FCA044", "#D800CC", "#00E8D8",
      "#787878", "#BCBCBC", "#A81000", "#58D854",
    ],
  },
  {
    id: "pastel",
    name: "파스텔",
    colors: [
      "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
      "#BAE1FF", "#E8BAFF", "#FFBAE1", "#BAF0FF",
      "#D4BAFF", "#FFDAB3", "#B3FFD9", "#FFB3D9",
      "#FFFFFF", "#F0F0F0", "#D9D9D9", "#B3B3B3",
    ],
  },
  {
    id: "mono",
    name: "모노크롬",
    colors: [
      "#000000", "#1A1A1A", "#333333", "#4D4D4D",
      "#666666", "#808080", "#999999", "#B3B3B3",
      "#CCCCCC", "#E6E6E6", "#F2F2F2", "#FFFFFF",
    ],
  },
  {
    id: "sunset",
    name: "석양",
    colors: [
      "#1A0533", "#2D1B69", "#5B2C6F", "#8E44AD",
      "#C0392B", "#E74C3C", "#F39C12", "#F1C40F",
      "#FF6B6B", "#FF8E53", "#FFC93C", "#FFE66D",
      "#2C3E50", "#34495E", "#7F8C8D", "#ECF0F1",
    ],
  },
  {
    id: "ocean",
    name: "바다",
    colors: [
      "#001219", "#005F73", "#0A9396", "#94D2BD",
      "#E9D8A6", "#EE9B00", "#CA6702", "#BB3E03",
      "#AE2012", "#9B2226", "#023E8A", "#0077B6",
      "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF",
    ],
  },
  {
    id: "earth",
    name: "어스톤",
    colors: [
      "#3D2B1F", "#5C4033", "#8B6914", "#A0522D",
      "#CD853F", "#DEB887", "#D2B48C", "#F5DEB3",
      "#556B2F", "#6B8E23", "#808000", "#BDB76B",
      "#2F4F4F", "#696969", "#A9A9A9", "#D3D3D3",
    ],
  },
];

export function findClosestColor(r: number, g: number, b: number, palette: string[]): string {
  let minDist = Infinity;
  let closest = palette[0];
  for (const hex of palette) {
    const pr = parseInt(hex.slice(1, 3), 16);
    const pg = parseInt(hex.slice(3, 5), 16);
    const pb = parseInt(hex.slice(5, 7), 16);
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (dist < minDist) {
      minDist = dist;
      closest = hex;
    }
  }
  return closest;
}
