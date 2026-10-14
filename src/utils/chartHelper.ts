import { Chart } from 'chart.js/auto';

/**
 * Initializes Chart.js instances for any canvas elements inside the slide container.
 * Specifically supports:
 * - Casas Bahia Q3 Trend NPS Bar Chart (data-chart="q3Trend" or id="chartQ3Trend")
 * - Dynamic charts configured with JSON in data-chart-data attribute
 */
export function initSlideCharts(container: HTMLElement | null): (() => void) {
  if (!container) return () => {};

  const canvases = container.querySelectorAll('canvas');
  if (canvases.length === 0) return () => {};

  const chartsCreated: Chart[] = [];

  canvases.forEach((canvas) => {
    const chartType = canvas.getAttribute('data-chart');
    const chartId = canvas.id;

    // Destroy existing chart on this canvas before re-initializing
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }

    // 1. Casas Bahia Q3 Trend Bar Chart
    if (chartType === 'q3Trend' || chartId === 'chartQ3Trend') {
      try {
        const chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Julho/26 (14.462)', 'Agosto/26 (10.166)', 'Setembro/26 (5.176)', 'Média Trimestre Q3'],
            datasets: [
              {
                label: 'NPS Real no Curto Prazo',
                data: [61.3, 58.9, 60.7, 60.4],
                backgroundColor: ['#0066cc', '#e11d48', '#0284c7', '#002b66'],
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` NPS: ${ctx.parsed.y} pts`,
                },
              },
            },
            scales: {
              y: {
                min: 50,
                max: 70,
                ticks: { font: { family: 'Inter, sans-serif', size: 10 } },
                grid: { color: 'rgba(0,0,0,0.06)' },
              },
              x: {
                ticks: { font: { family: 'Inter, sans-serif', size: 10 } },
                grid: { display: false },
              },
            },
          },
        });
        chartsCreated.push(chart);
      } catch (err) {
        console.warn('Failed to initialize Q3 trend chart:', err);
      }
    }
    // 2. Generic JSON chart data
    else if (canvas.getAttribute('data-chart-data')) {
      try {
        const configStr = canvas.getAttribute('data-chart-data') || '{}';
        const config = JSON.parse(configStr);
        if (config.type && config.data) {
          const chart = new Chart(canvas, {
            ...config,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              ...config.options,
            },
          });
          chartsCreated.push(chart);
        }
      } catch (err) {
        console.warn('Failed to initialize dynamic chart from data-chart-data:', err);
      }
    }
  });

  return () => {
    chartsCreated.forEach((c) => {
      try {
        c.destroy();
      } catch (_) {}
    });
  };
}

/**
 * Attaches interactive click handlers for slide tabs (.tabs-container, .tab-btn, .tab-content)
 */
export function initSlideTabs(container: HTMLElement | null): (() => void) {
  if (!container) return () => {};

  const tabButtons = container.querySelectorAll('.tab-btn');
  if (tabButtons.length === 0) return () => {};

  const handleClick = (e: Event) => {
    const btn = (e.currentTarget as HTMLElement) || (e.target as HTMLElement)?.closest('.tab-btn');
    if (!btn) return;

    const tabsContainer = btn.closest('.tabs-container') || container;
    const allBtns = tabsContainer.querySelectorAll('.tab-btn');
    const allContents = tabsContainer.querySelectorAll('.tab-content');

    allBtns.forEach((b) => b.classList.remove('active'));
    allContents.forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');

    // Find target content by onclick attribute, data-target, or href
    const onclickAttr = btn.getAttribute('onclick') || '';
    const match = onclickAttr.match(/['"]([^'"]+)['"]/);
    const targetId = btn.getAttribute('data-target') || (match ? match[1] : null);

    if (targetId) {
      const targetContent = tabsContainer.querySelector(`#${targetId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    } else {
      // Fallback: match by index
      const btnIndex = Array.from(allBtns).indexOf(btn);
      if (allContents[btnIndex]) {
        allContents[btnIndex].classList.add('active');
      }
    }
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', handleClick);
  });

  return () => {
    tabButtons.forEach((btn) => {
      btn.removeEventListener('click', handleClick);
    });
  };
}
