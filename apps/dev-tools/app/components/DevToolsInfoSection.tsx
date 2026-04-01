"use client";

import { useState } from "react";
import {
  Code,
  Wrench,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  Terminal,
} from "lucide-react";

/* ─── FAQ Data ─────────────────────────────────────── */

const faqItems = [
  {
    q: "JSON이란 무엇인가요?",
    a: "JSON(JavaScript Object Notation)은 데이터를 사람이 읽을 수 있는 텍스트 형태로 저장하고 전송하기 위한 경량 데이터 교환 형식입니다. 키-값 쌍으로 구성되며, 웹 API 통신에서 가장 널리 사용됩니다. XML에 비해 가볍고 파싱이 빨라 현대 웹 개발의 표준 데이터 형식으로 자리잡았습니다.",
  },
  {
    q: "Base64 인코딩과 암호화의 차이점은 무엇인가요?",
    a: "Base64는 인코딩 방식으로, 바이너리 데이터를 텍스트로 변환하는 것이 목적입니다. 누구나 디코딩할 수 있어 보안 목적으로는 사용할 수 없습니다. 반면 암호화(Encryption)는 키 없이는 원본 데이터를 복원할 수 없도록 변환하는 보안 기술입니다. Base64는 이메일 첨부파일, 이미지 인라인 삽입, JWT 토큰 등에 주로 사용됩니다.",
  },
  {
    q: "UUID가 충돌할 확률은 얼마나 되나요?",
    a: "UUID v4는 122비트의 랜덤 데이터를 사용하며, 충돌 확률은 극히 낮습니다. 약 2.71 x 10^18개의 UUID를 생성해야 50% 확률로 하나의 충돌이 발생합니다. 이는 초당 10억 개를 생성해도 약 86년이 걸리는 수준으로, 실무에서는 충돌 걱정 없이 사용할 수 있습니다.",
  },
  {
    q: "SHA-256과 MD5의 보안 차이는 무엇인가요?",
    a: "MD5는 128비트 해시를 생성하며, 이미 충돌 공격이 가능한 것으로 알려져 보안 용도로는 권장되지 않습니다. SHA-256은 256비트 해시를 생성하며 현재까지 알려진 실질적 취약점이 없어 비밀번호 해싱, 디지털 서명, 블록체인 등에 표준으로 사용됩니다. 파일 체크섬 등 단순 무결성 검증에는 MD5도 여전히 사용됩니다.",
  },
  {
    q: "정규표현식(Regex)은 어떻게 작동하나요?",
    a: "정규표현식은 문자열 패턴을 정의하는 특수한 문법입니다. 엔진이 입력 문자열을 왼쪽에서 오른쪽으로 스캔하면서 패턴과 일치하는 부분을 찾습니다. 메타문자(., *, +, ? 등)로 반복과 선택을 표현하고, 대괄호([])로 문자 클래스를, 소괄호(())로 그룹을 정의합니다. 이메일 검증, 전화번호 추출, 로그 분석 등에 필수적으로 사용됩니다.",
  },
];

/* ─── Tool Guide Data ──────────────────────────────── */

