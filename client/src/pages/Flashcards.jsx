import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Shuffle, 
  CheckSquare, 
  BookOpen, 
  RotateCcw, 
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import Flashcard from '../components/Flashcard';
import EmptyState from '../components/EmptyState';

export default function Flashcards({
  activeSession,
  onUpdateFlashcardRating,
  onRecordReview,
  addToast
}) {
  const navigate = useNavigate();

  const rawCards = activeSession?.flashcards || [];
  const [cards, setCards] = useState(rawCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [cardRatings, setCardRatings] = useState({});

  // Sync when activeSession changes
  useEffect(() => {
    if (activeSession?.flashcards) {
      setCards(activeSession.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      // Preload any existing ratings
      const initialRatings = {};
      activeSession.flashcards.forEach(c => {
        if (c.userRating) initialRatings[c.id] = c.userRating;
      });
      setCardRatings(initialRatings);
    }
  }, [activeSession]);

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      if (onRecordReview) {
        onRecordReview(cards.length);
      }
    }
  }, [currentIndex, cards.length, onRecordReview]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setSessionCompleted(false);
    addToast({
      type: 'info',
      message: 'Flashcards shuffled randomly.'
    });
  };

  const handleRate = (cardId, rating) => {
    setCardRatings(prev => ({
      ...prev,
      [cardId]: rating
    }));
    if (onUpdateFlashcardRating) {
      onUpdateFlashcardRating(cardId, rating);
    }
    addToast({
      type: 'info',
      message: `Card marked as ${rating.toUpperCase()}.`
    });
    // Auto advance to next after rating
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1' && currentCard) {
        handleRate(currentCard.id, 'hard');
      } else if (e.key === '2' && currentCard) {
        handleRate(currentCard.id, 'medium');
      } else if (e.key === '3' && currentCard) {
        handleRate(currentCard.id, 'easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard]);

  // If no active session or no flashcards
  if (!activeSession || cards.length === 0) {
    return (
      <div className="py-16 px-4">
        <EmptyState
          title="No Flashcards Selected"
          description="Generate study material with flashcards or select a previous study session from the workspace."
          actionLabel="Go to Workspace"
          actionTo="/"
        />
      </div>
    );
  }

  // Calculate rating stats for completion screen
  const ratingsList = Object.values(cardRatings);
  const easyCount = ratingsList.filter(r => r === 'easy').length;
  const mediumCount = ratingsList.filter(r => r === 'medium').length;
  const hardCount = ratingsList.filter(r => r === 'hard').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cream-300">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-800">
            {activeSession.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-cream-100 rounded-xl border border-cream-300 transition-colors shadow-soft-sm active:scale-95"
            title="Shuffle cards order"
          >
            <Shuffle className="w-3.5 h-3.5 text-lavender-600" />
            <span>Shuffle</span>
          </button>

          {activeSession.quiz && activeSession.quiz.length > 0 && (
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-coral-600 bg-coral-50 hover:bg-coral-100 rounded-xl border border-coral-200 transition-colors shadow-soft-sm active:scale-95"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Take Quiz ({activeSession.quiz.length})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="my-6">
        <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
          <span className="font-medium">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="font-mono">
            {Math.round(((currentIndex + 1) / cards.length) * 100)}% Completed
          </span>
        </div>
        <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-coral-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard or Session Completion View */}
      {!sessionCompleted ? (
        <div className="my-8">
          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onRate={handleRate}
            currentRating={cardRatings[currentCard.id]}
            index={currentIndex}
            total={cards.length}
          />

          {/* Navigation Controls */}
          <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                currentIndex === 0
                  ? 'border-cream-200 text-charcoal-300 cursor-not-allowed bg-cream-50'
                  : 'border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 shadow-soft-sm active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleFlip}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-charcoal-700 bg-cream-200/80 hover:bg-cream-300 border border-cream-300 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card [Space]</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-charcoal-800 hover:bg-charcoal-900 text-white shadow-soft transition-all active:scale-95"
            >
              <span>{currentIndex === cards.length - 1 ? 'Finish Deck' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard Navigation Shortcuts Hint */}
          <div className="max-w-2xl mx-auto mt-8 pt-4 border-t border-cream-200 flex flex-wrap items-center justify-center gap-4 text-[11px] text-charcoal-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-cream-300 rounded shadow-xs font-mono">Space</kbd> Flip
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-cream-300 rounded shadow-xs font-mono">← / →</kbd> Prev / Next
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-cream-300 rounded shadow-xs font-mono">1 / 2 / 3</kbd> Hard / Medium / Easy
            </span>
          </div>
        </div>
      ) : (
        /* Completion Summary Screen */
        <div className="max-w-xl mx-auto my-10 p-8 sm:p-10 bg-white rounded-3xl border border-cream-300 shadow-soft-lg text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mx-auto mb-4 border border-sage-200 shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-charcoal-800">
            Session Completed!
          </h2>
          <p className="mt-2 text-sm text-charcoal-600">
            You reviewed all {cards.length} flashcards in <span className="font-semibold text-charcoal-800">{activeSession.title}</span>.
          </p>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-3 my-6 pt-4 border-t border-cream-200">
            <div className="p-3 rounded-2xl bg-sage-50 border border-sage-100">
              <span className="block text-2xl font-bold text-sage-700 font-serif">{easyCount}</span>
              <span className="text-[11px] font-semibold text-sage-600 uppercase">Easy</span>
            </div>
            <div className="p-3 rounded-2xl bg-lavender-50 border border-lavender-100">
              <span className="block text-2xl font-bold text-lavender-700 font-serif">{mediumCount}</span>
              <span className="text-[11px] font-semibold text-lavender-600 uppercase">Medium</span>
            </div>
            <div className="p-3 rounded-2xl bg-crimson-50 border border-crimson-100">
              <span className="block text-2xl font-bold text-crimson-700 font-serif">{hardCount}</span>
              <span className="text-[11px] font-semibold text-crimson-600 uppercase">Difficult</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-cream-300 bg-white hover:bg-cream-100 text-charcoal-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </button>

            {activeSession.quiz && activeSession.quiz.length > 0 && (
              <button
                type="button"
                onClick={() => navigate('/quiz')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-coral-500 hover:bg-coral-600 text-white shadow-coral-glow transition-all active:scale-95"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Test Yourself (Quiz)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-700 transition-colors"
            >
              <span>Workspace</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
