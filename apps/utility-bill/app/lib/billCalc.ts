// ============================================================
// 전기요금 계산
// ============================================================

export type ElectricType = "residential" | "commercial";
export type Season = "summer" | "other";
export type DiscountType =
  | "none"
  | "disability"
  | "basicLiving"
  | "nextLowest"
  | "largeFam"
  | "newborn";

interface ProgressiveTier {
  label: string;
  rangeStart: number;
  rangeEnd: number;
  baseFee: number;
  unitPrice: number;
  usage: number;
  amount: number;
}

export interface ElectricBillResult {
  type: ElectricType;
  season: Season;
  usage: number;
  baseFee: number;
  energyCharge: number;
  climateCharge: number;
  fuelAdjust: number;
  subtotal: number;
  vat: number;
  fund: number;
  total: number;
  discount: number;
  discountLabel: string;
  tiers: ProgressiveTier[];
}

// 주택용 저압 요금표 (기타계절)
const RESIDENTIAL_OTHER: { max: number; baseFee: number; unit: number }[] = [
  { max: 200, baseFee: 910, unit: 120.0 },
  { max: 400, baseFee: 1600, unit: 214.6 },
  { max: Infinity, baseFee: 7300, unit: 307.3 },
];

// 주택용 저압 요금표 (여름)
const RESIDENTIAL_SUMMER: { max: number; baseFee: number; unit: number }[] = [
  { max: 300, baseFee: 910, unit: 120.0 },
  { max: 450, baseFee: 1600, unit: 214.6 },
  { max: Infinity, baseFee: 7300, unit: 307.3 },
];

// 복지할인 (월 한도, kWh 감면)
const DISCOUNT_MAP: Record<
  DiscountType,
  { label: string; monthlyLimit: number; kwhDiscount: number }
> = {
  none: { label: "없음", monthlyLimit: 0, kwhDiscount: 0 },
  disability: { label: "장애인 할인", monthlyLimit: 16000, kwhDiscount: 0 },
  basicLiving: {
    label: "기초생활 수급자",
    monthlyLimit: 16000,
    kwhDiscount: 0,
  },
  nextLowest: { label: "차상위 계층", monthlyLimit: 10000, kwhDiscount: 0 },
  largeFam: { label: "대가족 할인", monthlyLimit: 16000, kwhDiscount: 0 },
  newborn: { label: "출산가구 할인", monthlyLimit: 16000, kwhDiscount: 0 },
};

function calcResidentialProgressive(
  usage: number,
  season: Season
): { baseFee: number; energyCharge: number; tiers: ProgressiveTier[] } {
  const table =
    season === "summer" ? RESIDENTIAL_SUMMER : RESIDENTIAL_OTHER;

  const tierBounds: { start: number; end: number }[] = [];
  let prev = 0;
  for (const t of table) {
    tierBounds.push({ start: prev, end: t.max === Infinity ? Infinity : t.max });
    prev = t.max === Infinity ? Infinity : t.max;
  }

  let baseFee = 0;
  let energyCharge = 0;
  const tiers: ProgressiveTier[] = [];

  for (let i = 0; i < table.length; i++) {
    const tierStart = tierBounds[i].start;
    const tierEnd = tierBounds[i].end;
    const t = table[i];

    if (usage <= tierStart) break;

    const tierUsage = Math.min(usage, tierEnd) - tierStart;

    if (tierUsage > 0) {
      baseFee = t.baseFee; // 최고 구간 기본료 적용
      const amount = Math.round(tierUsage * t.unit);
      energyCharge += amount;

      const rangeLabel =
        tierEnd === Infinity
          ? `${tierStart + 1}kWh~`
          : `${tierStart + 1}~${tierEnd}kWh`;

      tiers.push({
        label: `${i + 1}구간 (${rangeLabel})`,
        rangeStart: tierStart + 1,
        rangeEnd: tierEnd === Infinity ? usage : tierEnd,
        baseFee: t.baseFee,
        unitPrice: t.unit,
        usage: tierUsage,
        amount,
      });
    }
  }

  return { baseFee, energyCharge, tiers };
}

export function calculateElectricBill(
  usage: number,
  type: ElectricType,
  season: Season,
  discount: DiscountType = "none"
): ElectricBillResult {
  let baseFee = 0;
  let energyCharge = 0;
  let tiers: ProgressiveTier[] = [];

  if (type === "residential") {
    const result = calcResidentialProgressive(usage, season);
    baseFee = result.baseFee;
    energyCharge = result.energyCharge;
    tiers = result.tiers;
  } else {
    // 일반용(갑) I
    baseFee = 6160;
    let unitPrice: number;
    if (season === "summer") {
      unitPrice = 113.8;
    } else {
      // 봄가을 기준 (겨울은 101.0이지만 기타계절 대표로 봄가을)
      unitPrice = 79.3;
    }
    energyCharge = Math.round(usage * unitPrice);
    tiers = [
      {
        label: "일반용(갑) I",
        rangeStart: 1,
        rangeEnd: usage,
        baseFee: 6160,
        unitPrice,
        usage,
        amount: energyCharge,
      },
    ];
  }

  // 기후환경요금: 9원/kWh
  const climateCharge = Math.round(usage * 9);
  // 연료비조정액: 5원/kWh
  const fuelAdjust = Math.round(usage * 5);

  const electricCharge = baseFee + energyCharge + climateCharge + fuelAdjust;

  // 복지할인
  const discountInfo = DISCOUNT_MAP[discount];
  const discountAmount = Math.min(discountInfo.monthlyLimit, electricCharge);

  const afterDiscount = electricCharge - discountAmount;

  // 부가세 10%
  const vat = Math.round(afterDiscount * 0.1);
  // 전력산업기반기금 3.7%
  const fund = Math.round(afterDiscount * 0.037);

  // 총합계 (10원 미만 절사)
  const rawTotal = afterDiscount + vat + fund;
  const total = Math.floor(rawTotal / 10) * 10;

  return {
    type,
    season,
    usage,
    baseFee,
    energyCharge,
    climateCharge,
    fuelAdjust,
    subtotal: afterDiscount,
    vat,
    fund,
    total,
    discount: discountAmount,
    discountLabel: discountInfo.label,
    tiers,
  };
}

