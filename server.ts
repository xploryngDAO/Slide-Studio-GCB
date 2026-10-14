import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Initialize Google GenAI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to call Gemini with fallback across models if high demand (503) occurs
async function generateContentWithFallback(ai: GoogleGenAI, params: { prompt: string; systemInstruction?: string; responseMimeType?: string }) {
  const models = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {};
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.responseMimeType) config.responseMimeType = params.responseMimeType;

      const response = await ai.models.generateContent({
        model,
        contents: params.prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next fallback:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Todos os modelos de IA estão temporariamente indisponíveis.');
}


// Healthcheck
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: 'ok', hasGeminiKey: hasKey });
});

// 1. Text Rewriting & Enhancement
app.post('/api/gemini/rewrite', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
    }

    const { text, action, context } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Texto não fornecido.' });
    }

    const actionPrompts: Record<string, string> = {
      concise: 'Torne o texto muito mais conciso, direto ao ponto e impactante para slides executivos.',
      formal: 'Reescreva em tom corporativo, formal e profissional.',
      persuasive: 'Reescreva com técnicas de copywriting persuasivo, destacando benefícios e valor.',
      bullet_points: 'Transforme o conteúdo em 3 a 5 bullet points concisos e visualmente escaneáveis.',
      grammar: 'Corrija erros de pontuação, concordância e gramática mantendo o sentido original intacto.',
      translate_en: 'Traduza o texto perfeitamente para o inglês corporativo.',
      translate_pt: 'Traduza o texto perfeitamente para o português brasileiro fluente.',
      expand: 'Expanda o argumento com detalhes claros e objetivos adequados a um slide corporativo.',
    };

    const instruction = actionPrompts[action] || 'Melhore a clareza e impacto deste texto para uma apresentação em slides.';

    const prompt = `Você é um especialista em redação e design de apresentações de alto impacto.
Contexto do slide: ${context || 'Apresentação corporativa'}

Tarefa: ${instruction}

Texto original:
"${text}"

IMPORTANTE:
- Retorne APENAS o texto reescrito, sem aspas adicionais, sem preâmbulos ("Aqui está:"), sem explicações.`;

    const responseText = await generateContentWithFallback(ai, {
      prompt,
    });

    const rewritten = responseText ? responseText.trim() : text;
    res.json({ rewritten });
  } catch (error: any) {
    console.error('Error in /api/gemini/rewrite:', error);
    res.status(500).json({ error: error.message || 'Falha ao reescrever texto com IA.' });
  }
});

// 2. Generate New Slide or Modify Existing Slide HTML
app.post('/api/gemini/slide', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
    }

    const { prompt, slideType, existingSlideHtml, presentationContext } = req.body;

    const systemPrompt = `Você é um arquiteto e designer de apresentações em HTML de nível mundial.
Você gera ou refatora o código HTML puro de um slide individual (uma tag <section> ou <div> representativa).
O HTML deve ser auto-contido, com Tailwind CSS ou estilos inline limpos e modernos.
Use cores modernas, espaçamentos generosos (p-8 a p-12), tipografia harmoniosa, cartões com bordas sutis (border border-slate-200 ou slate-800), contrastes bem definidos e layout em Grid ou Flexbox.
Tamanho padrão do slide é 16:9 widescreen (aspect-video ou min-h-[540px]).
NÃO inclua <html>, <head> ou <body>. Retorne apenas o container do slide (ex: <section class="slide ...">...</section>).
NÃO use blocos de markdown (\`\`\`html) na resposta se possível, apenas retorne o código HTML puro.`;

    const userQuery = `
Contexto geral da apresentação:
${presentationContext || 'Apresentação profissional de negócios/relatório executivo'}

Ação solicitada:
${prompt || 'Crie um slide atraente e moderno'}

Tipo de slide: ${slideType || 'conteúdo com cartões'}

${existingSlideHtml ? `Slide de referência para manter estilos e classes parecidas:\n${existingSlideHtml}` : ''}

Retorne exclusivamente o código HTML do slide:`;

    const fullPrompt = `${systemPrompt}\n\n${userQuery}`;
    const rawHtml = await generateContentWithFallback(ai, { prompt: fullPrompt });

    let html = rawHtml ? rawHtml.trim() : '';
    // Strip markdown code fences if model returned them
    if (html.startsWith('```html')) {
      html = html.replace(/^```html\s*/, '').replace(/\s*```$/, '');
    } else if (html.startsWith('```')) {
      html = html.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    res.json({ html });
  } catch (error: any) {
    console.error('Error in /api/gemini/slide:', error);
    res.status(500).json({ error: error.message || 'Falha ao gerar slide com IA.' });
  }
});

