'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, Menu, Settings, QrCode, Wifi, User, Mail, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import QRPreview from './components/QRPreview';
import HistoryItem from './components/HistoryItem';
import BottomBar from './components/BottomBar';
import Toast from './components/Toast';
import { generateQR } from './lib/qr';
import { getHistory, addHistory, clearHistory, type HistoryEntry } from './lib/history';

const quickChips = [
  { label: '네이버', url: 'https://www.naver.com' },
  { label: '구글', url: 'https://www.google.com' },
  { label: '유튜브', url: 'https://www.youtube.com' },
];

const wifiEncTypes = ['WPA', 'WEP', 'nopass'] as const;

function buildQrContent(
  tab: string,
  fields: Record<string, string>
): string {
  switch (tab) {
    case 'url':
    case 'text':
      return fields.main ?? '';
    case 'wifi': {
      const ssid = fields.ssid ?? '';
      const password = fields.password ?? '';
      const enc = fields.encryption ?? 'WPA';
      return `WIFI:T:${enc};S:${ssid};P:${password};;`;
    }
    case 'contact': {
      const name = fields.name ?? '';
      const tel = fields.tel ?? '';
      return `MECARD:N:${name};TEL:${tel};;`;
    }
    case 'email': {
      const email = fields.email ?? '';
      const subject = fields.subject ?? '';
      if (subject) return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
      return `mailto:${email}`;
    }
    default:
      return fields.main ?? '';
  }
}

function getDisplayContent(tab: string, fields: Record<string, string>): string {
  switch (tab) {
    case 'url':
    case 'text':
      return fields.main ?? '';
    case 'wifi':
      return fields.ssid ?? '';
    case 'contact':
      return `${fields.name ?? ''} ${fields.tel ?? ''}`.trim();
    case 'email':
      return fields.email ?? '';
    default:
      return fields.main ?? '';
  }
}

