"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, AlertTriangle, Lightbulb, User, ArrowRight, RotateCcw, Share2, Check } from "lucide-react";
import type { CompatibilityResult } from "../../lib/compatibility";
import { shareCompatibility } from "../../lib/webShare";

interface TypeSummary {
  type: string;
  title: string;
  description: string;
}

interface CompatibilityResultClientProps {
  compatibility: CompatibilityResult;
  result1: TypeSummary;
  result2: TypeSummary;
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-2xl ${
            i <= score ? "text-[#F59E0B]" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CompatibilityResultClient({
  compatibility,
  result1,
  result2,
}: CompatibilityResultClientProps) {
  const [shareLabel, setShareLabel] = useState("결과 공유하기");
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(async () => {
    const { success, method } = await shareCompatibility(
      compatibility.type1,
      compatibility.type2,
      compatibility.title
    );

    if (method === "clipboard" && success) {
      setShareLabel("링크가 복사되었습니다!");
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
      shareTimerRef.current = setTimeout(() => setShareLabel("결과 공유하기"), 2000);
    }
  }, [compatibility]);

  const isCopied = shareLabel !== "결과 공유하기";

  return (
    <>
      {/* 별점 + 제목 카드 */}
      <motion.div
        className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-1.5 text-sm font-bold text-white">
            {compatibility.type1}
          </span>
          <Heart className="h-5 w-5 text-[var(--mbti-secondary)]" fill="#EC4899" />
          <span className="rounded-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B] px-4 py-1.5 text-sm font-bold text-white">
            {compatibility.type2}
          </span>
        </div>
        <StarRating score={compatibility.score} />
        <p className="font-heading text-lg font-bold text-[var(--mbti-text)]">
          {compatibility.title}
        </p>
        <p className="text-center text-xs text-gray-500">
          호환성 점수: {compatibility.score} / 5
        </p>
      </motion.div>

      {/* 궁합 설명 */}
      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm leading-relaxed text-gray-600">
          {compatibility.description}
        </p>
      </motion.div>

      {/* 잘 맞는 점 */}
      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-4 w-4 text-[var(--mbti-secondary)]" />
          <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
            잘 맞는 점
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {compatibility.strengths.map((strength, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#EC4899]" />
              <span className="text-sm text-[var(--mbti-text)]">{strength}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 주의할 점 */}
      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
          <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
            주의할 점
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {compatibility.challenges.map((challenge, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F59E0B]" />
              <span className="text-sm text-[var(--mbti-text)]">{challenge}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 관계 팁 */}
      <motion.div
        className="flex items-start gap-4 rounded-3xl bg-[#F3E8FF] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--mbti-primary)]">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-[var(--mbti-primary)]">
            관계 팁
          </p>
          <p className="text-sm leading-relaxed text-[var(--mbti-text)]">
            {compatibility.tip}
          </p>
        </div>
      </motion.div>

      {/* 유형 요약 카드 */}
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[result1, result2].map((result, idx) => (
          <a
            key={result.type + idx}
            href={`/result/${result.type}`}
            className="block rounded-3xl bg-white p-5 shadow-sm transition-colors hover:bg-gray-50"
          >
            <div className="mb-2 flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background:
                    idx === 0
                      ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                      : "linear-gradient(135deg, #EC4899, #F59E0B)",
                }}
              >
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-heading text-sm font-bold text-[var(--mbti-text)]">
                  {result.type}
                </span>
                <span className="ml-2 text-sm text-gray-500">{result.title}</span>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              {result.description}
            </p>
          </a>
        ))}
      </motion.div>

      {/* 네비게이션 버튼 */}
      <motion.div
        className="mt-2 flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          onClick={handleShare}
          aria-label={shareLabel}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-8 py-4 text-base font-semibold text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          {shareLabel}
        </motion.button>

        <a
          href="/compatibility"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--mbti-primary)] bg-transparent px-8 py-4 text-base font-semibold text-[var(--mbti-primary)] transition-colors hover:bg-[#F3E8FF]"
        >
          <Heart className="h-5 w-5" />
          다른 궁합 보기
        </a>

        <a
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-transparent px-8 py-4 text-base font-medium text-[var(--mbti-text)] transition-colors hover:bg-gray-50"
        >
          <RotateCcw className="h-5 w-5" />
          테스트 다시하기
        </a>
      </motion.div>

      <div className="h-8" />
    </>
  );
}
