import React from 'react';
import { X, Shield, Check, AlertOctagon } from 'lucide-react';
import { CLOAK_PRESETS } from '../utils/cloak.js';

export const CloakModal = ({
  isOpen,
  onClose,
  activeCloakId,
  onSelectCloak
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tab Cloaking & Stealth</h2>
              <p className="text-xs text-slate-400">Disguise browser tab title & favicon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Select a disguise below. Your current browser tab's title and icon will instantly update to look like an educational or productivity website.
          </p>

          <div className="space-y-2">
            {CLOAK_PRESETS.map((preset) => {
              const isSelected = activeCloakId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectCloak(preset.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.icon}
                      alt={preset.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="text-sm font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
                        {preset.title}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 text-xs text-slate-400">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Panic Shortcut:</strong> Press the red Panic button in the navigation header at any time to immediately redirect this tab to Google search!
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
