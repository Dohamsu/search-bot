export interface SeveranceInput {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  recentThreeMonthSalary: number; // 최근 3개월 급여 총액
  annualBonus: number; // 연간 상여금
  annualLeaveAllowance: number; // 연차수당
}

export interface SeveranceResult {
  workingDays: number;
  workingYears: number;
  dailyAvgWage: number;
  severancePay: number;
  servicePeriodDeduction: number;
  convertedSalary: number;
  convertedSalaryDeduction: number;
  taxBase: number;
  convertedTax: number;
  severanceTax: number;
  localTax: number;
  totalTax: number;
  netSeverancePay: number;
}

/**
 * 두 날짜 사이의 일수를 계산합니다.
 */
function daysBetween(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 근속연수공제를 계산합니다.
 */
function calcServicePeriodDeduction(years: number): number {
  if (years <= 0) return 0;
  if (years <= 5) {
    return 300_000 * years;
  } else if (years <= 10) {
    return 1_500_000 + 500_000 * (years - 5);
  } else if (years <= 20) {
    return 4_000_000 + 800_000 * (years - 10);
  } else {
    return 12_000_000 + 1_200_000 * (years - 20);
  }
}

/**
 * 환산급여공제를 계산합니다.
 */
function calcConvertedSalaryDeduction(convertedSalary: number): number {
  if (convertedSalary <= 0) return 0;
  if (convertedSalary <= 8_000_000) {
    return convertedSalary; // 전액 공제
  } else if (convertedSalary <= 70_000_000) {
    return 8_000_000 + (convertedSalary - 8_000_000) * 0.6;
  } else if (convertedSalary <= 100_000_000) {
    return 45_200_000 + (convertedSalary - 70_000_000) * 0.55;
  } else if (convertedSalary <= 300_000_000) {
    return 61_700_000 + (convertedSalary - 100_000_000) * 0.45;
  } else {
    return 151_700_000 + (convertedSalary - 300_000_000) * 0.35;
  }
}

/**
 * 소득세 누진세율을 적용하여 환산산출세액을 계산합니다.
 */
function calcProgressiveTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  if (taxBase <= 14_000_000) {
    return taxBase * 0.06;
  } else if (taxBase <= 50_000_000) {
    return 840_000 + (taxBase - 14_000_000) * 0.15;
  } else if (taxBase <= 88_000_000) {
    return 6_240_000 + (taxBase - 50_000_000) * 0.24;
  } else if (taxBase <= 150_000_000) {
    return 15_360_000 + (taxBase - 88_000_000) * 0.35;
  } else if (taxBase <= 300_000_000) {
    return 37_060_000 + (taxBase - 150_000_000) * 0.38;
  } else if (taxBase <= 500_000_000) {
    return 94_060_000 + (taxBase - 300_000_000) * 0.4;
  } else if (taxBase <= 1_000_000_000) {
    return 174_060_000 + (taxBase - 500_000_000) * 0.42;
  } else {
    return 354_060_000 + (taxBase - 1_000_000_000) * 0.45;
  }
}

/**
 * 퇴직금을 계산합니다.
 */
export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  // 1. 근속일수
  const workingDays = daysBetween(start, end);
  if (workingDays <= 0) {
    return {
      workingDays: 0,
      workingYears: 0,
      dailyAvgWage: 0,
      severancePay: 0,
      servicePeriodDeduction: 0,
      convertedSalary: 0,
      convertedSalaryDeduction: 0,
      taxBase: 0,
      convertedTax: 0,
      severanceTax: 0,
      localTax: 0,
      totalTax: 0,
      netSeverancePay: 0,
    };
  }

  // 근속연수 (올림)
  const workingYears = Math.ceil(workingDays / 365);

  // 2. 1일 평균임금 계산
  // 평균임금 방식: (최근3개월 급여 + 상여금 가산액 + 연차수당 가산액) / 92일
  const bonusForThreeMonths = (input.annualBonus / 12) * 3;
  const leaveForThreeMonths = (input.annualLeaveAllowance / 12) * 3;
  const totalThreeMonthPay =
    input.recentThreeMonthSalary + bonusForThreeMonths + leaveForThreeMonths;
  const dailyAvgWageByAvg = totalThreeMonthPay / 92;

  // 통상임금 방식: 월급여 / 30 (월급여 = 최근3개월 급여 / 3)
  const monthlySalary = input.recentThreeMonthSalary / 3;
  const dailyAvgWageByOrdinary = monthlySalary / 30;

  // 둘 중 큰 값 사용
  const dailyAvgWage = Math.max(dailyAvgWageByAvg, dailyAvgWageByOrdinary);

  // 3. 퇴직금 = 1일 평균임금 x 30 x (총근속일수 / 365)
  const severancePay = dailyAvgWage * 30 * (workingDays / 365);

  // 4. 퇴직소득세 계산
  // 근속연수공제
  const servicePeriodDeduction = calcServicePeriodDeduction(workingYears);

  // 환산급여 = (퇴직금 - 근속연수공제) x 12 / 근속연수
  const convertedSalary = Math.max(
    ((severancePay - servicePeriodDeduction) * 12) / workingYears,
    0
  );

  // 환산급여공제
  const convertedSalaryDeduction =
    calcConvertedSalaryDeduction(convertedSalary);

  // 과세표준 = 환산급여 - 환산급여공제
  const taxBase = Math.max(convertedSalary - convertedSalaryDeduction, 0);

  // 환산산출세액 (소득세 누진세율 적용)
  const convertedTax = calcProgressiveTax(taxBase);

  // 퇴직소득세 = 환산산출세액 x 근속연수 / 12
  const severanceTax = Math.round((convertedTax * workingYears) / 12);

  // 지방소득세 = 퇴직소득세 x 10%
  const localTax = Math.round(severanceTax * 0.1);

  // 총 세금
  const totalTax = severanceTax + localTax;

  // 5. 실수령액 = 퇴직금 - 퇴직소득세 - 지방소득세
  const netSeverancePay = Math.round(severancePay - totalTax);

  return {
    workingDays,
    workingYears,
    dailyAvgWage: Math.round(dailyAvgWage),
    severancePay: Math.round(severancePay),
    servicePeriodDeduction,
    convertedSalary: Math.round(convertedSalary),
    convertedSalaryDeduction: Math.round(convertedSalaryDeduction),
    taxBase: Math.round(taxBase),
    convertedTax: Math.round(convertedTax),
    severanceTax,
    localTax,
    totalTax,
    netSeverancePay,
  };
}
