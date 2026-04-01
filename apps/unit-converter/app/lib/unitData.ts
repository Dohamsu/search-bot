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
  toBase: number; // multiply to convert to base unit (0 for special formulas)
}

export interface CategoryDef {
  id: CategoryId;
  icon: string; // lucide icon name
  baseUnit: string;
  units: UnitDef[];
}

export interface QuickConvert {
  key: string; // translation key under quickConverts.*
  categoryId: CategoryId;
  fromUnit: string;
  toUnit: string;
}

export const categories: CategoryDef[] = [
  {
    id: "length",
    icon: "Ruler",
    baseUnit: "m",
    units: [
      { id: "mm", toBase: 0.001 },
      { id: "cm", toBase: 0.01 },
      { id: "m", toBase: 1 },
      { id: "km", toBase: 1000 },
      { id: "in", toBase: 0.0254 },
      { id: "ft", toBase: 0.3048 },
      { id: "yd", toBase: 0.9144 },
      { id: "mi", toBase: 1609.344 },
      { id: "ri", toBase: 392.727 },
      { id: "ja", toBase: 0.303030 },
      { id: "chi", toBase: 0.030303 },
    ],
  },
  {
    id: "weight",
    icon: "Weight",
    baseUnit: "kg",
    units: [
      { id: "mg", toBase: 0.000001 },
      { id: "g", toBase: 0.001 },
      { id: "kg", toBase: 1 },
      { id: "t", toBase: 1000 },
      { id: "oz", toBase: 0.028349523125 },
      { id: "lb", toBase: 0.45359237 },
      { id: "geun", toBase: 0.6 },
      { id: "nyang", toBase: 0.0375 },
      { id: "don", toBase: 0.00375 },
    ],
  },
  {
    id: "area",
    icon: "Square",
    baseUnit: "m2",
    units: [
      { id: "mm2", toBase: 0.000001 },
      { id: "cm2", toBase: 0.0001 },
      { id: "m2", toBase: 1 },
      { id: "km2", toBase: 1000000 },
      { id: "ha", toBase: 10000 },
      { id: "ac", toBase: 4046.8564224 },
      { id: "pyeong", toBase: 3.305785123966942 },
      { id: "jeong", toBase: 9917.355 },
    ],
  },
  {
    id: "volume",
    icon: "Beaker",
    baseUnit: "L",
    units: [
      { id: "mL", toBase: 0.001 },
      { id: "L", toBase: 1 },
      { id: "m3", toBase: 1000 },
      { id: "gal", toBase: 3.785411784 },
      { id: "qt", toBase: 0.946352946 },
      { id: "pt", toBase: 0.473176473 },
      { id: "floz", toBase: 0.029573529563 },
      { id: "cup", toBase: 0.236588236 },
      { id: "hop", toBase: 0.18039 },
      { id: "doe", toBase: 1.8039 },
      { id: "mal", toBase: 18.039 },
    ],
  },
  {
    id: "temperature",
    icon: "Thermometer",
    baseUnit: "C",
    units: [
      { id: "C", toBase: 0 },
      { id: "F", toBase: 0 },
      { id: "K", toBase: 0 },
    ],
  },
  {
    id: "speed",
    icon: "Gauge",
    baseUnit: "ms",
    units: [
      { id: "ms", toBase: 1 },
      { id: "kmh", toBase: 0.277777778 },
      { id: "mph", toBase: 0.44704 },
      { id: "kn", toBase: 0.514444444 },
      { id: "mach", toBase: 343 },
    ],
  },
  {
    id: "data",
    icon: "HardDrive",
    baseUnit: "B",
    units: [
      { id: "bit", toBase: 0.125 },
      { id: "B", toBase: 1 },
      { id: "KB", toBase: 1024 },
      { id: "MB", toBase: 1048576 },
      { id: "GB", toBase: 1073741824 },
      { id: "TB", toBase: 1099511627776 },
      { id: "PB", toBase: 1125899906842624 },
    ],
  },
  {
    id: "time",
    icon: "Clock",
    baseUnit: "s",
    units: [
      { id: "s", toBase: 1 },
      { id: "min", toBase: 60 },
      { id: "h", toBase: 3600 },
      { id: "d", toBase: 86400 },
      { id: "w", toBase: 604800 },
      { id: "mo", toBase: 2592000 },
      { id: "y", toBase: 31536000 },
    ],
  },
];

export const quickConverts: QuickConvert[] = [
  {
    key: "pyeongToM2",
    categoryId: "area",
    fromUnit: "pyeong",
    toUnit: "m2",
  },
  {
    key: "geunToKg",
    categoryId: "weight",
    fromUnit: "geun",
    toUnit: "kg",
  },
  {
    key: "cToF",
    categoryId: "temperature",
    fromUnit: "C",
    toUnit: "F",
  },
  {
    key: "mileToKm",
    categoryId: "length",
    fromUnit: "mi",
    toUnit: "km",
  },
  {
    key: "ozToG",
    categoryId: "weight",
    fromUnit: "oz",
    toUnit: "g",
  },
  {
    key: "gbToMb",
    categoryId: "data",
    fromUnit: "GB",
    toUnit: "MB",
  },
];
