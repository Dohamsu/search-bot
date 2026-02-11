"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Calculator,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Banknote,
  Info,
} from "lucide-react";
import {
  calculateLoan,
  type RepaymentMethod,
  type LoanResult,
} from "./lib/loanCalc";


const METHOD_LABELS: Record<RepaymentMethod, string> = {
  equal_payment: "원리금균등상환",
  equal_principal: "원금균등상환",
  bullet: "만기일시상환",
};

const METHOD_DESCRIPTIONS: Record<RepaymentMethod, string> = {
  equal_payment: "매월 동일한 금액(원금+이자)을 상환합니다. 가장 일반적인 방식입니다.",
  equal_principal:
    "매월 동일한 원금을 상환하고 이자는 점차 줄어듭니다. 총 이자가 적습니다.",
  bullet:
    "매월 이자만 납부하고 만기에 원금을 일시 상환합니다. 월 부담은 적지만 총 이자가 높습니다.",
};

function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

function parseFormattedNumber(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

export default function LoanCalculatorPage() {
  const [principalInput, setPrincipalInput] = useState("10,000");
  const [annualRate, setAnnualRate] = useState("3.5");
  const [years, setYears] = useState("30");
  const [months, setMonths] = useState("0");
  const [method, setMethod] = useState<RepaymentMethod>("equal_payment");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMethodInfo, setShowMethodInfo] = useState(false);

  const totalMonths = useMemo(() => {
    return (parseInt(years) || 0) * 12 + (parseInt(months) || 0);
  }, [years, months]);

  const handlePrincipalChange = useCallback((value: string) => {
    const num = parseFormattedNumber(value);
    if (num >= 0) {
      setPrincipalInput(num === 0 ? "" : formatNumber(num));
    }
  }, []);

  const handleCalculate = useCallback(() => {
    const principal = parseFormattedNumber(principalInput) * 10000; // 만원 -> 원
    const rate = parseFloat(annualRate) || 0;
    const totalM = (parseInt(years) || 0) * 12 + (parseInt(months) || 0);

    if (principal <= 0 || rate <= 0 || totalM <= 0) {
      return;
    }

    const res = calculateLoan({
      principal,
      annualRate: rate,
      totalMonths: totalM,
      method,
    });
    setResult(res);
    setShowSchedule(false);
  }, [principalInput, annualRate, years, months, method]);

  const isValid = useMemo(() => {
    const principal = parseFormattedNumber(principalInput);
    const rate = parseFloat(annualRate) || 0;
    return principal > 0 && rate > 0 && rate <= 30 && totalMonths > 0;
  }, [principalInput, annualRate, totalMonths]);


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[var(--loan-border)] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[var(--loan-primary)] flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-[family-name:var(--font-space)] text-[var(--loan-primary)]">
              대출이자 계산기
            </h1>
            <p className="text-xs text-gray-500 -mt-0.5">2026 최신 버전</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--loan-border)] p-5 space-y-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--loan-primary)]" />
            대출 정보 입력
          </h2>

          {/* 대출금액 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              대출금액 (만원)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={principalInput}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                placeholder="10,000"
                className="w-full px-4 py-3 pr-12 border border-[var(--loan-border)] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--loan-primary)] focus:border-transparent transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                만원
              </span>
            </div>
            {parseFormattedNumber(principalInput) > 0 && (
              <p className="text-xs text-gray-400 pl-1">
                ={" "}
                {formatNumber(parseFormattedNumber(principalInput) * 10000)}원 (
                {parseFormattedNumber(principalInput) >= 10000
                  ? `${formatNumber(parseFormattedNumber(principalInput) / 10000)}억`
                  : `${formatNumber(parseFormattedNumber(principalInput))}만`}
                원)
              </p>
            )}
          </div>

          {/* 연이율 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              연이율 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="30"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="3.5"
                className="w-full px-4 py-3 pr-10 border border-[var(--loan-border)] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--loan-primary)] focus:border-transparent transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                %
              </span>
            </div>
          </div>

          {/* 대출기간 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              대출기간
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-3 pr-10 border border-[var(--loan-border)] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--loan-primary)] focus:border-transparent transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  년
                </span>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-12 border border-[var(--loan-border)] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--loan-primary)] focus:border-transparent transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  개월
                </span>
              </div>
            </div>
            {totalMonths > 0 && (
              <p className="text-xs text-gray-400 pl-1">
                총 {formatNumber(totalMonths)}개월
              </p>
            )}
          </div>

          {/* 상환방식 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                상환방식
              </label>
              <button
                type="button"
                onClick={() => setShowMethodInfo(!showMethodInfo)}
                className="text-xs text-[var(--loan-primary)] flex items-center gap-0.5 hover:underline"
              >
                <Info className="w-3.5 h-3.5" />
                방식 설명
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(METHOD_LABELS) as RepaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                    method === m
                      ? "border-[var(--loan-primary)] bg-blue-50 text-[var(--loan-primary)]"
                      : "border-[var(--loan-border)] bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {METHOD_LABELS[m]}
                </button>
              ))}
            </div>
            {showMethodInfo && (
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 mt-1">
                {(Object.keys(METHOD_DESCRIPTIONS) as RepaymentMethod[]).map(
                  (m) => (
                    <p key={m}>
                      <span className="font-semibold text-[var(--loan-primary)]">
                        {METHOD_LABELS[m]}:
                      </span>{" "}
                      {METHOD_DESCRIPTIONS[m]}
                    </p>
                  )
                )}
              </div>
            )}
          </div>

          {/* 계산 버튼 */}
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!isValid}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base bg-[var(--loan-primary)] hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            계산하기
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--loan-border)] overflow-hidden">
            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
              <h3 className="text-sm font-medium opacity-80 mb-3">계산 결과</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70">월 상환액</p>
                  <p className="text-2xl font-bold font-[family-name:var(--font-space)]">
                    {formatNumber(result.firstMonthPayment)}
                    <span className="text-sm font-normal ml-1">원</span>
                  </p>
                  {result.firstMonthPayment !== result.lastMonthPayment && (
                    <p className="text-xs opacity-70 mt-0.5">
                      ~ {formatNumber(result.lastMonthPayment)}원
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs opacity-70">총 이자</p>
                  <p className="text-2xl font-bold font-[family-name:var(--font-space)] text-yellow-300">
                    {formatNumber(result.totalInterest)}
                    <span className="text-sm font-normal ml-1">원</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Banknote className="w-4 h-4 text-[var(--loan-primary)]" />
                    <span className="text-xs text-gray-500">총 상환액</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--loan-text)]">
                    {formatNumber(result.totalPayment)}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">
                      원
                    </span>
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="w-4 h-4 text-[var(--loan-accent)]" />
                    <span className="text-xs text-gray-500">이자 비율</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--loan-accent)]">
                    {(
                      (result.totalInterest /
                        (parseFormattedNumber(principalInput) * 10000)) *
                      100
                    ).toFixed(1)}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">
                      %
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2.5">
                대출원금{" "}
                {formatNumber(parseFormattedNumber(principalInput))}만원 |{" "}
                연 {annualRate}% | {years}년{" "}
                {parseInt(months) > 0 ? `${months}개월` : ""} |{" "}
                {METHOD_LABELS[method]}
              </div>

              {/* Schedule Toggle */}
              <button
                type="button"
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-[var(--loan-border)] text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                {showSchedule ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    상세 스케줄 닫기
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    상세 스케줄 보기 ({formatNumber(totalMonths)}개월)
                  </>
                )}
              </button>

              {/* Schedule Table */}
              {showSchedule && (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--loan-border)]">
                        <th className="py-2.5 px-2 text-left text-gray-500 font-medium">
                          회차
                        </th>
                        <th className="py-2.5 px-2 text-right text-gray-500 font-medium">
                          상환원금
                        </th>
                        <th className="py-2.5 px-2 text-right text-gray-500 font-medium">
                          이자
                        </th>
                        <th className="py-2.5 px-2 text-right text-gray-500 font-medium">
                          월상환액
                        </th>
                        <th className="py-2.5 px-2 text-right text-gray-500 font-medium">
                          잔금
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr
                          key={row.month}
                          className={`border-b border-gray-100 ${
                            row.month === 1 || row.month === result.schedule.length
                              ? "bg-blue-50/50 font-semibold"
                              : ""
                          }`}
                        >
                          <td className="py-2 px-2 text-gray-600">
                            {row.month}
                          </td>
                          <td className="py-2 px-2 text-right text-[var(--loan-text)]">
                            {formatNumber(row.principalPayment)}
                          </td>
                          <td className="py-2 px-2 text-right text-[var(--loan-accent)]">
                            {formatNumber(row.interest)}
                          </td>
                          <td className="py-2 px-2 text-right text-[var(--loan-primary)] font-medium">
                            {formatNumber(row.monthlyPayment)}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-500">
                            {formatNumber(row.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--loan-border)] p-5 space-y-3">
          <h2 className="text-base font-semibold text-[var(--loan-text)]">
            대출 상환방식 안내
          </h2>
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex gap-2">
              <div className="w-1 rounded-full bg-[var(--loan-primary)] flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--loan-text)]">
                  원리금균등상환
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  매월 동일한 금액을 상환하여 자금 계획을 세우기 쉽습니다. 주택담보대출에서
                  가장 많이 사용되는 방식입니다.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1 rounded-full bg-[var(--loan-success)] flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--loan-text)]">
                  원금균등상환
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  초기 상환 부담이 크지만 갈수록 줄어들며, 총 이자가 원리금균등보다
                  적습니다.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1 rounded-full bg-[var(--loan-accent)] flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--loan-text)]">
                  만기일시상환
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  매월 이자만 납부하여 부담은 적지만, 총 이자 부담이 가장 큽니다.
                  전세자금대출 등에서 사용됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--loan-border)] mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition">
              개인정보처리방침
            </a>
            <span>|</span>
            <a href="/terms" className="hover:text-gray-600 transition">
              이용약관
            </a>
          </div>
          <p className="text-center text-xs text-gray-400">
            본 계산기는 참고용이며, 실제 금융기관의 대출 조건과 다를 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
