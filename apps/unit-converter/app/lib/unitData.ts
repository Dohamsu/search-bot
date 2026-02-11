export type CategoryId =
  | "length"
  | "weight"
  | "area"
  | "volume"
  | "temperature"
  | "speed"
  | "data"
  | "time";

export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  toBase: number; // multiply to convert to base unit (0 for special formulas)
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: string; // lucide icon name
  baseUnit: string;
  units: UnitDef[];
}

export interface QuickConvert {
  label: string;
  categoryId: CategoryId;
  fromUnit: string;
  toUnit: string;
  description: string;
}

export const categories: CategoryDef[] = [
  {
    id: "length",
    label: "길이",
    icon: "Ruler",
    baseUnit: "m",
    units: [
      { id: "mm", label: "밀리미터", symbol: "mm", toBase: 0.001 },
      { id: "cm", label: "센티미터", symbol: "cm", toBase: 0.01 },
      { id: "m", label: "미터", symbol: "m", toBase: 1 },
      { id: "km", label: "킬로미터", symbol: "km", toBase: 1000 },
      { id: "in", label: "인치", symbol: "in", toBase: 0.0254 },
      { id: "ft", label: "피트", symbol: "ft", toBase: 0.3048 },
      { id: "yd", label: "야드", symbol: "yd", toBase: 0.9144 },
      { id: "mi", label: "마일", symbol: "mi", toBase: 1609.344 },
      { id: "ri", label: "리(里)", symbol: "리", toBase: 392.727 },
      { id: "ja", label: "자(尺)", symbol: "자", toBase: 0.303030 },
      { id: "chi", label: "치(寸)", symbol: "치", toBase: 0.030303 },
    ],
  },
  {
    id: "weight",
    label: "무게",
    icon: "Weight",
    baseUnit: "kg",
    units: [
      { id: "mg", label: "밀리그램", symbol: "mg", toBase: 0.000001 },
      { id: "g", label: "그램", symbol: "g", toBase: 0.001 },
      { id: "kg", label: "킬로그램", symbol: "kg", toBase: 1 },
      { id: "t", label: "톤", symbol: "t", toBase: 1000 },
      { id: "oz", label: "온스", symbol: "oz", toBase: 0.028349523125 },
      { id: "lb", label: "파운드", symbol: "lb", toBase: 0.45359237 },
      { id: "geun", label: "근(斤)", symbol: "근", toBase: 0.6 },
      { id: "nyang", label: "냥(兩)", symbol: "냥", toBase: 0.0375 },
      { id: "don", label: "돈(錢)", symbol: "돈", toBase: 0.00375 },
    ],
  },
  {
    id: "area",
    label: "넓이",
    icon: "Square",
    baseUnit: "m2",
    units: [
      { id: "mm2", label: "제곱밀리미터", symbol: "㎟", toBase: 0.000001 },
      { id: "cm2", label: "제곱센티미터", symbol: "㎠", toBase: 0.0001 },
      { id: "m2", label: "제곱미터", symbol: "㎡", toBase: 1 },
      { id: "km2", label: "제곱킬로미터", symbol: "㎢", toBase: 1000000 },
      { id: "ha", label: "헥타르", symbol: "ha", toBase: 10000 },
      { id: "ac", label: "에이커", symbol: "ac", toBase: 4046.8564224 },
      {
        id: "pyeong",
        label: "평(坪)",
        symbol: "평",
        toBase: 3.305785123966942,
      },
      { id: "jeong", label: "정(町)", symbol: "정", toBase: 9917.355 },
    ],
  },
  {
    id: "volume",
    label: "부피",
    icon: "Beaker",
    baseUnit: "L",
    units: [
      { id: "mL", label: "밀리리터", symbol: "mL", toBase: 0.001 },
      { id: "L", label: "리터", symbol: "L", toBase: 1 },
      { id: "m3", label: "세제곱미터", symbol: "㎥", toBase: 1000 },
      { id: "gal", label: "갤런(US)", symbol: "gal", toBase: 3.785411784 },
      { id: "qt", label: "쿼트", symbol: "qt", toBase: 0.946352946 },
      { id: "pt", label: "파인트", symbol: "pt", toBase: 0.473176473 },
      { id: "floz", label: "액량 온스", symbol: "fl oz", toBase: 0.029573529563 },
      { id: "cup", label: "컵", symbol: "cup", toBase: 0.236588236 },
      { id: "hop", label: "홉(合)", symbol: "홉", toBase: 0.18039 },
      { id: "doe", label: "되(升)", symbol: "되", toBase: 1.8039 },
      { id: "mal", label: "말(斗)", symbol: "말", toBase: 18.039 },
    ],
  },
  {
    id: "temperature",
    label: "온도",
    icon: "Thermometer",
    baseUnit: "C",
    units: [
      { id: "C", label: "섭씨", symbol: "°C", toBase: 0 },
      { id: "F", label: "화씨", symbol: "°F", toBase: 0 },
      { id: "K", label: "켈빈", symbol: "K", toBase: 0 },
    ],
  },
  {
    id: "speed",
    label: "속도",
    icon: "Gauge",
    baseUnit: "ms",
    units: [
      { id: "ms", label: "미터/초", symbol: "m/s", toBase: 1 },
      { id: "kmh", label: "킬로미터/시", symbol: "km/h", toBase: 0.277777778 },
      { id: "mph", label: "마일/시", symbol: "mph", toBase: 0.44704 },
      { id: "kn", label: "노트", symbol: "kn", toBase: 0.514444444 },
      { id: "mach", label: "마하", symbol: "마하", toBase: 343 },
    ],
  },
  {
    id: "data",
    label: "데이터",
    icon: "HardDrive",
    baseUnit: "B",
    units: [
      { id: "bit", label: "비트", symbol: "bit", toBase: 0.125 },
      { id: "B", label: "바이트", symbol: "B", toBase: 1 },
      { id: "KB", label: "킬로바이트", symbol: "KB", toBase: 1024 },
      { id: "MB", label: "메가바이트", symbol: "MB", toBase: 1048576 },
      { id: "GB", label: "기가바이트", symbol: "GB", toBase: 1073741824 },
      { id: "TB", label: "테라바이트", symbol: "TB", toBase: 1099511627776 },
      { id: "PB", label: "페타바이트", symbol: "PB", toBase: 1125899906842624 },
    ],
  },
  {
    id: "time",
    label: "시간",
    icon: "Clock",
    baseUnit: "s",
    units: [
      { id: "s", label: "초", symbol: "초", toBase: 1 },
      { id: "min", label: "분", symbol: "분", toBase: 60 },
      { id: "h", label: "시간", symbol: "시간", toBase: 3600 },
      { id: "d", label: "일", symbol: "일", toBase: 86400 },
      { id: "w", label: "주", symbol: "주", toBase: 604800 },
      { id: "mo", label: "월(30일)", symbol: "월", toBase: 2592000 },
      { id: "y", label: "년(365일)", symbol: "년", toBase: 31536000 },
    ],
  },
];

export const quickConverts: QuickConvert[] = [
  {
    label: "평 → ㎡",
    categoryId: "area",
    fromUnit: "pyeong",
    toUnit: "m2",
    description: "부동산 면적 환산",
  },
  {
    label: "근 → kg",
    categoryId: "weight",
    fromUnit: "geun",
    toUnit: "kg",
    description: "식재료 무게 환산",
  },
  {
    label: "°C → °F",
    categoryId: "temperature",
    fromUnit: "C",
    toUnit: "F",
    description: "온도 변환",
  },
  {
    label: "mile → km",
    categoryId: "length",
    fromUnit: "mi",
    toUnit: "km",
    description: "거리 환산",
  },
  {
    label: "oz → g",
    categoryId: "weight",
    fromUnit: "oz",
    toUnit: "g",
    description: "무게 환산",
  },
  {
    label: "GB → MB",
    categoryId: "data",
    fromUnit: "GB",
    toUnit: "MB",
    description: "데이터 용량 환산",
  },
];
