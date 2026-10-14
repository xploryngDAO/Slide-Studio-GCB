import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Upload,
  Download,
  Play,
  Sparkles,
  Plus,
  Undo2,
  Redo2,
  Code,
  FileText,
  Printer,
  ChevronDown,
  Layers,
  BarChart3,
  CheckCircle2,
  Sparkle,
  PanelLeft,
  Sliders,
  MoreVertical,
  Check,
} from 'lucide-react';
import { PresentationDoc, ViewMode } from '../types/presentation';
import { SAMPLE_PRESENTATIONS } from '../utils/slideParser';

interface TopToolbarProps {
  presentation: PresentationDoc;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showNavigator: boolean;
  onToggleNavigator: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  onFileUpload: (file: File) => void;
  onLoadSample: (sampleKey: string) => void;
  onExportHtml: () => void;
  onPrintPdf: () => void;
  onOpenAiModal: (type: 'generate-slide' | 'generate-chart' | 'analyze') => void;
  onOpenInsertModal: () => void;
  onOpenCodeView: () => void;
  onTitleChange: (newTitle: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  presentation,
  viewMode,
  onViewModeChange,
  showNavigator,
  onToggleNavigator,
  showInspector,
  onToggleInspector,
  onFileUpload,
  onLoadSample,
  onExportHtml,
  onPrintPdf,
  onOpenAiModal,
  onOpenInsertModal,
  onOpenCodeView,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSamplesDropdown, setShowSamplesDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(presentation.title);

  useEffect(() => {
    setTitleInput(presentation.title);
  }, [presentation.title]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(presentation.title);
    }
  };

  return (
    <header className="h-14 border-b border-slate-200/90 bg-white/98 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none z-30 shrink-0 gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Zone 1: Left (Slides toggle, Brand, Presentation Title) */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Toggle Slides Sidebar Button */}
        <button
          onClick={onToggleNavigator}
          className={`hidden md:flex p-1.5 rounded-lg transition items-center gap-1.5 text-xs font-medium ${
            showNavigator
              ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90'
          }`}
          title="Alternar lista de slides à esquerda"
        >
          <PanelLeft className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px] font-semibold">Slides</span>
        </button>

