import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorState({ 
  error, 
  onRetry, 
  onLoadSample,
  title = 'Something went wrong' 
}) {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-crimson-100 shadow-soft-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-crimson-50 text-crimson-600 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold tracking-wider uppercase text-crimson-600 bg-crimson-50 px-2.5 py-1 rounded-full border border-crimson-100">
            Generation Error
          </span>
          <h3 className="font-serif text-2xl font-semibold text-charcoal-800 mt-2">
            {title}
          </h3>
          <p className="mt-2 text-sm text-charcoal-600 leading-relaxed bg-cream-50 p-3.5 rounded-xl border border-cream-200 font-mono text-xs overflow-x-auto">
            {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred while communicating with the AI service.'}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition-colors border border-cream-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>

        <div className="flex items-center gap-2">
          {onLoadSample && (
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-lavender-700 bg-lavender-50 hover:bg-lavender-100 rounded-xl transition-colors border border-lavender-200"
            >
              <BookOpen className="w-4 h-4" />
              Use Sample Material
            </button>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold rounded-xl shadow-coral-glow transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
