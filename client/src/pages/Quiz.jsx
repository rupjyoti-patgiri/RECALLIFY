import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  Sparkles,
  Trophy,
  ArrowRight
} from 'lucide-react';
import QuizQuestion from '../components/QuizQuestion';
import EmptyState from '../components/EmptyState';

export default function Quiz({
  activeSession,
  onRecordQuizCompletion,
  onAddMistakes,
  addToast
}) {
  const navigate = useNavigate();

  const questions = activeSession?.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: { isCorrect, selectedOption } }
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset when activeSession changes
  useEffect(() => {
    if (activeSession?.quiz) {
      setCurrentIndex(0);
      setAnswers({});
      setIsCompleted(false);
    }
  }, [activeSession]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (questionId, isCorrect, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { isCorrect, selectedOption }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);

    // Compute stats
    const totalQ = questions.length;
    let correctCount = 0;
    const mistakesList = [];

    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.isCorrect) {
        correctCount++;
      } else {
        // Collect mistakes
        mistakesList.push({
          id: `mistake-${q.id}`,
          questionId: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          sessionTitle: activeSession?.title || 'General Quiz',
          difficulty: q.difficulty || 'medium',
          dateAdded: new Date().toISOString()
        });
      }
    });

    const scorePercent = Math.round((correctCount / totalQ) * 100);

    // Trigger confetti on good performance
    if (scorePercent >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully if confetti fails
      }
    }

    // Save mistakes
    if (mistakesList.length > 0 && onAddMistakes) {
      onAddMistakes(mistakesList);
    }

    // Record progress stats
    if (onRecordQuizCompletion) {
      onRecordQuizCompletion({
        total: totalQ,
        correct: correctCount,
        title: activeSession?.title
      });
    }

    addToast({
      type: scorePercent >= 70 ? 'success' : 'info',
      message: `Quiz completed: ${scorePercent}% score.`
    });
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // If no quiz questions
  if (!activeSession || questions.length === 0) {
    return (
      <div className="py-16 px-4">
        <EmptyState
          title="No Quiz Available"
          description="Generate study material with Quiz mode enabled or select an existing study session with quiz items."
          actionLabel="Go to Workspace"
          actionTo="/"
        />
      </div>
    );
  }

  // Calculate final score
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const wrongCount = questions.length - correctCount;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Bar */}
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

        {activeSession.flashcards && activeSession.flashcards.length > 0 && (
          <Link
            to="/flashcards"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-cream-100 rounded-xl border border-cream-300 transition-colors shadow-soft-sm active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-coral-500" />
            <span>Study Flashcards ({activeSession.flashcards.length})</span>
          </Link>
        )}
      </div>

      {/* Progress Indicator */}
      {!isCompleted && (
        <div className="my-6">
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <span className="font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-mono">
              Score: {correctCount} / {Object.keys(answers).length} answered
            </span>
          </div>
          <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-coral-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Question or Results Screen */}
      {!isCompleted ? (
        <div className="my-8">
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLastQuestion={currentIndex === questions.length - 1}
          />
        </div>
      ) : (
        /* Results View */
        <div className="max-w-xl mx-auto my-10 p-8 sm:p-10 bg-white rounded-3xl border border-cream-300 shadow-soft-lg text-center animate-fade-in">
          
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 border shadow-inner ${
            scorePercent >= 80 
              ? 'bg-sage-50 text-sage-600 border-sage-200' 
              : scorePercent >= 50
              ? 'bg-lavender-50 text-lavender-600 border-lavender-200'
              : 'bg-crimson-50 text-crimson-600 border-crimson-200'
          }`}>
            {scorePercent >= 80 ? (
              <Trophy className="w-10 h-10 stroke-[1.5]" />
            ) : scorePercent >= 50 ? (
              <Award className="w-10 h-10 stroke-[1.5]" />
            ) : (
              <AlertCircle className="w-10 h-10 stroke-[1.5]" />
            )}
          </div>

          <h2 className="font-serif text-3xl font-bold text-charcoal-800">
            {scorePercent >= 80 ? 'Outstanding Recall!' : scorePercent >= 50 ? 'Solid Effort!' : 'Needs Revision'}
          </h2>
          
          <p className="mt-2 text-sm text-charcoal-600">
            You completed the quiz on <span className="font-semibold text-charcoal-800">{activeSession.title}</span>.
          </p>

          {/* Score Badge */}
          <div className="my-6 p-6 rounded-2xl bg-cream-50 border border-cream-300">
            <div className="font-serif text-5xl font-extrabold text-charcoal-800 tracking-tight">
              {scorePercent}%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mt-1">
              Final Accuracy Score
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-cream-200 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-sage-700">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                {correctCount} Correct
              </span>
              <span className="flex items-center gap-1.5 text-crimson-700">
                <AlertCircle className="w-4 h-4 text-crimson-600" />
                {wrongCount} Missed
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {wrongCount > 0 && (
              <button
                type="button"
                onClick={() => navigate('/mistakes')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-coral-500 hover:bg-coral-600 text-white shadow-coral-glow transition-all active:scale-95"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Review {wrongCount} Mistake{wrongCount > 1 ? 's' : ''} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-cream-300 bg-white hover:bg-cream-100 text-charcoal-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>

              {activeSession.flashcards && activeSession.flashcards.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/flashcards')}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-700 transition-colors border border-cream-300"
                >
                  <Layers className="w-4 h-4" />
                  <span>Review Cards</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors mt-2"
            >
              ← Return to Workspace
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
