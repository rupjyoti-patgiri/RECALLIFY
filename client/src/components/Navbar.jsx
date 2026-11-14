import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, Layers, CheckSquare, AlertCircle, BarChart3, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ mistakeCount = 0, hasActiveSession = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Workspace', path: '/', icon: BookOpen },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Quiz', path: '/quiz', icon: CheckSquare },
    { 
      name: 'Mistakes', 
      path: '/mistakes', 
      icon: AlertCircle,
      badge: mistakeCount > 0 ? mistakeCount : null,
      badgeColor: 'bg-coral-500 text-white'
    },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shadow-coral-glow transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4.5L4 21V5a2 2 0 0 1 2-2z" />
                <circle cx="12" cy="9" r="1.5" className="fill-cream-100" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-800">
                  Recallify
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-lavender-100 text-lavender-700">
                  AI Study
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-charcoal-500 tracking-tight -mt-1 font-medium">
                Active Recall & Knowledge Engine
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-coral-600 shadow-soft font-semibold border border-cream-300'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Right Action: New Session button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal-700 bg-white hover:bg-cream-50 border border-cream-300 rounded-xl shadow-soft-sm transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>New Session</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:bg-cream-200 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-300 bg-cream-100/98 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-soft-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-white text-coral-600 shadow-soft font-semibold border border-cream-300'
                      : 'text-charcoal-700 hover:bg-cream-200/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-charcoal-500" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
