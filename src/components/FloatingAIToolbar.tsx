import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Briefcase,
  Target,
  List,
  CheckCheck,
  Languages,
  Trash2,
  Copy,
  ChevronDown,
  Loader2,
  Maximize2
} from 'lucide-react';

interface FloatingAIToolbarProps {
  position: { top: number; left: number; width: number; height: number };
  selectedTagName: string;
  selectedText: string;
  isTextElement: boolean;
  onApplyAiAction: (action: string) => Promise<void>;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onSelectParent: () => void;
}

export const FloatingAIToolbar: React.FC<FloatingAIToolbarProps> = ({
  position,
  selectedTagName,
  selectedText,
  isTextElement,
  onApplyAiAction,
  onDuplicateElement,
  onDeleteElement,
  onSelectParent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    try {
      setLoadingAction(action);
      await onApplyAiAction(action);
    } finally {
      setLoadingAction(null);
      setIsOpen(false);
    }
  };

  // Calculate toolbar position: above element if room, otherwise below, and constrained horizontally
  const topPos = position.top > 54 ? position.top - 46 : position.top + position.height + 10;
  const leftPos = Math.max(10, Math.min(position.left, 960 - 290));

  return (
    <div
      style={{
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 50,
      }}
      className="flex items-center gap-1 bg-slate-900/95 text-white backdrop-blur-md px-2 py-1.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs select-none animate-in fade-in duration-100 max-w-[calc(100%-20px)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tag indicator badge */}
      <span className="text-[10px] font-mono uppercase bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700 font-semibold">
        &lt;{selectedTagName.toLowerCase()}&gt;
      </span>

      {/* Select parent container button */}
      <button
        onClick={onSelectParent}
        className="px-1.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded transition flex items-center gap-1"
        title="Selecionar elemento pai (container superior)"
      >
        <Maximize2 className="w-3 h-3 text-slate-400" />
        <span className="hidden sm:inline">Pai</span>
      </button>

      {/* AI Quick Actions for Text elements */}
      {isTextElement && selectedText.trim().length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loadingAction !== null}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-lg font-semibold transition active:scale-95 shadow-sm"
          >
            {loadingAction ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            )}
            <span>Reescrever com IA</span>
            <ChevronDown className="w-3 h-3 text-indigo-200" />
          </button>

          {isOpen && (
            <div
              className="absolute left-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 text-slate-200 text-xs"
              onMouseLeave={() => setIsOpen(false)}
            >
              <button
                onClick={() => handleAction('concise')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Mais conciso & direto</span>
              </button>
              <button
                onClick={() => handleAction('formal')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Tom corporativo / formal</span>
              </button>
              <button
                onClick={() => handleAction('persuasive')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <Target className="w-3.5 h-3.5 text-rose-400" />
                <span>Mais persuasivo (Copy)</span>
              </button>
              <button
                onClick={() => handleAction('bullet_points')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <List className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transformar em tópicos</span>
              </button>
              <button
                onClick={() => handleAction('grammar')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Corrigir gramática</span>
              </button>
              <button
                onClick={() => handleAction('translate_en')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/40 hover:text-white flex items-center gap-2 transition"
              >
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>Traduzir para Inglês</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="h-4 w-px bg-slate-700 mx-0.5" />

      {/* Duplicate Element */}
      <button
        onClick={onDuplicateElement}
        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        title="Duplicar elemento"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* Delete Element */}
      <button
        onClick={onDeleteElement}
        className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition"
        title="Excluir elemento"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
