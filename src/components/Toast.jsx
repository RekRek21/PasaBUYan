'use client';

import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { toast } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast.message) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2700); // hide slightly before context clears
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast]);

  if (!toast.message && !isVisible) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'}`}>
      <div className="bg-gray-900/95 backdrop-blur-sm text-white px-6 py-3.5 rounded-full shadow-2xl shadow-brandTeal/10 flex items-center gap-3 border border-gray-800">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span className="text-sm font-bold line-clamp-1">{toast.message}</span>
      </div>
    </div>
  );
}
