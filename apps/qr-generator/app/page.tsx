'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Link,
  Menu,
  QrCode,
  Wifi,
  User,
  Mail,
  ChevronDown,
  MessageSquare,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import QRPreview from './components/QRPreview';
import QRCustomizer from './components/QRCustomizer';
import HistoryItem from './components/HistoryItem';
import BottomBar from './components/BottomBar';
import Toast from './components/Toast';
import LanguageSwitcher from './i18n/LanguageSwitcher';
import RelatedTools from './components/RelatedTools';
import QrInfoSection from './components/QrInfoSection';
import { useTranslation } from './i18n';
import { generateQR, type QROptions } from './lib/qr';
import { applyLogoToQR } from './lib/qrWithLogo';
import { getHistory, addHistory, clearHistory, type HistoryEntry } from './lib/history';

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
    case 'sms': {
      const phone = fields.phone ?? '';
      const body = fields.body ?? '';
      return `smsto:${phone}:${body}`;
    }
    case 'location': {
      const lat = fields.lat ?? '';
      const lng = fields.lng ?? '';
      const label = fields.label ?? '';
      if (label) return `geo:${lat},${lng}?q=${encodeURIComponent(label)}`;
      return `geo:${lat},${lng}`;
    }
    case 'calendar': {
      const title = fields.title ?? '';
      const dtstart = (fields.dtstart ?? '').replace(/[-:]/g, '').replace('T', 'T');
      const dtend = (fields.dtend ?? '').replace(/[-:]/g, '').replace('T', 'T');
      const loc = fields.location ?? '';
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `LOCATION:${loc}`,
        'END:VEVENT',
      ].join('\n');
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
    case 'sms':
      return `${fields.phone ?? ''} ${fields.body ?? ''}`.trim();
    case 'location':
      return fields.label || `${fields.lat ?? ''}, ${fields.lng ?? ''}`;
    case 'calendar':
      return fields.title ?? '';
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
    case 'sms':
      return !!(fields.phone && fields.phone.trim());
    case 'location':
      return !!(fields.lat && fields.lat.trim()) && !!(fields.lng && fields.lng.trim());
    case 'calendar':
      return !!(fields.title && fields.title.trim()) && !!(fields.dtstart && fields.dtstart.trim());
    default:
      return !!(fields.main && fields.main.trim());
  }
}

