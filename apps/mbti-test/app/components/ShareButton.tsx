"use client";

import { motion } from "framer-motion";
import { Share2, RotateCcw, Check } from "lucide-react";

interface ShareButtonProps {
  onShare: () => void;
  onRetry: () => void;
  shareLabel?: string;
}

export default function ShareButton({ onShare, onRetry, shareLabel = "결과 공유하기" }: ShareButtonProps) {
  const isCopied = shareLabel !== "결과 공유하기";

  return (
    <div className="flex flex-col gap-3" role="group" aria-label="결과 공유 및 재시작">
      <motion.button
        onClick={onShare}
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

      <motion.button
        onClick={onRetry}
        aria-label="다시 테스트하기"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-transparent px-8 py-4 text-base font-medium text-[var(--mbti-text)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <RotateCcw className="h-5 w-5" />
        다시 테스트하기
      </motion.button>
    </div>
  );
}
