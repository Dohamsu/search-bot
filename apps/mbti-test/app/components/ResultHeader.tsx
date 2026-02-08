"use client";

import { motion } from "framer-motion";

interface ResultHeaderProps {
  type: string;
  title: string;
}

export default function ResultHeader({ type, title }: ResultHeaderProps) {
  return (
    <motion.div
      className="flex w-full flex-col items-center gap-3 bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-[#F9A8D4] px-6 pb-10 pt-12 md:pb-12 md:pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-sm font-medium text-white/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        테스트 완료!
      </motion.p>

      <motion.div
        className="rounded-full bg-white px-8 py-3"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
      >
        <span
          className="font-heading text-[32px] font-extrabold"
          style={{
            background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {type}
        </span>
      </motion.div>

      <motion.h1
        className="font-heading text-lg font-bold text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {title}
      </motion.h1>
    </motion.div>
  );
}
