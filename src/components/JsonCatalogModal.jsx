import React, { useState } from 'react';
import { X, FileJson, Copy, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

export const JsonCatalogModal = ({
  isOpen,
  onClose,
  games,
  onUpdateGames,
  onResetDefaults
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentJsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = () => {
    setJsonText(currentJsonString);
    setIsEditing(true);
    setError('');
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON element must be an array of game objects.');
      }
      onUpdateGames(parsed);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(`Invalid JSON syntax: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('Uploaded file must contain a JSON array of games.');
        }
        onUpdateGames(parsed);
        setError('');
      } catch (err) {
        setError(`Failed to parse uploaded JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                games.json Catalog Explorer
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {games.length} games stored
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Every game is stored with its own iframe embed code in this JSON structure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/20 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download games.json</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition font-semibold"
              >
                Live Edit JSON
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel Edit
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Apply Changes
                </button>
              </>
            )}

            <button
              onClick={onResetDefaults}
              title="Reset catalog back to the initial defaults"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-3 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-hidden flex-1 flex flex-col">
          {isEditing ? (
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="w-full flex-1 min-h-[380px] p-4 bg-slate-950 border border-cyan-500/50 rounded-xl font-mono text-xs text-cyan-200 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <div className="w-full flex-1 min-h-[380px] p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-auto font-mono text-xs text-cyan-200/90 leading-relaxed">
              <pre>{currentJsonString}</pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
