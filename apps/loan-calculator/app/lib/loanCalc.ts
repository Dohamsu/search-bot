export type RepaymentMethod = "equal_payment" | "equal_principal" | "bullet";

export interface LoanInput {
  principal: number; // 원금 (원 단위)
  annualRate: number; // 연이율 (%, 예: 3.5)
  totalMonths: number; // 총 상환 개월 수
  method: RepaymentMethod;
}

export interface MonthlySchedule {
  month: number; // 회차
  principalPayment: number; // 상환원금
  interest: number; // 이자
  monthlyPayment: number; // 월상환액
  remainingBalance: number; // 잔금
}

export interface LoanResult {
  schedule: MonthlySchedule[];
  totalPayment: number; // 총 상환액
  totalInterest: number; // 총 이자
  firstMonthPayment: number; // 첫달 상환액
  lastMonthPayment: number; // 마지막달 상환액
}

/**
 * 원리금균등상환 계산
 * M = P * r(1+r)^n / ((1+r)^n - 1)
 */
function calcEqualPayment(input: LoanInput): LoanResult {
  const { principal, annualRate, totalMonths } = input;
  const monthlyRate = annualRate / 100 / 12;
  const schedule: MonthlySchedule[] = [];
  let remaining = principal;
  let totalPayment = 0;
  let totalInterest = 0;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
  }

  for (let i = 1; i <= totalMonths; i++) {
    const interest = remaining * monthlyRate;
    let principalPayment: number;
    let payment: number;

    if (i === totalMonths) {
      // 마지막 달에는 잔금 정리
      principalPayment = remaining;
      payment = principalPayment + interest;
    } else {
      payment = monthlyPayment;
      principalPayment = payment - interest;
    }

    remaining = Math.max(0, remaining - principalPayment);
    totalPayment += payment;
    totalInterest += interest;

    schedule.push({
      month: i,
      principalPayment: Math.round(principalPayment),
      interest: Math.round(interest),
      monthlyPayment: Math.round(payment),
      remainingBalance: Math.round(remaining),
    });
  }

  return {
    schedule,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    firstMonthPayment: schedule[0].monthlyPayment,
    lastMonthPayment: schedule[schedule.length - 1].monthlyPayment,
  };
}

/**
 * 원금균등상환 계산
 * 매월 원금 = P / n, 이자 = 잔금 * r
 */
function calcEqualPrincipal(input: LoanInput): LoanResult {
  const { principal, annualRate, totalMonths } = input;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPrincipal = principal / totalMonths;
  const schedule: MonthlySchedule[] = [];
  let remaining = principal;
  let totalPayment = 0;
  let totalInterest = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = remaining * monthlyRate;
    let principalPayment: number;

    if (i === totalMonths) {
      principalPayment = remaining;
    } else {
      principalPayment = monthlyPrincipal;
    }

    const payment = principalPayment + interest;
    remaining = Math.max(0, remaining - principalPayment);
    totalPayment += payment;
    totalInterest += interest;

    schedule.push({
      month: i,
      principalPayment: Math.round(principalPayment),
      interest: Math.round(interest),
      monthlyPayment: Math.round(payment),
      remainingBalance: Math.round(remaining),
    });
  }

  return {
    schedule,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    firstMonthPayment: schedule[0].monthlyPayment,
    lastMonthPayment: schedule[schedule.length - 1].monthlyPayment,
  };
}

/**
 * 만기일시상환 계산
 * 매월 이자만 납부, 만기에 원금 일시 상환
 */
function calcBullet(input: LoanInput): LoanResult {
  const { principal, annualRate, totalMonths } = input;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyInterest = principal * monthlyRate;
  const schedule: MonthlySchedule[] = [];
  let totalPayment = 0;
  let totalInterest = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = monthlyInterest;
    const principalPayment = i === totalMonths ? principal : 0;
    const payment = principalPayment + interest;
    const remaining = i === totalMonths ? 0 : principal;

    totalPayment += payment;
    totalInterest += interest;

    schedule.push({
      month: i,
      principalPayment: Math.round(principalPayment),
      interest: Math.round(interest),
      monthlyPayment: Math.round(payment),
      remainingBalance: Math.round(remaining),
    });
  }

  return {
    schedule,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    firstMonthPayment: schedule[0].monthlyPayment,
    lastMonthPayment: schedule[schedule.length - 1].monthlyPayment,
  };
}

export function calculateLoan(input: LoanInput): LoanResult {
  switch (input.method) {
    case "equal_payment":
      return calcEqualPayment(input);
    case "equal_principal":
      return calcEqualPrincipal(input);
    case "bullet":
      return calcBullet(input);
  }
}
