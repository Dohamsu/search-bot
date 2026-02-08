'use client';

const tabs = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: '텍스트' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'contact', label: '연락처' },
  { id: 'email', label: '이메일' },
];

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-zinc-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'text-[var(--qr-primary)] border-b-2 border-[var(--qr-primary)]'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
