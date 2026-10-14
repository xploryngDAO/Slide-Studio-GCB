import React from 'react';
import {
  Layers,
  Sliders,
  PlusCircle,
  Sparkles,
  Play,
  ChevronUp,
} from 'lucide-react';
import { SelectedElementInfo } from './SlideCanvas';

interface MobileBottomNavProps {
  currentSlideIndex: number;
  totalSlides: number;
  selectedElement: SelectedElementInfo | null;
  showNavigator: boolean;
  onToggleNavigator: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  onOpenInsertModal: () => void;
  onOpenAiModal: () => void;
  onStartPresentation: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentSlideIndex,
  totalSlides,
  selectedElement,
  showNavigator,
  onToggleNavigator,
  showInspector,
  onToggleInspector,
  onOpenInsertModal,
  onOpenAiModal,
  onStartPresentation,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Slides Navigator Button */}
        <button
          onClick={onToggleNavigator}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition active:scale-95 ${
            showNavigator
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Ver todos os slides"
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            <span className="absolute -top-1 -right-2.5 bg-slate-800 text-white font-mono text-[9px] font-bold px-1 rounded-full">
              {currentSlideIndex + 1}/{totalSlides}
            </span>
          </div>
          <span className="text-[10px] mt-1 font-medium">Slides</span>
        </button>

        {/* 2. Inspector / Style Button */}
        <button
          onClick={onToggleInspector}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition active:scale-95 ${
            showInspector
              ? 'text-blue-600 bg-blue-50 font-bold'
              : selectedElement
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Editar estilo do elemento ou slide"
        >
          <div className="relative">
            <Sliders className="w-5 h-5" />
            {selectedElement && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">
            {selectedElement ? (
              <span className="text-indigo-600 font-bold truncate max-w-[50px] inline-block">
                &lt;{selectedElement.tagName.toLowerCase()}&gt;
              </span>
            ) : (
              'Estilo'
            )}
          </span>
        </button>

        {/* 3. Insert Elements Button */}
        <button
          onClick={onOpenInsertModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition active:scale-95"
          title="Inserir cards, gráficos ou blocos"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] mt-1 font-medium">Inserir</span>
        </button>

        {/* 4. Gemini AI Button */}
        <button
          onClick={onOpenAiModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-indigo-600 hover:text-indigo-700 transition active:scale-95"
          title="Superpoderes de IA Gemini"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 font-semibold text-indigo-600">IA</span>
        </button>

        {/* 5. Present Fullscreen Button */}
        <button
          onClick={onStartPresentation}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-700 hover:text-blue-600 transition active:scale-95"
          title="Apresentar em tela cheia"
        >
          <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
          <span className="text-[10px] mt-1 font-medium">Apresentar</span>
        </button>
      </div>
    </nav>
  );
};
