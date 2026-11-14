import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Layers, 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp,
  Award
} from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import ConfirmModal from '../components/ConfirmModal';

export default function Progress({
  stats,
  activityLog = [],
  savedSessions = [],
  mistakes = [],
  onResetProgress,
  addToast
}) {
  const [showResetModal, setShowResetModal] = useState(false);

  const totalSessions = savedSessions.length;
  const totalCardsReviewed = stats?.totalCardsReviewed || 0;
  const totalQuestionsAnswered = stats?.totalQuestionsAnswered || 0;
  const totalQuestionsCorrect = stats?.totalQuestionsCorrect || 0;
  const questionsRequiringRevision = mistakes.length;

  const accuracy = totalQuestionsAnswered > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
    : 0;

  const handleConfirmReset = () => {
    onResetProgress();
    setShowResetModal(false);
    addToast({
      type: 'info',
      message: 'Learning progress and activity history have been reset.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
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
          <h1 className="font-serif text-3xl font-bold text-charcoal-800">
            Learning Progress & Analytics
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Track your active recall consistency, quiz accuracy, and mastery over time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-500 hover:text-crimson-600 hover:bg-crimson-50 rounded-xl border border-cream-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset History</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <ProgressCard
          title="Total Study Sessions"
          value={totalSessions}
          subtitle="Saved learning units"
          icon={Layers}
          variant="coral"
        />

        <ProgressCard
          title="Flashcards Reviewed"
          value={totalCardsReviewed}
          subtitle="Active recall repetitions"
          icon={Award}
          variant="lavender"
        />

        <ProgressCard
          title="Quiz Accuracy"
          value={`${accuracy}%`}
          subtitle={`${totalQuestionsCorrect} / ${totalQuestionsAnswered} correct`}
          icon={TrendingUp}
          variant="sage"
        />

        <ProgressCard
          title="Requiring Revision"
          value={questionsRequiringRevision}
          subtitle="Active mistakes in review bank"
          icon={AlertCircle}
          variant="crimson"
        />
      </div>

      {/* Accuracy & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Visual Ratio Card */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white rounded-3xl border border-cream-300 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold text-charcoal-800">
              Knowledge Retention Ratio
            </h3>
            <span className="text-xs font-semibold text-charcoal-500 uppercase">
              Quiz Accuracy
            </span>
          </div>

          <p className="text-xs text-charcoal-600 mb-6 leading-relaxed">
            Direct comparison between correctly verified recall answers and questions flagged for further revision.
          </p>

          {/* Clean Segmented Bar Chart */}
          <div className="w-full bg-cream-200 h-6 rounded-xl overflow-hidden flex shadow-inner">
            <div
              className="bg-sage-600 transition-all duration-700 flex items-center justify-center text-[11px] font-bold text-white px-2"
              style={{ width: `${totalQuestionsAnswered > 0 ? (totalQuestionsCorrect / totalQuestionsAnswered) * 100 : 50}%` }}
              title={`Correct: ${totalQuestionsCorrect}`}
            >
              {totalQuestionsCorrect > 0 ? `${Math.round((totalQuestionsCorrect / Math.max(1, totalQuestionsAnswered)) * 100)}% Correct` : ''}
            </div>
            <div
              className="bg-crimson-500 transition-all duration-700 flex items-center justify-center text-[11px] font-bold text-white px-2"
              style={{ width: `${totalQuestionsAnswered > 0 ? ((totalQuestionsAnswered - totalQuestionsCorrect) / totalQuestionsAnswered) * 100 : 50}%` }}
              title={`Need revision: ${totalQuestionsAnswered - totalQuestionsCorrect}`}
            >
              {totalQuestionsAnswered - totalQuestionsCorrect > 0 ? `${Math.round(((totalQuestionsAnswered - totalQuestionsCorrect) / Math.max(1, totalQuestionsAnswered)) * 100)}% Missed` : ''}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs font-medium text-charcoal-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sage-600 inline-block"></span>
              <span>Correct Answers ({totalQuestionsCorrect})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-crimson-500 inline-block"></span>
              <span>Incorrect / In Review ({totalQuestionsAnswered - totalQuestionsCorrect})</span>
            </div>
          </div>
        </div>

        {/* Quick Review Prompt Card */}
        <div className="p-6 sm:p-8 bg-cream-50 rounded-3xl border border-cream-300 shadow-soft flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-cream-300 text-xs font-semibold text-charcoal-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>Retention Recommendation</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-charcoal-800">
              {questionsRequiringRevision > 0
                ? `${questionsRequiringRevision} concept${questionsRequiringRevision > 1 ? 's' : ''} need retesting.`
                : 'All concepts mastered!'}
            </h4>
            <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
              {questionsRequiringRevision > 0
                ? 'Revisiting mistakes within 24 hours reinforces synaptic connections and prevents memory decay.'
                : 'Great job maintaining zero mistakes. Test yourself on new topics or review flashcards.'}
            </p>
          </div>

          <div className="mt-6">
            {questionsRequiringRevision > 0 ? (
              <Link
                to="/mistakes"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold rounded-xl shadow-coral-glow transition-all active:scale-95"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Review Mistakes Now</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-charcoal-800 hover:bg-charcoal-900 text-white text-xs font-semibold rounded-xl shadow-soft transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New Unit</span>
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Recent Learning Activity Log */}
      <div className="mt-8 p-6 sm:p-8 bg-white rounded-3xl border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-charcoal-500" />
            <h3 className="font-serif text-xl font-bold text-charcoal-800">
              Recent Learning Activity
            </h3>
          </div>
          <span className="text-xs text-charcoal-400">
            Last {activityLog.length} events
          </span>
        </div>

        {activityLog.length === 0 ? (
          <div className="py-8 text-center text-charcoal-500 text-sm">
            No study activity logged yet. Complete flashcards or a quiz to see your timeline.
          </div>
        ) : (
          <div className="divide-y divide-cream-100 mt-2">
            {activityLog.slice(0, 10).map((act, index) => (
              <div key={index} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cream-100 border border-cream-300 flex items-center justify-center text-charcoal-600 flex-shrink-0">
                    {act.type === 'quiz_completed' ? (
                      <CheckSquare className="w-4 h-4 text-coral-500" />
                    ) : act.type === 'flashcards_reviewed' ? (
                      <Layers className="w-4 h-4 text-lavender-600" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-sage-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-800">
                      {act.title || 'Study Session'}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {act.description || (
                        act.type === 'quiz_completed' 
                          ? `Completed quiz: ${act.correct}/${act.total} correct`
                          : act.type === 'flashcards_reviewed'
                          ? `Reviewed ${act.count || 'deck of'} flashcards`
                          : 'Generated study material'
                      )}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-charcoal-400 font-mono whitespace-nowrap">
                  {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Progress & History?"
        message="This will reset all study statistics, accuracy numbers, and the recent activity log. Saved study units will not be deleted."
        confirmText="Reset Progress"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

    </div>
  );
}
