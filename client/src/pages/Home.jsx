import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  CheckSquare, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Trash2, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { generateStudyMaterial } from '../services/studyService';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ConfirmModal from '../components/ConfirmModal';
import { MOCK_TOPICS } from '../utils/mockData';

const EXAMPLE_TOPICS = [
  {
    label: 'Database Systems (DBMS)',
    topic: 'Relational Database Management Systems: ACID properties, transactions, 1NF to 3NF normalization, and B-Tree indexing.',
    key: 'dbms'
  },
  {
    label: 'Operating Systems',
    topic: 'Operating System architecture: Process states, CPU scheduling (SJF, Round Robin), virtual memory paging, and deadlock conditions.',
    key: 'os'
  },
  {
    label: 'JavaScript Deep Dive',
    topic: 'Core JavaScript mechanics: Event loop, microtasks vs macrotasks, lexical closures, prototypal inheritance, and hoisting.',
    key: 'javascript'
  },
  {
    label: 'Computer Networks',
    topic: 'Computer Networks: OSI 7-layer model, TCP 3-way handshake, UDP differences, DNS resolution, and HTTP/3 QUIC protocol.',
    key: 'networks'
  }
];

export default function Home({
  activeSession,
  setActiveSession,
  savedSessions = [],
  setSavedSessions,
  addToast,
  recordActivity
}) {
  const navigate = useNavigate();

  // Form State
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('both'); // 'flashcards' | 'quiz' | 'both'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard'
  const [count, setCount] = useState(5);

  // Status & Error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Modal State for session deletion
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Character counter
  const charLimit = 15000;
  const charCount = content.length;

  const handleApplyExample = (example) => {
    setContent(example.topic);
    setError(null);
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    addToast({
      type: 'info',
      message: 'Generation cancelled by user.'
    });
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setError('Please paste your study notes or type a topic to generate learning materials.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Setup AbortController for cancelability and race condition protection
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await generateStudyMaterial({
        content: content.trim(),
        mode,
        difficulty,
        count: Number(count),
        signal: controller.signal
      });

      if (!response.success) {
        if (!response.isAborted) {
          setError(response.error || 'Failed to generate study materials.');
        }
        setIsLoading(false);
        return;
      }

      const sessionData = {
        ...response.data,
        id: `session-${Date.now()}`,
        difficulty,
        createdAt: new Date().toISOString()
      };

      // Set active session
      setActiveSession(sessionData);

      // Persist into saved sessions
      setSavedSessions(prev => [sessionData, ...prev.filter(s => s.id !== sessionData.id)].slice(0, 20));

      if (recordActivity) {
        recordActivity({
          type: 'created_session',
          title: sessionData.title,
          timestamp: new Date().toISOString(),
          mode
        });
      }

      addToast({
        type: 'success',
        message: response.notice || `Study materials generated: "${sessionData.title}"`
      });

      setIsLoading(false);

      // Navigate to corresponding view
      if (mode === 'quiz') {
        navigate('/quiz');
      } else {
        navigate('/flashcards');
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[Generate error]:', err);
        setError('An unexpected network or application error occurred.');
      }
      setIsLoading(false);
    }
  };

  // Load sample/mock directly if offline or requested
  const handleLoadSample = (sampleKey = 'dbms') => {
    const sample = MOCK_TOPICS[sampleKey] || MOCK_TOPICS.dbms;
    const sessionData = {
      ...JSON.parse(JSON.stringify(sample)),
      id: `session-${Date.now()}`,
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    };
    setActiveSession(sessionData);
    setSavedSessions(prev => [sessionData, ...prev.filter(s => s.id !== sessionData.id)]);
    addToast({
      type: 'success',
      message: `Loaded curated study unit: "${sessionData.title}"`
    });
    navigate('/flashcards');
  };

  // Delete session handler
  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;
    setSavedSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
    if (activeSession?.id === sessionToDelete.id) {
      setActiveSession(null);
    }
    addToast({
      type: 'info',
      message: `Deleted session "${sessionToDelete.title}".`
    });
    setSessionToDelete(null);
  };

  return (
    <div className="py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/80 border border-cream-300 text-xs font-semibold text-charcoal-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          <span>Active Recall & Pedagogical Flashcards</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 tracking-tight leading-tight">
          Turn your notes into <span className="text-coral-500 italic">knowledge.</span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal max-w-2xl mx-auto">
          Paste lecture notes, study outlines, or raw technical concepts. Recallify synthesizes interactive 3D flashcards and multiple-choice quizzes with instant pedagogical feedback.
        </p>
      </section>

      {/* Main Workspace Generator Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
        {isLoading ? (
          <LoadingState onCancel={handleCancelGeneration} topic={content.slice(0, 30) || 'Study Material'} />
        ) : error ? (
          <ErrorState 
            error={error} 
            onRetry={handleGenerate} 
            onLoadSample={() => handleLoadSample('dbms')} 
          />
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-soft-lg transition-all">
            <form onSubmit={handleGenerate}>
              
              {/* Text Input Header */}
              <div className="flex items-center justify-between pb-3">
                <label htmlFor="notes-input" className="block text-sm font-semibold text-charcoal-800">
                  Study Content or Topic
                </label>
                <span className={`text-xs font-mono ${charCount > charLimit ? 'text-crimson-600 font-bold' : 'text-charcoal-400'}`}>
                  {charCount.toLocaleString()} / {charLimit.toLocaleString()} characters
                </span>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  id="notes-input"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste lecture notes, article excerpts, textbook chapters, or simply enter a topic like 'PostgreSQL Transactions and Indexing'..."
                  className="w-full p-4 sm:p-5 rounded-2xl border border-cream-300 bg-cream-50/50 text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent transition-all resize-y text-sm sm:text-base leading-relaxed"
                  disabled={isLoading}
                />
              </div>

              {/* Example Topic Pills */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                  <Flame className="w-3.5 h-3.5 text-coral-500" />
                  <span>Try an Example Topic</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TOPICS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleApplyExample(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-100 hover:bg-cream-200 text-charcoal-700 border border-cream-300 transition-colors active:scale-95 text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration Controls Grid */}
              <div className="mt-8 pt-6 border-t border-cream-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* 1. Learning Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-2">
                    Learning Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-cream-100 rounded-xl border border-cream-300">
                    <button
                      type="button"
                      onClick={() => setMode('flashcards')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'flashcards'
                          ? 'bg-white text-coral-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('quiz')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'quiz'
                          ? 'bg-white text-coral-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('both')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        mode === 'both'
                          ? 'bg-white text-coral-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </div>

                {/* 2. Difficulty Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-cream-100 rounded-xl border border-cream-300">
                    <button
                      type="button"
                      onClick={() => setDifficulty('easy')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        difficulty === 'easy'
                          ? 'bg-white text-sage-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      type="button"
                      onClick={() => setDifficulty('medium')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        difficulty === 'medium'
                          ? 'bg-white text-lavender-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setDifficulty('hard')}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        difficulty === 'hard'
                          ? 'bg-white text-crimson-600 shadow-soft font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                </div>

                {/* 3. Question / Card Count */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-2">
                    Item Count
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full py-2.5 px-3 bg-cream-100 border border-cream-300 rounded-xl text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-coral-400"
                  >
                    <option value={5}>5 Items (Quick Session)</option>
                    <option value={10}>10 Items (Standard)</option>
                    <option value={15}>15 Items (Comprehensive)</option>
                    <option value={20}>20 Items (Mastery Exam)</option>
                  </select>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-charcoal-500 text-center sm:text-left">
                  Powered by Google Gemini • Structured pedagogical JSON validation
                </span>
                
                <button
                  type="submit"
                  disabled={isLoading || !content.trim()}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-coral-glow transition-all ${
                    isLoading || !content.trim()
                      ? 'bg-charcoal-300 cursor-not-allowed shadow-none'
                      : 'bg-coral-500 hover:bg-coral-600 active:scale-95'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Study Material</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}
      </section>

      {/* Recent Study Sessions Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex items-center justify-between pb-4 border-b border-cream-300">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-800">
              Recent Study Sessions
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Saved locally on your browser. Return anytime to re-study.
            </p>
          </div>
          {savedSessions.length > 0 && (
            <span className="text-xs font-semibold text-charcoal-600 bg-cream-200 px-2.5 py-1 rounded-full">
              {savedSessions.length} saved
            </span>
          )}
        </div>

        {savedSessions.length === 0 ? (
          <div className="mt-6 p-8 text-center bg-white/50 rounded-2xl border border-cream-200">
            <BookOpen className="w-8 h-8 text-charcoal-400 mx-auto stroke-[1.5]" />
            <p className="mt-3 text-sm text-charcoal-600">
              No previous sessions saved yet. Generate your first study material above!
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {savedSessions.map((session) => (
              <div
                key={session.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-cream-300 shadow-soft hover:shadow-soft-lg hover:border-coral-200 transition-all gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold text-charcoal-800 truncate">
                      {session.title}
                    </h3>
                    <span className="capitalize text-[11px] font-semibold px-2 py-0.5 rounded-md bg-lavender-50 text-lavender-700 border border-lavender-200">
                      {session.difficulty || 'medium'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-charcoal-600 mt-1 line-clamp-1">
                    {session.summary}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-charcoal-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {session.flashcards?.length || 0} cards
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      {session.quiz?.length || 0} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-100">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSession(session);
                      navigate('/flashcards');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-coral-600 bg-coral-50 hover:bg-coral-100 rounded-xl transition-colors border border-coral-200"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Study Cards
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSession(session);
                      navigate('/quiz');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition-colors border border-cream-300"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Take Quiz
                  </button>

                  <button
                    type="button"
                    onClick={() => setSessionToDelete(session)}
                    className="p-1.5 text-charcoal-400 hover:text-crimson-600 rounded-lg hover:bg-crimson-50 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(sessionToDelete)}
        title="Delete Study Session?"
        message={`Are you sure you want to delete "${sessionToDelete?.title}"? All associated local flashcards and quizzes for this session will be removed.`}
        confirmText="Delete Session"
        isDestructive={true}
        onConfirm={confirmDeleteSession}
        onCancel={() => setSessionToDelete(null)}
      />
    </div>
  );
}
