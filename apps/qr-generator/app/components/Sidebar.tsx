'use client';

import {
  QrCode,
  Type,
  Wifi,
  Contact,
  Mail,
  MessageSquare,
  MapPin,
  CalendarDays,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../i18n';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'url', labelKey: 'sidebar.urlQr', icon: QrCode },
  { id: 'text', labelKey: 'sidebar.text', icon: Type },
  { id: 'wifi', labelKey: 'sidebar.wifi', icon: Wifi },
  { id: 'contact', labelKey: 'sidebar.contact', icon: Contact },
  { id: 'email', labelKey: 'sidebar.email', icon: Mail },
  { id: 'sms', labelKey: 'sidebar.sms', icon: MessageSquare },
  { id: 'location', labelKey: 'sidebar.location', icon: MapPin },
  { id: 'calendar', labelKey: 'sidebar.calendar', icon: CalendarDays },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[var(--qr-sidebar)] text-white">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <QrCode className="w-6 h-6 text-[var(--qr-primary)]" />
        <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
          QR Studio
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A2E] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/batch"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span>{t('sidebar.batch')}</span>
        </Link>
      </div>
    </aside>
  );
}
