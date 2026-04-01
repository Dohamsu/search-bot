"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ArrowRightLeft, BookOpen, TrendingUp, Lightbulb, HelpCircle, ChevronDown } from "lucide-react";
import NavBar from "./components/NavBar";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import BreakdownCard from "./components/BreakdownCard";
import BottomTabBar from "./components/BottomTabBar";
import Footer from "./components/Footer";
import RelatedTools from "./components/RelatedTools";
import { calculateSalary, type SalaryResult, type DeductionItem } from "./lib/salary";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";

function parseNumber(value: string): number {
  const raw = value.replace(/,/g, "");
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString("ko-KR");
}

type CalcMode = "normal" | "reverse";

const STANDARD_MONTHLY_HOURS = 209;
const MINIMUM_HOURLY_WAGE_2026 = 10_320;

const DEDUCTION_LABEL_MAP: Record<string, string> = {
  "국민연금": "deductions.nationalPension",
  "건강보험": "deductions.healthInsurance",
  "장기요양보험": "deductions.longTermCare",
  "고용보험": "deductions.employmentInsurance",
  "소득세": "deductions.incomeTax",
  "지방소득세": "deductions.localIncomeTax",
};

function findAnnualSalaryForNetPay(
  targetMonthlyNet: number,
  nonTaxableAmount: number,
  dependents: number,
  childrenUnder20: number
): { annualSalary: number; result: SalaryResult } {
  let low = targetMonthlyNet * 12;
  let high = targetMonthlyNet * 12 * 2;

  let checkHigh = calculateSalary({
    annualSalary: high,
    nonTaxableAmount,
    dependents,
    childrenUnder20,
  });
  while (checkHigh.monthlyNetSalary < targetMonthlyNet) {
    high *= 2;
    checkHigh = calculateSalary({
      annualSalary: high,
      nonTaxableAmount,
      dependents,
      childrenUnder20,
    });
  }

  let bestResult = checkHigh;
  let bestSalary = high;

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const res = calculateSalary({
      annualSalary: mid,
      nonTaxableAmount,
      dependents,
      childrenUnder20,
    });

    if (
      Math.abs(res.monthlyNetSalary - targetMonthlyNet) <
      Math.abs(bestResult.monthlyNetSalary - targetMonthlyNet)
    ) {
      bestResult = res;
      bestSalary = mid;
    }

    if (res.monthlyNetSalary < targetMonthlyNet) {
      low = mid + 1;
    } else if (res.monthlyNetSalary > targetMonthlyNet) {
      high = mid - 1;
    } else {
      break;
    }
  }

  return { annualSalary: bestSalary, result: bestResult };
}

function translateDeductions(deductions: DeductionItem[], t: (key: string) => string): DeductionItem[] {
  return deductions.map((d) => ({
    ...d,
    label: DEDUCTION_LABEL_MAP[d.label] ? t(DEDUCTION_LABEL_MAP[d.label]) : d.label,
  }));
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--salary-border)] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-medium text-[var(--salary-text)]">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-sm leading-relaxed text-slate-600">
          {answer}
        </div>
      )}
    </div>
  );
}

function SalaryInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="space-y-8">

        {/* 연봉 실수령액이란? */}
        <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--salary-primary)]" />
            <h2 className="text-lg font-bold text-[var(--salary-text)]">연봉 실수령액이란?</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              연봉 실수령액은 근로자가 회사와 계약한 연봉(세전 급여)에서 4대 보험료와 소득세, 지방소득세를 공제한 뒤
              실제로 통장에 입금되는 금액을 의미합니다. 예를 들어 연봉이 5,000만 원이라고 해도
              매월 통장에 들어오는 금액은 약 350만 원 내외로, 세전 월급과는 상당한 차이가 있습니다.
            </p>
            <p>
              실수령액을 정확히 아는 것은 개인 재무 계획의 출발점입니다. 월 고정 지출(주거비, 생활비, 대출 상환금 등)을
              계획할 때 세전 급여가 아닌 실수령액을 기준으로 해야 현실적인 예산을 세울 수 있습니다.
              또한 이직이나 연봉 협상 시에도 실수령액 기준으로 비교해야 실질적인 처우 차이를 파악할 수 있습니다.
            </p>
            <p>
              공제 항목은 크게 <strong>4대 사회보험료</strong>(국민연금, 건강보험, 장기요양보험, 고용보험)와
              <strong> 세금</strong>(근로소득세, 지방소득세)으로 나뉩니다. 4대 보험료는 보수월액에 일정 요율을 곱해
              산출하고, 소득세는 간이세액표에 따라 부양가족 수와 과세표준 구간별로 차등 적용됩니다.
              비과세 수당(식대, 차량유지비 등)이 있다면 해당 금액만큼 과세 대상에서 제외되어
              실수령액이 다소 늘어나는 효과가 있습니다.
            </p>
          </div>
        </div>

        {/* 2026년 4대보험 요율 */}
        <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--salary-primary)]" />
            <h2 className="text-lg font-bold text-[var(--salary-text)]">2026년 4대보험 요율 안내</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            아래 표는 2026년 기준 근로자 부담분 4대 사회보험 요율입니다.
            사용자(회사)도 동일하거나 더 높은 비율을 부담하며, 근로자 급여에서는 아래 비율만큼 공제됩니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--salary-border)]">
                  <th className="py-3 pr-4 text-left font-semibold text-[var(--salary-text)]">항목</th>
                  <th className="py-3 pr-4 text-left font-semibold text-[var(--salary-text)]">근로자 부담률</th>
                  <th className="py-3 text-left font-semibold text-[var(--salary-text)]">산정 기준</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--salary-border)] bg-slate-50/50">
                  <td className="py-3 pr-4 font-medium text-[var(--salary-text)]">국민연금</td>
                  <td className="py-3 pr-4 text-slate-600">4.5%</td>
                  <td className="py-3 text-slate-600">보수월액 기준 (상·하한액 적용)</td>
                </tr>
                <tr className="border-b border-[var(--salary-border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--salary-text)]">건강보험</td>
                  <td className="py-3 pr-4 text-slate-600">3.545%</td>
                  <td className="py-3 text-slate-600">보수월액 기준</td>
                </tr>
                <tr className="border-b border-[var(--salary-border)] bg-slate-50/50">
                  <td className="py-3 pr-4 font-medium text-[var(--salary-text)]">장기요양보험</td>
                  <td className="py-3 pr-4 text-slate-600">12.95%</td>
                  <td className="py-3 text-slate-600">건강보험료의 12.95%</td>
                </tr>
                <tr className="border-b border-[var(--salary-border)]">
                  <td className="py-3 pr-4 font-medium text-[var(--salary-text)]">고용보험</td>
                  <td className="py-3 pr-4 text-slate-600">0.9%</td>
                  <td className="py-3 text-slate-600">보수월액 기준</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3 pr-4 font-medium text-[var(--salary-text)]">소득세</td>
                  <td className="py-3 pr-4 text-slate-600">6~45%</td>
                  <td className="py-3 text-slate-600">과세표준 구간별 누진세율 적용</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-xs leading-relaxed text-blue-700">
              <strong>참고:</strong> 국민연금은 기준소득월액 상한(2026년 기준 약 617만 원)과 하한(약 39만 원)이
              적용됩니다. 보수월액이 상한을 초과하더라도 상한액까지만 보험료가 부과되므로
              고소득자일수록 국민연금 부담 비율이 상대적으로 낮아집니다.
              소득세는 근로소득 간이세액표에 따라 부양가족 수에 따라 달라지며,
              연말정산을 통해 정확한 세액이 확정됩니다.
            </p>
          </div>
        </div>

        {/* 연봉 협상 꿀팁 */}
        <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[var(--salary-primary)]" />
            <h2 className="text-lg font-bold text-[var(--salary-text)]">연봉 협상 꿀팁 가이드</h2>
          </div>
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--salary-primary)] text-xs font-bold text-white">1</div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">실수령액 기준으로 비교하세요</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  같은 연봉 5,000만 원이라도 비과세 수당 구성에 따라 실수령액이 월 10~20만 원까지 차이 날 수 있습니다.
                  이직 시 단순히 연봉 숫자만 비교하지 말고, 식대·교통비 등 비과세 항목과 복리후생을 포함한
                  총보상 패키지(Total Compensation)를 실수령액 기준으로 환산해 비교하세요.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--salary-primary)] text-xs font-bold text-white">2</div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">과세표준 구간 경계를 활용하세요</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  소득세는 누진세율이 적용되므로 과세표준이 특정 구간을 넘어가면 세율이 급격히 올라갑니다.
                  예를 들어 과세표준 5,000만 원 이하는 24%, 초과 시 35%가 적용됩니다.
                  연봉 인상분이 세율 구간을 넘기는 경우, 인상분 대비 실수령 증가가 기대보다 작을 수 있으니
                  구간별 실수령액 변화를 미리 계산해 보는 것이 좋습니다.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--salary-primary)] text-xs font-bold text-white">3</div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">비과세 수당 항목을 확인하세요</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  식대(월 20만 원), 자가운전보조금(월 20만 원), 연구보조비(월 20만 원) 등은 비과세 처리가 가능합니다.
                  이러한 비과세 수당이 많을수록 과세 대상 소득이 줄어들어 실수령액이 증가합니다.
                  연봉 협상 시 기본급 인상뿐 아니라 비과세 수당 확대도 함께 요청하면
                  같은 비용으로 더 높은 실수령액을 받을 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--salary-primary)] text-xs font-bold text-white">4</div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">연말정산 공제 항목을 미리 준비하세요</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  의료비, 교육비, 기부금, 주택자금, 연금저축, IRP 등 다양한 소득공제·세액공제 항목을 활용하면
                  연말정산에서 상당한 환급을 받을 수 있습니다. 특히 연금저축(연 600만 원)과 IRP(연 900만 원 합산)는
                  최대 16.5%의 세액공제를 제공하므로, 절세와 노후 준비를 동시에 할 수 있는 효과적인 방법입니다.
                  연초부터 계획적으로 공제 항목을 챙기면 13월의 월급을 극대화할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--salary-primary)]" />
            <h2 className="text-lg font-bold text-[var(--salary-text)]">자주 묻는 질문 (FAQ)</h2>
          </div>
          <div className="divide-y divide-[var(--salary-border)]">
            <FAQItem
              question="연봉과 월급의 차이는 무엇인가요?"
              answer="연봉은 1년간 받는 총 급여(세전)이고, 월급은 연봉을 12개월로 나눈 금액입니다. 실수령 월급은 여기서 4대 보험료와 소득세를 공제한 금액입니다. 회사에 따라 연봉에 상여금(성과급)이 포함되기도 하고 별도로 지급하기도 하므로, 근로계약서에서 연봉의 정확한 구성을 확인하는 것이 중요합니다."
            />
            <FAQItem
              question="비과세 수당에는 어떤 것들이 있나요?"
              answer="대표적인 비과세 수당으로는 식대(월 20만 원 이내), 자가운전보조금(월 20만 원 이내), 연구활동비(월 20만 원 이내), 생산직 근로자의 야간근무수당(연 240만 원 이내), 출산·보육수당(월 20만 원 이내) 등이 있습니다. 이 금액들은 소득세 과세 대상에서 제외되어 실수령액이 높아지는 효과가 있습니다."
            />
            <FAQItem
              question="부양가족 수는 실수령액에 어떤 영향을 미치나요?"
              answer="부양가족 수가 많을수록 근로소득 간이세액표에 의해 매월 원천징수되는 소득세가 줄어듭니다. 본인을 포함하여 배우자, 직계존비속(부모, 자녀) 등 실제 부양하는 가족 수를 기준으로 합니다. 다만, 부양가족이 많다고 해서 최종 세금이 줄어드는 것은 아니며, 연말정산 시 정확한 세액이 조정됩니다."
            />
            <FAQItem
              question="신입사원과 경력직의 실수령액 차이가 큰 이유는?"
              answer="소득세는 누진세율 구조이므로 연봉이 높아질수록 적용되는 세율이 올라갑니다. 예를 들어 연봉 3,000만 원 구간에서는 실수령 비율이 약 89%이지만, 연봉 1억 원 구간에서는 약 78% 수준으로 떨어집니다. 따라서 연봉이 높을수록 세전과 세후의 차이가 점점 벌어집니다."
            />
            <FAQItem
              question="중도 입사하거나 퇴사하면 4대 보험료는 어떻게 되나요?"
              answer="4대 보험료는 해당 월의 보수를 기준으로 일할 계산됩니다. 입사일이 월 중간이라면 해당 월은 근무 일수에 비례하여 보험료가 부과됩니다. 퇴사 시에는 퇴사 월까지의 보수를 기준으로 정산하며, 건강보험의 경우 퇴직 후 지역가입자로 전환되어 별도의 보험료를 납부해야 합니다. 국민연금은 퇴사 후 임의가입 또는 임의계속가입을 선택할 수 있습니다."
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<CalcMode>("normal");
  const [annualSalary, setAnnualSalary] = useState("50,000,000");
  const [desiredMonthlyNet, setDesiredMonthlyNet] = useState("3,000,000");
  const [nonTaxable, setNonTaxable] = useState("100,000");
  const [dependents, setDependents] = useState("1");
  const [children, setChildren] = useState("0");
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [reverseAnnual, setReverseAnnual] = useState<number | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  const validate = useCallback((): string | null => {
    if (mode === "normal") {
      const salary = parseNumber(annualSalary);
      if (salary <= 0) return t("validation.enterSalary");
      if (salary < 1_000_000) return t("validation.salaryMin");
      if (salary > 10_000_000_000) return t("validation.salaryMax");
    } else {
      const desired = parseNumber(desiredMonthlyNet);
      if (desired <= 0) return t("validation.enterDesiredNet");
      if (desired < 100_000) return t("validation.desiredNetMin");
      if (desired > 100_000_000) return t("validation.desiredNetMax");
    }
    const nonTax = parseNumber(nonTaxable);
    if (nonTax < 0) return t("validation.nonTaxableMin");
    const deps = parseNumber(dependents);
    if (deps < 1) return t("validation.dependentsMin");
    const child = parseNumber(children);
    if (child < 0) return t("validation.childrenMin");
    return null;
  }, [mode, annualSalary, desiredMonthlyNet, nonTaxable, dependents, children, t]);

  const compute = useCallback(() => {
    const msg = validate();
    setValidationMsg(msg);
    if (msg) return;

    if (mode === "normal") {
      const salary = parseNumber(annualSalary);
      const nonTax = parseNumber(nonTaxable);
      if (nonTax > salary / 12) {
        setValidationMsg(t("validation.nonTaxableExceedsMonthly"));
        return;
      }
      const res = calculateSalary({
        annualSalary: salary,
        nonTaxableAmount: nonTax,
        dependents: parseNumber(dependents) || 1,
        childrenUnder20: parseNumber(children),
      });
      setResult(res);
      setReverseAnnual(null);
    } else {
      const desired = parseNumber(desiredMonthlyNet);
      const { annualSalary: foundSalary, result: res } =
        findAnnualSalaryForNetPay(
          desired,
          parseNumber(nonTaxable),
          parseNumber(dependents) || 1,
          parseNumber(children)
        );
      setResult(res);
      setReverseAnnual(foundSalary);
    }
  }, [mode, annualSalary, desiredMonthlyNet, nonTaxable, dependents, children, validate, t]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      compute();
    }, 200);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [compute]);

  const handleCalculate = () => {
    compute();
    if (!validate() && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const defaultDeductions: DeductionItem[] = [
    { label: t("deductions.nationalPension"), amount: 0 },
    { label: t("deductions.healthInsurance"), amount: 0 },
    { label: t("deductions.longTermCare"), amount: 0 },
    { label: t("deductions.employmentInsurance"), amount: 0 },
    { label: t("deductions.incomeTax"), amount: 0 },
    { label: t("deductions.localIncomeTax"), amount: 0 },
  ];

  const displayResult = result
    ? {
        ...result,
        deductions: translateDeductions(result.deductions, t),
      }
    : {
        monthlySalary: 0,
        monthlyNetSalary: 0,
        totalDeduction: 0,
        netRatio: 0,
        deductions: defaultDeductions,
      };

  const currentAnnualSalary =
    mode === "reverse" && reverseAnnual
      ? reverseAnnual
      : parseNumber(annualSalary);

  const hourlyRate = Math.round(currentAnnualSalary / 12 / STANDARD_MONTHLY_HOURS);
  const dailyRate = Math.round(hourlyRate * 8);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "연봉 실수령액 계산기 2026",
    url: "https://salary.onekit.co.kr",
    description:
      "2026년 기준 4대보험, 소득세를 자동으로 공제하여 연봉 실수령액을 계산하는 무료 온라인 도구입니다. 역산 계산, 시급/일급 환산 기능도 제공합니다.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    featureList: [
      "연봉 실수령액 계산",
      "월급 역산 계산",
      "시급/일급 환산",
      "4대보험 공제 계산",
      "소득세 자동 계산",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };

  return (
    <main className="min-h-screen bg-[var(--salary-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd),
        }}
      />
      <NavBar />

      <div className="flex h-14 items-center justify-between border-b border-[var(--salary-border)] bg-white px-4 md:hidden">
        <button
          onClick={handleBackClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
          aria-label={t("common.backToTop")}
        >
          <ChevronLeft className="h-5 w-5 text-[var(--salary-text)]" />
        </button>
        <span className="font-[family-name:var(--font-space-grotesk-var)] text-base font-bold text-[var(--salary-primary)]">
          {t("common.siteName")}
        </span>
        <LanguageSwitcher />
      </div>

      <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        <section className="w-full shrink-0 border-b border-[var(--salary-border)] bg-white p-6 md:w-[480px] md:border-b-0 md:border-r md:p-8" aria-label={t("home.inputSection")}>
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-[var(--salary-text)]">
              {mode === "normal" ? t("home.titleNormal") : t("home.titleReverse")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "normal"
                ? t("home.descNormal")
                : t("home.descReverse")}
            </p>
          </div>

          <div className="mb-5 flex rounded-lg border border-[var(--salary-border)] bg-slate-50 p-1">
            <button
              onClick={() => setMode("normal")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "normal"
                  ? "bg-white text-[var(--salary-primary)] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("home.modeNormalTab")}
            </button>
            <button
              onClick={() => setMode("reverse")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "reverse"
                  ? "bg-white text-[var(--salary-primary)] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {t("home.modeReverseTab")}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {mode === "normal" ? (
              <InputField
                label={t("home.annualSalary")}
                value={annualSalary}
                placeholder="50,000,000"
                onChange={setAnnualSalary}
              />
            ) : (
              <InputField
                label={t("home.desiredMonthlyNet")}
                value={desiredMonthlyNet}
                placeholder="3,000,000"
                onChange={setDesiredMonthlyNet}
              />
            )}
            <InputField
              label={t("home.nonTaxable")}
              value={nonTaxable}
              placeholder="100,000"
              onChange={setNonTaxable}
            />
            <InputField
              label={t("home.dependents")}
              value={dependents}
              placeholder="1"
              onChange={setDependents}
            />
            <InputField
              label={t("home.childrenUnder20")}
              value={children}
              placeholder="0"
              onChange={setChildren}
            />
          </div>

          {validationMsg && (
            <p className="mt-3 text-sm text-red-500">{validationMsg}</p>
          )}

          <button
            onClick={handleCalculate}
            className="mt-6 h-12 w-full rounded-lg bg-[var(--salary-primary)] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {mode === "normal" ? t("home.calculateBtn") : t("home.reverseCalcBtn")}
          </button>
        </section>

        <section ref={resultRef} className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8" aria-label={t("home.resultSection")}>
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            {mode === "reverse" && reverseAnnual && (
              <div className="rounded-xl border border-[var(--salary-primary)]/20 bg-blue-50 p-5">
                <p className="text-sm font-medium text-[var(--salary-primary)]">
                  {t("home.requiredAnnualSalary")}
                </p>
                <p className="mt-1 font-[family-name:var(--font-space-grotesk-var)] text-2xl font-bold text-[var(--salary-text)]">
                  {formatCurrency(reverseAnnual)}
                  <span className="ml-1 text-sm font-normal text-slate-500">{t("common.won")}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("home.basedOnDesiredNet", { amount: formatCurrency(parseNumber(desiredMonthlyNet)) })}
                </p>
              </div>
            )}
            <ResultCard
              monthlyNetSalary={displayResult.monthlyNetSalary}
              netRatio={displayResult.netRatio}
              monthlySalary={displayResult.monthlySalary}
              annualSalary={currentAnnualSalary}
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />
            <BreakdownCard
              deductions={displayResult.deductions}
              totalDeduction={displayResult.totalDeduction}
            />

            {currentAnnualSalary > 0 && (
              <div className="rounded-xl border border-[var(--salary-border)] bg-white p-6">
                <h3 className="text-sm font-semibold text-[var(--salary-text)]">
                  {t("home.hourlyDailyTitle")}
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">{t("home.hourlyRate")}</span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(hourlyRate)}{t("common.won")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">{t("home.dailyRate")}</span>
                    <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium text-[var(--salary-text)]">
                      {formatCurrency(dailyRate)}{t("common.won")}
                    </span>
                  </div>
                  <div className="mt-1 border-t border-[var(--salary-border)] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500">
                        {t("home.minWage2026")}
                      </span>
                      <span className="font-[family-name:var(--font-space-grotesk-var)] text-[13px] text-slate-400">
                        {formatCurrency(MINIMUM_HOURLY_WAGE_2026)}{t("common.won")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] text-slate-500">
                        {t("home.vsMinWage")}
                      </span>
                      <span
                        className={`font-[family-name:var(--font-space-grotesk-var)] text-[13px] font-medium ${
                          hourlyRate >= MINIMUM_HOURLY_WAGE_2026
                            ? "text-[var(--salary-success)]"
                            : "text-red-500"
                        }`}
                      >
                        {(hourlyRate / MINIMUM_HOURLY_WAGE_2026 * 100).toFixed(0)}%
                        {hourlyRate >= MINIMUM_HOURLY_WAGE_2026 ? ` ${t("home.met")}` : ` ${t("home.notMet")}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              {t("home.disclaimer")}
            </p>
          </div>
        </section>
      </div>

      {/* SEO 정보 콘텐츠 섹션 */}
      <SalaryInfoSection />

      <RelatedTools currentToolId="salary" />
      <Footer />
      <BottomTabBar />
    </main>
  );
}
