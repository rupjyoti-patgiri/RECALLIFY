import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon = BookOpen, 
  title = 'No Items Yet', 
  description = 'You have not generated any study material yet. Start by turning your notes into interactive flashcards and quizzes.', 
  actionLabel = 'Create Study Session',
  actionTo = '/',
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto bg-white/70 rounded-3xl border border-cream-300 shadow-soft-sm">
      <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 flex items-center justify-center text-coral-500 mb-5 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl font-medium text-charcoal-800 tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
        {description}
      </p>
      <div className="mt-6">
        {actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold rounded-xl shadow-coral-glow transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            {actionLabel}
          </Link>
        ) : onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold rounded-xl shadow-coral-glow transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
