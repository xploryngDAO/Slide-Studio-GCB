export const CASAS_BAHIA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comitê de Marketplace | Diagnóstico Analítico de NPS, Curto Prazo & Voz do Cliente</title>
  
  <!-- Fontes Corporativas -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    :root {
      /* Paleta Corporativa */
      --color-primary: #002b66;         /* Azul corporativo base */
      --color-primary-dark: #001a40;    /* Azul profundo */
      --color-secondary: #0066cc;       /* Azul secundário / destaque */
      --color-accent: #e31c2d;          /* Vermelho acento Casas Bahia */
      --color-accent-text: #A50F2A;     /* Vermelho escuro de contraste */
      
      /* Indicadores e Categorias */
      --color-promoter: #0d9488;        /* Verde promotor / sucesso */
      --color-detractor: #e11d48;       /* Vermelho detrator / crítico */
      --color-neutral: #f59e0b;         /* Âmbar neutro / atenção */
      --color-info: #0284c7;            /* Azul informação */

      /* Superfícies e Fundos */
      --color-bg: #f8fafc;              /* Fundo claro da apresentação */
      --color-surface: #ffffff;         /* Superfície de cartões */
      --color-surface-alt: #f1f5f9;     /* Superfície alternada */
      --color-border: #e2e8f0;          /* Borda padrão */
      --color-border-subtle: #cbd5e1;   /* Borda sutil */

      /* Textos */
      --color-text: #0f172a;            /* Texto principal escuro */
      --color-text-muted: #64748b;      /* Texto de apoio e legendas */
      --color-text-on-dark: #fcfcfc;    /* Texto sobre fundos escuros */

      /* Raios de Borda */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;

      /* Sombras */
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-container: 0 25px 50px -12px rgba(0, 0, 0, 0.45);

      /* Tipografia */
      --font-display: 'Montserrat', -apple-system, sans-serif;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #0b1329;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--color-text);
    }

    /* Container Widescreen 16:9 */
    .presentation-container {
      width: 100vw;
      height: 100vh;
      max-width: 1440px;
      max-height: 810px;
      aspect-ratio: 16 / 9;
      display: flex;
      flex-direction: column;
      position: relative;
      background: var(--color-bg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-container);
      overflow: hidden;
    }

    /* Header Corporativo Fixo */
    .header-bar {
      background: linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-secondary) 100%);
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 26px;
      z-index: 10;
      flex-shrink: 0;
      border-bottom: 3px solid var(--color-accent);
    }

    .brand-logo-area {
      display: flex;
      align-items: center;
    }

    .logo-badge {
      background: #ffffff;
      color: var(--color-primary);
      font-weight: 800;
      border-radius: 9999px;
      padding: 4px 12px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: var(--font-display);
    }

    .brand-title {
      color: #ffffff;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 13px;
      margin-left: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-meta {
      display: flex;
      align-items: center;
    }

    .header-tag {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }

    .header-text {
      color: rgba(255, 255, 255, 0.85);
      font-size: 12px;
      margin-left: 10px;
    }

    /* Viewport de Slides */
    .slide-viewport {
      flex: 1;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px 32px;
      display: flex;
      flex-direction: column;
    }

    .slide {
      display: none;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 100%;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .slide.active {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    /* Títulos */
    .slide-eyebrow {
      color: var(--color-accent);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .slide-title {
      font-family: var(--font-display);
      font-size: 22px;
      color: var(--color-primary-dark);
      font-weight: 800;
      text-transform: uppercase;
      margin: 0 0 3px 0;
      line-height: 1.15;
    }

    .slide-subtitle {
      color: var(--color-text-muted);
      font-size: 12.5px;
      margin: 0 0 12px 0;
    }

    /* Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 8px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 8px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 8px;
    }

    .grid-7-5 {
      display: grid;
      grid-template-columns: 7fr 5fr;
      gap: 12px;
      margin-bottom: 8px;
      flex: 1;
    }

    .grid-5-7 {
      display: grid;
      grid-template-columns: 5fr 7fr;
      gap: 12px;
      margin-bottom: 8px;
      flex: 1;
    }

    /* Cartões */
    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 11.5px;
      font-weight: 700;
      color: var(--color-primary-dark);
      margin-bottom: 8px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* KPI Cards */
    .kpi-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--color-secondary);
    }

    .kpi-card.promoter { border-left-color: var(--color-promoter); }
    .kpi-card.detractor { border-left-color: var(--color-detractor); }
    .kpi-card.neutral { border-left-color: var(--color-neutral); }
    .kpi-card.accent { border-left-color: var(--color-accent); }

    .kpi-label {
      font-size: 10px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--color-text-muted);
      font-weight: 700;
    }

    .kpi-value {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.1;
      margin: 2px 0;
    }

    .kpi-subtext {
      font-size: 10.5px;
      color: var(--color-text-muted);
    }

    /* Badges */
    .badge {
      border-radius: 9999px;
      padding: 2px 7px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
    }

    .badge-success { background: #ecfdf5; color: var(--color-promoter); }
    .badge-danger { background: #fff1f2; color: var(--color-detractor); }
    .badge-warning { background: #fffbeb; color: var(--color-neutral); }
    .badge-info { background: #f0f9ff; color: var(--color-info); }

    /* Action Box */
    .action-box {
      background: #f0f7ff;
      border-left: 4px solid var(--color-secondary);
      padding: 8px 12px;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin-top: 6px;
      font-size: 11.5px;
      color: var(--color-primary-dark);
      line-height: 1.38;
    }

    .action-box.alert {
      background: #fff5f5;
      border-left-color: var(--color-accent);
      color: var(--color-accent-text);
    }

    /* Tabelas */
    .custom-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }

    .custom-table th {
      background: var(--color-surface-alt);
      color: var(--color-primary-dark);
      text-transform: uppercase;
      font-size: 9.5px;
      font-weight: 700;
      padding: 6px 8px;
      text-align: left;
      border-bottom: 2px solid var(--color-border);
    }

    .custom-table td {
      padding: 6px 8px;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text);
    }

    .custom-table tbody tr:nth-child(even) {
      background: #fafcff;
    }

    /* Drivers e Barras */
    .driver-item {
      margin-bottom: 7px;
    }

    .driver-header {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .driver-bar-wrapper {
      height: 6px;
      background: var(--color-border);
      border-radius: 9999px;
      overflow: hidden;
    }

    .driver-bar {
      height: 100%;
      border-radius: 9999px;
    }

    /* Verbatims Cards */
    .verbatim-card {
      background: var(--color-surface-alt);
      border-left: 3px solid var(--color-accent);
      padding: 7px 10px;
      border-radius: 4px;
      margin-bottom: 6px;
      font-size: 10.5px;
      line-height: 1.35;
      color: var(--color-text);
      font-style: italic;
    }

    /* Abas */
    .tabs-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .tabs-header {
      display: flex;
      border-bottom: 2px solid var(--color-border);
      gap: 10px;
      margin-bottom: 8px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      color: var(--color-secondary);
      border-bottom-color: var(--color-secondary);
      font-weight: 700;
    }

    .tab-content {
      display: none;
      flex: 1;
      animation: fadeIn 0.2s ease;
    }

    .tab-content.active {
      display: flex;
      flex-direction: column;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Slide de Capa */
    .cover-slide {
      background: radial-gradient(circle at top right, rgba(0, 102, 204, 0.45), transparent 65%), linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 70%, #00122e 100%);
      color: #ffffff;
      border-radius: var(--radius-sm);
      padding: 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      height: 100%;
    }

    .cover-tagline {
      font-family: var(--font-display);
      font-size: 30px;
      text-transform: uppercase;
      font-weight: 900;
      line-height: 1.15;
      margin: 12px 0 8px 0;
      color: #ffffff;
      max-width: 950px;
    }

    .cover-desc {
      font-size: 13.5px;
      max-width: 880px;
      color: #e2e8f0;
      line-height: 1.45;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 16px;
    }

    .cover-meta-item {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      backdrop-filter: blur(4px);
    }

    .cover-meta-item .label {
      font-size: 9.5px;
      text-transform: uppercase;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }

    .cover-meta-item .value {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 2px;
    }

    /* Footer Fixo */
    .footer-bar {
      height: 44px;
      background: var(--color-surface);
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
      z-index: 10;
      font-size: 11px;
    }

    .footer-hints {
      color: var(--color-text-muted);
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    kbd {
      background: var(--color-surface-alt);
      border: 1px solid var(--color-border-subtle);
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 9.5px;
      color: var(--color-text);
      font-weight: 600;
    }

    .progress-track {
      width: 200px;
      height: 6px;
      background: var(--color-border);
      border-radius: 9999px;
      overflow: hidden;
      margin: 0 14px;
    }

    .progress-fill {
      height: 100%;
      background: var(--color-secondary);
      transition: width 0.3s ease;
      width: 9.1%;
    }

    .footer-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .slide-counter {
      font-weight: 700;
      color: var(--color-text);
      font-size: 11px;
      min-width: 85px;
      text-align: right;
    }

    .nav-btn {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .nav-btn:hover:not(:disabled) {
      background: var(--color-surface-alt);
      border-color: var(--color-border-subtle);
    }

    .nav-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .nav-btn.primary {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      color: #ffffff;
    }

    .nav-btn.primary:hover:not(:disabled) {
      background: #0052a3;
    }

    .canvas-container {
      position: relative;
      width: 100%;
      height: 195px;
    }
  </style>
</head>
<body>

  <div class="presentation-container">
    <!-- Header Fixo -->
    <header class="header-bar">
      <div class="brand-logo-area">
        <span class="logo-badge">Grupo Casas Bahia</span>
        <span class="brand-title">Comitê de Marketplace &amp; Backoffice</span>
      </div>
      <div class="header-meta">
        <span class="header-tag">Diagnóstico Executivo</span>
        <span class="header-text">NPS Real, Curto Prazo (Q3) &amp; Voz do Cliente</span>
      </div>
    </header>

    <!-- Viewport -->
    <main class="slide-viewport">

      <!-- SLIDE 1: Capa Executiva -->
      <section class="slide active">
        <div class="cover-slide">
          <div>
            <span class="badge badge-info" style="background: rgba(255,255,255,0.18); color: #fff;">Comitê Executivo de Marketplace</span>
            <h1 class="cover-tagline">NPS sob a Ótica Operacional: Matriz Marginal, Curto Prazo &amp; Voz do Cliente</h1>
            <p class="cover-desc">
              Diagnóstico 100% analítico estruturado sobre <strong>138.348 avaliações de NPS (jan-set/2026)</strong>, <strong>25.674 protocolos de atendimento</strong> e <strong>32.004 comentários espontâneos</strong>. Conectando a taxa de cancelamento (28,3%) e perdas de R$ 85,6M à esteira de entrega, ao comportamento de curto prazo (Q3) e às alavancas de <strong>CB Full</strong> e <strong>CB Entrega</strong>.
            </p>
          </div>

          <div class="cover-meta-grid">
            <div class="cover-meta-item">
              <div class="label">Público-Alvo</div>
              <div class="value">Gerentes de Marketplace</div>
            </div>
            <div class="cover-meta-item">
              <div class="label">Amostra Analisada</div>
              <div class="value">138.348 Clientes (Jan-Set/26)</div>
            </div>
            <div class="cover-meta-item">
              <div class="label">NPS Consolidado / Q3</div>
              <div class="value">58,3 (Ano) | 60,4 (Q3)</div>
            </div>
            <div class="cover-meta-item">
              <div class="label">Foco Central</div>
              <div class="value">Impacto Marginal &amp; Governança</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 2: Panorama Executivo Consolidado do Ano -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 1 | Visão Macro do Ano</div>
        <h2 class="slide-title">Panorama Executivo | O Reflexo Operacional no NPS</h2>
        <p class="slide-subtitle">A nota de NPS consolidada reflete com precisão os atritos de expedição e cancelamento reportados pelo Backoffice.</p>

        <div class="grid-4">
          <div class="kpi-card">
            <div class="kpi-label">NPS Consolidado Mktp</div>
            <div class="kpi-value" style="color: var(--color-primary);">58,3</div>
            <div class="kpi-subtext">75,9% Promotores | 17,6% Detratores</div>
          </div>
          <div class="kpi-card promoter">
            <div class="kpi-label">Entrega no Prazo / Antecipada</div>
            <div class="kpi-value" style="color: var(--color-promoter);">+75,7</div>
            <div class="kpi-subtext">99.434 pedidos (71,9% da base)</div>
          </div>
          <div class="kpi-card detractor">
            <div class="kpi-label">Entrega Fora do Prazo</div>
            <div class="kpi-value" style="color: var(--color-detractor);">+17,9</div>
            <div class="kpi-subtext">19.628 pedidos (<span style="font-weight:700;">-57,8 p.p. queda</span>)</div>
          </div>
          <div class="kpi-card accent">
            <div class="kpi-label">Não Entregue / Extravio</div>
            <div class="kpi-value" style="color: var(--color-accent);">-51,9</div>
            <div class="kpi-subtext">8.758 pedidos em litígio e cancelamento</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">Impacto da Abertura de Protocolo no SAC (TeveProtocolo)</div>
            <div style="display:flex; justify-content:space-around; align-items:center; height: 130px;">
              <div style="text-align:center;">
                <div style="font-size: 26px; font-weight: 800; color: var(--color-promoter); font-family: var(--font-display);">+76,1</div>
                <div style="font-size: 10px; font-weight:700; text-transform:uppercase; color: var(--color-text-muted);">Sem Protocolo no SAC</div>
                <div style="font-size: 10.5px; color: var(--color-text-muted);">112.674 clientes (81,4%)</div>
              </div>
              <div style="border-left: 2px solid var(--color-border); height: 65px;"></div>
              <div style="text-align:center;">
                <div style="font-size: 26px; font-weight: 800; color: var(--color-detractor); font-family: var(--font-display);">-19,9</div>
                <div style="font-size: 10px; font-weight:700; text-transform:uppercase; color: var(--color-detractor);">Com Protocolo no SAC</div>
                <div style="font-size: 10.5px; color: var(--color-text-muted);">25.674 clientes (18,6%)</div>
              </div>
            </div>
            <div class="action-box alert" style="margin-top: 0;">
              <strong>Quebra de Confiança:</strong> O ato de abrir um chamado no SAC drena <strong>96 pontos de NPS</strong>. Clientes com entrega fluida são altamente promotores (+76,1).
            </div>
          </div>

          <div class="card">
            <div class="card-title">Conexão com Dados Reais do Backoffice</div>
            <p style="font-size: 11.5px; line-height: 1.45; color: var(--color-text);">
              O Backoffice evidenciou em setembro uma taxa de cancelamento efetivado de <strong>28,3% (67.015 pedidos e R$ 85,6M)</strong> e o ápice de reclamações operacionais de 2026.
            </p>
            <p style="font-size: 11.5px; line-height: 1.45; color: var(--color-text); margin-top: 5px;">
              Na base de NPS, a jornada de <strong>CANCELAMENTO tem nota de -53,8</strong> (9.397 clientes respondentes), enquanto a jornada regular de entrega (SAI CD) apresenta <strong>+66,4</strong>.
            </p>
            <div class="action-box">
              <strong>Síntese para Gerentes:</strong> A insatisfação não está na marca Casas Bahia, mas concentrada nos 28.386 clientes impactados por atrasos, extravios e cancelamentos de sellers.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: Análise de Curto Prazo (Evolução Mensal & Tipo de Lojista) -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 2 | Análise de Curto Prazo (Q3 Recente)</div>
        <h2 class="slide-title">Curto Prazo | Evolução Mensal &amp; Tipo de Lojista (Jul a Set/26)</h2>
        <p class="slide-subtitle">Amostra recente de <strong>29.804 clientes respondentes</strong> nos últimos 3 meses: comportamento do NPS e dispersão por modelo de gestão.</p>

        <div class="grid-7-5">
          <div class="card">
            <div class="card-title">Evolução Mensal de Curto Prazo (Data da Pesquisa)</div>
            <div class="canvas-container">
              <canvas id="chartQ3Trend" data-chart="q3Trend"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Comportamento Recente por Tipo de Lojista</div>
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Tipo de Lojista</th>
                  <th>Jul/26</th>
                  <th>Ago/26</th>
                  <th>Set/26</th>
                  <th>Média Q3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Assistido Operações</strong></td>
                  <td>67,7</td>
                  <td>70,5</td>
                  <td>66,1</td>
                  <td style="font-weight:700; color:var(--color-promoter);">68,4</td>
                </tr>
                <tr>
                  <td><strong>Fulfillment Mar Aberto</strong></td>
                  <td>71,4</td>
                  <td>65,5</td>
                  <td>66,1</td>
                  <td style="font-weight:700; color:var(--color-promoter);">68,1</td>
                </tr>
                <tr>
                  <td><strong>Não Assistido</strong></td>
                  <td>58,9</td>
                  <td style="color:var(--color-detractor); font-weight:700;">50,3</td>
                  <td>57,1</td>
                  <td style="font-weight:700; color:var(--color-neutral);">55,8</td>
                </tr>
                <tr style="background:#fff1f2;">
                  <td><strong>Fulfillment 3P</strong></td>
                  <td>39,5</td>
                  <td style="color:var(--color-detractor); font-weight:800;">12,9</td>
                  <td style="color:var(--color-detractor); font-weight:800;">13,8</td>
                  <td style="font-weight:800; color:var(--color-detractor);">28,3</td>
                </tr>
              </tbody>
            </table>

            <div class="action-box alert" style="margin-top: 8px;">
              <strong>Alerta no Fulfillment 3P:</strong> Queda de <strong>26,6 p.p.</strong> entre julho e agosto/setembro no Full, provocada por rupturas de estoque em sellers âncora do armazém.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 4: Performance Logística no Curto Prazo -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 2 | Análise de Curto Prazo (Q3 Recente)</div>
        <h2 class="slide-title">Curto Prazo | Logística &amp; Aderência a Serviços Casas Bahia</h2>
        <p class="slide-subtitle">Como as modalidades de transporte se comportaram no trimestre mais recente (Julho a Setembro/2026).</p>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">NPS Trimestral por Modalidade Logística (Últimos 3 Meses)</div>
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Modalidade</th>
                  <th>Jul/26</th>
                  <th>Ago/26</th>
                  <th>Set/26</th>
                  <th>Média Q3</th>
                  <th>Vol. Q3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Própria 3P (Seller)</strong></td>
                  <td>65,3</td>
                  <td>64,7</td>
                  <td>64,4</td>
                  <td style="font-weight:700; color:var(--color-secondary);">64,9</td>
                  <td>20.116</td>
                </tr>
                <tr>
                  <td><strong>CB Entrega (Postagem)</strong></td>
                  <td>55,2</td>
                  <td>41,5</td>
                  <td>41,1</td>
                  <td style="font-weight:700; color:var(--color-neutral);">48,8</td>
                  <td>2.791</td>
                </tr>
                <tr>
                  <td><strong>CB Entrega (Coleta)</strong></td>
                  <td>42,4</td>
                  <td style="color:var(--color-detractor); font-weight:700;">24,1</td>
                  <td>54,8</td>
                  <td style="font-weight:700; color:var(--color-neutral);">38,0</td>
                  <td>1.166</td>
                </tr>
                <tr style="background: #fff5f5;">
                  <td><strong>CB Full (Armazém CB)</strong></td>
                  <td>37,5</td>
                  <td style="color:var(--color-detractor); font-weight:800;">11,0</td>
                  <td style="color:var(--color-detractor); font-weight:800;">11,6</td>
                  <td style="font-weight:800; color:var(--color-detractor);">26,3</td>
                  <td>1.246</td>
                </tr>
              </tbody>
            </table>

            <div class="action-box">
              <strong>Fundo de Poço em Agosto:</strong> A Coleta bateu 24,1 e o Full 11,0 em agosto, refletindo a sobrecarga operacional e atraso nos SLAs pré-coleta de sellers.
            </div>
          </div>

          <div class="card">
            <div class="card-title">Corte Estratégico: CbEntrega Sim vs. Não (Curto Prazo)</div>
            <div style="height: 140px; display:flex; flex-direction:column; justify-content:center; gap: 8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f1f5f9; padding:8px 12px; border-radius:6px;">
                <div>
                  <div style="font-size:11px; font-weight:700; color:var(--color-primary-dark);">CbEntrega = Não (Transportador Seller)</div>
                  <div style="font-size:10px; color:var(--color-text-muted);">24.549 avaliações no Q3 (82,4% do volume)</div>
                </div>
                <div style="font-size:20px; font-weight:800; color:var(--color-secondary); font-family:var(--font-display);">NPS 64,6</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff1f2; padding:8px 12px; border-radius:6px; border-left:3px solid var(--color-detractor);">
                <div>
                  <div style="font-size:11px; font-weight:700; color:var(--color-detractor);">CbEntrega = Sim (Serviços Casas Bahia)</div>
                  <div style="font-size:10px; color:var(--color-text-muted);">5.255 avaliações no Q3 (Jul: 48,1 | Ago: 30,9 | Set: 37,8)</div>
                </div>
                <div style="font-size:20px; font-weight:800; color:var(--color-detractor); font-family:var(--font-display);">NPS 40,9</div>
              </div>
            </div>

            <div class="action-box alert">
              <strong>Diagnóstico Indispensável:</strong> No curto prazo, a malha da casa sofreu com descalibração de sellers específicos. O desafio comercial é alinhar estoque e abastecimento antes de faturar.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 5: A Voz do Cliente (Classificação dos Comentários Espontâneos) -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 3 | Voz do Cliente &amp; Sentimento</div>
        <h2 class="slide-title">A Voz do Cliente | Análise Textual dos Comentários Espontâneos</h2>
        <p class="slide-subtitle">Classificação temática sobre <strong>32.004 comentários reais</strong> (13.234 de clientes detratores) e verbatims literais da base.</p>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">Distribuição de Temas nos Comentários dos Detratores</div>
            
            <div class="driver-item">
              <div class="driver-header">
                <span>1. Cancelamento / Demora de Estorno e Reembolso</span>
                <span style="color:var(--color-detractor);">26,8% (3.543 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:26.8%; background:var(--color-detractor);"></div>
              </div>
            </div>

            <div class="driver-item">
              <div class="driver-header">
                <span>2. Atraso na Entrega / Quebra do Prazo</span>
                <span style="color:var(--color-detractor);">21,4% (2.836 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:21.4%; background:var(--color-detractor);"></div>
              </div>
            </div>

            <div class="driver-item">
              <div class="driver-header">
                <span>3. Falta de Atendimento / SAC Sem Resposta do Seller</span>
                <span style="color:var(--color-neutral);">18,4% (2.440 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:18.4%; background:var(--color-neutral);"></div>
              </div>
            </div>

            <div class="driver-item">
              <div class="driver-header">
                <span>4. Produto com Defeito / Divergente / Avariado</span>
                <span style="color:var(--color-info);">10,0% (1.319 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:10.0%; background:var(--color-info);"></div>
              </div>
            </div>

            <div class="driver-item">
              <div class="driver-header">
                <span>5. Não Recebido / Constando Entregue Indevidamente</span>
                <span style="color:var(--color-accent);">6,7% (885 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:6.7%; background:var(--color-accent);"></div>
              </div>
            </div>

            <div class="driver-item">
              <div class="driver-header">
                <span>6. Fricção de Confiança com o Marketplace</span>
                <span style="color:var(--color-primary-dark);">4,5% (599 citações)</span>
              </div>
              <div class="driver-bar-wrapper">
                <div class="driver-bar" style="width:4.5%; background:var(--color-primary-dark);"></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Citações Literais dos Clientes (Verbatims Reais)</div>
            
            <div class="verbatim-card">
              "Comprei e não vi que era de um parceiro que apenas utiliza a plataforma e vocês não se responsabilizam... Tento entrar em contato porque o produto não era o mesmo mas ninguém responde. Já passou o prazo e não consegui contato!"
            </div>

            <div class="verbatim-card">
              "É quase impossível falar com a empresa parceira para cancelar o pedido. Um fica direcionando para o outro e não estornam o valor pago no cartão."
            </div>

            <div class="verbatim-card">
              "O Fogão foi entregue hoje mas não no meu endereço, foi simplesmente entregue em um BAZAR longe da minha casa, não recebi ligação de ninguém avisando..."
            </div>

            <div class="action-box alert">
              <strong>Aprendizado Central:</strong> A detração máxima é gerada quando a falha de entrega é seguida pela ausência de suporte no cancelamento e demora no estorno.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 6: A Esteira de Atendimento (Cronologia do Protocolo) -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 3 | Voz do Cliente &amp; Protocolos SAC</div>
        <h2 class="slide-title">A Esteira de SAC | Impacto Cronológico &amp; Categorias Ofensoras</h2>
        <p class="slide-subtitle">Cruzamento entre <strong>DataPesquisa vs. DataProtocolo</strong> e a hierarquia temática (\`CategoriaN1, N2 e N3\`).</p>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">A Ordem Temporal Dita a Nota do Cliente</div>
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Momento do Protocolo vs. Pesquisa</th>
                  <th>Volume</th>
                  <th>% Base SAC</th>
                  <th>NPS Real</th>
                  <th>Impacto no Cliente</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background:#fff1f2;">
                  <td><strong>Protocolo Aberto ANTES da Pesquisa</strong></td>
                  <td>19.272</td>
                  <td>75,1%</td>
                  <td style="font-weight:800; color:var(--color-detractor);">-29,0</td>
                  <td>Cliente responde à pesquisa desgastado pelo atrito</td>
                </tr>
                <tr style="background:#fff5f5;">
                  <td><strong>Protocolo Aberto no MESMO DIA</strong></td>
                  <td>3.409</td>
                  <td>13,3%</td>
                  <td style="font-weight:800; color:var(--color-detractor);">-35,2</td>
                  <td>Pico máximo de estresse e insatisfação ativa</td>
                </tr>
                <tr>
                  <td><strong>Protocolo Aberto DEPOIS da Pesquisa</strong></td>
                  <td>2.993</td>
                  <td>11,6%</td>
                  <td style="font-weight:700; color:var(--color-promoter);">+55,5</td>
                  <td>Pesquisa avaliou a compra; chamado foi dúvida posterior</td>
                </tr>
              </tbody>
            </table>

            <div class="action-box alert" style="margin-top: 8px;">
              <strong>Delta de Atrito:</strong> Abrir chamado antes da pesquisa derruba o NPS de <strong>+76,1 para -29,0 (queda de 105 p.p.)</strong>. Resolver sem acionar SAC é mandatório.
            </div>
          </div>

          <div class="card">
            <div class="card-title">Top Ofensores Temáticos (\`CategoriaN1 / N2 / N3\`)</div>
            <div style="font-size:11px; line-height:1.45; color:var(--color-text);">
              <div style="background:var(--color-surface-alt); padding:7px 9px; border-radius:4px; margin-bottom:5px;">
                <strong>Reclamação sobre Separação de Pedidos (N2):</strong> NPS <strong>-81,3</strong> (214 casos). É a pior nota de toda a base.
              </div>
              <div style="background:var(--color-surface-alt); padding:7px 9px; border-radius:4px; margin-bottom:5px;">
                <strong>Reclamação sobre Atraso de Entrega (N3):</strong> 7.051 casos antes da pesquisa com NPS <strong>-41,3</strong>. Concentra o maior volume bruto.
              </div>
              <div style="background:var(--color-surface-alt); padding:7px 9px; border-radius:4px; margin-bottom:5px;">
                <strong>Divergente vs. Recebido (N3):</strong> 639 casos antes da pesquisa com NPS <strong>-75,6</strong> (produto trocado gera nota zero imediata).
              </div>
              <div style="background:var(--color-surface-alt); padding:7px 9px; border-radius:4px;">
                <strong>Desconhece Entrega (N3):</strong> 987 casos antes da pesquisa com NPS <strong>-51,8</strong>.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 7: Matriz de Impacto Marginal Consolidada do Ano -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 4 | Matrizes de Impacto Marginal</div>
        <h2 class="slide-title">Matriz Consolidada do Ano | Lojistas de Maior Impacto Negativo</h2>
        <p class="slide-subtitle">Metodologia factual: <strong>NPS Base (58,27) vs. NPS da Base sem o Lojista</strong>. Impacto negativo indica dreno na nota.</p>

        <div class="card" style="margin-bottom: 6px;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Lojista / Seller Real</th>
                <th>Modalidade</th>
                <th>Tipo Lojista</th>
                <th>Respostas</th>
                <th>NPS Seller</th>
                <th>Impacto Marginal</th>
                <th>% Atraso</th>
                <th>% Não Entregue</th>
                <th>Ofensor Operacional</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fff1f2;">
                <td><strong>EASYTECH TECNOLOGIA</strong></td>
                <td><span class="badge badge-warning">Coleta</span></td>
                <td>Não Assistido</td>
                <td>2.498</td>
                <td style="font-weight:700; color:var(--color-detractor);">33,2</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,460 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">56,9%</td>
                <td>4,2%</td>
                <td>Atraso de entrega na coleta</td>
              </tr>
              <tr>
                <td><strong>WEBCONTINENTAL</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Assistido Operações</td>
                <td>5.080</td>
                <td style="font-weight:700; color:var(--color-detractor);">49,5</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,334 p.p.</td>
                <td>9,5%</td>
                <td>8,8%</td>
                <td>Cancelamento e estorno no SAC</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>MELHOR PARA VOCE FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>1.730</td>
                <td style="font-weight:700; color:var(--color-detractor);">32,0</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,332 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">37,6%</td>
                <td>9,5%</td>
                <td>Atraso de expedição no armazém</td>
              </tr>
              <tr>
                <td><strong>MOBLY COMERCIO VAREJISTA LTDA</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Não Assistido</td>
                <td>1.171</td>
                <td style="font-weight:700; color:var(--color-detractor);">34,9</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,199 p.p.</td>
                <td>9,7%</td>
                <td style="color:var(--color-detractor); font-weight:700;">20,1%</td>
                <td>Extravio e falha de entrega 3P</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>NEGOCIUM FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>667</td>
                <td style="font-weight:700; color:var(--color-detractor);">21,1</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,180 p.p.</td>
                <td>25,0%</td>
                <td style="color:var(--color-detractor); font-weight:700;">27,1%</td>
                <td>Ruptura de estoque no Full</td>
              </tr>
              <tr>
                <td><strong>MADEIRAMADEIRA</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Assistido Operações</td>
                <td>3.722</td>
                <td style="font-weight:700; color:var(--color-neutral);">53,1</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,142 p.p.</td>
                <td>6,1%</td>
                <td>10,3%</td>
                <td>Atrito pós-venda e cancelamento</td>
              </tr>
              <tr>
                <td><strong>TGN COMERCIO DE COLCHOES LTDA</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Não Assistido</td>
                <td>1.249</td>
                <td style="font-weight:700; color:var(--color-neutral);">44,1</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,129 p.p.</td>
                <td>21,0%</td>
                <td>5,0%</td>
                <td>Atraso de linha pesada</td>
              </tr>
              <tr>
                <td><strong>OLIST</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Assistido Operações</td>
                <td>3.002</td>
                <td style="font-weight:700; color:var(--color-neutral);">52,5</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,129 p.p.</td>
                <td>5,4%</td>
                <td>8,5%</td>
                <td>Cancelamento e devoluções</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>NEWMAQ FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>415</td>
                <td style="font-weight:700; color:var(--color-detractor);">20,7</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,113 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">36,1%</td>
                <td>8,4%</td>
                <td>Atraso no fulfillment</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>UPKEEN FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Não Assistido</td>
                <td>466</td>
                <td style="font-weight:700; color:var(--color-detractor);">27,0</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,106 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">45,5%</td>
                <td>12,7%</td>
                <td>Atraso severo de expedição</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="action-box alert">
          <strong>Impacto Conjunto:</strong> O Top 10 acima soma 20.000 avaliações e é responsável por drenar <strong>-2,44 p.p.</strong> do NPS global. Ao sanar a operação desse grupo, a nota do Marketplace salta de <strong>58,3 para 60,7</strong>.
        </div>
      </section>

      <!-- SLIDE 8: Matriz de Impacto Marginal de Curto Prazo (Q3 Recente) -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 4 | Matrizes de Impacto Marginal</div>
        <h2 class="slide-title">Matriz de Curto Prazo | Top Ofensores Recentes (Jul a Set/26)</h2>
        <p class="slide-subtitle">Cálculo de impacto marginal específico sobre a base recente do Q3 (NPS Base Q3: <strong>60,38</strong>).</p>

        <div class="card" style="margin-bottom: 6px;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Lojista Real (Curto Prazo)</th>
                <th>Modalidade Q3</th>
                <th>Tipo Lojista</th>
                <th>Respostas Q3</th>
                <th>NPS Q3</th>
                <th>Impacto Marginal Q3</th>
                <th>% Atraso Q3</th>
                <th>% Não Entregue Q3</th>
                <th>Comportamento Recente</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fff1f2;">
                <td><strong>MELHOR PARA VOCE FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>330</td>
                <td style="font-weight:800; color:var(--color-detractor);">24,2</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,405 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">42,1%</td>
                <td>12,4%</td>
                <td><strong>Maior ofensor recente:</strong> 54,5% de pedidos com falha</td>
              </tr>
              <tr>
                <td><strong>WEBCONTINENTAL</strong></td>
                <td><span class="badge badge-danger">Própria 3P</span></td>
                <td>Assistido Operações</td>
                <td>1.178</td>
                <td style="font-weight:700; color:var(--color-detractor);">51,0</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,385 p.p.</td>
                <td>11,0%</td>
                <td>10,2%</td>
                <td>Volume alto com atrito em cancelamento</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>NEGOCIUN</strong></td>
                <td><span class="badge badge-warning">Coleta</span></td>
                <td>Não Assistido</td>
                <td>290</td>
                <td style="font-weight:800; color:var(--color-detractor);">21,7</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,380 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">38,3%</td>
                <td>17,6%</td>
                <td>Atraso de coleta e não entregas</td>
              </tr>
              <tr>
                <td><strong>EASYTECH TECNOLOGIA</strong></td>
                <td><span class="badge badge-warning">Coleta</span></td>
                <td>Não Assistido</td>
                <td>206</td>
                <td style="font-weight:700; color:var(--color-detractor);">30,1</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,211 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">52,4%</td>
                <td>8,7%</td>
                <td>Persistência de mais de 50% de atraso</td>
              </tr>
              <tr style="background: #fff1f2;">
                <td><strong>NEGOCIUM FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>227</td>
                <td style="font-weight:700; color:var(--color-detractor);">33,0</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,210 p.p.</td>
                <td>19,8%</td>
                <td style="color:var(--color-detractor); font-weight:700;">22,5%</td>
                <td>Ruptura crítica no armazém Full</td>
              </tr>
              <tr>
                <td><strong>MYWIT E ASSURANT ECOPHONE</strong></td>
                <td><span class="badge badge-warning">Postagem</span></td>
                <td>Não Assistido</td>
                <td>258</td>
                <td style="font-weight:700; color:var(--color-detractor);">37,2</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,202 p.p.</td>
                <td style="color:var(--color-detractor); font-weight:700;">56,6%</td>
                <td>3,1%</td>
                <td><strong>Novo ofensor Q3:</strong> Atraso massivo em postagens</td>
              </tr>
              <tr>
                <td><strong>COMMCENTER FULFILLMENT</strong></td>
                <td><span class="badge badge-info">CB Full</span></td>
                <td>Fulfillment 3P</td>
                <td>96</td>
                <td style="font-weight:800; color:var(--color-detractor);">9,4</td>
                <td style="font-weight:800; color:var(--color-detractor);">-0,165 p.p.</td>
                <td>21,9%</td>
                <td style="color:var(--color-detractor); font-weight:700;">26,0%</td>
                <td><strong>Novo ofensor Q3:</strong> NPS crítico de 9,4 no Full</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="action-box alert">
          <strong>Ação Direcionada para os Gerentes de Contas:</strong> No trimestre recente, os parceiros <strong>Melhor Para Você, Negociun e Mywit Assurant</strong> despontaram como novos drenos urgentes que precisam de alinhamento operacional imediato.
        </div>
      </section>

      <!-- SLIDE 9: O Paradoxo dos Gigantes (Volume de SAC vs. NPS) -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 4 | Matrizes de Impacto Marginal</div>
        <h2 class="slide-title">O Paradoxo dos Gigantes | Volume Bruto de SAC vs. NPS Real</h2>
        <p class="slide-subtitle">Distinção analítica entre ofensores de volume de SAC e a percepção de lealdade e qualidade da marca.</p>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">1. O Efeito dos Grandes Fabricantes (Electrolux, Consul, Brastemp, Fast Shop)</div>
            <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
              No Comitê de Backoffice, <strong>Electrolux</strong> (4.749 rec), <strong>Consul</strong> (1.338 rec) e <strong>Brastemp</strong> (1.089 rec) aparecem no topo de chamados.
            </p>
            <div style="background: #ecfdf5; border-left: 3px solid var(--color-promoter); padding: 8px 10px; margin: 6px 0; border-radius: var(--radius-sm);">
              <div style="font-size: 11px; font-weight:700; color: var(--color-promoter);">Realidade no NPS: Puxam a Média do Marketplace para CIMA</div>
              <div style="font-size: 10.5px; color: var(--color-text-muted); line-height: 1.45;">
                • <strong>Fast Shop (Q3):</strong> 972 resp. | NPS <strong>85,2</strong> (Impacto Marginal: <strong>+0,836 p.p.</strong>)<br>
                • <strong>Electrolux (Ano):</strong> 11.515 resp. | NPS <strong>68,2</strong> (Impacto Marginal: <strong>+0,906 p.p.</strong>)<br>
                • <strong>Consul (Ano):</strong> 3.948 resp. | NPS <strong>68,4</strong> (Impacto Marginal: <strong>+0,298 p.p.</strong>)<br>
                • <strong>Brastemp (Ano):</strong> 3.769 resp. | NPS <strong>68,0</strong> (Impacto Marginal: <strong>+0,272 p.p.</strong>)
              </div>
            </div>
            <p style="font-size: 10.5px; color: var(--color-text-muted);">
              <strong>Conclusão:</strong> O alto volume de SAC desses parceiros é decorrência da escala massiva de vendas. O cliente é leal à marca. O foco com eles é integração de tracking e agilidade de SAC, e não restrição comercial.
            </p>
          </div>

          <div class="card">
            <div class="card-title">2. As Verdadeiras Ameaças de Destruição de Valor</div>
            <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
              O NPS revela sellers de médio porte que geram menos chamados brutos que uma Electrolux, mas possuem <strong>altíssima concentração de notas zero</strong>:
            </p>
            <div style="display:flex; flex-direction:column; gap: 5px; margin-top: 6px;">
              <div style="background: #fff1f2; padding: 6px 8px; border-radius: 4px; font-size: 10.5px;">
                <strong>Easytech Tecnologia:</strong> Maior destruidor da média anual (-0,46 p.p.). 56,9% de entregas fora do prazo na modalidade Coleta.
              </div>
              <div style="background: #fff1f2; padding: 6px 8px; border-radius: 4px; font-size: 10.5px;">
                <strong>Melhor Para Você:</strong> Pior ofensor de curto prazo (-0,405 p.p.). NPS de 24,2 e 42,1% de atraso em pleno Fulfillment.
              </div>
              <div style="background: #fff1f2; padding: 6px 8px; border-radius: 4px; font-size: 10.5px;">
                <strong>Mobly Comércio Varejista:</strong> 20,1% de entregas não concluídas/extravio na logística Própria 3P.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 10: Oportunidades & Argumentação Comercial com Serviços Casas Bahia -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 5 | Logística &amp; Estratégia Comercial</div>
        <h2 class="slide-title">CB Full &amp; CB Entrega | Oportunidades &amp; Pitch Comercial</h2>
        <p class="slide-subtitle">Como os Gerentes de Marketplace devem utilizar a logística da casa como solução de blindagem.</p>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">Oportunidade Real: A Promessa Funciona no Prazo</div>
            <p style="font-size: 11.5px; line-height: 1.45; color: var(--color-text);">
              Os dados comprovam: quando o <strong>CB Full entrega no prazo ou antecipado, o NPS atinge 75,9</strong>. Na Coleta, entregas no prazo atingem <strong>NPS 76,1</strong>.
            </p>
            <div class="action-box" style="margin: 8px 0;">
              <strong>O Gargalo Mapeado para Destravar:</strong><br>
              • <strong>CB Full:</strong> Eliminar divergências de inventário e ruptura de doca (combater os 13,6% de "Não entregue").<br>
              • <strong>CB Entrega (Coleta):</strong> Cobrar o cumprimento da janela de separação de 24h do seller para evitar que o caminhão colete pedidos em atraso.
            </div>
          </div>

          <div class="card">
            <div class="card-title">Pitch de Vendas para os Gerentes de Contas</div>
            <div style="display:flex; flex-direction:column; gap: 6px;">
              <div style="background: var(--color-surface-alt); padding: 7px 10px; border-radius: 4px;">
                <div style="font-size: 11px; font-weight:700; color: var(--color-primary-dark);">1. Blindagem contra Cancelamentos e Perda de Receita</div>
                <div style="font-size: 10.5px; color: var(--color-text-muted);">Sellers em Própria 3P perdem até 20% das vendas por cancelamentos decorrentes de atraso. No Full a entrega é garantida.</div>
              </div>
              <div style="background: var(--color-surface-alt); padding: 7px 10px; border-radius: 4px;">
                <div style="font-size: 11px; font-weight:700; color: var(--color-primary-dark);">2. Prioridade Algorítmica e Retenção de Buy Box</div>
                <div style="font-size: 10.5px; color: var(--color-text-muted);">Itens no CB Full ganham prioridade de exibição e conversão estimada 28% superior devido ao selo de pontualidade.</div>
              </div>
              <div style="background: var(--color-surface-alt); padding: 7px 10px; border-radius: 4px;">
                <div style="font-size: 11px; font-weight:700; color: var(--color-primary-dark);">3. Redução de Custos de Atendimento e Reversa</div>
                <div style="font-size: 10.5px; color: var(--color-text-muted);">A Casas Bahia assume a gestão da logística reversa e primeiro nível de atendimento.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 11: Planejamento de Atuação & Governança Integrada -->
      <section class="slide">
        <div class="slide-eyebrow">Bloco 5 | Plano de Ação &amp; Governança</div>
        <h2 class="slide-title">Planejamento de Atuação Integrada | O Papel dos Gerentes de Contas</h2>
        <p class="slide-subtitle">Iniciativas mandatórias acordadas entre Comercial de Marketplace, Backoffice e Logística.</p>

        <div class="tabs-container">
          <div class="tabs-header">
            <button class="tab-btn active" onclick="switchTab(event, 'tabAct1')">1. Intervenção nos Top Ofensores</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabAct2')">2. Regras de Elegibilidade &amp; Buy Box</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabAct3')">3. Rotina Semanal de Governança</button>
          </div>

          <div id="tabAct1" class="tab-content active">
            <div class="grid-3">
              <div class="card">
                <div class="card-title">Easytech &amp; Negociun (Coleta)</div>
                <div class="badge badge-danger" style="margin-bottom:5px;">Atraso > 38%</div>
                <p style="font-size: 10.5px; color: var(--color-text-muted); line-height: 1.4;">
                  Revisão imediata da janela de despacho. Redução da tolerância de separação para 24h antes do acionamento da coleta da transportadora.
                </p>
              </div>

              <div class="card">
                <div class="card-title">Melhor Para Você &amp; Negocium (Full)</div>
                <div class="badge badge-danger" style="margin-bottom:5px;">Ruptura de Armazém</div>
                <p style="font-size: 10.5px; color: var(--color-text-muted); line-height: 1.4;">
                  Auditoria de doca no armazém CB Full. Bloqueio de SKUs com divergência de saldo para impedir venda sem estoque disponível.
                </p>
              </div>

              <div class="card">
                <div class="card-title">Webcontinental &amp; Mobly (3P)</div>
                <div class="badge badge-danger" style="margin-bottom:5px;">SAC Cancelamento / Extravio</div>
                <p style="font-size: 10.5px; color: var(--color-text-muted); line-height: 1.4;">
                  Integração obrigatória de API de tracking em tempo real e agilização da confirmação de estorno em menos de 48h.
                </p>
              </div>
            </div>
            <div class="action-box">
              <strong>Entregável Imediato:</strong> Execução de Plano de Operação Padrão (POP) com metas de 15 dias para os 6 lojistas prioritários.
            </div>
          </div>

          <div id="tabAct2" class="tab-content">
            <div class="grid-2">
              <div class="card">
                <div class="card-title">Trava Algorítmica de Exposição (Buy Box)</div>
                <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
                  Sellers que mantiverem <strong>taxa de entrega fora do prazo superior a 25% por 2 semanas consecutivas</strong> ou taxa de cancelamento > 8% perderão temporariamente a elegibilidade do Buy Box em benefício de ofertas CB Full ou estoque 1P.
                </p>
              </div>

              <div class="card">
                <div class="card-title">Desconto Tarifário por Excelência</div>
                <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
                  Incentivo positivo na comissão (desconto de até 1,5 p.p.) para sellers que mantiverem <strong>NPS &ge; 75</strong> e utilizarem 100% da malha CB Entrega ou CB Full, garantindo alinhamento econômico.
                </p>
              </div>
            </div>
          </div>

          <div id="tabAct3" class="tab-content">
            <div class="grid-2">
              <div class="card">
                <div class="card-title">Comitê Semanal: Gerentes de Contas + Backoffice</div>
                <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
                  Agenda semanal mandatória de 45 minutos para acompanhamento do painel de <strong>Impacto Marginal em p.p.</strong> por lojista, deliberando sobre notificações, bloqueios e migrações para a malha da casa.
                </p>
              </div>

              <div class="card">
                <div class="card-title">Dashboard Operacional em Tempo Real</div>
                <p style="font-size: 11px; line-height: 1.45; color: var(--color-text);">
                  Disponibilização do indicador de impacto marginal diretamente na tela dos gerentes de contas, permitindo intervenção preventiva antes do fechamento do mês.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer Fixo com Navegação -->
    <footer class="footer-bar">
      <div class="footer-hints">
        <span>Navegação:</span>
        <kbd>◀</kbd> <kbd>▶</kbd> ou <kbd>Espaço</kbd>
        <span style="margin-left: 8px;">Tela cheia:</span>
        <kbd>F</kbd>
      </div>

      <div style="display:flex; align-items:center;">
        <div class="progress-track">
          <div id="progressFill" class="progress-fill"></div>
        </div>
        <span id="slideCounter" class="slide-counter">Slide 1 de 11</span>
      </div>

      <div class="footer-controls">
        <button id="prevBtn" class="nav-btn" disabled>Anterior</button>
        <button id="nextBtn" class="nav-btn primary">Próximo ❯</button>
        <button id="fullscreenBtn" class="nav-btn">⛶ Tela Cheia</button>
      </div>
    </footer>
  </div>

  <!-- Motor JavaScript Padrão Obrigatório -->
  <script>
    // Estado Global
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const progressFill = document.getElementById('progressFill');
    const chartsInitialized = {};

    // Atualização do Slide Ativo
    function updateSlide(index) {
      if (index < 0 || index >= totalSlides) return;
      slides[currentSlide].classList.remove('active');
      currentSlide = index;
      slides[currentSlide].classList.add('active');

      // Atualiza Contador e Progresso
      if (slideCounter) {
        slideCounter.textContent = \`Slide \${currentSlide + 1} de \${totalSlides}\`;
      }
      if (progressFill) {
        const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = \`\${progressPercent}%\`;
      }

      // Estado dos Botões
      if (prevBtn) prevBtn.disabled = (currentSlide === 0);
      if (nextBtn) {
        nextBtn.textContent = (currentSlide === totalSlides - 1) ? 'Início ↺' : 'Próximo ❯';
      }

      // Lazy Loading de Gráficos do Slide Ativo
      initChartForSlide(currentSlide);
    }

    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        updateSlide(currentSlide + 1);
      } else {
        updateSlide(0);
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        updateSlide(currentSlide - 1);
      }
    }

    // Eventos de Clique
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Navegação via Teclado
    document.addEventListener('keydown', (e) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        nextSlide();
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        prevSlide();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    });

    // Suporte a Modo Tela Cheia
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Controle de Abas (Tabs)
    function switchTab(evt, tabId) {
      const container = evt.currentTarget.closest('.tabs-container') || document;
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      evt.currentTarget.classList.add('active');
      const target = container.querySelector(\`#\${tabId}\`);
      if (target) target.classList.add('active');
    }

    // Inicialização Preguiçosa de Gráficos Chart.js com Dados Reais
    function initChartForSlide(slideIndex) {
      if (chartsInitialized[slideIndex]) return;
      chartsInitialized[slideIndex] = true;

      const currentSlideEl = slides[slideIndex];
      const canvases = currentSlideEl.querySelectorAll('canvas[data-chart]');
      
      canvases.forEach(canvas => {
        const chartType = canvas.getAttribute('data-chart');
        
        // Gráfico Slide 3: Tendência de Curto Prazo (Q3: Jul, Ago, Set/2026)
        if (chartType === 'q3Trend') {
          new Chart(canvas, {
            type: 'bar',
            data: {
              labels: ['Julho/26 (14.462)', 'Agosto/26 (10.166)', 'Setembro/26 (5.176)', 'Média Trimestre Q3'],
              datasets: [{
                label: 'NPS Real no Curto Prazo',
                data: [61.3, 58.9, 60.7, 60.4],
                backgroundColor: ['#0066cc', '#e11d48', '#0284c7', '#002b66'],
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { min: 50, max: 70, ticks: { font: { family: 'Inter', size: 10 } } },
                x: { ticks: { font: { family: 'Inter', size: 10 } } }
              }
            }
          });
        }
      });
    }

    // Inicialização ao carregar
    document.addEventListener('DOMContentLoaded', () => {
      updateSlide(0);
    });
  </script>
</body>
</html>`;
