'use client';

import { useTranslation } from '../i18n';

const tabIds = ['url', 'text', 'wifi', 'contact', 'email', 'sms', 'location', 'calendar'] as const;

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex border-b border-zinc-200 overflow-x-auto scrollbar-none">
      {tabIds.map((id) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`px-5 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isActive
                ? 'text-[var(--qr-primary)] border-b-2 border-[var(--qr-primary)]'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {t(`tabs.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
