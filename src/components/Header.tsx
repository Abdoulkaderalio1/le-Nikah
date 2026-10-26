import React from 'react';
import { HeartHandshake, ShieldCheck, UserPlus, Lock } from 'lucide-react';

interface HeaderProps {
  activeView: 'home' | 'howItWorks' | 'charter' | 'gmail' | 'admin';
  setActiveView: (view: 'home' | 'howItWorks' | 'charter' | 'gmail' | 'admin') => void;
  onOpenRegister: () => void;
  pendingCount: number;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenRegister,
  pendingCount,
  pendingRequestsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single clean element) */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-900 text-amber-200 flex items-center justify-center font-serif text-xl font-bold shadow-sm shrink-0">
            ن
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 whitespace-nowrap shrink-0">
            Chemin pour le Nikah
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'home'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : 'hover:text-emerald-900'
            }`}
          >
            Profils vérifiés
          </button>
          <button
            onClick={() => setActiveView('howItWorks')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'howItWorks'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : 'hover:text-emerald-900'
            }`}
          >
            Comment ça marche
          </button>
          <button
            onClick={() => setActiveView('charter')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'charter'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : 'hover:text-emerald-900'
            }`}
          >
            Charte & Éthique
          </button>
          <button
            onClick={() => setActiveView('gmail')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'gmail'
                ? 'text-red-700 font-semibold border-b-2 border-red-700'
                : 'hover:text-red-700'
            }`}
          >
            <span>Gmail</span>
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : 'hover:text-emerald-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>Espace Admin</span>
            {(pendingCount > 0 || pendingRequestsCount > 0) && (
              <span className="bg-amber-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {pendingCount + pendingRequestsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Déposer mon profil</span>
          </button>
        </div>
      </div>
    </header>
  );
};
