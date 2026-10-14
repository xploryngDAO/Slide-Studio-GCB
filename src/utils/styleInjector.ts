import { useEffect } from 'react';

/**
 * Normalizes and scopes raw CSS from uploaded presentation HTML files
 * so that:
 * 1. CSS variables defined in :root or html/body are available everywhere and inside .slidestudio-scope
 * 2. body / html rules (background, color, font-family) apply to the slide canvas and presentation frame without breaking the outer React application UI
 * 3. * universal reset (margin: 0; padding: 0;) is scoped to .slidestudio-scope so it doesn't strip padding from editor buttons/inputs
 * 4. .presentation-container expands to 100% of the virtual slide canvas instead of enforcing 100vw/100vh
 * 5. .slide active/visibility rules ensure the current slide is always visible and rendered in full fidelity
 */
export function scopePresentationCss(rawCss: string): string {
  if (!rawCss || typeof rawCss !== 'string') return '';

  let scoped = rawCss;

  // 1. Keep :root intact and also declare on .slidestudio-scope for maximum variable cascading
  scoped = scoped.replace(/:root\s*\{/g, ':root, .slidestudio-scope {');

  // 2. Rewrite body and html, body selectors so background, font, and text color apply to presentation frames
  // without affecting the editor's body layout
  scoped = scoped.replace(/html\s*,\s*body\s*\{/g, '.slidestudio-canvas-stage, .presentation-container, body.in-presentation-mode {');
  scoped = scoped.replace(/(^|[\s,;{}])body\s*\{/g, '$1.slidestudio-canvas-stage, .presentation-container, .slidestudio-body-mock, body.in-presentation-mode {');

  // 3. Rewrite universal selector * so resets (box-sizing, margin:0, padding:0) apply only inside presentations
  scoped = scoped.replace(/(^|[\s,;{}])\*\s*\{/g, '$1.slidestudio-scope, .slidestudio-scope * {');

  // 4. Scope container rules so it fits the editor canvas base resolution
  scoped += `
    /* SlideStudio Virtual Stage Canonical Fixed Resolution */
    .slidestudio-virtual-stage {
      width: 960px !important;
      height: 540px !important;
      min-width: 960px !important;
      min-height: 540px !important;
      max-width: 960px !important;
      max-height: 540px !important;
      transform-origin: top left !important;
      box-sizing: border-box !important;
    }

    /* Inner Presentation Container Overrides to fill virtual canvas completely */
    .slidestudio-virtual-stage .presentation-container,
    .slidestudio-scope .presentation-container {
      width: 100% !important;
      height: 100% !important;
      min-width: 100% !important;
      min-height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      aspect-ratio: auto !important;
      margin: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    /* Guarantee visibility of slides inside editor and thumbnails */
    .slidestudio-scope .slide,
    .slidestudio-scope .slide.active,
    .slidestudio-viewport .slide,
    .slidestudio-viewport-wrapper .slide {
      display: flex !important;
      opacity: 1 !important;
      transform: none !important;
      visibility: visible !important;
    }

    /* Thumbnail specific styling to ensure contents fit scaled preview */
    .slidestudio-thumbnail-scope .slide,
    .slidestudio-thumbnail-scope .slide.active {
      display: flex !important;
      opacity: 1 !important;
      transform: none !important;
    }

    /* Smooth crisp rendering for tables, cards and badges */
    .slidestudio-scope table,
    .slidestudio-scope .card,
    .slidestudio-scope .kpi-card {
      box-sizing: border-box;
    }

    /* SlideStudio Entry Keyframes for presentation slides */
    @keyframes ss-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes ss-slide-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ss-slide-down {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ss-slide-left {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes ss-slide-right {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes ss-zoom-in {
      from { opacity: 0; transform: scale(0.84); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes ss-zoom-out {
      from { opacity: 0; transform: scale(1.16); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes ss-bounce-in {
      0% { opacity: 0; transform: scale(0.35); }
      50% { opacity: 1; transform: scale(1.05); }
      75% { transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;

  return scoped;
}

/**
 * Extracts links, styles, and external script URLs from a raw headHtml string,
 * injecting them safely into the DOM.
 */
export function injectPresentationStyles(headHtml: string) {
  if (typeof document === 'undefined') return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(headHtml || '', 'text/html');

  // 1. External links (fonts, stylesheets, preconnect)
  const existingLinks = document.querySelectorAll('link[data-slidestudio="external"]');
  existingLinks.forEach((el) => el.remove());

  const links = doc.querySelectorAll('link');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const newLink = document.createElement('link');
      Array.from(link.attributes).forEach((attr) => {
        newLink.setAttribute(attr.name, attr.value);
      });
      newLink.setAttribute('data-slidestudio', 'external');
      document.head.appendChild(newLink);
    }
  });

  // 2. Extract and concatenate all style contents
  let combinedCss = '';
  const styles = doc.querySelectorAll('style');
  styles.forEach((s) => {
    combinedCss += (s.textContent || '') + '\n';
  });

  // If headHtml contains raw <style> tags without proper doc root parsing
  if (!combinedCss && headHtml && headHtml.includes('<style')) {
    const matches = headHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (matches) {
      matches.forEach((m) => {
        const content = m.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '');
        combinedCss += content + '\n';
      });
    }
  }

  // 3. Inject scoped CSS
  let styleEl = document.getElementById('slidestudio-presentation-styles') as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'slidestudio-presentation-styles';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = scopePresentationCss(combinedCss);

  // 4. External scripts (e.g. Chart.js, Tailwind CDN)
  const scripts = doc.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && !document.querySelector(`script[src="${src}"]`)) {
      const newScript = document.createElement('script');
      newScript.src = src;
      newScript.async = true;
      document.head.appendChild(newScript);
    }
  });
}

/**
 * React hook to synchronize presentation styles dynamically
 */
export function usePresentationStyles(headHtml: string) {
  useEffect(() => {
    injectPresentationStyles(headHtml);

    return () => {
      // Optional cleanup on complete unmount
    };
  }, [headHtml]);
}
