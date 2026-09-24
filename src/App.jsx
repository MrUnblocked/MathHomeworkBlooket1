import React, { useState, useEffect, useMemo } from 'react';
import {
  Gamepad2,
  Sparkles,
  Heart,
  FileJson,
  PlusCircle,
  SlidersHorizontal,
  Compass,
  History,
  Code2
} from 'lucide-react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonCatalogModal } from './components/JsonCatalogModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { applyCloak, triggerPanic } from './utils/cloak.js';

export default function App() {
  // Games Catalog State
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_games_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep only Minecraft and any custom user-added games
          const valid = parsed.filter(g => g.id === 'minecraft' || g.isCustom);
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
    }
    return DEFAULT_GAMES;
  });

  // Active playing game
  const [activeGame, setActiveGame] = useState(null);

  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Favorites & History
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_games_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(id => id === 'minecraft' || id.startsWith('custom-'));
      }
      return ['minecraft'];
    } catch {
      return ['minecraft'];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked_recent_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [activeCloakId, setActiveCloakId] = useState(() => {
    return localStorage.getItem('unblocked_cloak_id') || 'default';
  });

  // Try fetching /games.json on initial load and purge any stale deleted /games/* entries
  useEffect(() => {
    try {
      const saved = localStorage.getItem('unblocked_games_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it contains stale /games/ paths from deleted games, reset to DEFAULT_GAMES
        const hasStale = Array.isArray(parsed) && parsed.some(g => g.iframeSrc && g.iframeSrc.startsWith('/games/'));
        if (hasStale) {
          localStorage.setItem('unblocked_games_catalog', JSON.stringify(DEFAULT_GAMES));
          setGames(DEFAULT_GAMES);
        }
      }
      const recents = localStorage.getItem('unblocked_recent_games');
      if (recents) {
        const parsedRecents = JSON.parse(recents);
        const cleaned = Array.isArray(parsedRecents) ? parsedRecents.filter(id => id === 'minecraft') : [];
        localStorage.setItem('unblocked_recent_games', JSON.stringify(cleaned));
        setRecentlyPlayed(cleaned);
      }
    } catch (e) {
      console.error(e);
    }

    const hasCustomEdits = localStorage.getItem('unblocked_games_catalog');
    if (!hasCustomEdits) {
      fetch(`${import.meta.env.BASE_URL}games.json`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Fallback to default');
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setGames(data);
          }
        })
        .catch(() => {
          // Defaults are already set
        });
    }
  }, []);

  // Apply tab cloak on startup
  useEffect(() => {
    applyCloak(activeCloakId);
  }, [activeCloakId]);

  // Global key listener (ESC to leave player, ] for panic)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeGame) {
        setActiveGame(null);
      }
      if (e.key === ']') {
        triggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame]);

  // Persist games catalog changes
  const updateGamesCatalog = (updated) => {
    setGames(updated);
    try {
      localStorage.setItem('unblocked_games_catalog', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist games', e);
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('unblocked_games_catalog');
    setGames(DEFAULT_GAMES);
    setIsJsonModalOpen(false);
  };

  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    updateGamesCatalog(updated);
    handleSelectGame(newGame);
  };

  const handleToggleFavorite = (gameId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      try {
        localStorage.setItem('unblocked_games_favorites', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const handleSelectGame = (game) => {
    setActiveGame(game);
    // Increment play count
    const updated = games.map(g => g.id === game.id ? { ...g, plays: g.plays + 1 } : g);
    updateGamesCatalog(updated);

    // Update recently played
    setRecentlyPlayed(prev => {
      const next = [game.id, ...prev.filter(id => id !== game.id)].slice(0, 6);
      try {
        localStorage.setItem('unblocked_recent_games', JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCloak = (id) => {
    setActiveCloakId(id);
    localStorage.setItem('unblocked_cloak_id', id);
    applyCloak(id);
  };

  // Filtered & Sorted list of games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Category filter
    if (selectedCategory === 'Favorites') {
      result = result.filter(g => favorites.includes(g.id));
    } else if (selectedCategory === 'Custom') {
      result = result.filter(g => g.isCustom);
    } else if (selectedCategory !== 'All') {
      result = result.filter(g => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query) ||
        g.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => b.plays - a.plays);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [games, selectedCategory, searchQuery, sortBy, favorites]);

  // Featured game for spotlight
  const featuredGame = useMemo(() => {
    return games.find(g => g.id === 'minecraft') || games[0];
  }, [games]);

  // Recently played game items
  const recentGameObjects = useMemo(() => {
    return recentlyPlayed
      .map(id => games.find(g => g.id === id))
      .filter(Boolean);
  }, [recentlyPlayed, games]);

  const categories = useMemo(() => {
    const set = new Set(games.map(g => g.category));
    return ['All', ...Array.from(set), 'Favorites', 'Custom'];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        favoritesCount={favorites.length}
        totalGamesCount={games.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onPanic={triggerPanic}
        activeGameTitle={activeGame?.title}
        onBackToLibrary={() => setActiveGame(null)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If a game is active: Render the Game Player view */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          /* Otherwise: Render the Games Library */
          <div className="space-y-8">
            
            {/* Hero / Spotlight Banner */}
            {!searchQuery && selectedCategory === 'All' && featuredGame && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
                
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ZERO-BLOCK PROXY ARCHITECTURE • STORED IN JSON</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-mono">
                    SHHH DONT TELL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">THE TEACHERS</span>
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    Play Minecraft unblocked directly in a seamless iframe container with stealth tab cloaking and panic switch. Stored cleanly in our <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded text-xs border border-slate-700">games.json</code> catalogue.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
                    >
                      <Gamepad2 className="w-4 h-4 text-slate-950" />
                      <span>Play Featured: {featuredGame.title}</span>
                    </button>

                    <button
                      onClick={() => setIsJsonModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 transition"
                    >
                      <FileJson className="w-4 h-4 text-amber-400" />
                      <span>Inspect games.json</span>
                    </button>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 transition"
                    >
                      <PlusCircle className="w-4 h-4 text-cyan-400" />
                      <span>Add Iframe Game</span>
                    </button>
                  </div>
                </div>

                {/* Decorative Stats badge */}
                <div className="hidden lg:flex absolute right-8 bottom-8 items-center gap-4 bg-slate-950/70 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                  <div className="text-center px-2">
                    <div className="text-2xl font-black text-cyan-400 font-mono">{games.length}</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Iframe Games</div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <div className="text-2xl font-black text-amber-400 font-mono">100%</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Unblocked</div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <div className="text-2xl font-black text-emerald-400 font-mono">0</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">AI Features</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recently Played Bar */}
            {recentGameObjects.length > 0 && !searchQuery && selectedCategory === 'All' && (
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Recently Played</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {recentGameObjects.map(g => (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGame(g)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left shrink-0 transition"
                    >
                      <span className="text-base">🎮</span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 truncate max-w-[130px]">{g.title}</div>
                        <div className="text-[10px] text-slate-400">{g.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Navigation & Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
              
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  let count = 0;
                  if (cat === 'All') count = games.length;
                  else if (cat === 'Favorites') count = favorites.length;
                  else if (cat === 'Custom') count = games.filter(g => g.isCustom).length;
                  else count = games.filter(g => g.category.toLowerCase() === cat.toLowerCase()).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {cat === 'Favorites' && <Heart className={`w-3 h-3 ${isSelected ? 'fill-slate-950' : 'text-rose-400'}`} />}
                      {cat === 'Custom' && <Code2 className="w-3 h-3 text-purple-400" />}
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 text-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="alphabetical">Title A-Z</option>
                </select>
              </div>

            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-slate-900/30 rounded-3xl border border-slate-800/80 p-6">
                <Compass className="w-12 h-12 text-slate-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Games Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  We couldn't find any game matching "{searchQuery}". Try searching for another genre or add your own custom game as an iframe!
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
                  >
                    Add Custom Game
                  </button>
                </div>
              </div>
            )}

            {/* Educational Info Footer on JSON Storage */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">
                    100% JSON-Driven Iframe Architecture
                  </h4>
                  <p className="mt-0.5 leading-relaxed text-slate-400">
                    Each game in this portal is defined in <code className="text-cyan-400">games.json</code> with its own self-contained iframe embed string (<code className="text-amber-300">iframeCode</code>). No external AI tools or trackers are used.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold shrink-0 transition"
              >
                View games.json Source
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-slate-300">SHHH DONT TELL THE TEACHERS</span>
            <span>•</span>
            <span>Unblocked Iframe Portal</span>
            <span>•</span>
            <span className="text-emerald-400">No AI Features</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Panic key: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">]</kbd></span>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">ESC</kbd> to exit game</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonCatalogModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onUpdateGames={updateGamesCatalog}
        onResetDefaults={handleResetDefaults}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloakId={activeCloakId}
        onSelectCloak={handleSelectCloak}
      />

    </div>
  );
}
