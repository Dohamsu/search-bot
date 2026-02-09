export interface SalaryInput {
  annualSalary: number;
  nonTaxableAmount: number;
  dependents: number;
  childrenUnder20: number;
}

export interface DeductionItem {
  label: string;
  amount: number;
}

export interface SalaryResult {
  monthlySalary: number;
  monthlyNetSalary: number;
  totalDeduction: number;
  netRatio: number;
  deductions: DeductionItem[];
}

function calculateIncomeTax(
  annualTaxable: number,
  dependents: number,
  childrenUnder20: number
): number {
  // 근로소득공제
  let earnedIncomeDeduction = 0;
  if (annualTaxable <= 5_000_000) {
    earnedIncomeDeduction = annualTaxable * 0.7;
  } else if (annualTaxable <= 15_000_000) {
    earnedIncomeDeduction = 3_500_000 + (annualTaxable - 5_000_000) * 0.4;
  } else if (annualTaxable <= 45_000_000) {
    earnedIncomeDeduction = 7_500_000 + (annualTaxable - 15_000_000) * 0.15;
  } else if (annualTaxable <= 100_000_000) {
    earnedIncomeDeduction = 12_000_000 + (annualTaxable - 45_000_000) * 0.05;
  } else {
    earnedIncomeDeduction = 14_750_000 + (annualTaxable - 100_000_000) * 0.02;
  }

  const earnedIncome = annualTaxable - earnedIncomeDeduction;

  // 인적공제 (부양가족 1인당 150만원)
  const personalDeduction = dependents * 1_500_000;

  // 표준공제
  const standardDeduction = 130_000;

  // 국민연금 공제 (연간, 상한 적용)
  const monthlyTaxable = annualTaxable / 12;
  const monthlyNPS = Math.min(monthlyTaxable * 0.0475, 302_575);
  const annualNPSDeduction = monthlyNPS * 12;

  // 과세표준
  let taxableIncome =
    earnedIncome - personalDeduction - standardDeduction - annualNPSDeduction;
  if (taxableIncome < 0) taxableIncome = 0;

  // 누진세율 적용
  let tax = 0;
  if (taxableIncome <= 14_000_000) {
    tax = taxableIncome * 0.06;
  } else if (taxableIncome <= 50_000_000) {
    tax = 840_000 + (taxableIncome - 14_000_000) * 0.15;
  } else if (taxableIncome <= 88_000_000) {
    tax = 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
  } else if (taxableIncome <= 150_000_000) {
    tax = 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
  } else if (taxableIncome <= 300_000_000) {
    tax = 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  } else if (taxableIncome <= 500_000_000) {
    tax = 94_060_000 + (taxableIncome - 300_000_000) * 0.4;
  } else if (taxableIncome <= 1_000_000_000) {
    tax = 174_060_000 + (taxableIncome - 500_000_000) * 0.42;
  } else {
    tax = 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45;
  }

  // 근로소득세액공제
  let taxCredit = 0;
  if (tax <= 1_300_000) {
    taxCredit = tax * 0.55;
  } else {
    taxCredit = 715_000 + (tax - 1_300_000) * 0.3;
  }
  // 세액공제 한도
  if (annualTaxable <= 33_000_000) {
    taxCredit = Math.min(taxCredit, 740_000);
  } else if (annualTaxable <= 70_000_000) {
    taxCredit = Math.min(taxCredit, 660_000);
  } else {
    taxCredit = Math.min(taxCredit, 500_000);
  }

  tax -= taxCredit;

  // 자녀세액공제
  if (childrenUnder20 >= 1) {
    if (childrenUnder20 === 1) {
      tax -= 150_000;
    } else if (childrenUnder20 === 2) {
      tax -= 300_000;
    } else {
      tax -= 300_000 + (childrenUnder20 - 2) * 300_000;
    }
  }

  if (tax < 0) tax = 0;

  // 월 소득세
  return Math.round(tax / 12);
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { annualSalary, nonTaxableAmount, dependents, childrenUnder20 } = input;

  if (annualSalary <= 0) {
    return {
      monthlySalary: 0,
      monthlyNetSalary: 0,
      totalDeduction: 0,
      netRatio: 0,
      deductions: [
        { label: "국민연금", amount: 0 },
        { label: "건강보험", amount: 0 },
        { label: "장기요양보험", amount: 0 },
        { label: "고용보험", amount: 0 },
        { label: "소득세", amount: 0 },
        { label: "지방소득세", amount: 0 },
      ],
    };
  }

  const monthlySalary = Math.round(annualSalary / 12);
  const monthlyTaxable = monthlySalary - nonTaxableAmount;
  const taxableBase = Math.max(monthlyTaxable, 0);

  // 4대 보험
  const nationalPension = Math.min(
    Math.round(taxableBase * 0.0475),
    302_575
  );
  const healthInsurance = Math.round(taxableBase * 0.03595);
  const longTermCare = Math.round(healthInsurance * 0.1314);
  const employmentInsurance = Math.round(taxableBase * 0.009);

  // 소득세 (연간 과세소득 기준)
  const annualTaxable = Math.max(annualSalary - nonTaxableAmount * 12, 0);
  const incomeTax = calculateIncomeTax(annualTaxable, dependents, childrenUnder20);
  const localIncomeTax = Math.round(incomeTax * 0.1);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  const monthlyNetSalary = monthlySalary - totalDeduction;
  const netRatio = monthlySalary > 0 ? (monthlyNetSalary / monthlySalary) * 100 : 0;

  return {
    monthlySalary,
    monthlyNetSalary,
    totalDeduction,
    netRatio,
    deductions: [
      { label: "국민연금", amount: nationalPension },
      { label: "건강보험", amount: healthInsurance },
      { label: "장기요양보험", amount: longTermCare },
      { label: "고용보험", amount: employmentInsurance },
      { label: "소득세", amount: incomeTax },
      { label: "지방소득세", amount: localIncomeTax },
    ],
  };
}
