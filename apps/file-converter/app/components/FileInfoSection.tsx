"use client";

import { useState } from "react";
import {
  FileImage,
  Shield,
  Zap,
  HelpCircle,
  ChevronDown,
  Image,
  FileType,
} from "lucide-react";

const formatData = [
  { name: "PNG", desc: "무손실 압축, 투명 배경 지원. 로고, 아이콘, 스크린샷에 적합" },
  { name: "JPG", desc: "손실 압축으로 용량이 작음. 사진, 웹 이미지에 널리 사용" },
  { name: "WebP", desc: "구글이 개발한 차세대 포맷. PNG/JPG 대비 25~35% 작은 용량" },
  { name: "SVG", desc: "벡터 기반 이미지. 확대해도 깨지지 않아 아이콘, 로고에 최적" },
  { name: "HEIC", desc: "Apple 기기 기본 포맷. JPG 대비 절반 용량으로 고화질 저장" },
  { name: "GIF", desc: "애니메이션 지원. 간단한 움짤, 배너에 사용" },
  { name: "BMP", desc: "비압축 비트맵. 화질 손실 없지만 용량이 매우 큼" },
  { name: "TIFF", desc: "출판/인쇄용 고품질 포맷. 레이어와 메타데이터 지원" },
];

const tips = [
  {
    icon: Image,
    title: "용도에 맞는 포맷 선택",
    desc: "웹용은 WebP, 인쇄용은 PNG 또는 TIFF, 사진 공유는 JPG가 최적입니다. 용도에 따라 포맷을 선택하면 품질과 용량을 모두 잡을 수 있습니다.",
  },
  {
    icon: FileType,
    title: "손실 vs 무손실 압축 이해하기",
    desc: "JPG, WebP는 손실 압축으로 용량을 줄이지만 약간의 화질 저하가 있습니다. PNG, TIFF는 무손실 압축으로 원본 품질을 유지합니다.",
  },
  {
    icon: Zap,
    title: "대량 변환으로 시간 절약",
    desc: "여러 파일을 한 번에 변환하고 ZIP으로 일괄 다운로드하세요. 반복 작업 없이 수십 개 파일을 빠르게 처리할 수 있습니다.",
  },
  {
    icon: Shield,
    title: "품질 설정 활용하기",
    desc: "JPG, WebP 변환 시 품질 슬라이더를 조절해 용량과 화질의 균형을 맞추세요. 웹용은 80~85%, 고품질 보관용은 95% 이상을 권장합니다.",
  },
];

const faqData = [
  {
    q: "파일 변환 시 개인정보가 안전한가요?",
    a: "네, 완전히 안전합니다. 모든 변환 작업은 사용자의 브라우저(클라이언트) 내에서 처리되며, 파일이 외부 서버로 전송되지 않습니다. 인터넷 연결 없이도 변환이 가능하며, 개인정보 유출 위험이 전혀 없습니다.",
  },
  {
    q: "변환할 수 있는 최대 파일 크기는 얼마인가요?",
    a: "브라우저 기반 변환이므로 별도의 서버 용량 제한이 없습니다. 다만, 기기의 메모리에 따라 처리 속도가 달라질 수 있으며, 일반적으로 50MB 이하의 파일에서 가장 원활하게 작동합니다.",
  },
  {
    q: "이미지 변환 시 화질이 떨어지나요?",
    a: "포맷에 따라 다릅니다. PNG에서 PNG처럼 무손실 포맷 간 변환은 화질 손실이 없습니다. JPG나 WebP로 변환할 때는 품질 설정을 90% 이상으로 설정하면 육안으로 구분하기 어려운 수준의 품질을 유지할 수 있습니다.",
  },
  {
    q: "WebP 포맷은 무엇이고 왜 사용하나요?",
    a: "WebP는 Google이 개발한 차세대 이미지 포맷입니다. JPG보다 25~35% 작은 용량으로 비슷한 화질을 제공하며, PNG처럼 투명 배경도 지원합니다. 웹사이트 로딩 속도를 높이고 데이터 사용량을 줄이는 데 효과적입니다.",
  },
  {
    q: "HEIC 파일을 JPG로 어떻게 변환하나요?",
    a: "변환 형식에서 'From'을 HEIC, 'To'를 JPG로 선택한 후 파일을 업로드하면 됩니다. iPhone이나 iPad에서 촬영한 HEIC 사진을 호환성 높은 JPG로 간편하게 변환할 수 있습니다.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--file-border)] bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[var(--file-text)]">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="border-t border-[var(--file-border)] px-5 pb-5 pt-3">
          <p className="text-sm leading-relaxed text-slate-600">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FileInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* 1. 파일 변환이란? */}
      <div className="mb-10 rounded-xl border border-[var(--file-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileImage size={22} className="text-[var(--file-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-[var(--file-text)]">파일 변환이란?</h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            파일 변환은 하나의 파일 형식을 다른 형식으로 바꾸는 작업입니다. 이미지, 문서, 오디오 등
            다양한 파일을 목적에 맞는 포맷으로 변환하여 호환성을 높이고, 파일 크기를 최적화하며,
            원하는 품질을 유지할 수 있습니다.
          </p>
          <p>
            파일 변환이 필요한 대표적인 이유로는 <strong>호환성 확보</strong>(특정 프로그램이나
            플랫폼에서 지원하지 않는 포맷을 변환), <strong>용량 최적화</strong>(웹 업로드나 이메일
            첨부를 위해 파일 크기 줄이기), <strong>품질 관리</strong>(인쇄용 고해상도 포맷으로
            변환)가 있습니다.
          </p>
          <p>
            파일 변환 방식에는 서버 기반과 브라우저(클라이언트) 기반이 있습니다. 서버 기반은 파일을
            외부 서버에 업로드하여 변환하는 방식이고, 브라우저 기반은 사용자의 기기에서 직접
            변환합니다. <strong>FileFlow는 브라우저 기반 변환</strong>을 사용하여 파일이 외부로
            전송되지 않으므로 개인정보가 완벽하게 보호됩니다.
          </p>
        </div>
      </div>

      {/* 2. 지원 파일 형식 안내 */}
      <div className="mb-10 rounded-xl border border-[var(--file-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileType size={22} className="text-[var(--file-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-[var(--file-text)]">지원 파일 형식 안내</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          FileFlow에서 지원하는 이미지 파일 형식입니다. 각 포맷의 특징을 이해하고 용도에 맞게
          변환하세요.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {formatData.map((f) => (
            <div
              key={f.name}
              className="flex items-start gap-3 rounded-lg border border-[var(--file-border)] bg-[var(--file-bg)] p-3.5"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--file-primary)] text-xs font-bold text-white">
                {f.name.slice(0, 3)}
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--file-text)]">{f.name}</p>
                <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 파일 변환 꿀팁 */}
      <div className="mb-10 rounded-xl border border-[var(--file-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap size={22} className="text-[var(--file-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-[var(--file-text)]">파일 변환 꿀팁</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="rounded-lg border border-[var(--file-border)] bg-[var(--file-bg)] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={18} className="text-[var(--file-primary)]" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-[var(--file-text)]">{tip.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="rounded-xl border border-[var(--file-border)] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle size={22} className="text-[var(--file-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-[var(--file-text)]">자주 묻는 질문</h2>
        </div>
        <div className="space-y-3">
          {faqData.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