export default function Home() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('url');
  const [bottomTab, setBottomTab] = useState('generate');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [qrOptions, setQrOptions] = useState<QROptions>({
    width: 200,
    darkColor: '#111827',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const quickChips = [
    { label: t('chips.naver'), url: 'https://www.naver.com' },
    { label: t('chips.google'), url: 'https://www.google.com' },
    { label: t('chips.youtube'), url: 'https://www.youtube.com' },
  ];

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
    setQrContent('');
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
      setQrContent(content);

      const opts: QROptions = logoFile
        ? { ...qrOptions, errorCorrectionLevel: 'H' }
        : qrOptions;

      let dataUrl = await generateQR(content, opts);

      if (logoFile) {
        dataUrl = await applyLogoToQR(dataUrl, logoFile);
      }

      setQrDataUrl(dataUrl);
      const display = getDisplayContent(tab, f);
      addHistory({ type: tab, content: display });
      setHistory(getHistory());
    } catch (err) {
      console.error('QR generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [fields, activeTab, qrOptions, logoFile]);

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
    setBottomTab(tab);
  };

  const canGenerate = isFieldsFilled(activeTab, fields);

  const showHistory = bottomTab === 'history';

  const inputClass =
    'w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition';
  const inputWithIconClass =
    'w-full h-12 pl-11 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition';

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

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
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-screen">
        <h1 className="sr-only">{t('header.subtitle')}</h1>
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-zinc-200">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 cursor-pointer"
            aria-label={t('header.menuOpen')}
          >
            <Menu className="w-5 h-5 text-zinc-700" />
          </button>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[var(--qr-primary)]" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-zinc-900">
              {t('header.title')}
            </span>
          </div>
          <LanguageSwitcher />
        </header>

        {!showHistory && (
          <div className="hidden lg:block bg-white px-10 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-zinc-900">{t('form.generateQr')}</h2>
              <LanguageSwitcher />
            </div>
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}

        {!showHistory && (
          <div className="lg:hidden bg-white">
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}

        {showHistory && (
          <section className="lg:hidden flex-1 p-5 pb-24" aria-label={t('history.title')}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900">{t('history.title')}</h2>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    clearHistory();
                    setHistory([]);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  {t('history.clearAll')}
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-400 py-8 text-center">
                {t('history.empty')}
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
          </section>
        )}

        {!showHistory && (
          <section className="flex-1 p-5 lg:px-10 lg:py-8 pb-24 lg:pb-4" aria-label={t('form.generateQr')}>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              <div className="flex-1 flex flex-col gap-6">
                {activeTab === 'url' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="qr-input-url" className="text-sm font-semibold text-zinc-700">
                      {t('form.urlLabel')}
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input
                        id="qr-input-url"
                        type="url"
                        value={fields.main ?? ''}
                        onChange={(e) => updateField('main', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.urlPlaceholder')}
                        className={inputWithIconClass}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="qr-input-text" className="text-sm font-semibold text-zinc-700">
                      {t('form.textLabel')}
                    </label>
                    <textarea
                      id="qr-input-text"
                      value={fields.main ?? ''}
                      onChange={(e) => updateField('main', e.target.value)}
                      placeholder={t('form.textPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition resize-none"
                    />
                  </div>
                )}

                {activeTab === 'wifi' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-ssid" className="text-sm font-semibold text-zinc-700">
                        {t('form.wifiSsidLabel')}
                      </label>
                      <div className="relative">
                        <Wifi className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-wifi-ssid"
                          type="text"
                          value={fields.ssid ?? ''}
                          onChange={(e) => updateField('ssid', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.wifiSsidPlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-password" className="text-sm font-semibold text-zinc-700">
                        {t('form.wifiPasswordLabel')}
                      </label>
                      <input
                        id="qr-wifi-password"
                        type="password"
                        value={fields.password ?? ''}
                        onChange={(e) => updateField('password', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.wifiPasswordPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-wifi-enc" className="text-sm font-semibold text-zinc-700">
                        {t('form.wifiEncLabel')}
                      </label>
                      <div className="relative">
                        <select
                          id="qr-wifi-enc"
                          value={fields.encryption ?? 'WPA'}
                          onChange={(e) => updateField('encryption', e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition appearance-none cursor-pointer"
                        >
                          {wifiEncTypes.map((enc) => (
                            <option key={enc} value={enc}>
                              {enc === 'nopass' ? t('form.wifiEncNone') : enc}
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
                        {t('form.contactNameLabel')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-contact-name"
                          type="text"
                          value={fields.name ?? ''}
                          onChange={(e) => updateField('name', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.contactNamePlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-contact-tel" className="text-sm font-semibold text-zinc-700">
                        {t('form.contactTelLabel')}
                      </label>
                      <input
                        id="qr-contact-tel"
                        type="tel"
                        value={fields.tel ?? ''}
                        onChange={(e) => updateField('tel', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.contactTelPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-email-addr" className="text-sm font-semibold text-zinc-700">
                        {t('form.emailAddrLabel')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-email-addr"
                          type="email"
                          value={fields.email ?? ''}
                          onChange={(e) => updateField('email', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.emailAddrPlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-email-subject" className="text-sm font-semibold text-zinc-700">
                        {t('form.emailSubjectLabel')}
                      </label>
                      <input
                        id="qr-email-subject"
                        type="text"
                        value={fields.subject ?? ''}
                        onChange={(e) => updateField('subject', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.emailSubjectPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-sms-phone" className="text-sm font-semibold text-zinc-700">
                        {t('form.smsPhoneLabel')}
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-sms-phone"
                          type="tel"
                          value={fields.phone ?? ''}
                          onChange={(e) => updateField('phone', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.smsPhonePlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-sms-body" className="text-sm font-semibold text-zinc-700">
                        {t('form.smsBodyLabel')}
                      </label>
                      <textarea
                        id="qr-sms-body"
                        value={fields.body ?? ''}
                        onChange={(e) => updateField('body', e.target.value)}
                        placeholder={t('form.smsBodyPlaceholder')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--qr-primary)] focus:border-transparent transition resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-loc-lat" className="text-sm font-semibold text-zinc-700">
                        {t('form.locationLatLabel')}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-loc-lat"
                          type="text"
                          inputMode="decimal"
                          value={fields.lat ?? ''}
                          onChange={(e) => updateField('lat', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.locationLatPlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-loc-lng" className="text-sm font-semibold text-zinc-700">
                        {t('form.locationLngLabel')}
                      </label>
                      <input
                        id="qr-loc-lng"
                        type="text"
                        inputMode="decimal"
                        value={fields.lng ?? ''}
                        onChange={(e) => updateField('lng', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.locationLngPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-loc-label" className="text-sm font-semibold text-zinc-700">
                        {t('form.locationLabelLabel')}
                      </label>
                      <input
                        id="qr-loc-label"
                        type="text"
                        value={fields.label ?? ''}
                        onChange={(e) => updateField('label', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.locationLabelPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'calendar' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-cal-title" className="text-sm font-semibold text-zinc-700">
                        {t('form.calTitleLabel')}
                      </label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                          id="qr-cal-title"
                          type="text"
                          value={fields.title ?? ''}
                          onChange={(e) => updateField('title', e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('form.calTitlePlaceholder')}
                          className={inputWithIconClass}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-cal-start" className="text-sm font-semibold text-zinc-700">
                        {t('form.calStartLabel')}
                      </label>
                      <input
                        id="qr-cal-start"
                        type="datetime-local"
                        value={fields.dtstart ?? ''}
                        onChange={(e) => updateField('dtstart', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-cal-end" className="text-sm font-semibold text-zinc-700">
                        {t('form.calEndLabel')}
                      </label>
                      <input
                        id="qr-cal-end"
                        type="datetime-local"
                        value={fields.dtend ?? ''}
                        onChange={(e) => updateField('dtend', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="qr-cal-location" className="text-sm font-semibold text-zinc-700">
                        {t('form.calLocationLabel')}
                      </label>
                      <input
                        id="qr-cal-location"
                        type="text"
                        value={fields.location ?? ''}
                        onChange={(e) => updateField('location', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('form.calLocationPlaceholder')}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

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

                <QRCustomizer
                  qrOptions={qrOptions}
                  onOptionsChange={setQrOptions}
                  logoFile={logoFile}
                  onLogoChange={setLogoFile}
                />

                <button
                  onClick={() => handleGenerate()}
                  disabled={!canGenerate || isGenerating}
                  className="w-full h-12 rounded-lg bg-[var(--qr-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? t('button.generating') : t('button.generate')}
                </button>

                <div className="lg:hidden">
                  <QRPreview
                    qrDataUrl={qrDataUrl}
                    inputValue={getDisplayContent(activeTab, fields)}
                    qrContent={qrContent}
                    qrOptions={qrOptions}
                    onToast={showToast}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700">
                      {t('history.recentTitle')}
                    </h3>
                    {history.length > 0 && (
                      <button
                        onClick={() => {
                          clearHistory();
                          setHistory([]);
                        }}
                        className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      >
                        {t('history.clearAll')}
                      </button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-zinc-400 py-4 text-center">
                      {t('history.empty')}
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

              <div className="hidden lg:block">
                <QRPreview
                  qrDataUrl={qrDataUrl}
                  inputValue={getDisplayContent(activeTab, fields)}
                  qrContent={qrContent}
                  qrOptions={qrOptions}
                  onToast={showToast}
                />
              </div>
            </div>
          </section>
        )}

        <QrInfoSection />
        <RelatedTools currentToolId="qr" />
        <footer className="hidden lg:block bg-white border-t border-zinc-200 py-4 px-10">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
            <a
              href="/privacy"
              className="hover:text-zinc-700 hover:underline transition-colors"
            >
              {t('footer.privacy')}
            </a>
            <span className="text-zinc-300">|</span>
            <a
              href="/terms"
              className="hover:text-zinc-700 hover:underline transition-colors"
            >
              {t('footer.terms')}
            </a>
            <span className="text-zinc-300">|</span>
            <a
              href="mailto:rlawlsdnjswk@gmail.com"
              className="hover:text-zinc-700 hover:underline transition-colors"
            >
              {t('footer.contact')}
            </a>
            <span className="text-zinc-300">|</span>
            <span>&copy; 2025</span>
          </div>
        </footer>
      </main>

      <BottomBar activeItem={bottomTab} onItemChange={handleBottomTabChange} />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