// ============================================================
// 수도요금 계산
// ============================================================

export type WaterPurpose = "household" | "business";

interface WaterTier {
  label: string;
  rangeStart: number;
  rangeEnd: number;
  unitPrice: number;
  usage: number;
  amount: number;
}

export interface WaterBillResult {
  purpose: WaterPurpose;
  usage: number;
  baseFee: number;
  usageCharge: number;
  sewerCharge: number;
  waterUseFee: number;
  total: number;
  tiers: WaterTier[];
}

// 서울시 가정용 수도요금
const WATER_HOUSEHOLD_TIERS: {
  max: number;
  unit: number;
}[] = [
  { max: 30, unit: 360 },
  { max: 50, unit: 550 },
  { max: Infinity, unit: 790 },
];

// 업무용은 단일 요금
const WATER_BUSINESS_UNIT = 690;

export function calculateWaterBill(
  usage: number,
  purpose: WaterPurpose
): WaterBillResult {
  const baseFee = 1080; // 구경 15mm 기준
  let usageCharge = 0;
  const tiers: WaterTier[] = [];

  if (purpose === "household") {
    let prev = 0;
    for (const tier of WATER_HOUSEHOLD_TIERS) {
      if (usage <= prev) break;
      const tierUsage = Math.min(usage, tier.max) - prev;
      if (tierUsage > 0) {
        const amount = Math.round(tierUsage * tier.unit);
        usageCharge += amount;
        const endLabel =
          tier.max === Infinity ? `${prev + 1}m\u00B3~` : `${prev + 1}~${tier.max}m\u00B3`;
        tiers.push({
          label: endLabel,
          rangeStart: prev + 1,
          rangeEnd: tier.max === Infinity ? usage : tier.max,
          unitPrice: tier.unit,
          usage: tierUsage,
          amount,
        });
      }
      prev = tier.max;
    }
  } else {
    usageCharge = Math.round(usage * WATER_BUSINESS_UNIT);
    tiers.push({
      label: "업무용 전체",
      rangeStart: 1,
      rangeEnd: usage,
      unitPrice: WATER_BUSINESS_UNIT,
      usage,
      amount: usageCharge,
    });
  }

  // 하수도요금
  const sewerCharge = Math.round(usage * 470);
  // 물이용부담금
  const waterUseFee = Math.round(usage * 170);

  const total = baseFee + usageCharge + sewerCharge + waterUseFee;

  return {
    purpose,
    usage,
    baseFee,
    usageCharge,
    sewerCharge,
    waterUseFee,
    total,
    tiers,
  };
}

// ============================================================
// 도시가스 요금 계산
// ============================================================

export type GasPurpose = "cooking" | "heating";

export interface GasBillResult {
  purpose: GasPurpose;
  usage: number;
  baseFee: number;
  usageCharge: number;
  subtotal: number;
  vat: number;
  total: number;
  mjPerCubic: number;
  unitPricePerMJ: number;
  effectiveUnitPrice: number;
}

// 서울도시가스 기준
const GAS_MJ_PER_CUBIC = 43.1;
const GAS_COOKING_MJ_PRICE = 16.04; // 원/MJ
const GAS_HEATING_MJ_PRICE = 14.55; // 원/MJ
const GAS_BASE_FEE = 1040;

export function calculateGasBill(
  usage: number,
  purpose: GasPurpose
): GasBillResult {
  const unitPricePerMJ =
    purpose === "cooking" ? GAS_COOKING_MJ_PRICE : GAS_HEATING_MJ_PRICE;

  const effectiveUnitPrice = Math.round(GAS_MJ_PER_CUBIC * unitPricePerMJ);
  const usageCharge = Math.round(usage * GAS_MJ_PER_CUBIC * unitPricePerMJ);
  const subtotal = GAS_BASE_FEE + usageCharge;
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  return {
    purpose,
    usage,
    baseFee: GAS_BASE_FEE,
    usageCharge,
    subtotal,
    vat,
    total,
    mjPerCubic: GAS_MJ_PER_CUBIC,
    unitPricePerMJ,
    effectiveUnitPrice,
  };
}

// ============================================================
// 유틸리티
// ============================================================

export function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}
