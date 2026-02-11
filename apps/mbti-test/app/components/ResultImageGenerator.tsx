"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { MBTIResult } from "../lib/results";

interface ResultImageGeneratorProps {
  result: MBTIResult;
}

function drawResultCard(
  canvas: HTMLCanvasElement,
  result: MBTIResult
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 1080;
  const h = 1350;
  canvas.width = w;
  canvas.height = h;

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#8B5CF6");
  gradient.addColorStop(0.5, "#A855F7");
  gradient.addColorStop(1, "#EC4899");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.15, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.2, h * 0.75, 250, 0, Math.PI * 2);
  ctx.fill();

  const cardX = 60;
  const cardY = 200;
  const cardW = w - 120;
  const cardH = h - 360;
  const radius = 40;

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.lineTo(cardX + cardW - radius, cardY);
  ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + radius, radius);
  ctx.lineTo(cardX + cardW, cardY + cardH - radius);
  ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH, radius);
  ctx.lineTo(cardX + radius, cardY + cardH);
  ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - radius, radius);
  ctx.lineTo(cardX, cardY + radius);
  ctx.arcTo(cardX, cardY, cardX + radius, cardY, radius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("나의 성격 유형 결과", w / 2, 120);

  const typeGradient = ctx.createLinearGradient(w / 2 - 150, 0, w / 2 + 150, 0);
  typeGradient.addColorStop(0, "#8B5CF6");
  typeGradient.addColorStop(1, "#EC4899");
  ctx.fillStyle = typeGradient;
  ctx.font = "900 120px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(result.type, w / 2, cardY + 150);

  ctx.fillStyle = "#374151";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(result.title, w / 2, cardY + 220);

  ctx.fillStyle = "#6B7280";
  ctx.font = "26px sans-serif";
  const descLines = wrapText(ctx, result.description, cardW - 120);
  let descY = cardY + 290;
  for (const line of descLines) {
    ctx.fillText(line, w / 2, descY);
    descY += 38;
  }

  let traitY = descY + 30;
  ctx.textAlign = "left";
  const dotColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "#1E1B4B";
  ctx.fillText("핵심 성격 특성", cardX + 60, traitY);
  traitY += 50;

  result.traits.forEach((trait, i) => {
    ctx.fillStyle = dotColors[i % dotColors.length];
    ctx.beginPath();
    ctx.arc(cardX + 80, traitY - 8, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#374151";
    ctx.font = "28px sans-serif";
    ctx.fillText(trait, cardX + 105, traitY);
    traitY += 48;
  });

  traitY += 20;
  ctx.fillStyle = "#F3E8FF";
  const pillW = 280;
  const pillH = 60;
  const pillX = w / 2 - pillW / 2;
  const pillR = 30;
  ctx.beginPath();
  ctx.moveTo(pillX + pillR, traitY);
  ctx.lineTo(pillX + pillW - pillR, traitY);
  ctx.arcTo(pillX + pillW, traitY, pillX + pillW, traitY + pillR, pillR);
  ctx.lineTo(pillX + pillW, traitY + pillH - pillR);
  ctx.arcTo(pillX + pillW, traitY + pillH, pillX + pillW - pillR, traitY + pillH, pillR);
  ctx.lineTo(pillX + pillR, traitY + pillH);
  ctx.arcTo(pillX, traitY + pillH, pillX, traitY + pillH - pillR, pillR);
  ctx.lineTo(pillX, traitY + pillR);
  ctx.arcTo(pillX, traitY, pillX + pillR, traitY, pillR);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#8B5CF6";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`전체 인구의 ${result.percentage}%`, w / 2, traitY + 40);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("16가지 성격 유형 테스트 | mbti.onekit.co.kr", w / 2, h - 80);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split("");
  const lines: string[] = [];
  let currentLine = "";

  for (const char of words) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export default function ResultImageGenerator({ result }: ResultImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawResultCard(canvas, result);

    const link = document.createElement("a");
    link.download = `mbti-${result.type}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [result]);

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />
      <motion.button
        onClick={handleDownload}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-8 py-4 text-base font-medium text-[var(--mbti-text)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Download className="h-5 w-5" />
        결과 이미지 저장
      </motion.button>
    </div>
  );
}
