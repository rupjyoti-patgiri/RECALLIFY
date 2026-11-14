import React from 'react';
import { RotateCw, CheckCircle2, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function Flashcard({
  card,
  isFlipped,
  onFlip,
  onRate,
  currentRating,
  index,
  total
}) {
  if (!card) return null;

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 select-none">
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        aria-label={`Flashcard ${index + 1} of ${total}. Click or press space to flip.`}
        className={`relative w-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d cursor-pointer rounded-3xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT OF CARD */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl p-8 sm:p-10 border border-cream-300 shadow-soft-lg flex flex-col justify-between hover:border-coral-300 transition-all">
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-cream-300 text-xs font-semibold uppercase tracking-wider text-charcoal-600">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              Prompt • Card {index + 1} of {total}
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Press [Space] to flip
            </span>
          </div>

          {/* Question Text */}
          <div className="my-auto py-6 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-800 leading-snug tracking-tight">
              {card.question}
            </h2>
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-cream-100 flex items-center justify-between text-xs text-charcoal-500">
            <span className="capitalize font-medium text-lavender-600 bg-lavender-50 px-2.5 py-1 rounded-lg">
              Difficulty: {card.difficulty || 'Medium'}
            </span>
            <div className="flex items-center gap-1.5 text-coral-600 font-semibold group-hover:underline">
              <span>Click to reveal answer</span>
              <RotateCw className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#FAF9F5] rounded-3xl p-8 sm:p-10 border border-cream-300 shadow-soft-lg flex flex-col justify-between">
          {/* Back Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 border border-sage-200 text-xs font-semibold uppercase tracking-wider text-sage-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
              Answer Explanation
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200/50 transition-colors"
              title="Flip back to question"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Answer Text */}
          <div className="my-auto py-6 overflow-y-auto max-h-[240px] pr-2">
            <p className="font-sans text-base sm:text-lg text-charcoal-800 leading-relaxed whitespace-pre-line">
              {card.answer}
            </p>
          </div>

          {/* Self-Rating Controls */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <span className="text-xs font-medium text-charcoal-500">
              How well did you recall this?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRate(card.id, 'hard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  currentRating === 'hard'
                    ? 'bg-crimson-600 text-white border-crimson-600 shadow-sm'
                    : 'bg-white text-crimson-600 border-crimson-200 hover:bg-crimson-50'
                }`}
              >
                Difficult
              </button>
              <button
                type="button"
                onClick={() => onRate(card.id, 'medium')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  currentRating === 'medium'
                    ? 'bg-lavender-600 text-white border-lavender-600 shadow-sm'
                    : 'bg-white text-lavender-600 border-lavender-200 hover:bg-lavender-50'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => onRate(card.id, 'easy')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  currentRating === 'easy'
                    ? 'bg-sage-600 text-white border-sage-600 shadow-sm'
                    : 'bg-white text-sage-600 border-sage-200 hover:bg-sage-50'
                }`}
              >
                Easy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