// 3. Generate Visual Chart / Graphic (SVG + Data)
app.post('/api/gemini/chart', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
    }

    const { description, chartType, primaryColor } = req.body;

    const prompt = `Crie um gráfico vetorial em SVG moderno, limpo e profissional ou um componente de métricas em HTML para um slide de apresentação.
Tipo desejado: ${chartType || 'bar'} (ex: bar, pie/donut, line, kpi-cards, progress)
Descrição do dado: ${description || 'Comparativo trimestral de crescimento'}
Cor primária sugerida: ${primaryColor || '#3b82f6'}

Requisitos:
- Se for SVG: viewBox="0 0 600 320", largura="100%", responsivo, fontes legíveis, cores elegantes, labels visíveis.
- Se for KPI cards: grid com 3 a 4 indicadores com títulos, números grandes e badges de variação (+18%, etc.).
- Retorne APENAS o código HTML/SVG puro que pode ser inserido diretamente dentro do slide.
- Sem markdown, sem explicações.`;

    const rawChart = await generateContentWithFallback(ai, { prompt });

    let chartHtml = rawChart ? rawChart.trim() : '';
    if (chartHtml.startsWith('```html')) {
      chartHtml = chartHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
    } else if (chartHtml.startsWith('```')) {
      chartHtml = chartHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    res.json({ chartHtml });
  } catch (error: any) {
    console.error('Error in /api/gemini/chart:', error);
    res.status(500).json({ error: error.message || 'Falha ao gerar gráfico com IA.' });
  }
});

// 4. Slide & Presentation Analysis
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
    }

    const { slidesContent } = req.body;

    const prompt = `Analise a seguinte apresentação de slides em HTML e forneça um diagnóstico executivo rápido e prático.
Conteúdo resumido dos slides:
${JSON.stringify(slidesContent).slice(0, 5000)}

Retorne um JSON com a estrutura:
{
  "overallScore": 85,
  "summary": "Resumo de 2 frases sobre a qualidade e clareza da apresentação",
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "improvements": ["Oportunidade 1", "Oportunidade 2", "Oportunidade 3"],
  "designTips": ["Dica visual 1", "Dica visual 2"]
}
Retorne estritamente o JSON sem blocos markdown.`;

    const rawJson = await generateContentWithFallback(ai, {
      prompt,
      responseMimeType: 'application/json',
    });

    const parsed = JSON.parse(rawJson || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze:', error);
    res.status(500).json({ error: error.message || 'Falha na análise da apresentação.' });
  }
});



// 5. Curated Presentation Imagery Keywords & Unsplash links
app.post('/api/gemini/suggest-images', async (req, res) => {
  try {
    const ai = getAiClient();
    const { query } = req.body;

    let keywords = ['business', 'technology', 'presentation', 'minimal'];
    if (ai && query) {
      try {
        const rawJson = await generateContentWithFallback(ai, {
          prompt: `Para o tema "${query}", sugira 4 termos em inglês em uma única palavra para busca de fotos de alta qualidade em apresentações corporativas. Retorne JSON no formato: {"terms": ["term1", "term2", "term3", "term4"]}`,
          responseMimeType: 'application/json',
        });
        const data = JSON.parse(rawJson || '{}');
        if (Array.isArray(data.terms)) {
          keywords = data.terms;
        }
      } catch (err) {
        console.warn('Fallback keywords used');
      }
    }

    // High quality curated unsplash presentation images
    const sampleImages = [
      { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', label: 'Equipe em Reunião Estratégica' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', label: 'Dashboard & Gráficos Financeiros' },
      { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', label: 'Tecnologia & Inovação' },
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', label: 'Liderança Executiva' },
      { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80', label: 'Planejamento e Metas' },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', label: 'Arquitetura Corporativa Moderna' },
      { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', label: 'Colaboração & Workshop' },
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', label: 'Análise de Métricas & Dados' },
    ];

    res.json({ images: sampleImages, keywords });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SlideStudio Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
