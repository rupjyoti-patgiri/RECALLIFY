import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import MistakeReview from './pages/MistakeReview';
import Progress from './pages/Progress';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MOCK_TOPICS } from './utils/mockData';
import { BookOpen, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  // Persisted study state
  const [savedSessions, setSavedSessions] = useLocalStorage('recallify_saved_sessions', () => {
    // Seed with initial curated DBMS session so user has instant interactive data
    const initialSession = {
      ...MOCK_TOPICS.dbms,
      id: 'session-seed-dbms',
      createdAt: new Date().toISOString()
    };
    return [initialSession];
  });

  const [activeSession, setActiveSession] = useLocalStorage('recallify_active_session', () => {
    return savedSessions?.[0] || {
      ...MOCK_TOPICS.dbms,
      id: 'session-seed-dbms',
      createdAt: new Date().toISOString()
    };
  });

  const [mistakes, setMistakes] = useLocalStorage('recallify_mistakes', []);

  const [stats, setStats] = useLocalStorage('recallify_stats', {
    totalCardsReviewed: 0,
    totalQuestionsAnswered: 0,
    totalQuestionsCorrect: 0
  });

  const [activityLog, setActivityLog] = useLocalStorage('recallify_activity_log', () => [
    {
      type: 'created_session',
      title: 'Database Management Systems (DBMS)',
      description: 'Initialized curated study unit with 5 flashcards and 4 quiz items.',
      timestamp: new Date().toISOString()
    }
  ]);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const addToast = (toastObj) => {
    setToast(toastObj);
  };

  // Helper to append to activity log
  const recordActivity = (item) => {
    setActivityLog(prev => [item, ...(prev || [])].slice(0, 30));
  };

  // Handlers for study actions
  const handleRecordReview = (count) => {
    setStats(prev => ({
      ...prev,
      totalCardsReviewed: (prev.totalCardsReviewed || 0) + count
    }));
    recordActivity({
      type: 'flashcards_reviewed',
      title: activeSession?.title || 'Flashcards Deck',
      count,
      timestamp: new Date().toISOString()
    });
  };

  const handleUpdateFlashcardRating = (cardId, rating) => {
    if (!activeSession) return;
    const updatedCards = (activeSession.flashcards || []).map(c => 
      c.id === cardId ? { ...c, userRating: rating } : c
    );
    const updatedSession = { ...activeSession, flashcards: updatedCards };
    setActiveSession(updatedSession);
    setSavedSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleRecordQuizCompletion = ({ total, correct, title }) => {
    setStats(prev => ({
      ...prev,
      totalQuestionsAnswered: (prev.totalQuestionsAnswered || 0) + total,
      totalQuestionsCorrect: (prev.totalQuestionsCorrect || 0) + correct
    }));
    recordActivity({
      type: 'quiz_completed',
      title: title || 'Quiz Session',
      total,
      correct,
      timestamp: new Date().toISOString()
    });
  };

  const handleAddMistakes = (newMistakes) => {
    setMistakes(prev => {
      const existingIds = new Set(prev.map(m => m.questionId));
      const filteredNew = newMistakes.filter(m => !existingIds.has(m.questionId));
      return [...filteredNew, ...prev];
    });
  };

  const handleRemoveMistake = (mistakeId) => {
    setMistakes(prev => prev.filter(m => m.id !== mistakeId));
  };

  const handleClearAllMistakes = () => {
    setMistakes([]);
  };

  const handleResetProgress = () => {
    setStats({
      totalCardsReviewed: 0,
      totalQuestionsAnswered: 0,
      totalQuestionsCorrect: 0
    });
    setActivityLog([]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-800 font-sans antialiased selection:bg-coral-100 selection:text-coral-800">
        
        {/* Navigation Bar */}
        <Navbar
          mistakeCount={mistakes.length}
          hasActiveSession={Boolean(activeSession)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  activeSession={activeSession}
                  setActiveSession={setActiveSession}
                  savedSessions={savedSessions}
                  setSavedSessions={setSavedSessions}
                  addToast={addToast}
                  recordActivity={recordActivity}
                />
              }
            />
            <Route
              path="/flashcards"
              element={
                <Flashcards
                  activeSession={activeSession}
                  onUpdateFlashcardRating={handleUpdateFlashcardRating}
                  onRecordReview={handleRecordReview}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/quiz"
              element={
                <Quiz
                  activeSession={activeSession}
                  onRecordQuizCompletion={handleRecordQuizCompletion}
                  onAddMistakes={handleAddMistakes}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/mistakes"
              element={
                <MistakeReview
                  mistakes={mistakes}
                  onRemoveMistake={handleRemoveMistake}
                  onClearAllMistakes={handleClearAllMistakes}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/progress"
              element={
                <Progress
                  stats={stats}
                  activityLog={activityLog}
                  savedSessions={savedSessions}
                  mistakes={mistakes}
                  onResetProgress={handleResetProgress}
                  addToast={addToast}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Toast Notifications */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Editorial Footer */}
        <footer className="mt-auto border-t border-cream-300 bg-white/70 backdrop-blur-sm py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-coral-500 text-white flex items-center justify-center font-bold text-[10px]">
                R
              </div>
              <span className="font-serif font-bold text-sm text-charcoal-800">Recallify</span>
              <span>— AI-Powered Active Recall Study Assistant</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-sage-700 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-600 animate-pulse"></span>
                Structured JSON Validation Active
              </span>
              <span className="text-charcoal-400">
                Pure JavaScript Architecture
              </span>
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
