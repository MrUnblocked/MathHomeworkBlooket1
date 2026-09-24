import React from 'react';
import { Gamepad2, Search, PlusCircle, FileJson, Shield, AlertOctagon } from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  favoritesCount,
  totalGamesCount,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenCloakModal,
  onPanic,
  activeGameTitle,
  onBackToLibrary
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onBackToLibrary}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Gamepad2 className="w-6 h-6 text-slate-950" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white font-mono">
                  SHHH <span className="text-cyan-400">DONT TELL</span> THE TEACHERS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  TOP SECRET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {totalGamesCount} HTML/Iframe Web Games
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          {!activeGameTitle ? (
            <div className="flex-1 max-w-md mx-2 sm:mx-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search unblocked games, tags, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-md mx-4 hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">Playing:</span>
              <span className="text-sm font-bold text-cyan-300 truncate">{activeGameTitle}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Add Custom Game Button */}
            <button
              onClick={onOpenAddModal}
              title="Add a game as an iframe into the JSON catalog"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Game</span>
            </button>

            {/* View JSON Catalog */}
            <button
              onClick={onOpenJsonModal}
              title="Inspect or export games JSON file"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-cyan-500/50 transition shadow-sm"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">games.json</span>
            </button>

            {/* Tab Cloak */}
            <button
              onClick={onOpenCloakModal}
              title="Cloak tab as Google Docs / Classroom"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Cloak</span>
            </button>

            {/* Panic Button */}
            <button
              onClick={onPanic}
              title="Instant Panic: Redirect immediately to Google"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Panic</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
