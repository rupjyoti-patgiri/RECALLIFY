import React, { useState } from 'react';
import { Check, X, ArrowRight, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  isLastQuestion
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!question) return null;

  const handleSelectOption = (index) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === question.correctAnswer;
    onAnswer(question.id, isCorrect, selectedOption);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    onNext();
  };

  const isCorrect = isSubmitted && selectedOption === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-soft-lg animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cream-200">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-cream-300 text-xs font-semibold uppercase tracking-wider text-charcoal-600">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="capitalize text-xs font-medium text-lavender-600 bg-lavender-50 px-2.5 py-1 rounded-lg">
          Difficulty: {question.difficulty || 'Medium'}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="py-6">
        <h2 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-800 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isTargetCorrect = idx === question.correctAnswer;

          let optionStyle = 'border-cream-300 bg-white text-charcoal-800 hover:border-coral-300 hover:bg-cream-50/50';
          let badgeStyle = 'bg-cream-100 text-charcoal-600 border-cream-300';

          if (isSelected && !isSubmitted) {
            optionStyle = 'border-coral-500 bg-coral-50/40 text-charcoal-900 shadow-sm';
            badgeStyle = 'bg-coral-500 text-white border-coral-500';
          }

          if (isSubmitted) {
            if (isTargetCorrect) {
              optionStyle = 'border-sage-500 bg-sage-50 text-sage-900 shadow-sm ring-1 ring-sage-400';
              badgeStyle = 'bg-sage-600 text-white border-sage-600';
            } else if (isSelected && !isTargetCorrect) {
              optionStyle = 'border-crimson-500 bg-crimson-50 text-crimson-900 ring-1 ring-crimson-300';
              badgeStyle = 'bg-crimson-600 text-white border-crimson-600';
            } else {
              optionStyle = 'opacity-50 border-cream-200 bg-cream-50/40 text-charcoal-500';
              badgeStyle = 'bg-cream-200 text-charcoal-400 border-cream-200';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelectOption(idx)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${optionStyle}`}
            >
              <div className="flex items-center gap-3.5 flex-1 pr-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors flex-shrink-0 ${badgeStyle}`}>
                  {OPTION_LABELS[idx] || idx + 1}
                </span>
                <span className="text-sm sm:text-base font-normal leading-relaxed">
                  {option}
                </span>
              </div>

              {isSubmitted && (
                <div className="flex-shrink-0">
                  {isTargetCorrect && <CheckCircle2 className="w-5 h-5 text-sage-600" />}
                  {isSelected && !isTargetCorrect && <X className="w-5 h-5 text-crimson-600" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {isSubmitted && (
        <div className={`mt-6 p-4 rounded-2xl border animate-fade-in ${
          isCorrect ? 'bg-sage-50 border-sage-200' : 'bg-crimson-50/70 border-crimson-200'
        }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-crimson-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <span className={`font-semibold block mb-1 ${isCorrect ? 'text-sage-800' : 'text-crimson-800'}`}>
                {isCorrect ? 'Well done! Correct answer.' : 'Not quite. Here is the breakdown:'}
              </span>
              <p className="text-charcoal-700 leading-relaxed font-normal">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-cream-200 flex items-center justify-between">
        <span className="text-xs text-charcoal-400">
          {!isSubmitted ? 'Select an option to submit' : isCorrect ? 'Great recall!' : 'Review the explanation above'}
        </span>

        {!isSubmitted ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${
              selectedOption !== null
                ? 'bg-coral-500 hover:bg-coral-600 text-white shadow-coral-glow active:scale-95'
                : 'bg-cream-200 text-charcoal-400 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal-800 hover:bg-charcoal-900 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <span>{isLastQuestion ? 'Complete Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
