'use client';

import { QrCode, History, Layers } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../i18n';

const items = [
  { id: 'generate', labelKey: 'bottomBar.generate', icon: QrCode },
  { id: 'history', labelKey: 'bottomBar.history', icon: History },
];

interface BottomBarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
}

export default function BottomBar({ activeItem, onItemChange }: BottomBarProps) {
  const { t } = useTranslation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex items-center justify-around h-16 z-50">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 cursor-pointer ${
              isActive ? 'text-[var(--qr-primary)]' : 'text-zinc-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
          </button>
        );
      })}
      <Link
        href="/batch"
        className="flex flex-col items-center gap-1 py-1 px-3 text-zinc-400"
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium">{t('bottomBar.batch')}</span>
      </Link>
    </div>
  );
}