        {/* Brand Icon and Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 hidden sm:inline">
            SlideStudio
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block shrink-0" />

        {/* Editable Title */}
        <div className="max-w-[170px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-xs truncate">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                className="text-xs sm:text-sm font-medium text-slate-900 border border-blue-500 rounded px-2 py-0.5 outline-none bg-blue-50/50 w-full"
                value={titleInput}
                autoFocus
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              />
              <button
                onMouseDown={handleTitleSubmit}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                title="Salvar título"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded px-1.5 py-0.5 hover:bg-slate-100 transition truncate text-left"
              title="Clique para renomear apresentação"
            >
              <span className="truncate">{presentation.title || 'Apresentação Sem Título'}</span>
              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition">✎</span>
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Center (Undo/Redo, Insert Element, AI Assistant, Samples) */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Undo / Redo Segmented Control */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
            className={`p-1.5 rounded-md text-slate-600 transition ${
              canUndo ? 'hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
            className={`p-1.5 rounded-md text-slate-600 transition ${
              canRedo ? 'hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Insert Element Button */}
        <button
          onClick={onOpenInsertModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 transition shadow-2xs active:scale-98"
          title="Inserir texto, card, tabela, métrica ou forma no slide"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>Inserir</span>
        </button>

        {/* AI Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAiDropdown(!showAiDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 transition shadow-2xs"
            title="Recursos inteligentes com Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Assistente IA</span>
            <ChevronDown className="w-3 h-3 text-indigo-400" />
          </button>

          {showAiDropdown && (
            <div
              className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-700 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowAiDropdown(false)}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recursos Inteligentes
              </div>
              <button
                onClick={() => {
                  setShowAiDropdown(false);
                  onOpenAiModal('generate-slide');
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                <Sparkle className="w-3.5 h-3.5 text-indigo-600" />
                <div>
                  <div className="font-semibold">Criar Novo Slide com IA</div>
                  <div className="text-[11px] text-slate-500">Gere um slide completo a partir de um prompt</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAiDropdown(false);
                  onOpenAiModal('generate-chart');
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <div>
                  <div className="font-semibold">Gerar Gráfico / KPI com IA</div>
                  <div className="text-[11px] text-slate-500">Crie gráficos SVG elegantes com dados</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAiDropdown(false);
                  onOpenAiModal('analyze');
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <div className="font-semibold">Diagnóstico da Apresentação</div>
                  <div className="text-[11px] text-slate-500">Audite clareza, concisão e estilo</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sample Decks Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
          >
            <span>Modelos</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showSamplesDropdown && (
            <div
              className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-700 text-xs animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowSamplesDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Exemplos Prontos
              </div>
              {Object.entries(SAMPLE_PRESENTATIONS).map(([key, sample]) => (
                <button
                  key={key}
                  onClick={() => {
                    setShowSamplesDropdown(false);
                    onLoadSample(key);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition"
                >
                  <div className="font-semibold text-slate-800">{sample.name}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{sample.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 3: Right (Code, Upload, Export, Present, Inspector Toggle) */}
      <div className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        {/* Upload HTML Button (Desktop) */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
          title="Carregar apresentação HTML externa"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden xl:inline">Subir HTML</span>
        </button>

        {/* View HTML Code Modal (Desktop) */}
        <button
          onClick={onOpenCodeView}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
          title="Inspecionar ou editar código HTML bruto"
        >
          <Code className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Código</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
            title="Opções de exportação (HTML / PDF)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Exportar</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showExportDropdown && (
            <div
              className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-700 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowExportDropdown(false)}
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Opções de Download
              </div>
              <button
                onClick={() => {
                  setShowExportDropdown(false);
                  onExportHtml();
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold">Baixar HTML Completo</div>
                  <div className="text-[11px] text-slate-500">Auto-contido, pronto para apresentar offline</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportDropdown(false);
                  onPrintPdf();
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="font-semibold">Salvar como PDF / Imprimir</div>
                  <div className="text-[11px] text-slate-500">Layout paginado para PDF corporativo</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Present Fullscreen Button (Primary Action) */}
        <button
          onClick={() => onViewModeChange('present')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition active:scale-98"
          title="Apresentar em tela cheia (F)"
        >
          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          <span>Apresentar</span>
        </button>

        {/* Toggle Inspector Sidebar Button (Desktop) */}
        <button
          onClick={onToggleInspector}
          className={`hidden md:flex p-1.5 rounded-lg transition items-center gap-1.5 text-xs font-medium ${
            showInspector
              ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90'
          }`}
          title="Alternar painel de estilo & propriedades à direita"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px] font-semibold">Inspetor</span>
        </button>

        {/* Mobile Header Quick Actions */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-lg transition"
            title="Desfazer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-lg transition"
            title="Refazer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-1.5 rounded-lg transition ${
                showMobileMenu ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Mais opções"
              aria-label="Mais opções"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMobileMenu &&
              typeof document !== 'undefined' &&
              createPortal(
                <div className="fixed inset-0 z-50 flex flex-col justify-start">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
                    onClick={() => setShowMobileMenu(false)}
                  />

                  {/* Dropdown Menu Modal positioned safely right below the header */}
                  <div
                    className="fixed right-3 w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ top: '60px' }}
                  >
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Menu da Apresentação</span>
                      <button
                        onClick={() => setShowMobileMenu(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100"
                        title="Fechar menu"
                      >
                        ✕
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition"
                    >
                      <Upload className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-semibold block text-slate-800">Subir HTML</span>
                        <span className="text-[10px] text-slate-400">Carregar arquivo de slides</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        onExportHtml();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-semibold block text-slate-800">Baixar HTML Completo</span>
                        <span className="text-[10px] text-slate-400">Arquivo pronto para apresentação offline</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        onPrintPdf();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition"
                    >
                      <Printer className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-semibold block text-slate-800">Salvar PDF / Imprimir</span>
                        <span className="text-[10px] text-slate-400">Imprimir ou salvar em PDF</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        onOpenCodeView();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition"
                    >
                      <Code className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-semibold block text-slate-800">Ver Código HTML</span>
                        <span className="text-[10px] text-slate-400">Inspecionar código do slide</span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase">
                        Exemplos Rápidos
                      </div>
                      {Object.entries(SAMPLE_PRESENTATIONS).map(([key, sample]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setShowMobileMenu(false);
                            onLoadSample(key);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 transition text-slate-600 hover:text-slate-900 font-medium"
                        >
                          • {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        </div>
      </div>
    </header>
  );
};
