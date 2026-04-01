"use client";

import { motion } from "framer-motion";
import { useTranslation } from "../i18n";

interface ProgressHeaderProps {
  current: number;
  total: number;
}

export default function ProgressHeader({
  current,
  total,
}: ProgressHeaderProps) {
  const { t } = useTranslation();
  const progress = ((current + 1) / total) * 100;

  return (
    <div
      className="flex w-full flex-col items-center gap-3 rounded-b-3xl bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-6 py-6 md:gap-4 md:px-8 md:py-8"
      role="banner"
      aria-label={t("quiz.progressAria", { current: current + 1, total })}
    >
      <p className="font-heading text-sm font-medium text-white/80">
        {t("quiz.questionLabel", { current: current + 1, total })}
      </p>

      {/* Progress Bar */}
      <div
        className="h-2 w-full max-w-[600px] overflow-hidden rounded-full bg-white/30"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={t("quiz.progressBarAria", { current: current + 1, total })}
      >
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step Dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className={`rounded-full ${
              i < current
                ? "h-2 w-2 bg-white"
                : i === current
                  ? "h-2.5 w-2.5 bg-white"
                  : "h-2 w-2 bg-white/[0.27]"
            }`}
            initial={false}
            animate={{
              scale: i === current ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
