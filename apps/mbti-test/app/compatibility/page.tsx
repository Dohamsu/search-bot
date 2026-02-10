"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, RotateCcw } from "lucide-react";
import Footer from "../components/Footer";

const TYPE_GROUPS: Record<string, string[]> = {
  "분석가형 (NT)": ["INTJ", "INTP", "ENTJ", "ENTP"],
  "외교관형 (NF)": ["INFJ", "INFP", "ENFJ", "ENFP"],
  "관리자형 (SJ)": ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  "탐험가형 (SP)": ["ISTP", "ISFP", "ESTP", "ESFP"],
};

const GROUP_COLORS: Record<string, string> = {
  "분석가형 (NT)": "#8B5CF6",
  "외교관형 (NF)": "#10B981",
  "관리자형 (SJ)": "#3B82F6",
  "탐험가형 (SP)": "#F59E0B",
};

export default function CompatibilityPage() {
  const [myType, setMyType] = useState<string | null>(null);
  const [otherType, setOtherType] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = () => {
    if (myType && otherType) {
      const sorted = [myType, otherType].sort();
      router.push(`/compatibility/${sorted[0]}-${sorted[1]}`);
    }
  };

  const handleReset = () => {
    setMyType(null);
    setOtherType(null);
  };

  return (
    <main className="flex min-h-dvh flex-col">
      {/* Header */}
      <div className="flex w-full flex-col items-center gap-3 bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-[#F9A8D4] px-6 pb-10 pt-12 md:pb-12 md:pt-16">
        <p className="text-sm font-medium text-white/80">MBTI 궁합 분석</p>
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-white" fill="white" />
        </div>
        <h1 className="font-heading text-center text-xl font-bold text-white md:text-2xl">
          성격 유형 궁합 테스트
        </h1>
        <p className="text-center text-sm text-white/80">
          두 유형을 선택하고 궁합을 확인하세요
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-8">
        {/* 선택 상태 표시 */}
        <div className="flex items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
          <div
            className={`flex h-16 w-20 items-center justify-center rounded-2xl text-lg font-bold ${
              myType
                ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white"
                : "border-2 border-dashed border-gray-300 text-gray-400"
            }`}
          >
            {myType || "?"}
          </div>
          <Heart className="h-6 w-6 shrink-0 text-[var(--mbti-secondary)]" />
          <div
            className={`flex h-16 w-20 items-center justify-center rounded-2xl text-lg font-bold ${
              otherType
                ? "bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white"
                : "border-2 border-dashed border-gray-300 text-gray-400"
            }`}
          >
            {otherType || "?"}
          </div>
        </div>

        {/* 나의 유형 선택 */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-base font-bold text-[var(--mbti-text)]">
            나의 유형
          </h2>
          <div className="flex flex-col gap-4">
            {Object.entries(TYPE_GROUPS).map(([group, types]) => (
              <div key={group}>
                <p
                  className="mb-2 text-xs font-semibold"
                  style={{ color: GROUP_COLORS[group] }}
                >
                  {group}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setMyType(type)}
                      className={`cursor-pointer rounded-xl px-2 py-2.5 text-sm font-semibold transition-all ${
                        myType === type
                          ? "bg-[var(--mbti-primary)] text-white shadow-md scale-105"
                          : "bg-[#F3E8FF] text-[var(--mbti-primary)] hover:bg-[#EDE9FE]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상대 유형 선택 */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-base font-bold text-[var(--mbti-text)]">
            상대 유형
          </h2>
          <div className="flex flex-col gap-4">
            {Object.entries(TYPE_GROUPS).map(([group, types]) => (
              <div key={group}>
                <p
                  className="mb-2 text-xs font-semibold"
                  style={{ color: GROUP_COLORS[group] }}
                >
                  {group}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setOtherType(type)}
                      className={`cursor-pointer rounded-xl px-2 py-2.5 text-sm font-semibold transition-all ${
                        otherType === type
                          ? "bg-[var(--mbti-secondary)] text-white shadow-md scale-105"
                          : "bg-[#FCE7F3] text-[var(--mbti-secondary)] hover:bg-[#FBCFE8]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!myType || !otherType}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all ${
              myType && otherType
                ? "bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] hover:shadow-xl"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            궁합 분석하기
            <ArrowRight className="h-5 w-5" />
          </button>

          {(myType || otherType) && (
            <button
              onClick={handleReset}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-300 bg-transparent px-8 py-4 text-base font-medium text-[var(--mbti-text)] transition-colors hover:bg-gray-50"
            >
              <RotateCcw className="h-5 w-5" />
              초기화
            </button>
          )}

          <a
            href="/"
            className="mt-2 text-center text-sm text-[var(--mbti-primary)] hover:underline"
          >
            성격 유형 테스트하기 →
          </a>
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </main>
  );
}
