import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-crimson-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-lavender-600 flex-shrink-0" />
  };

  const borders = {
    success: 'border-sage-500 bg-sage-50 text-charcoal-800',
    error: 'border-crimson-500 bg-crimson-50 text-charcoal-800',
    info: 'border-lavender-400 bg-lavender-50 text-charcoal-800'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in shadow-soft-lg">
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${borders[toast.type || 'info']} bg-white/95 backdrop-blur-sm shadow-soft`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="text-charcoal-400 hover:text-charcoal-700 transition-colors p-0.5 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
