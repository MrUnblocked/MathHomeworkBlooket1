import React, { useState } from 'react';
import { X, PlusCircle, Code, Eye, AlertCircle } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [controls, setControls] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Generate clean iframeCode & src
  const formatIframeData = (input) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["'](.*?)["']/);
      return {
        iframeCode: trimmed,
        iframeSrc: match ? match[1] : ''
      };
    } else {
      return {
        iframeCode: `<iframe src="${trimmed}" title="${title || 'Custom Game'}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
        iframeSrc: trimmed
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe URL or <iframe> embed code.');
      return;
    }

    const { iframeCode, iframeSrc } = formatIframeData(iframeInput);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom unblocked game added to catalog.',
      controls: controls.trim() || 'Keyboard and mouse controls.',
      rating: 5.0,
      plays: 1,
      tags: tags.length > 0 ? tags : [category, 'Custom', 'Unblocked'],
      iframeSrc: iframeSrc,
      iframeCode: iframeCode,
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setIframeInput('');
    setControls('');
    setDescription('');
    setTagsInput('');
    setPreviewActive(false);
  };

  const previewData = formatIframeData(iframeInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Game as Iframe</h2>
              <p className="text-xs text-slate-400">Store a new game in your JSON catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-950/50 border border-rose-800/60 text-rose-300 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Super Smash Web, Slope, Run 3"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Sports">Sports</option>
                <option value="Casual">Casual</option>
                <option value="Retro">Retro</option>
              </select>
            </div>
          </div>

          {/* Iframe URL or Tag */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Iframe URL or &lt;iframe&gt; HTML Tag *
              </label>
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                {previewActive ? 'Hide Test Preview' : 'Test Iframe Preview'}
              </button>
            </div>
            <textarea
              rows={2}
              placeholder='e.g., https://example.com/game OR <iframe src="https://example.com/game" width="100%" height="100%"></iframe>'
              value={iframeInput}
              onChange={e => setIframeInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This will be stored directly inside the game's JSON record as <code className="text-cyan-400">"iframeCode"</code>.
            </p>
          </div>

          {/* Live Preview Box */}
          {previewActive && previewData.iframeSrc && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Code className="w-3 h-3 text-cyan-400" />
                Live Iframe Test:
              </div>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-black border border-slate-800">
                <iframe
                  src={previewData.iframeSrc}
                  title="Test Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What makes this game fun?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Controls & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Controls / Instructions
              </label>
              <input
                type="text"
                placeholder="e.g., WASD to move, Space to jump"
                value={controls}
                onChange={e => setControls(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., 3D, Skill, Fast"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition"
            >
              Add to JSON Catalog
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
