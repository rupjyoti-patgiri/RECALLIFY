import React, { useState, useEffect } from 'react';
import { Loader2, XCircle, Sparkles, BookMarked } from 'lucide-react';

const LOADING_STEPS = [
  "Analyzing your study notes & key concepts...",
  "Distilling core definitions and relational theories...",
  "Drafting active recall flashcards with detailed explanations...",
  "Formulating multiple-choice questions & distractor options...",
  "Validating pedagogical accuracy and JSON structure..."
];

export default function LoadingState({ onCancel, topic = 'Study Material' }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white/90 backdrop-blur-sm rounded-3xl border border-cream-300 shadow-soft-lg text-center animate-fade-in">
      {/* Icon Badge */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-2xl bg-coral-50 border border-coral-200 flex items-center justify-center text-coral-500 shadow-inner">
          <BookMarked className="w-10 h-10 animate-pulse stroke-[1.5]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-lavender-400 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
        </div>
      </div>

      <h3 className="font-serif text-2xl font-semibold text-charcoal-800">
        Synthesizing "{topic}"
      </h3>
      <p className="mt-2 text-sm text-coral-600 font-medium transition-all duration-300 min-h-[24px]">
        {LOADING_STEPS[stepIndex]}
      </p>

      {/* Editorial Progress Bar */}
      <div className="w-full bg-cream-200 h-2 rounded-full mt-6 overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-coral-400 via-coral-500 to-lavender-400 rounded-full transition-all duration-700 ease-out animate-pulse"
          style={{ width: `${Math.min(100, (stepIndex + 1) * 22)}%` }}
        />
      </div>

      {/* Skeleton placeholders */}
      <div className="mt-8 space-y-3 text-left">
        <div className="h-4 bg-cream-200/70 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-4 bg-cream-200/50 rounded-md w-full animate-pulse"></div>
        <div className="h-4 bg-cream-200/40 rounded-md w-5/6 animate-pulse"></div>
      </div>

      {/* Cancel button */}
      {onCancel && (
        <div className="mt-8 pt-6 border-t border-cream-200 flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal-500 hover:text-crimson-600 hover:bg-crimson-50 rounded-xl transition-all border border-cream-300"
          >
            <XCircle className="w-4 h-4" />
            Cancel Generation
          </button>
        </div>
      )}
    </div>
  );
}
