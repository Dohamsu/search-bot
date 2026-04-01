"use client";

import { motion } from "framer-motion";
import { useTranslation } from "../i18n";

interface QuestionCardProps {
  questionNumber: number;
  questionTextKey: string;
}

export default function QuestionCard({
  questionNumber,
  questionTextKey,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const questionText = t(questionTextKey);

  return (
    <motion.div
      className="mx-auto w-full max-w-[800px] rounded-3xl bg-white p-6 shadow-lg md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      role="heading"
      aria-level={2}
      aria-label={t("quiz.questionAria", { number: questionNumber, text: questionText })}
    >
      <p className="mb-3 text-center text-xl font-bold text-[var(--mbti-primary)]">
        Q{questionNumber}
      </p>
      <h2 className="font-heading mb-3 text-center text-[22px] font-bold leading-tight text-[var(--mbti-text)] md:text-[28px]">
        {questionText}
      </h2>
      <p className="text-center text-sm text-gray-500">
        {t("quiz.pickInstruction")}
      </p>
    </motion.div>
  );
}
