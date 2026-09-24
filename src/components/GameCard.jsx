import React from 'react';
import { Play, Star, Heart, Flame } from 'lucide-react';

const THEMES = {
  'minecraft': {
    bg: 'from-emerald-900/90 via-stone-900 to-amber-950/50',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    textGrad: 'from-emerald-300 to-amber-200',
    symbol: '⛏️'
  },
  'minecraft-3d': {
    bg: 'from-emerald-900/90 via-stone-900 to-amber-950/50',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    textGrad: 'from-emerald-300 to-amber-200',
    symbol: '⛏️'
  },
  'retro-snake': {
    bg: 'from-emerald-950/80 via-slate-900 to-cyan-950/40',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    textGrad: 'from-emerald-300 to-teal-200',
    symbol: '🐍'
  },
  'puzzle-2048': {
    bg: 'from-amber-950/80 via-slate-900 to-orange-950/40',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    textGrad: 'from-amber-300 to-yellow-200',
    symbol: '🔢'
  },
  'retro-breakout': {
    bg: 'from-rose-950/80 via-slate-900 to-pink-950/40',
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    textGrad: 'from-rose-300 to-pink-200',
    symbol: '🧱'
  },
  'cyber-flap': {
    bg: 'from-yellow-950/80 via-slate-900 to-sky-950/40',
    iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    textGrad: 'from-yellow-300 to-amber-200',
    symbol: '🐤'
  },
  'alien-defender': {
    bg: 'from-purple-950/80 via-slate-900 to-violet-950/40',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    textGrad: 'from-purple-300 to-violet-200',
    symbol: '👾'
  },
  'block-tetris': {
    bg: 'from-cyan-950/80 via-slate-900 to-blue-950/40',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    textGrad: 'from-cyan-300 to-blue-200',
    symbol: '🕹️'
  },
  'cyber-pong': {
    bg: 'from-blue-950/80 via-slate-900 to-indigo-950/40',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    textGrad: 'from-blue-300 to-cyan-200',
    symbol: '🏓'
  },
  'neon-dino-run': {
    bg: 'from-teal-950/80 via-slate-900 to-emerald-950/40',
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    textGrad: 'from-teal-300 to-emerald-200',
    symbol: '🦖'
  },
  'retro-minesweeper': {
    bg: 'from-slate-900 via-slate-900 to-zinc-900',
    iconBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    textGrad: 'from-slate-200 to-slate-400',
    symbol: '💣'
  },
  'cyber-tic-tac-toe': {
    bg: 'from-indigo-950/80 via-slate-900 to-purple-950/40',
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    textGrad: 'from-indigo-300 to-sky-200',
    symbol: '❌'
  },
  'cookie-clicker-mini': {
    bg: 'from-amber-950/80 via-stone-900 to-amber-900/30',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    textGrad: 'from-amber-300 to-yellow-100',
    symbol: '🍪'
  }
};

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) => {
  const theme = THEMES[game.id] || {
    bg: 'from-slate-900 via-slate-900/90 to-slate-950',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    textGrad: 'from-cyan-300 to-blue-200',
    symbol: '🎮'
  };

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer text-left"
    >
      {/* Visual Header / Banner */}
      <div className={`relative h-36 w-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800/60`}>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-700/80 text-slate-300 backdrop-blur-sm">
            {game.category}
          </span>

          <div className="flex items-center gap-1">
            {game.featured && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
                <Flame className="w-3 h-3 text-amber-400" />
                HOT
              </span>
            )}
            {game.isCustom && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                JSON CUSTOM
              </span>
            )}
            <button
              onClick={(e) => onToggleFavorite(game.id, e)}
              className="p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-rose-400 transition"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Symbol & Hover Play Overlay */}
        <div className="relative z-10 flex items-center justify-between mt-auto">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner ${theme.iconBg}`}>
            {theme.symbol}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30">
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              PLAY
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {game.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Card Footer: Rating & Plays */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(game.rating).toFixed(1)}</span>
          </div>
          <div>
            <span>{Number(game.plays).toLocaleString()} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
};
