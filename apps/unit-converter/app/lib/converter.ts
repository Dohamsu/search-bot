import { categories, type CategoryId } from "./unitData";

/**
 * Temperature conversion helpers.
 * Base unit is Celsius (°C).
 */
function tempToBase(value: number, unitId: string): number {
  switch (unitId) {
    case "C":
      return value;
    case "F":
      return (value - 32) * (5 / 9);
    case "K":
      return value - 273.15;
    default:
      return value;
  }
}

function tempFromBase(baseValue: number, unitId: string): number {
  switch (unitId) {
    case "C":
      return baseValue;
    case "F":
      return baseValue * (9 / 5) + 32;
    case "K":
      return baseValue + 273.15;
    default:
      return baseValue;
  }
}

/**
 * Convert a value from one unit to another within the same category.
 */
export function convert(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: CategoryId
): number {
  if (fromUnitId === toUnitId) return value;

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return 0;

  // Temperature uses formula-based conversion
  if (categoryId === "temperature") {
    const baseValue = tempToBase(value, fromUnitId);
    return tempFromBase(baseValue, toUnitId);
  }

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return 0;

  // Convert to base unit, then to target unit
  const baseValue = value * fromUnit.toBase;
  return baseValue / toUnit.toBase;
}

/**
 * Convert a value from one unit to all other units in the same category.
 */
export function convertToAll(
  value: number,
  fromUnitId: string,
  categoryId: CategoryId
): Record<string, number> {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return {};

  const results: Record<string, number> = {};
  for (const unit of category.units) {
    results[unit.id] = convert(value, fromUnitId, unit.id, categoryId);
  }
  return results;
}

/**
 * Format a number for display with appropriate precision.
 */
export function formatNumber(num: number): string {
  if (num === 0) return "0";

  const abs = Math.abs(num);

  // Very large numbers: use locale string with max 2 decimal places
  if (abs >= 1e15) {
    return num.toExponential(4);
  }

  if (abs >= 1000) {
    // Show with commas, up to 4 decimal places
    return Number(num.toFixed(4)).toLocaleString("ko-KR", {
      maximumFractionDigits: 4,
    });
  }

  if (abs >= 1) {
    return Number(num.toFixed(6)).toLocaleString("ko-KR", {
      maximumFractionDigits: 6,
    });
  }

  if (abs >= 0.0001) {
    return Number(num.toFixed(8)).toLocaleString("ko-KR", {
      maximumFractionDigits: 8,
    });
  }

  // Very small numbers
  return num.toExponential(4);
}
