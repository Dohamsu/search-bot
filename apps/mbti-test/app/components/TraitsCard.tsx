"use client";

import { motion } from "framer-motion";

interface TraitsCardProps {
  traits: string[];
}

const dotColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

export default function TraitsCard({ traits }: TraitsCardProps) {
  return (
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
        {traits.map((trait, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: dotColors[i % dotColors.length] }}
            />
            <span className="text-sm text-[var(--mbti-text)]">{trait}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
