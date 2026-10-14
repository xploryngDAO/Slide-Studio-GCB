# Plano de Implementação: SlideStudio HTML - Editor Visual e Inteligente de Apresentações

O objetivo é transformar relatórios de slides em HTML auto-contidos gerados por agentes em apresentações visualmente editáveis, intuitivas para usuários não técnicos, com suporte de IA para reescrita, diagramação, geração de novos slides e exportação do HTML final pronto para compartilhamento ou apresentação.

---

## 1. Visão Geral da Arquitetura

O sistema será construído em modelo Full-Stack (Vite + React 19 + Tailwind CSS no frontend, com backend Express integrado via `server.ts` executando chamadas do Gemini SDK de forma segura):

1. **Área de Upload & Biblioteca de Slides:**
   - Suporte para upload de arquivos `.html` (drag-and-drop ou seleção de arquivo) e templates demonstrativos pré-carregados (Relatório Trimestral Executivo, Apresentação de Resultados e Pitch Deck).
   - Parser inteligente que detecta a estrutura dos slides (`<section>`, `<div class="slide">`, `article` ou divisores equivalentes) e seus assets incorporados (CSS, SVG, imagens inline/base64).

2. **Canvas Interativo de Apresentação (WYSIWYG Direto):**
   - Visualização fiel 16:9 em canvas responsivo e isolado.
   - Navegação por miniaturas de slides à esquerda (adicionar, duplicar, reordenar por arrasto e excluir slides).
   - Seleção com clique direto em qualquer elemento: títulos, parágrafos, cartões de métricas, ícones, imagens, tabelas e contêineres de layout.
   - Overlay de destaque visual (bounding box com handles de seleção) mostrando o elemento ativo de forma clara e amigável.

3. **Barra Lateral de Edição Visual (Sem necessidade de código):**
   - **Tipografia:** Família da fonte (Google Fonts populares e limpas como Inter, Plus Jakarta Sans, Poppins, Merriweather), tamanho, peso, alinhamento, espaçamento entre linhas e cor.
   - **Cores & Estilos:** Paletas de cores inteligentes, gradientes, cor de fundo do elemento ou do slide, bordas, sombras e cantos arredondados (`border-radius`).
   - **Imagens & Ícones:** Substituição por upload local, inserção de URLs ou geração/busca rápida por imagens de alta qualidade via IA ou Unsplash presets.
   - **Gráficos & Métricas:** Edição de cartões numéricos (KPIs), barras de progresso e mini-gráficos SVG interativos.
   - **Layouts Pré-definidos:** Alternância de diagramação (1 coluna, 2 colunas, 3 cartões, imagem + texto, destaque central).

4. **Copiloto de IA Integrado (Gemini 3.8 Flash):**
   - **Ações Rápidas no Elemento Selecionado:** "Tornar mais executivo", "Encurtar / Mais direto", "Expandir com detalhes", "Traduzir", "Mudar tom de voz".
   - **Gerador de Novos Slides:** Gerar um novo slide a partir de instruções em linguagem natural (ex: *"Crie um slide de Conclusão e Próximos Passos seguindo as mesmas cores e estilo da apresentação"*).
   - **Assistente de Temas & Paletas:** Aplicar esquemas de cores harmoniosos a toda a apresentação com 1 clique (Minimalista Escuro, Corporativo Azul, Elegante Esmeralda, Moderno Roxo, Editorial etc.).
   - **Análise & Melhoria do Relatório:** Identificar slides com excesso de texto e sugerir quebras visuais em cartões/bullets.

5. **Modos de Apresentação e Exportação:**
   - **Modo Apresentação:** Visualizador fullscreen com controle por teclado (setas/espaço) e barra de progresso.
   - **Exportar HTML Auto-contido:** Gera o código HTML completo e limpo, com todo CSS e scripts inline, pronto para abrir em qualquer navegador offline.
   - **Exportar PDF / Imprimir:** Formatação pronta para impressão/exportação nativa.

---

## 2. Etapas de Desenvolvimento

### Fase 1: Estrutura Base & Backend Express com Gemini
- Configurar `server.ts` com Express e integração ao SDK `@google/genai` (usando `gemini-3.8-flash` para transformações de texto, criação de slides e estruturação de layouts).
- Atualizar `metadata.json` com nome oficial do app (*SlideStudio HTML*) e permissões necessárias.
- Criar rotas `/api/gemini/edit-content`, `/api/gemini/generate-slide`, `/api/gemini/suggest-theme`.

### Fase 2: Parser de Slides HTML & Carregamento
- Desenvolver motor de parsing DOM seguro:
  - Identificar tags de slides (`<section>`, `.slide`, etc.) ou agrupar blocos contínuos caso o HTML venha em formato corrido.
  - Extrair estilos globais (`<style>`) para manter consistência sem vazar para a interface principal do aplicativo.
  - Carregador de arquivos `.html` com fallback para amostras ricas de demonstração prontas para teste imediato.

### Fase 3: Canvas de Edição & Seleção Interativa
- Renderizador do slide atual com aspect ratio 16:9 fixo com zoom/escala responsiva.
- Sistema de seleção por clique: destaca o elemento clicado com contorno elegante, tag indicativa (ex: "Título", "Parágrafo", "Cartão", "Imagem") e abre imediatamente os controles relevantes na barra lateral.
- Suporte a edição direta de texto (*contenteditable* inteligente sincronizado com o estado).

### Fase 4: Painel Lateral Não-Técnico
- Abas contextuais:
  - **Texto & Conteúdo:** Tipografia, alinhamento, formatação rica.
  - **Aparência & Cores:** Fundo do slide, cores do elemento, sombras, raios de borda, opacidade.
  - **Layout & Estrutura:** Trocar ordem de elementos, ajustar paddings e gaps visuais com sliders simples.
  - **Biblioteca de Temas:** Paletas de 1 clique que atualizam variáveis e estilos de todo o relatório.

### Fase 5: Assistente IA & Barra Flutuante de Atalhos
- Menu flutuante de ações de IA ao selecionar um bloco de texto.
- Modal/gaveta lateral para "Criar novo slide com IA" que gera o HTML do slide com a mesma gramática visual da apresentação atual.
- Sugestões de design e reformulação executiva.

### Fase 6: Apresentação Fullscreen, Desfazer/Refazer & Exportação
- Histórico de alterações (Undo / Redo).
- Visualizador em tela cheia com transições suaves.
- Exportador de arquivo único `.html` auto-contido para download direto.

---

## 3. Critérios de Validação
- Upload de relatórios HTML gerados por agentes funciona de forma transparente.
- Usuário clica em qualquer elemento do slide e altera cores, texto ou tamanhos sem tocar em código.
- IA gera novos slides mantendo o padrão visual e fontes existentes.
- O arquivo exportado abre de forma idêntica em qualquer navegador sem dependências externas.
