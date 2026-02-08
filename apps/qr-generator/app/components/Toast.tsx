'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[fadeInUp_0.2s_ease-out]">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 text-white text-sm shadow-lg">
        <span>{message}</span>
        <button onClick={onClose} className="shrink-0 cursor-pointer">
          <X className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}
