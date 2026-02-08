"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface CompatCardProps {
  compatible: string[];
}

export default function CompatCard({ compatible }: CompatCardProps) {
  return (
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
        {compatible.map((type) => (
          <span
            key={type}
            className="rounded-full bg-[#F3E8FF] px-5 py-2 text-sm font-semibold text-[var(--mbti-primary)]"
          >
            {type}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
