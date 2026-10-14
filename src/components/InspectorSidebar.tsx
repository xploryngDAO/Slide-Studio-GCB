import React, { useState } from 'react';
import {
  Type,
  Palette,
  Maximize,
  Sliders,
  Image as ImageIcon,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Sparkles,
  Upload,
  Check,
  ChevronRight,
  HelpCircle,
  FileCode2,
  X,
  Copy,
  Trash2,
  Maximize2,
  MousePointer,
  Play,
  Eye,
  MoveUp,
  MoveDown,
  MoveLeft,
  ZoomIn,
  Zap,
  Ban,
  Clock,
  Timer,
} from 'lucide-react';
import { SelectedElementInfo } from './SlideCanvas';
import { SlideData } from '../types/presentation';
import { cssStringToStyleObject } from '../utils/styleHelper';

interface InspectorSidebarProps {
  selectedElement: SelectedElementInfo | null;
  currentSlide: SlideData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateElementStyle: (styleProperty: string, value: string) => void;
  onUpdateElementClass: (className: string) => void;
  onUpdateElementText: (text: string) => void;
  onUpdateElementAttribute: (attr: string, value: string) => void;
  onUpdateSlideProps: (props: Partial<SlideData>) => void;
  onSelectBreadcrumb: (id: string) => void;
  onOpenAiAssistant: (action: string) => void;
  onDuplicateElement?: () => void;
  onDeleteElement?: () => void;
  onUpdateElementAnimation?: (type: string, duration?: string, delay?: string, easing?: string) => void;
  onPreviewAnimation?: () => void;
}

const FONT_OPTIONS = [
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'Outfit', value: '"Outfit", sans-serif' },
  { label: 'Poppins', value: '"Poppins", sans-serif' },
  { label: 'Montserrat', value: '"Montserrat", sans-serif' },
  { label: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
  { label: 'Merriweather (Serif)', value: '"Merriweather", serif' },
  { label: 'Fira Code (Tech Mono)', value: '"Fira Code", monospace' },
];

const COLOR_SWATCHES = [
  '#0f172a', // Slate 900
  '#334155', // Slate 700
  '#64748b', // Slate 500
  '#ffffff', // White
  '#2563eb', // Blue 600
  '#4f46e5', // Indigo 600
  '#7c3aed', // Purple 600
  '#059669', // Emerald 600
  '#d97706', // Amber 600
  '#dc2626', // Red 600
  'transparent',
];

const SLIDE_BACKGROUND_PRESETS = [
  { label: 'Branco Puro', style: 'background-color: #ffffff; color: #0f172a;' },
  { label: 'Dark Navy', style: 'background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff;' },
  { label: 'Grafite Executivo', style: 'background-color: #18181b; color: #f4f4f5;' },
  { label: 'Índigo Vibrante', style: 'background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff;' },
  { label: 'Cinza Suave Minimalista', style: 'background-color: #f8fafc; color: #1e293b;' },
  { label: 'Esmeralda Corporativo', style: 'background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); color: #ecfdf5;' },
];

