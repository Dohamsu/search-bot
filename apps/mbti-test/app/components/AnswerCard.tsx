"use client";

import { motion } from "framer-motion";

interface AnswerCardProps {
  emoji: string;
  text: string;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
  index: number;
}

export default function AnswerCard({
  emoji,
  text,
  isSelected,
  isLocked,
  onClick,
  index,
}: AnswerCardProps) {
  const lockedNotSelected = isLocked && !isSelected;

  return (
    <motion.button
      onClick={onClick}
      aria-label={`${emoji} ${text}`}
      aria-pressed={isSelected}
      aria-disabled={isLocked}
      className={`flex w-full items-center gap-3 rounded-3xl border-2 px-5 py-4 text-left transition-colors md:h-[120px] md:flex-col md:items-center md:justify-center md:gap-2 md:text-center ${
        isSelected
          ? "border-[var(--mbti-primary)] bg-[#F3E8FF] shadow-[0_0_16px_rgba(139,92,246,0.25)]"
          : lockedNotSelected
            ? "cursor-default border-[#E5E7EB] bg-white opacity-50"
            : "cursor-pointer border-[#E5E7EB] bg-white hover:border-[var(--mbti-primary)]/40 hover:bg-[#FAF5FF]"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileTap={isLocked ? undefined : { scale: 0.97 }}
    >
      <span className="text-[28px]">{emoji}</span>
      <span className="text-[15px] font-medium text-[var(--mbti-text)]">
        {text}
      </span>
    </motion.button>
  );
}
