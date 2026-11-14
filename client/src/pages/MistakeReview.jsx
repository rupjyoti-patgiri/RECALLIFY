import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  X, 
  Check, 
  HelpCircle,
  Award
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function MistakeReview({
  mistakes = [],
  onRemoveMistake,
  onClearAllMistakes,
  addToast
}) {
  // Retest state per mistake: { [mistakeId]: { selectedOption, isSubmitted, isCorrect } }
  const [retestState, setRetestState] = useState({});
  const [showClearModal, setShowClearModal] = useState(false);

  const handleSelectOption = (mistakeId, optionIdx) => {
    if (retestState[mistakeId]?.isSubmitted) return;
    setRetestState(prev => ({
      ...prev,
      [mistakeId]: {
        ...prev[mistakeId],
        selectedOption: optionIdx
      }
    }));
  };

  const handleCheckAnswer = (mistake) => {
    const state = retestState[mistake.id];
    if (!state || state.selectedOption === undefined) return;

    const isCorrect = state.selectedOption === mistake.correctAnswer;
    
    setRetestState(prev => ({
      ...prev,
      [mistake.id]: {
        ...prev[mistake.id],
        isSubmitted: true,
        isCorrect
      }
    }));

    if (isCorrect) {
      addToast({
        type: 'success',
        message: 'Correct! Concept mastered and removed from mistakes list.'
      });
      // Remove from list after brief celebration delay so user sees feedback
      setTimeout(() => {
        onRemoveMistake(mistake.id);
        setRetestState(prev => {
          const next = { ...prev };
          delete next[mistake.id];
          return next;
        });
      }, 1500);
    } else {
      addToast({
        type: 'error',
        message: 'Still incorrect. Review the detailed explanation below.'
      });
    }
  };

  const handleResetRetest = (mistakeId) => {
    setRetestState(prev => ({
      ...prev,
      [mistakeId]: {
        selectedOption: null,
        isSubmitted: false,
        isCorrect: false
      }
    }));
  };

  if (!mistakes || mistakes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-md mx-auto p-12 bg-white rounded-3xl border border-cream-300 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mx-auto mb-4 border border-sage-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-charcoal-800">
            Zero Mistakes!
          </h2>
          <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
            You do not have any questions requiring review. Keep testing yourself through quizzes to identify learning gaps.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold rounded-xl shadow-coral-glow transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Start New Study Session
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cream-300">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-charcoal-800">
              Mistake Review
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-crimson-50 text-crimson-600 border border-crimson-200">
              {mistakes.length} item{mistakes.length > 1 ? 's' : ''} to master
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Retest missed questions. Answering correctly automatically clears them from your review bank.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClearModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-500 hover:text-crimson-600 hover:bg-crimson-50 rounded-xl border border-cream-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Mistake Items List */}
      <div className="mt-8 space-y-6">
        {mistakes.map((mistake, index) => {
          const testState = retestState[mistake.id] || {};
          const isSubmitted = testState.isSubmitted;
          const isCorrect = testState.isCorrect;

          return (
            <div
              key={mistake.id}
              className={`p-6 sm:p-8 rounded-3xl bg-white border transition-all duration-300 shadow-soft ${
                isSubmitted && isCorrect
                  ? 'border-sage-400 bg-sage-50/50 scale-[0.99] opacity-90'
                  : 'border-cream-300 hover:border-coral-200'
              }`}
            >
              {/* Card Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-cream-200">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-coral-50 text-coral-600 border border-coral-200">
                    Mistake #{index + 1}
                  </span>
                  <span className="text-xs text-charcoal-500 font-medium">
                    {mistake.sessionTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="capitalize text-[11px] font-semibold text-lavender-700 bg-lavender-50 px-2 py-0.5 rounded-md border border-lavender-200">
                    {mistake.difficulty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveMistake(mistake.id)}
                    className="p-1 text-charcoal-400 hover:text-crimson-600 rounded transition-colors"
                    title="Dismiss without retesting"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-4">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal-800 leading-snug">
                  {mistake.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mt-2">
                {mistake.options.map((opt, optIdx) => {
                  const isSelected = testState.selectedOption === optIdx;
                  const isTargetCorrect = optIdx === mistake.correctAnswer;

                  let optClass = 'border-cream-300 bg-white hover:bg-cream-50 hover:border-coral-200 text-charcoal-800';

                  if (isSelected && !isSubmitted) {
                    optClass = 'border-coral-500 bg-coral-50/40 text-charcoal-900 ring-1 ring-coral-400';
                  }

                  if (isSubmitted) {
                    if (isTargetCorrect) {
                      optClass = 'border-sage-500 bg-sage-50 text-sage-900 ring-1 ring-sage-400';
                    } else if (isSelected && !isTargetCorrect) {
                      optClass = 'border-crimson-500 bg-crimson-50 text-crimson-900 ring-1 ring-crimson-300';
                    } else {
                      optClass = 'opacity-40 border-cream-200 bg-cream-50 text-charcoal-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(mistake.id, optIdx)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-all ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-cream-100 border border-cream-300 flex items-center justify-center text-xs font-bold text-charcoal-600">
                          {OPTION_LABELS[optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && (
                        <div>
                          {isTargetCorrect && <Check className="w-4 h-4 text-sage-600" />}
                          {isSelected && !isTargetCorrect && <X className="w-4 h-4 text-crimson-600" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Retest Result Feedback */}
              {isSubmitted && (
                <div className={`mt-4 p-4 rounded-xl border animate-fade-in ${
                  isCorrect ? 'bg-sage-50 border-sage-200 text-sage-800' : 'bg-crimson-50/70 border-crimson-200 text-crimson-800'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-crimson-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <span className="font-semibold block">
                        {isCorrect ? 'Mastered! Removing from mistake list...' : 'Incorrect.'}
                      </span>
                      <p className="mt-1 text-charcoal-700 leading-relaxed font-normal">
                        {mistake.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-cream-200 flex items-center justify-between">
                <span className="text-xs text-charcoal-400">
                  {!isSubmitted ? 'Select an answer to re-test your memory' : isCorrect ? 'Great recovery!' : 'Review explanation and retry'}
                </span>

                <div className="flex items-center gap-2">
                  {isSubmitted && !isCorrect && (
                    <button
                      type="button"
                      onClick={() => handleResetRetest(mistake.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg border border-cream-300 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  )}

                  {!isSubmitted && (
                    <button
                      type="button"
                      disabled={testState.selectedOption === undefined}
                      onClick={() => handleCheckAnswer(mistake)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all ${
                        testState.selectedOption !== undefined
                          ? 'bg-coral-500 hover:bg-coral-600 shadow-coral-glow active:scale-95'
                          : 'bg-charcoal-300 cursor-not-allowed'
                      }`}
                    >
                      Verify Answer
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear All Mistakes?"
        message="Are you sure you want to clear all questions from your mistake review list? This cannot be undone."
        confirmText="Clear All"
        isDestructive={true}
        onConfirm={() => {
          onClearAllMistakes();
          setShowClearModal(false);
          addToast({ type: 'info', message: 'All mistakes cleared.' });
        }}
        onCancel={() => setShowClearModal(false)}
      />

    </div>
  );
}