const toolGuides = [
  {
    name: "JSON Formatter",
    icon: <Code size={18} className="text-blue-500" />,
    when: "API 디버깅",
    desc: "API 응답 데이터를 보기 좋게 정렬하거나, 전송 전 JSON의 유효성을 검증할 때 사용합니다. 들여쓰기된 JSON으로 구조를 빠르게 파악하고, 문법 오류를 즉시 발견할 수 있습니다.",
  },
  {
    name: "Base64",
    icon: <Terminal size={18} className="text-green-500" />,
    when: "이미지 인코딩, JWT 토큰",
    desc: "이미지를 Data URI로 변환하여 인라인 삽입하거나, JWT 토큰의 페이로드를 디코딩하여 내용을 확인할 때 활용합니다. API 키나 바이너리 데이터를 텍스트 환경에서 안전하게 전달할 수 있습니다.",
  },
  {
    name: "UUID Generator",
    icon: <Wrench size={18} className="text-purple-500" />,
    when: "데이터베이스 고유 ID",
    desc: "데이터베이스 레코드, 세션 토큰, 파일명 등에 전역적으로 고유한 식별자가 필요할 때 사용합니다. 대량 생성 기능으로 테스트 데이터 준비에도 유용합니다.",
  },
  {
    name: "Hash Generator",
    icon: <Wrench size={18} className="text-orange-500" />,
    when: "비밀번호 검증, 파일 무결성",
    desc: "비밀번호의 해시값을 생성하거나, 파일 다운로드 후 무결성을 검증할 때 사용합니다. MD5부터 SHA-256까지 다양한 알고리즘을 한번에 비교할 수 있습니다.",
  },
  {
    name: "Regex Tester",
    icon: <Code size={18} className="text-red-500" />,
    when: "패턴 매칭, 유효성 검사",
    desc: "이메일, 전화번호, URL 등의 유효성 검사 패턴을 작성하고 실시간으로 테스트합니다. 매칭 결과를 하이라이트로 확인하여 패턴을 빠르게 완성할 수 있습니다.",
  },
];

/* ─── Tips Data ────────────────────────────────────── */

const tips = [
  {
    title: "API 디버깅 워크플로우",
    desc: "API 응답을 JSON Formatter로 정렬한 후, 중첩된 구조에서 필요한 데이터 경로를 파악하세요. 에러 응답도 포맷팅하면 문제 원인을 빠르게 찾을 수 있습니다.",
  },
  {
    title: "데이터 인코딩 모범 사례",
    desc: "URL 파라미터에는 encodeURIComponent를, 전체 URL에는 encodeURI를 사용하세요. Base64는 바이너리 데이터 전송에만 사용하고, 보안이 필요하면 반드시 암호화를 별도 적용하세요.",
  },
  {
    title: "보안 해싱 전략",
    desc: "비밀번호 저장에는 SHA-256 이상을 사용하고, 가능하면 bcrypt나 Argon2 같은 전용 해싱 알고리즘을 사용하세요. MD5는 체크섬 용도로만 활용하는 것을 권장합니다.",
  },
  {
    title: "정규식 최적화 팁",
    desc: "탐욕적(.*) 대신 게으른(.*?) 수량자를 사용하면 성능이 향상됩니다. 캡처 그룹이 불필요하면 비캡처 그룹(?:)을 사용하고, 앵커(^, $)를 활용하면 검색 범위를 줄일 수 있습니다.",
  },
];

/* ─── FAQ Item Component ───────────────────────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Main Section ─────────────────────────────────── */

export default function DevToolsInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* 1. 소개 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Code size={22} className="text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            개발자 도구 모음 소개
          </h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          개발 과정에서 반복적으로 필요한 유틸리티를 한곳에 모았습니다. JSON
          포맷터/검증기, Base64 인코딩/디코딩, UUID 생성기, 해시
          생성기(MD5, SHA-256), 정규표현식 테스터까지 — 별도 프로그램 설치 없이
          브라우저에서 바로 사용할 수 있습니다.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          이 도구들은 API 개발, 데이터 처리, 보안 검증, 텍스트 패턴 분석 등
          일상적인 개발 작업에 필수적입니다. 모든 처리는 브라우저 내에서
          이루어지므로 데이터가 외부 서버로 전송되지 않아 안심하고 사용할 수
          있습니다.
        </p>
      </div>

      {/* 2. 도구별 활용 가이드 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Wrench size={22} className="text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            도구별 활용 가이드
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolGuides.map((guide) => (
            <div
              key={guide.name}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {guide.icon}
                <h3 className="text-sm font-semibold text-slate-800">
                  {guide.name}
                </h3>
              </div>
              <span className="inline-block mb-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {guide.when}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {guide.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 개발 생산성 꿀팁 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Lightbulb size={22} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            개발 생산성 꿀팁
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                {tip.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <HelpCircle size={22} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            자주 묻는 질문
          </h2>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
