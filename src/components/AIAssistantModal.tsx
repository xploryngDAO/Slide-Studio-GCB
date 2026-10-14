import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  TrendingUp,
  Layers,
  Award,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { SlideData } from '../types/presentation';
import { generateId } from '../utils/slideParser';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'generate-slide' | 'generate-chart' | 'analyze';
  activeSlide: SlideData;
  allSlides: SlideData[];
  onInsertNewSlide: (slide: SlideData) => void;
  onInsertHtmlIntoActiveSlide: (html: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialType = 'generate-slide',
  activeSlide,
  allSlides,
  onInsertNewSlide,
  onInsertHtmlIntoActiveSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'generate-slide' | 'generate-chart' | 'analyze'>(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Generate Slide State
  const [slidePrompt, setSlidePrompt] = useState('');
  const [slideType, setSlideType] = useState('Cartões de Métricas e Destaques');
  const [generatedSlideHtml, setGeneratedSlideHtml] = useState<string | null>(null);

  // 2. Generate Chart State
  const [chartDescription, setChartDescription] = useState('Comparativo de crescimento da receita trimestral: Q1 R$10M, Q2 R$14M, Q3 R$19M');
  const [chartType, setChartType] = useState('bar');
  const [chartColor, setChartColor] = useState('#3b82f6');
  const [generatedChartHtml, setGeneratedChartHtml] = useState<string | null>(null);

  // 3. Presentation Analysis State
  const [analysisResult, setAnalysisResult] = useState<{
    overallScore?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    designTips?: string[];
  } | null>(null);

  if (!isOpen) return null;

  // Handle Generate Slide with Gemini
  const handleGenerateSlide = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/gemini/slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: slidePrompt || 'Crie um slide executivo e atraente',
          slideType,
          existingSlideHtml: activeSlide.htmlContent,
          presentationContext: `Apresentação com ${allSlides.length} slides. Slide atual: ${activeSlide.title}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao gerar slide');
      setGeneratedSlideHtml(data.html);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar à IA Gemini.');
    } finally {
      setLoading(false);
    }
  };

  // Commit Generated Slide to Presentation
  const handleCommitSlide = () => {
    if (!generatedSlideHtml) return;

    // Parse returned html tag and title
    const parser = new DOMParser();
    const doc = parser.parseFromString(generatedSlideHtml, 'text/html');
    const rootEl = doc.body.firstElementChild || doc.body;

    const titleEl = rootEl.querySelector('h1, h2, h3, .title');
    const slideTitle = titleEl?.textContent?.trim() || `Slide IA ${allSlides.length + 1}`;

    const newSlide: SlideData = {
      id: generateId('slide'),
      title: slideTitle.length > 40 ? slideTitle.substring(0, 40) + '...' : slideTitle,
      htmlContent: rootEl.innerHTML,
      tagName: rootEl.tagName.toLowerCase() === 'body' ? 'section' : rootEl.tagName.toLowerCase(),
      className: rootEl.getAttribute('class') || 'slide p-12 bg-white text-slate-800 flex flex-col justify-between min-h-[580px] rounded-2xl shadow-xl',
      style: rootEl.getAttribute('style') || "font-family: 'Plus Jakarta Sans', sans-serif;",
      attributes: {},
    };

    onInsertNewSlide(newSlide);
    onClose();
  };

  // Handle Generate Chart with Gemini
  const handleGenerateChart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/gemini/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: chartDescription,
          chartType,
          primaryColor: chartColor,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao gerar gráfico');
      setGeneratedChartHtml(data.chartHtml);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar gráfico.');
    } finally {
      setLoading(false);
    }
  };

  // Insert Chart into Active Slide
  const handleCommitChart = () => {
    if (!generatedChartHtml) return;
    const wrappedChart = `
      <div class="my-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
        ${generatedChartHtml}
      </div>
    `;
    onInsertHtmlIntoActiveSlide(wrappedChart);
    onClose();
  };

  // Run Deck Analysis
  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const slidesSummary = allSlides.map((s, i) => ({
        index: i + 1,
        title: s.title,
        textPreview: s.htmlContent.replace(/<[^>]+>/g, ' ').slice(0, 250),
      }));

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slidesContent: slidesSummary }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha na análise');
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar apresentação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Assistente IA Gemini</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Crie slides, gere gráficos ou audite sua apresentação em segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 gap-1 sm:gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('generate-slide')}
            className={`py-2.5 sm:py-3 px-2.5 sm:px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition ${
              activeTab === 'generate-slide'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Criar Slide com IA</span>
          </button>
          <button
            onClick={() => setActiveTab('generate-chart')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'generate-chart'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Gerar Gráfico / KPI</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('analyze');
              if (!analysisResult) handleRunAnalysis();
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'analyze'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Diagnóstico do Deck</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* TAB 1: GENERATE SLIDE */}
          {activeTab === 'generate-slide' && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1.5">
                  Descreva o slide que você precisa:
                </label>
                <textarea
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Ex: Crie um slide comparativo entre nossa solução tradicional e o modelo baseado em IA, com 3 colunas de benefícios e métricas de ROI..."
                  value={slidePrompt}
                  onChange={(e) => setSlidePrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="font-semibold text-slate-900 block mb-1.5">
                    Estilo / Tipo de Layout:
                  </label>
                  <select
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-white font-medium"
                    value={slideType}
                    onChange={(e) => setSlideType(e.target.value)}
                  >
                    <option value="Cartões de Métricas e Destaques">Cartões de Métricas / KPIs</option>
                    <option value="Comparativo 2 Colunas">Comparativo Lado a Lado (2 Colunas)</option>
                    <option value="3 Colunas de Recursos / Pilares">3 Colunas de Pilares / Recursos</option>
                    <option value="Timeline ou Linha do Tempo em 4 Fases">Timeline / Roadmap de Etapas</option>
                    <option value="Capa de Seção de Alto Impacto">Capa de Seção / Abertura</option>
                    <option value="Depoimento / Prova Social com Citação">Citação de Impacto / Callout</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateSlide}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Criando com Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Gerar Slide</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Slide Preview if generated */}
              {generatedSlideHtml && (
                <div className="mt-4 border border-indigo-200 bg-indigo-50/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Slide Gerado com Sucesso!
                    </span>
                    <button
                      onClick={handleCommitSlide}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar à Apresentação</span>
                    </button>
                  </div>

                  <div className="aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-md">
                    <div
                      className="w-[960px] h-[540px] transform origin-top-left p-8"
                      style={{ transform: 'scale(0.58)' }}
                      dangerouslySetInnerHTML={{ __html: generatedSlideHtml }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERATE CHART */}
          {activeTab === 'generate-chart' && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1.5">
                  Dados ou Descrição do Gráfico:
                </label>
                <textarea
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  placeholder="Ex: Receita trimestral em barras: Q1 R$10M, Q2 R$14M, Q3 R$19M..."
                  value={chartDescription}
                  onChange={(e) => setChartDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-900 block mb-1.5">
                    Tipo de Visualização:
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white font-medium"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="bar">Barras Comparativas</option>
                    <option value="donut">Donut / Pizza de Fatias</option>
                    <option value="line">Linha de Tendência</option>
                    <option value="kpi-cards">Cards de Indicadores (KPIs)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1.5">
                    Cor Primária:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0"
                      value={chartColor}
                      onChange={(e) => setChartColor(e.target.value)}
                    />
                    <span className="font-mono text-[11px] text-slate-500">{chartColor}</span>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateChart}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4" />
                        <span>Criar Gráfico</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chart Preview */}
              {generatedChartHtml && (
                <div className="mt-4 border border-blue-200 bg-blue-50/20 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">Prévia do Gráfico Gerado</span>
                    <button
                      onClick={handleCommitChart}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Inserir no Slide Atual</span>
                    </button>
                  </div>
                  <div
                    className="bg-white p-4 rounded-xl border border-slate-200 max-h-64 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedChartHtml }}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRESENTATION ANALYSIS */}
          {activeTab === 'analyze' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Auditoria Executiva do Deck</h3>
                  <p className="text-slate-500 text-xs">Avaliação de clareza, concisão e impacto da mensagem</p>
                </div>
                <button
                  onClick={handleRunAnalysis}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Reavaliar</span>
                </button>
              </div>

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-xs">Avaliando estrutura de {allSlides.length} slides com Gemini...</p>
                </div>
              )}

              {analysisResult && !loading && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Score badge */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex flex-col items-center justify-center text-emerald-600 font-extrabold border border-emerald-100 shrink-0">
                      <span className="text-2xl">{analysisResult.overallScore || 92}</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">/ 100</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Qualidade Geral da Apresentação</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {analysisResult.summary}
                      </p>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Pontos Fortes
                      </span>
                      <ul className="space-y-1.5">
                        {(analysisResult.strengths || ['Boa hierarquia visual', 'Métricas destacadas']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-emerald-800">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        Oportunidades de Melhoria
                      </span>
                      <ul className="space-y-1.5">
                        {(analysisResult.improvements || ['Reduzir densidade de texto', 'Adicionar mais espaço']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-amber-800">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Design Tips */}
                  {analysisResult.designTips && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        Dicas de Design
                      </span>
                      <ul className="space-y-1">
                        {analysisResult.designTips.map((tip, i) => (
                          <li key={i} className="text-xs text-blue-800 flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
