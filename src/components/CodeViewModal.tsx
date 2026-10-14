import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText } from 'lucide-react';
import { SlideData } from '../types/presentation';

interface CodeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
  fullHtml: string;
  onUpdateCurrentSlideHtml: (newHtml: string) => void;
}

export const CodeViewModal: React.FC<CodeViewModalProps> = ({
  isOpen,
  onClose,
  currentSlide,
  fullHtml,
  onUpdateCurrentSlideHtml,
}) => {
  const [activeTab, setActiveTab] = useState<'currentSlide' | 'fullDeck'>('currentSlide');
  const [slideHtmlInput, setSlideHtmlInput] = useState(currentSlide.htmlContent);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setSlideHtmlInput(currentSlide.htmlContent);
  }, [currentSlide.htmlContent]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy = activeTab === 'currentSlide' ? slideHtmlInput : fullHtml;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySlideCode = () => {
    onUpdateCurrentSlideHtml(slideHtmlInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Editor de Código HTML</h2>
              <p className="text-xs text-slate-500">Inspecione ou edite a estrutura HTML bruta dos slides</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('currentSlide')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'currentSlide'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            HTML do Slide Atual ({currentSlide.title})
          </button>
          <button
            onClick={() => setActiveTab('fullDeck')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'fullDeck'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            HTML Completo da Apresentação
          </button>
        </div>

        {/* Editor Body */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col bg-slate-950">
          {activeTab === 'currentSlide' ? (
            <textarea
              className="w-full flex-1 bg-transparent text-emerald-400 font-mono text-xs p-2 outline-none resize-none border-0 leading-relaxed selection:bg-blue-600/40"
              value={slideHtmlInput}
              onChange={(e) => setSlideHtmlInput(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <textarea
              readOnly
              className="w-full flex-1 bg-transparent text-emerald-400 font-mono text-xs p-2 outline-none resize-none border-0 leading-relaxed selection:bg-blue-600/40"
              value={fullHtml}
              spellCheck={false}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {activeTab === 'currentSlide'
              ? 'Edições feitas aqui serão refletidas visualmente no slide.'
              : 'Código completo pronto para exportação.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              Fechar
            </button>
            {activeTab === 'currentSlide' && (
              <button
                onClick={handleApplySlideCode}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
              >
                Aplicar Alterações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