const CURATED_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80', label: 'Reunião de Equipe' },
  { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', label: 'Dashboard & Gráficos' },
  { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', label: 'Inovação e Tech' },
  { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', label: 'Liderança' },
  { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', label: 'Arquitetura Moderna' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', label: 'Dados & Análise' },
];

export const ANIMATION_PRESETS = [
  { id: 'none', label: 'Nenhuma', icon: Ban, desc: 'Sem animação de entrada' },
  { id: 'fade-in', label: 'Fade In', icon: Eye, desc: 'Aparição gradual suave' },
  { id: 'slide-up', label: 'Slide Up', icon: MoveUp, desc: 'Deslizar de baixo para cima' },
  { id: 'zoom', label: 'Zoom In', icon: ZoomIn, desc: 'Aproximação suave com escala' },
  { id: 'slide-down', label: 'Slide Down', icon: MoveDown, desc: 'Deslizar de cima para baixo' },
  { id: 'slide-left', label: 'Slide Left', icon: MoveLeft, desc: 'Deslizar da direita para esquerda' },
  { id: 'bounce', label: 'Bounce', icon: Zap, desc: 'Entrada com impacto elástico' },
];

export const DURATION_OPTIONS = [
  { label: '0.3s (Rápida)', value: '0.3s' },
  { label: '0.6s (Padrão)', value: '0.6s' },
  { label: '0.9s (Suave)', value: '0.9s' },
  { label: '1.2s (Lenta)', value: '1.2s' },
];

export const DELAY_OPTIONS = [
  { label: '0s (Imediato)', value: '0s' },
  { label: '0.2s (+200ms)', value: '0.2s' },
  { label: '0.4s (+400ms)', value: '0.4s' },
  { label: '0.6s (+600ms)', value: '0.6s' },
  { label: '0.8s (+800ms)', value: '0.8s' },
  { label: '1.0s (+1s)', value: '1.0s' },
];

export const EASING_OPTIONS = [
  { label: 'Suave Natural (Ease Out)', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { label: 'Elástico Dinâmico (Spring)', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { label: 'Linear Uniforme', value: 'linear' },
];

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  selectedElement,
  currentSlide,
  isOpen,
  onClose,
  onUpdateElementStyle,
  onUpdateElementClass,
  onUpdateElementText,
  onUpdateElementAttribute,
  onUpdateSlideProps,
  onSelectBreadcrumb,
  onOpenAiAssistant,
  onDuplicateElement,
  onDeleteElement,
  onUpdateElementAnimation,
  onPreviewAnimation,
}) => {
  const [activeTab, setActiveTab] = useState<'element' | 'slide'>('element');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const isImage = selectedElement?.tagName === 'IMG';
  const hasElement = Boolean(selectedElement);

  // If no element selected, default to slide tab
  const currentTab = hasElement ? activeTab : 'slide';

  // Animation state derived from selected element
  const activeAnimType = selectedElement?.animation?.type || selectedElement?.element?.getAttribute('data-animate') || 'none';
  const activeDuration = selectedElement?.animation?.duration || selectedElement?.element?.getAttribute('data-animate-duration') || '0.6s';
  const activeDelay = selectedElement?.animation?.delay || selectedElement?.element?.getAttribute('data-animate-delay') || '0s';
  const activeEasing = selectedElement?.animation?.easing || selectedElement?.element?.getAttribute('data-animate-easing') || 'cubic-bezier(0.16, 1, 0.3, 1)';

  const handleSelectAnimation = (animId: string) => {
    if (animId === 'none') {
      onUpdateElementAnimation?.('none');
    } else {
      onUpdateElementAnimation?.(animId, activeDuration, activeDelay, activeEasing);
      setTimeout(() => {
        onPreviewAnimation?.();
      }, 50);
    }
  };

  const handleUpdateDuration = (duration: string) => {
    onUpdateElementAnimation?.(activeAnimType, duration, activeDelay, activeEasing);
    setTimeout(() => {
      onPreviewAnimation?.();
    }, 50);
  };

  const handleUpdateDelay = (delay: string) => {
    onUpdateElementAnimation?.(activeAnimType, activeDuration, delay, activeEasing);
    setTimeout(() => {
      onPreviewAnimation?.();
    }, 50);
  };

  const handleUpdateEasing = (easing: string) => {
    onUpdateElementAnimation?.(activeAnimType, activeDuration, activeDelay, easing);
    setTimeout(() => {
      onPreviewAnimation?.();
    }, 50);
  };

  // Handle local image file upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        if (isImage) {
          onUpdateElementAttribute('src', dataUrl);
        } else {
          onUpdateElementStyle('backgroundImage', `url("${dataUrl}")`);
          onUpdateElementStyle('backgroundSize', 'cover');
          onUpdateElementStyle('backgroundPosition', 'center');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-full md:w-72 lg:w-80 h-[52vh] sm:h-[48vh] md:h-full bg-white border-t md:border-t-0 md:border-l border-slate-200/90 flex flex-col shrink-0 select-none overflow-hidden z-20 shadow-xl md:shadow-none animate-in slide-in-from-bottom md:slide-in-from-right duration-200 order-2 md:order-3">
      {/* Mobile Drag Handle (Click to close/collapse and expand slide) */}
      <div
        className="pt-2 pb-1 md:hidden flex justify-center cursor-pointer hover:bg-slate-50 transition"
        onClick={onClose}
        title="Toque para recolher painel e ver slide completo"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
      </div>

      {/* Top Tab Switcher & Close button */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab('element')}
          disabled={!hasElement}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            currentTab === 'element'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
              : hasElement
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Elemento</span>
          {hasElement && (
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">
              {selectedElement?.tagName.toLowerCase()}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('slide')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            currentTab === 'slide'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Slide</span>
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition shrink-0"
          title="Recolher painel e expandir slide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
        {/* TAB 1: ELEMENT INSPECTOR */}
        {currentTab === 'element' && !selectedElement && (
          <div className="py-8 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
              <MousePointer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Nenhum elemento selecionado</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Toque ou clique em qualquer texto, card ou imagem no slide acima para editar cores, tamanhos e efeitos.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('slide')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Configurar Cores do Slide</span>
            </button>
          </div>
        )}

        {currentTab === 'element' && selectedElement && (
          <>
            {/* Quick Action Buttons for Element */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {onDuplicateElement && (
                <button
                  onClick={onDuplicateElement}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold text-[11px] transition shadow-2xs active:scale-95"
                  title="Duplicar elemento selecionado"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duplicar</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (selectedElement.element && selectedElement.element.parentElement) {
                    const parent = selectedElement.element.parentElement;
                    const container = document.getElementById(currentSlide.id);
                    if (parent !== container) {
                      const editId = parent.getAttribute('data-edit-id');
                      if (editId) onSelectBreadcrumb(editId);
                    }
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold text-[11px] transition shadow-2xs active:scale-95"
                title="Selecionar elemento container pai"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pai</span>
              </button>

              {onDeleteElement && (
                <button
                  onClick={onDeleteElement}
                  className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-[11px] transition active:scale-95"
                  title="Remover elemento"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Excluir</span>
                </button>
              )}
            </div>

            {/* Breadcrumb Hierarchy Navigation */}
            {selectedElement.breadcrumbs.length > 0 && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Hierarquia do Elemento (Navegar no Container):
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {selectedElement.breadcrumbs.map((crumb, idx) => {
                    const isCurrent = idx === selectedElement.breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.id || idx}>
                        {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                        <button
                          onClick={() => onSelectBreadcrumb(crumb.id)}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                            isCurrent
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                          title={`Selecionar <${crumb.tagName}>`}
                        >
                          {crumb.tagName}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Typography Section (If text or contains text) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                <div className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tipografia & Texto</span>
                </div>
                {selectedElement.isTextElement && (
                  <button
                    onClick={() => onOpenAiAssistant('rewrite')}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    title="Pedir sugestão de texto com IA"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>IA Reescrever</span>
                  </button>
                )}
              </div>

              {/* Text content direct edit input */}
              {selectedElement.isTextElement && (
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Conteúdo do Texto
                  </label>
                  <textarea
                    rows={2}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
                    value={selectedElement.textContent}
                    onChange={(e) => onUpdateElementText(e.target.value)}
                  />
                </div>
              )}

              {/* Font Family */}
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  Fonte
                </label>
                <select
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                  value={selectedElement.computedStyle.fontFamily}
                  onChange={(e) => onUpdateElementStyle('fontFamily', e.target.value)}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Tamanho (px)
                  </label>
                  <select
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                    onChange={(e) => onUpdateElementStyle('fontSize', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Escolha...</option>
                    <option value="12px">Pequeno (12px)</option>
                    <option value="14px">Normal (14px)</option>
                    <option value="16px">Médio (16px)</option>
                    <option value="20px">Título Pequeno (20px)</option>
                    <option value="28px">Título Grande (28px)</option>
                    <option value="36px">Destaque (36px)</option>
                    <option value="48px">Gigante (48px)</option>
                    <option value="60px">Impacto (60px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Peso
                  </label>
                  <select
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                    onChange={(e) => onUpdateElementStyle('fontWeight', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Escolha...</option>
                    <option value="300">Leve (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="600">Seminegrito (600)</option>
                    <option value="700">Negrito (700)</option>
                    <option value="800">Extra Negrito (800)</option>
                  </select>
                </div>
              </div>

              {/* Text Align & Styles */}
              <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateElementStyle('textAlign', 'left')}
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
                    title="Alinhar à Esquerda"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateElementStyle('textAlign', 'center')}
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
                    title="Centralizar"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateElementStyle('textAlign', 'right')}
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
                    title="Alinhar à Direita"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateElementStyle('textAlign', 'justify')}
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition"
                    title="Justificado"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      onUpdateElementStyle(
                        'fontWeight',
                        selectedElement.computedStyle.fontWeight === 'bold' ||
                          parseInt(selectedElement.computedStyle.fontWeight, 10) >= 700
                          ? 'normal'
                          : 'bold'
                      )
                    }
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 font-bold transition"
                    title="Negrito"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElementStyle(
                        'fontStyle',
                        selectedElement.element.style.fontStyle === 'italic' ? 'normal' : 'italic'
                      )
                    }
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 italic transition"
                    title="Itálico"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      onUpdateElementStyle(
                        'textDecoration',
                        selectedElement.element.style.textDecoration === 'underline' ? 'none' : 'underline'
                      )
                    }
                    className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 underline transition"
                    title="Sublinhado"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Color Swatches & Picker */}
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Cor do Texto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                    onChange={(e) => onUpdateElementStyle('color', e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {COLOR_SWATCHES.slice(0, 8).map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateElementStyle('color', color)}
                        style={{ backgroundColor: color }}
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-xs hover:scale-110 transition"
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colors, Box & Background Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-1">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cores & Fundo</span>
              </div>

              {/* Background Color */}
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Cor de Fundo do Elemento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                    onChange={(e) => onUpdateElementStyle('backgroundColor', e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateElementStyle('backgroundColor', color)}
                        style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-xs hover:scale-110 transition relative"
                        title={color}
                      >
                        {color === 'transparent' && (
                          <span className="text-[9px] text-red-500 font-bold block text-center">⊘</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Border & Corner Radius */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Borda
                  </label>
                  <select
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                    onChange={(e) => {
                      if (e.target.value === 'none') {
                        onUpdateElementStyle('border', 'none');
                      } else {
                        onUpdateElementStyle('border', e.target.value);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Escolha borda...</option>
                    <option value="none">Sem Borda</option>
                    <option value="1px solid #e2e8f0">Fina Cinza (1px)</option>
                    <option value="2px solid #3b82f6">Azul Destaque (2px)</option>
                    <option value="1px solid #334155">Escura (1px)</option>
                    <option value="2px dashed #94a3b8">Tracejada (2px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">
                    Cantos (Raio)
                  </label>
                  <select
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                    onChange={(e) => onUpdateElementStyle('borderRadius', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Escolha canto...</option>
                    <option value="0px">Reto (0px)</option>
                    <option value="6px">Leve (6px)</option>
                    <option value="12px">Médio (12px)</option>
                    <option value="20px">Arredondado (20px)</option>
                    <option value="9999px">Pílula Circular</option>
                  </select>
                </div>
              </div>

              {/* Shadow Preset */}
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  Sombra (Elevação)
                </label>
                <select
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                  onChange={(e) => onUpdateElementStyle('boxShadow', e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Escolha sombra...</option>
                  <option value="none">Nenhuma</option>
                  <option value="0 1px 3px rgba(0,0,0,0.1)">Suave (Subtle)</option>
                  <option value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Média</option>
                  <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Destaque</option>
                  <option value="0 20px 25px -5px rgba(0,0,0,0.25)">Flutuante Premium</option>
                </select>
              </div>

              {/* Padding */}
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  Espaçamento Interno (Padding)
                </label>
                <select
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                  onChange={(e) => onUpdateElementStyle('padding', e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Escolha espaçamento...</option>
                  <option value="0px">Zero (0px)</option>
                  <option value="8px">Compacto (8px)</option>
                  <option value="16px">Padrão (16px)</option>
                  <option value="24px">Confortável (24px)</option>
                  <option value="36px">Amplo (36px)</option>
                </select>
              </div>
            </div>

            {/* Entrance Animations Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Animações de Entrada</span>
                </div>
                {activeAnimType && activeAnimType !== 'none' ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {ANIMATION_PRESETS.find((p) => p.id === activeAnimType)?.label || activeAnimType}
                    </span>
                    {onPreviewAnimation && (
                      <button
                        onClick={onPreviewAnimation}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100/70 rounded transition flex items-center"
                        title="Testar animação no slide"
                      >
                        <Play className="w-3 h-3 fill-blue-600" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-normal">Nenhuma</span>
                )}
              </div>

              {/* Animation Preset Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                {ANIMATION_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = activeAnimType === preset.id || (!activeAnimType && preset.id === 'none');
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectAnimation(preset.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition group relative ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 text-blue-700 shadow-2xs font-semibold'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                      title={`${preset.label}: ${preset.desc}`}
                    >
                      <Icon className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${
                        isSelected ? 'text-blue-600' : 'text-slate-500'
                      }`} />
                      <span className="text-[11px] leading-tight block truncate w-full">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Timing Controls (Duration, Delay, Easing) - only when animation is selected */}
              {activeAnimType && activeAnimType !== 'none' && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Duração</span>
                      </label>
                      <select
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                        value={activeDuration}
                        onChange={(e) => handleUpdateDuration(e.target.value)}
                      >
                        {DURATION_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Timer className="w-3 h-3 text-slate-400" />
                        <span>Atraso (Delay)</span>
                      </label>
                      <select
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                        value={activeDelay}
                        onChange={(e) => handleUpdateDelay(e.target.value)}
                      >
                        {DELAY_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Curva de Movimento
                    </label>
                    <select
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                      value={activeEasing}
                      onChange={(e) => handleUpdateEasing(e.target.value)}
                    >
                      {EASING_OPTIONS.map((eOpt) => (
                        <option key={eOpt.value} value={eOpt.value}>
                          {eOpt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions: Replay preview & remove */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <button
                      onClick={() => onPreviewAnimation?.()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                      title="Executar pré-visualização no slide agora"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Testar Animação</span>
                    </button>

                    <button
                      onClick={() => handleSelectAnimation('none')}
                      className="py-1.5 px-2.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
                      title="Desativar animação do elemento"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Image Tools (If <img> or can insert image) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Imagens & Mídia</span>
                </div>
                <button
                  onClick={() => setShowImagePicker(!showImagePicker)}
                  className="text-[11px] text-emerald-600 font-semibold hover:underline"
                >
                  {showImagePicker ? 'Fechar' : 'Galeria'}
                </button>
              </div>

              {/* Upload image from computer */}
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Curated Unsplash Gallery */}
              {showImagePicker && (
                <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Fotos Executivas Curadas:
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {CURATED_IMAGES.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (isImage) {
                            onUpdateElementAttribute('src', img.url);
                          } else {
                            onUpdateElementStyle('backgroundImage', `url("${img.url}")`);
                            onUpdateElementStyle('backgroundSize', 'cover');
                            onUpdateElementStyle('backgroundPosition', 'center');
                          }
                        }}
                        className="group relative rounded-lg overflow-hidden cursor-pointer aspect-video border border-slate-200 hover:border-blue-500 shadow-xs"
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] px-1 py-0.5 truncate">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: SLIDE SETTINGS */}
        {currentTab === 'slide' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">
                Título do Slide
              </span>
              <input
                type="text"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                value={currentSlide.title}
                onChange={(e) => onUpdateSlideProps({ title: e.target.value })}
                placeholder="Nome do slide para navegação"
              />
            </div>

            {/* Slide Background Color Presets */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">
                Temas & Cores do Slide
              </span>
              <div className="space-y-1.5">
                {SLIDE_BACKGROUND_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateSlideProps({ style: `${preset.style} font-family: 'Plus Jakarta Sans', sans-serif;` });
                    }}
                    className="w-full text-left p-2 rounded-xl border border-slate-200 hover:border-blue-500 flex items-center justify-between text-xs transition hover:shadow-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md border border-slate-300 shadow-xs"
                        style={cssStringToStyleObject(preset.style)}
                      />
                      <span className="font-semibold text-slate-800">{preset.label}</span>
                    </div>
                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Speaker Notes */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">
                Anotações do Apresentador (Notas)
              </span>
              <textarea
                rows={4}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-y"
                placeholder="Roteiro de fala, números complementares ou observações que auxiliam na hora de apresentar..."
                value={currentSlide.notes || ''}
                onChange={(e) => onUpdateSlideProps({ notes: e.target.value })}
              />
            </div>

            {/* Quick Tips */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Dica de Design</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Mantenha no máximo 3 ideias centrais por slide e valorize espaços em branco para maior retenção visual.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