function isFieldsFilled(tab: string, fields: Record<string, string>): boolean {
  switch (tab) {
    case 'url':
    case 'text':
      return !!(fields.main && fields.main.trim());
    case 'wifi':
      return !!(fields.ssid && fields.ssid.trim());
    case 'contact':
      return !!(fields.name && fields.name.trim()) || !!(fields.tel && fields.tel.trim());
    case 'email':
      return !!(fields.email && fields.email.trim());
    default:
      return !!(fields.main && fields.main.trim());
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const [bottomTab, setBottomTab] = useState('generate');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFields({});
    setQrDataUrl(null);
    if (bottomTab !== 'generate') {
      setBottomTab('generate');
    }
  };

  const handleGenerate = useCallback(async (overrideFields?: Record<string, string>, overrideTab?: string) => {
    const tab = overrideTab ?? activeTab;
    const f = overrideFields ?? fields;
    if (!isFieldsFilled(tab, f)) return;

    setIsGenerating(true);
    try {
      const content = buildQrContent(tab, f);
      const dataUrl = await generateQR(content);
      setQrDataUrl(dataUrl);
      const display = getDisplayContent(tab, f);
      addHistory({ type: tab, content: display });
      setHistory(getHistory());
    } catch (err) {
      console.error('QR generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [fields, activeTab]);

  const handleHistoryClick = (content: string, type?: string) => {
    const tab = type ?? 'url';
    setActiveTab(tab);
    if (tab === 'url' || tab === 'text') {
      const newFields = { main: content };
      setFields(newFields);
      handleGenerate(newFields, tab);
    } else {
      setFields({ main: content });
      handleGenerate({ main: content }, 'text');
    }
    if (bottomTab === 'history') {
      setBottomTab('generate');
    }
  };

  const handleChipClick = (url: string) => {
    const newFields = { main: url };
    setFields(newFields);
    handleGenerate(newFields, 'url');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      handleGenerate();
    }
  };

  const handleBottomTabChange = (tab: string) => {
    if (tab === 'scan') {
      showToast('스캔 기능은 준비 중입니다');
      return;
    }
    if (tab === 'settings') {
      showToast('설정 기능은 준비 중입니다');
      return;
    }
    setBottomTab(tab);
  };

  const canGenerate = isFieldsFilled(activeTab, fields);

  // Decide what to show based on bottomTab (mobile)
  const showHistory = bottomTab === 'history';

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onProClick={() => showToast('Pro 업그레이드는 준비 중입니다')}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                handleTabChange(tab);
                setMobileMenuOpen(false);
              }}
              onProClick={() => {
                showToast('Pro 업그레이드는 준비 중입니다');
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile AppBar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-zinc-200">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-zinc-700" />
          </button>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[var(--qr-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-zinc-900">
              QR Studio
            </span>
          </div>
          <button
            onClick={() => showToast('설정 기능은 준비 중입니다')}
            className="p-2 cursor-pointer"
          >
            <Settings className="w-5 h-5 text-zinc-700" />
          </button>
        </header>

        {/* Desktop TabBar */}
        {!showHistory && (
          <div className="hidden lg:block bg-white px-10 pt-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-4">QR코드 생성</h1>
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}

        {/* Mobile Tabs */}
        {!showHistory && (
          <div className="lg:hidden bg-white">
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}

        {/* History Full View (mobile) */}
        {showHistory && (
          <div className="lg:hidden flex-1 p-5 pb-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900">히스토리</h2>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    clearHistory();
                    setHistory([]);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  전체 삭제
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-400 py-8 text-center">
                아직 생성된 QR코드가 없습니다
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {history.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    onClick={(content) => handleHistoryClick(content, entry.type)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Generate Content */}
        {!showHistory && (
          <div className="flex-1 p-5 lg:px-10 lg:py-8 pb-24 lg:pb-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Input Section */}
                {activeTab === 'url' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="qr-input-url" className="text-sm font-semibold text-zinc-700">
                      URL 입력
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input
                        id="qr-input-url"
                        type="url"
                        value={fields.main ?? ''}
                        onChange={(e) => updateField('main', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="https://example.com"
                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="qr-input-text" className="text-sm font-semibold text-zinc-700">
                      텍스트 입력
                    </label>
                    <textarea
                      id="qr-input-text"
                      value={fields.main ?? ''}
                      onChange={(e) => updateField('main', e.target.value)}
                      placeholder="텍스트를 입력하세요"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition resize-none"
                    />
                  </div>
                )}

                {activeTab === 'wifi' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-ssid" className="text-sm font-semibold text-zinc-700">
                        네트워크 이름 (SSID)
                      </label>
                      <div className="relative">
                        <Wifi className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-wifi-ssid"
                          type="text"
                          value={fields.ssid ?? ''}
                          onChange={(e) => updateField('ssid', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Wi-Fi 네트워크 이름"
                          className="w-full h-12 pl-11 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-password" className="text-sm font-semibold text-zinc-700">
                        비밀번호
                      </label>
                      <input
                        id="qr-wifi-password"
                        type="password"
                        value={fields.password ?? ''}
                        onChange={(e) => updateField('password', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Wi-Fi 비밀번호"
                        className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-enc" className="text-sm font-semibold text-zinc-700">
                        암호화 방식
                      </label>
                      <div className="relative">
                        <select
                          id="qr-wifi-enc"
                          value={fields.encryption ?? 'WPA'}
                          onChange={(e) => updateField('encryption', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition appearance-none cursor-pointer"
                        >
                          {wifiEncTypes.map((t) => (
                            <option key={t} value={t}>
                              {t === 'nopass' ? '없음 (Open)' : t}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-contact-name" className="text-sm font-semibold text-zinc-700">
                        이름
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-contact-name"
                          type="text"
                          value={fields.name ?? ''}
                          onChange={(e) => updateField('name', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="홍길동"
                          className="w-full h-12 pl-11 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-contact-tel" className="text-sm font-semibold text-zinc-700">
                        전화번호
                      </label>
                      <input
                        id="qr-contact-tel"
                        type="tel"
                        value={fields.tel ?? ''}
                        onChange={(e) => updateField('tel', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="010-1234-5678"
                        className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-email-addr" className="text-sm font-semibold text-zinc-700">
                        이메일 주소
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-email-addr"
                          type="email"
                          value={fields.email ?? ''}
                          onChange={(e) => updateField('email', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="example@email.com"
                          className="w-full h-12 pl-11 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-email-subject" className="text-sm font-semibold text-zinc-700">
                        제목 (선택)
                      </label>
                      <input
                        id="qr-email-subject"
                        type="text"
                        value={fields.subject ?? ''}
                        onChange={(e) => updateField('subject', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="이메일 제목"
                        className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition"
                      />
                    </div>
                  </div>
                )}

                {/* Quick Chips - Only for URL tab on Mobile */}
                {activeTab === 'url' && (
                  <div className="flex gap-2 lg:hidden">
                    {quickChips.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => handleChipClick(chip.url)}
                        className="px-3 py-1.5 rounded-full bg-blue-50 text-[var(--qr-primary)] text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={() => handleGenerate()}
                  disabled={!canGenerate || isGenerating}
                  className="w-full h-12 rounded-lg bg-[var(--qr-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? '생성 중...' : 'QR코드 생성'}
                </button>

                {/* Mobile QR Preview */}
                <div className="lg:hidden">
                  <QRPreview qrDataUrl={qrDataUrl} inputValue={getDisplayContent(activeTab, fields)} onToast={showToast} />
                </div>

                {/* Recent History */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700">
                      최근 생성
                    </h3>
                    {history.length > 0 && (
                      <button
                        onClick={() => {
                          clearHistory();
                          setHistory([]);
                        }}
                        className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      >
                        전체 삭제
                      </button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-zinc-400 py-4 text-center">
                      아직 생성된 QR코드가 없습니다
                    </p>
                  ) : (
                    <div className="flex flex-col">
                      {history.slice(0, 3).map((entry) => (
                        <HistoryItem
                          key={entry.id}
                          entry={entry}
                          onClick={(content) => handleHistoryClick(content, entry.type)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Desktop QR Preview */}
              <div className="hidden lg:block">
                <QRPreview qrDataUrl={qrDataUrl} inputValue={getDisplayContent(activeTab, fields)} onToast={showToast} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <BottomBar activeItem={bottomTab} onItemChange={handleBottomTabChange} />

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
