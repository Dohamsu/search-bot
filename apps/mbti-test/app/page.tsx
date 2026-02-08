"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { questions, type OptionScore } from "./lib/questions";
import { getResult } from "./lib/results";
import { calculateMBTI } from "./lib/calculator";
import ProgressHeader from "./components/ProgressHeader";
import QuestionCard from "./components/QuestionCard";
import AnswerCard from "./components/AnswerCard";
import ResultHeader from "./components/ResultHeader";
import TraitsCard from "./components/TraitsCard";
import CompatCard from "./components/CompatCard";
import ShareButton from "./components/ShareButton";

type Screen = "start" | "quiz" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<OptionScore[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mbtiType, setMbtiType] = useState<string>("");

  const handleStart = useCallback(() => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setMbtiType("");
  }, []);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;

      setSelectedOption(optionIndex);
      const question = questions[currentQuestion];
      const score = question.options[optionIndex].score;
      const newAnswers = [...answers, score];

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setAnswers(newAnswers);
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          const type = calculateMBTI(newAnswers);
          setMbtiType(type);
          setAnswers(newAnswers);
          setScreen("result");
        }
      }, 400);
    },
    [currentQuestion, answers, selectedOption]
  );

  const [shareLabel, setShareLabel] = useState("결과 공유하기");
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(async () => {
    const result = getResult(mbtiType);
    const url = typeof window !== "undefined" ? window.location.href : "";
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
      // 클립보드 API가 지원되지 않는 환경 (예: http)
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
  }, [mbtiType]);

  const handleRetry = useCallback(() => {
    setScreen("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setMbtiType("");
    setShareLabel("결과 공유하기");
    if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
  }, []);

  // === Start Screen ===
  if (screen === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <motion.div
          className="flex max-w-md flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>

          <div>
            <h1 className="font-heading mb-2 text-3xl font-extrabold text-[var(--mbti-text)] md:text-4xl">
              MBTI 성격 유형 테스트
            </h1>
            <p className="text-base text-gray-500">
              16가지 질문으로 알아보는 나의 성격 유형
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span>16문항 / 약 3분 소요</span>
          </div>

          <motion.button
            onClick={handleStart}
            aria-label="MBTI 성격 유형 테스트 시작하기"
            className="mt-4 flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-10 py-4 text-lg font-semibold text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            테스트 시작하기
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // === Quiz Screen ===
  if (screen === "quiz") {
    const question = questions[currentQuestion];
    return (
      <div className="flex min-h-dvh flex-col">
        <ProgressHeader
          current={currentQuestion}
          total={questions.length}
        />

        <div className="flex flex-1 flex-col items-center gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="w-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                questionNumber={question.id}
                questionText={question.question}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="grid w-full max-w-[800px] grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
              role="group"
              aria-label={`질문 ${question.id}의 답변 선택지`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {question.options.map((option, i) => (
                <AnswerCard
                  key={i}
                  emoji={option.emoji}
                  text={option.text}
                  isSelected={selectedOption === i}
                  isLocked={selectedOption !== null}
                  onClick={() => handleAnswer(i)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // === Result Screen ===
  const result = getResult(mbtiType);

  return (
    <div className="flex min-h-dvh flex-col">
      <ResultHeader type={result.type} title={result.title} />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        {/* Description */}
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

        <TraitsCard traits={result.traits} />
        <CompatCard compatible={result.compatible} />

        {/* Percentage Card */}
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

        <div className="mt-2">
          <ShareButton onShare={handleShare} onRetry={handleRetry} shareLabel={shareLabel} />
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
