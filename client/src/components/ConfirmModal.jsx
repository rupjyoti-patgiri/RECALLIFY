import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-cream-300 shadow-soft-lg p-6 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl flex-shrink-0 ${isDestructive ? 'bg-crimson-50 text-crimson-600' : 'bg-lavender-50 text-lavender-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal-800">
              {title}
            </h3>
            <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-cream-200/60 rounded-xl transition-colors border border-cream-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all shadow-sm ${
              isDestructive
                ? 'bg-crimson-600 hover:bg-crimson-700'
                : 'bg-coral-500 hover:bg-coral-600 shadow-coral-glow'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
