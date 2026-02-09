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
  Crown,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProClick?: () => void;
}

const navItems = [
  { id: 'url', label: 'URL QR', icon: QrCode },
  { id: 'text', label: '텍스트', icon: Type },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'contact', label: '연락처', icon: Contact },
  { id: 'email', label: '이메일', icon: Mail },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'location', label: '위치', icon: MapPin },
  { id: 'calendar', label: '일정', icon: CalendarDays },
];

export default function Sidebar({ activeTab, onTabChange, onProClick }: SidebarProps) {
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
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
            U
          </div>
          <span className="text-sm text-zinc-300">사용자</span>
        </div>
        <button
          onClick={onProClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--qr-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Crown className="w-4 h-4" />
          Pro 업그레이드
        </button>
      </div>
    </aside>
  );
}
