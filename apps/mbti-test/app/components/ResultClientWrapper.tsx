"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Share2, RotateCcw, Check, Briefcase, Star } from "lucide-react";
import { Heart } from "lucide-react";
import type { MBTIResult } from "../lib/results";
import ResultImageGenerator from "./ResultImageGenerator";

interface ResultClientWrapperProps {
  result: MBTIResult;
}

export default function ResultClientWrapper({ result }: ResultClientWrapperProps) {
  const [shareLabel, setShareLabel] = useState("결과 공유하기");
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/result/${result.type}` : "";
    const text = `나의 MBTI는 ${result.type} - ${result.title}! ${url}`;

    const showCopiedFeedback = () => {
      setShareLabel("복사 완료!");
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
      shareTimerRef.current = setTimeout(() => setShareLabel("결과 공유하기"), 2000);
    };

    if (navigator.share) {
      try {
        await navigator.share({ title: "MBTI 테스트 결과", text, url });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      showCopiedFeedback();
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopiedFeedback();
    }
  }, [result]);

  const isCopied = shareLabel !== "결과 공유하기";

  return (
    <>
      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm leading-relaxed text-gray-600">
          {result.description}
        </p>
      </motion.div>

      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-heading mb-4 text-base font-bold text-[var(--mbti-text)]">
          핵심 성격 특성
        </h3>
        <div className="flex flex-col gap-3">
          {result.traits.map((trait, i) => {
            const dotColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
            return (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dotColors[i % dotColors.length] }}
                />
                <span className="text-sm text-[var(--mbti-text)]">{trait}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[var(--mbti-primary)]" />
          <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
            추천 직업
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.careers.map((career) => (
            <span
              key={career}
              className="rounded-full bg-[#EDE9FE] px-4 py-1.5 text-sm font-medium text-[var(--mbti-primary)]"
            >
              {career}
            </span>
          ))}
        </div>
      </motion.div>

      {result.celebrities.length > 0 && (
        <motion.div
          className="rounded-3xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
              같은 유형 유명인
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((celeb) => (
              <span
                key={celeb}
                className="rounded-full bg-[#FEF3C7] px-4 py-1.5 text-sm font-medium text-[#92400E]"
              >
                {celeb}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-4 w-4 text-[var(--mbti-secondary)]" />
          <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
            최고의 궁합
          </h3>
        </div>
        <div className="flex gap-3">
          {result.compatible.map((type) => (
            <span
              key={type}
              className="rounded-full bg-[#F3E8FF] px-5 py-2 text-sm font-semibold text-[var(--mbti-primary)]"
            >
              {type}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 rounded-3xl bg-[#F3E8FF] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--mbti-primary)]">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">전체 인구의 약</p>
          <p className="font-heading text-xl font-bold text-[var(--mbti-primary)]">
            {result.percentage}%
          </p>
        </div>
      </motion.div>

      <div className="mt-2 flex flex-col gap-3">
        <ResultImageGenerator result={result} />

        <motion.button
          onClick={handleShare}
          aria-label={shareLabel}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-8 py-4 text-base font-semibold text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          {shareLabel}
        </motion.button>

        <motion.a
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-transparent px-8 py-4 text-base font-medium text-[var(--mbti-text)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <RotateCcw className="h-5 w-5" />
          다시 테스트하기
        </motion.a>
      </div>

      <div className="h-8" />
    </>
  );
}
