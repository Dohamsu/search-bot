"use client";

import { motion } from "framer-motion";

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
}

export default function QuestionCard({
  questionNumber,
  questionText,
}: QuestionCardProps) {
  return (
    <motion.div
      className="mx-auto w-full max-w-[800px] rounded-3xl bg-white p-6 shadow-lg md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      role="heading"
      aria-level={2}
      aria-label={`질문 ${questionNumber}: ${questionText}`}
    >
      <p className="mb-3 text-center text-xl font-bold text-[var(--mbti-primary)]">
        Q{questionNumber}
      </p>
      <h2 className="font-heading mb-3 text-center text-[22px] font-bold leading-tight text-[var(--mbti-text)] md:text-[28px]">
        {questionText}
      </h2>
      <p className="text-center text-sm text-gray-500">
        가장 자연스러운 선택을 골라주세요
      </p>
    </motion.div>
  );
}
