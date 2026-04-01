'use client';

import { useState } from 'react';
import {
  QrCode,
  Smartphone,
  CreditCard,
  Wifi,
  Ticket,
  BookOpen,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  UtensilsCrossed,
  Megaphone,
  UserCircle,
} from 'lucide-react';

const useCases = [
  {
    icon: UserCircle,
    title: '명함 / 연락처',
    desc: 'QR 코드를 명함에 인쇄하면 스캔 한 번으로 연락처를 저장할 수 있어 네트워킹이 훨씬 편리해집니다.',
  },
  {
    icon: UtensilsCrossed,
    title: '레스토랑 메뉴',
    desc: '테이블 위 QR 코드를 스캔하면 디지털 메뉴를 확인할 수 있어 위생적이고 메뉴 업데이트도 간편합니다.',
  },
  {
    icon: CreditCard,
    title: '모바일 결제',
    desc: '카카오페이, 네이버페이 등 간편결제 서비스에서 QR 코드를 활용한 빠른 결제가 가능합니다.',
  },
  {
    icon: Megaphone,
    title: '마케팅 / 전단지',
    desc: '오프라인 광고물에 QR 코드를 넣어 웹사이트, 이벤트 페이지, 쿠폰 등으로 바로 연결할 수 있습니다.',
  },
  {
    icon: Wifi,
    title: 'WiFi 공유',
    desc: '복잡한 비밀번호를 입력할 필요 없이 QR 코드를 스캔하면 자동으로 WiFi에 접속됩니다.',
  },
  {
    icon: Ticket,
    title: '이벤트 / 티켓',
    desc: '콘서트, 세미나, 항공권 등 전자 티켓에 QR 코드를 활용하여 빠른 입장 처리가 가능합니다.',
  },
];

const tips = [
  {
    title: '적절한 크기 유지',
    desc: '인쇄 시 최소 2cm x 2cm 이상을 권장합니다. 스캔 거리가 멀수록 QR 코드 크기를 키워야 합니다. 일반적으로 스캔 거리의 1/10 크기가 적당합니다.',
  },
  {
    title: '오류 정정 레벨 선택',
    desc: 'L(7%), M(15%), Q(25%), H(30%) 네 가지 레벨이 있습니다. 로고를 넣거나 인쇄 품질이 낮을 경우 H 레벨을 선택하세요.',
  },
  {
    title: '충분한 색상 대비',
    desc: '어두운 모듈과 밝은 배경 사이 명확한 대비가 필요합니다. 배경보다 모듈이 항상 더 어두워야 하며, 최소 4:1 이상의 대비율을 유지하세요.',
  },
  {
    title: '인쇄 전 테스트',
    desc: '여러 기기(아이폰, 안드로이드)에서 스캔 테스트를 반드시 진행하세요. 다양한 조명 환경에서도 정상 작동하는지 확인하는 것이 좋습니다.',
  },
];

const faqs = [
  {
    q: 'QR 코드에 얼마나 많은 데이터를 담을 수 있나요?',
    a: 'QR 코드는 최대 숫자 7,089자, 영문 4,296자, 한글 약 1,800자까지 저장할 수 있습니다. 다만 데이터가 많을수록 QR 코드가 복잡해져 스캔이 어려워지므로, URL 단축 서비스 등을 활용해 데이터를 최소화하는 것이 좋습니다.',
  },
  {
    q: 'QR 코드에 유효기간이 있나요?',
    a: '정적 QR 코드는 유효기간이 없습니다. QR 코드 자체에 데이터가 인코딩되어 있어 영구적으로 사용 가능합니다. 다만 QR 코드가 가리키는 URL이 변경되거나 삭제되면 접속이 불가능해질 수 있습니다.',
  },
  {
    q: 'QR 코드 색상을 자유롭게 바꿀 수 있나요?',
    a: '네, QR 코드의 모듈(어두운 부분)과 배경(밝은 부분) 색상을 변경할 수 있습니다. 단, 모듈이 배경보다 항상 어두워야 하며, 충분한 대비가 유지되어야 스캔 인식률이 보장됩니다. 빨간색 모듈에 흰색 배경 등은 사용 가능하지만, 노란색 모듈에 흰색 배경은 대비가 부족해 권장하지 않습니다.',
  },
  {
    q: '오류 정정(Error Correction)이란 무엇인가요?',
    a: 'QR 코드의 오류 정정 기능은 코드가 일부 손상되거나 가려져도 데이터를 복원할 수 있게 해줍니다. L(7%), M(15%), Q(25%), H(30%) 네 단계가 있으며, 높은 레벨일수록 더 많은 손상을 복구할 수 있지만 QR 코드가 더 복잡해집니다. 로고를 삽입할 경우 H 레벨을 사용하세요.',
  },
  {
    q: 'QR 코드는 어떻게 스캔하나요?',
    a: '대부분의 최신 스마트폰은 기본 카메라 앱으로 QR 코드를 스캔할 수 있습니다. 아이폰은 카메라 앱을 열고 QR 코드에 가까이 대면 자동 인식됩니다. 안드로이드도 대부분 기본 카메라에서 지원하며, 지원하지 않는 기기는 Google Lens나 별도 QR 스캐너 앱을 사용하면 됩니다.',
  },
];

export default function QrInfoSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* QR 코드란? */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[var(--qr-primary)]" />
          <h2 className="text-xl font-bold text-slate-800">QR 코드란?</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            QR 코드(Quick Response Code)는 1994년 일본의 덴소 웨이브(Denso Wave)가 개발한 2차원 매트릭스 바코드입니다.
            기존 1차원 바코드가 수십 자의 데이터만 저장할 수 있는 것과 달리, QR 코드는 수천 자의 정보를 작은 정사각형 패턴 안에 담을 수 있습니다.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            QR 코드는 흑백 모듈(정사각형 점)의 2차원 배열로 데이터를 인코딩합니다.
            세 모서리에 있는 위치 탐지 패턴(큰 사각형)을 통해 어느 각도에서든 빠르게 인식할 수 있으며,
            오류 정정 기능을 내장하여 코드가 일부 손상되어도 데이터를 복원할 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-700 mb-1">정적 QR 코드</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                데이터가 QR 코드 자체에 직접 인코딩됩니다. 한번 생성하면 내용을 변경할 수 없지만,
                별도 서버 없이 영구적으로 작동합니다. URL, 텍스트, WiFi 정보 등에 적합합니다.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-700 mb-1">동적 QR 코드</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                짧은 리디렉션 URL을 인코딩하여 실제 목적지를 서버에서 관리합니다.
                생성 후에도 목적지 URL을 변경할 수 있고, 스캔 횟수 등 통계를 추적할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR 코드 활용 사례 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-[var(--qr-primary)]" />
          <h2 className="text-xl font-bold text-slate-800">QR 코드 활용 사례</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[var(--qr-primary)]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QR 코드 만들기 꿀팁 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[var(--qr-primary)]" />
          <h2 className="text-xl font-bold text-slate-800">QR 코드 만들기 꿀팁</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div
              key={tip.title}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[var(--qr-primary)] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{tip.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-[var(--qr-primary)]" />
          <h2 className="text-xl font-bold text-slate-800">자주 묻는 질문</h2>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-bold text-slate-800 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
