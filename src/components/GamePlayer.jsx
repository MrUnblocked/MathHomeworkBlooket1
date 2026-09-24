import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Heart,
  Code2,
  Tv,
  Gamepad,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [showJsonSnippet, setShowJsonSnippet] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extract source url or use fallback
  const getIframeSrc = () => {
    if (game.iframeSrc) return game.iframeSrc;
    const match = game.iframeCode?.match(/src=["'](.*?)["']/);
    return match ? match[1] : '';
  };

  const iframeSrc = getIframeSrc();

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleOpenExternal = () => {
    if (iframeSrc) {
      window.open(iframeSrc, '_blank');
    }
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(game, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center py-4 px-2 sm:px-6 max-w-7xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              {game.title}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {game.category}
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Controls & Utility Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(game.id)}
            title="Toggle Favorite"
            className={`p-2 rounded-xl border transition ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Reload Iframe */}
          <button
            onClick={handleReload}
            title="Reload Game Iframe"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Default Size' : 'Theater Mode (Wide View)'}
            className={`p-2 rounded-xl border transition hidden sm:inline-flex ${
              isTheater
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            title="Fullscreen"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Open in new tab */}
          <button
            onClick={handleOpenExternal}
            title="Open in new window"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition hidden md:inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* View JSON Storage representation */}
          <button
            onClick={() => setShowJsonSnippet(!showJsonSnippet)}
            title="Inspect Iframe JSON record"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/50 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Iframe JSON</span>
          </button>
        </div>
      </div>

      {/* JSON Snippet Inspector Box (collapsible) */}
      {showJsonSnippet && (
        <div className="w-full mb-4 bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300">
                JSON Entry for "{game.title}" (Stored as Iframe in games.json)
              </span>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Object'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-cyan-200/90 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-48 border border-slate-800">
            {JSON.stringify(game, null, 2)}
          </pre>
        </div>
      )}

      {/* Game Iframe Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center ${
          isTheater ? 'max-w-7xl h-[780px]' : 'max-w-5xl h-[640px]'
        }`}
      >
        {iframeSrc ? (
          <iframe
            key={iframeKey}
            id="iframehtml5"
            src={iframeSrc}
            title={game.title || 'Minecraft'}
            className="w-full h-full border-0 rounded-2xl"
            scrolling="auto"
            allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope; pointer-lock"
            sandbox="allow-forms allow-modals allow-same-origin allow-scripts allow-pointer-lock"
            allowFullScreen
          />
        ) : (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: game.iframeCode }}
          />
        )}
      </div>

      {/* Game Information & Controls Details */}
      <div className="w-full max-w-4xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* About the Game */}
        <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
            <Gamepad className="w-4 h-4 text-cyan-400" />
            About {game.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Tags:</span>
            {game.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Controls & Quick Tips */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Controls & Input
            </h3>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
              {game.controls || 'Keyboard Arrow Keys / Mouse / Spacebar'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Rating: <strong className="text-amber-400">{Number(game.rating).toFixed(1)} / 5.0</strong></span>
            <span>Plays: <strong className="text-slate-200">{Number(game.plays).toLocaleString()}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
