"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Share2, RotateCcw, Check, Briefcase, Star } from "lucide-react";
import { Heart } from "lucide-react";
import type { MBTIResult } from "../lib/results";
import { shareMBTIResult } from "../lib/webShare";
import { useTranslation } from "../i18n";
import ResultImageGenerator from "./ResultImageGenerator";

interface ResultClientWrapperProps {
  result: MBTIResult;
}

export default function ResultClientWrapper({ result }: ResultClientWrapperProps) {
  const { t } = useTranslation();
  const [shareLabel, setShareLabel] = useState<"share" | "copied">("share");
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(async () => {
    const shareTitle = t("share.resultTitle", { type: result.type, title: t(result.titleKey) });
    const { success, method } = await shareMBTIResult(result.type, shareTitle);

    if (method === "clipboard" && success) {
      setShareLabel("copied");
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
      shareTimerRef.current = setTimeout(() => setShareLabel("share"), 2000);
    }
  }, [result, t]);

  const isCopied = shareLabel === "copied";
  const displayLabel = isCopied ? t("result.linkCopied") : t("result.shareResult");

  return (
    <>
      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm leading-relaxed text-gray-600">
          {t(result.descriptionKey, { type: result.type })}
        </p>
      </motion.div>

      <motion.div
        className="rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-heading mb-4 text-base font-bold text-[var(--mbti-text)]">
          {t("result.coreTraits")}
        </h3>
        <div className="flex flex-col gap-3">
          {result.traitKeys.map((traitKey, i) => {
            const dotColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
            return (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dotColors[i % dotColors.length] }}
                />
                <span className="text-sm text-[var(--mbti-text)]">{t(traitKey)}</span>
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
            {t("result.recommendedCareers")}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.careerKeys.map((careerKey) => (
            <span
              key={careerKey}
              className="rounded-full bg-[#EDE9FE] px-4 py-1.5 text-sm font-medium text-[var(--mbti-primary)]"
            >
              {t(careerKey)}
            </span>
          ))}
        </div>
      </motion.div>

      {result.celebrityKeys.length > 0 && (
        <motion.div
          className="rounded-3xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="font-heading text-base font-bold text-[var(--mbti-text)]">
              {t("result.sameCelebrities")}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.celebrityKeys.map((celebKey) => (
              <span
                key={celebKey}
                className="rounded-full bg-[#FEF3C7] px-4 py-1.5 text-sm font-medium text-[#92400E]"
              >
                {t(celebKey)}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">
            {t("result.celebrityDisclaimer")}
          </p>
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
            {t("result.bestCompatibility")}
          </h3>
        </div>
        <div className="flex gap-3">
          {result.compatible.map((type) => (
            <a
              key={type}
              href={`/compatibility/${[result.type, type].sort().join('-')}`}
              className="rounded-full bg-[#F3E8FF] px-5 py-2 text-sm font-semibold text-[var(--mbti-primary)] hover:bg-[#EDE9FE] transition-colors"
            >
              {type}
            </a>
          ))}
        </div>
        <a href="/compatibility" className="mt-2 text-sm text-[var(--mbti-primary)] hover:underline">
          {t("result.viewAllCompatibility")}
        </a>
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
          <p className="text-sm text-gray-500">{t("result.populationPrefix")}</p>
          <p className="font-heading text-xl font-bold text-[var(--mbti-primary)]">
            {result.percentage}%
          </p>
        </div>
      </motion.div>

      <div className="mt-2 flex flex-col gap-3">
        <ResultImageGenerator result={result} />

        <motion.button
          onClick={handleShare}
          aria-label={displayLabel}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-8 py-4 text-base font-semibold text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          {displayLabel}
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
          {t("result.retakeTest")}
        </motion.a>
      </div>

      <div className="h-8" />
    </>
  );
}
