import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Monitor, ChevronLeft, ChevronRight, Maximize2, RotateCcw } from 'lucide-react';
import { SlideData, PresentationDoc } from '../types/presentation';
import { FloatingAIToolbar } from './FloatingAIToolbar';
import { cssStringToStyleObject } from '../utils/styleHelper';
import { initSlideCharts, initSlideTabs } from '../utils/chartHelper';
import Chart from 'chart.js/auto';

// Ensure Chart.js is globally accessible for inline slide scripts
if (typeof window !== 'undefined') {
  (window as any).Chart = Chart;
}

export interface SelectedElementInfo {
  id: string;
  tagName: string;
  className: string;
  textContent: string;
  innerHTML: string;
  isTextElement: boolean;
  element: HTMLElement;
  breadcrumbs: Array<{ id: string; tagName: string; className: string }>;
  animation?: {
    type: string;
    duration: string;
    delay: string;
    easing: string;
  };
  computedStyle: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
    textAlign: string;
    fontFamily: string;
    borderRadius: string;
    padding: string;
    borderWidth: string;
    borderColor: string;
  };
}

interface SlideCanvasProps {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
  presentation?: PresentationDoc;
  isCompactMode?: boolean;
  onUpdateSlideHtml: (newHtml: string) => void;
  onUpdateSlideProps?: (props: Partial<SlideData>) => void;
  selectedElement: SelectedElementInfo | null;
  onSelectElement: (info: SelectedElementInfo | null) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  slideIndex,
  totalSlides,
  presentation,
  isCompactMode = false,
  onUpdateSlideHtml,
  selectedElement,
  onSelectElement,
  onPrevSlide,
  onNextSlide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Zoom & responsiveness state
  const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit');
  const [manualZoom, setManualZoom] = useState<number>(1);
  const [autoScale, setAutoScale] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9');

  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [hoverRect, setHoverRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [selectedRect, setSelectedRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);

  // Virtual slide canonical size
  const baseWidth = 960;
  const baseHeight = aspectRatio === '16:9' ? 540 : 720;

  // Measure container and compute automatic responsive scale factor
  const updateResponsiveScale = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    // Available space subtracting margins & floating header/footer
    const isMobile = clientWidth < 768;
    const paddingX = isMobile ? 12 : 36;
    // When compact (e.g. mobile with inspector below), canvas uses minimal vertical padding
    const paddingY = isCompactMode && isMobile ? 36 : (isMobile ? 100 : 80);

    const availW = Math.max(140, clientWidth - paddingX);
    const availH = Math.max(80, clientHeight - paddingY);

    const scaleW = availW / baseWidth;
    const scaleH = availH / baseHeight;
    // Fit smoothly without blowing up excessively on huge displays
    const fit = Math.min(scaleW, scaleH, 1.4);
    setAutoScale(Math.max(0.16, fit));
  }, [baseWidth, baseHeight, isCompactMode]);

  useEffect(() => {
    updateResponsiveScale();

    const resizeObserver = new ResizeObserver(() => {
      updateResponsiveScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateResponsiveScale]);

  const effectiveZoom = zoomMode === 'fit' ? autoScale : manualZoom;

  // Sync element ID tag inside DOM
  const ensureEditIds = useCallback(() => {
    if (!slideRef.current) return;
    const elements = slideRef.current.querySelectorAll('*');
    elements.forEach((el, idx) => {
      if (!el.getAttribute('data-edit-id')) {
        el.setAttribute('data-edit-id', `el-${idx}-${Date.now().toString(36)}`);
      }
    });
  }, []);

  // Auto-initialize charts and tab switching on slide change or content update
  useEffect(() => {
    const timer = setTimeout(() => {
      const targetContainer = stageRef.current || slideRef.current;
      if (!targetContainer) return;
      const cleanupCharts = initSlideCharts(targetContainer);
      const cleanupTabs = initSlideTabs(targetContainer);

      return () => {
        cleanupCharts();
        cleanupTabs();
      };
    }, 60);

    return () => clearTimeout(timer);
  }, [slide.id, slideIndex, slide.htmlContent]);

  // Update selection rectangle normalized to base 960x540 coordinates
  const updateSelectedRect = useCallback(() => {
    const baseTarget = stageRef.current || slideRef.current;
    if (selectedElement?.element && baseTarget) {
      if (document.body.contains(selectedElement.element)) {
        const rect = selectedElement.element.getBoundingClientRect();
        const baseBounding = baseTarget.getBoundingClientRect();
        const scale = effectiveZoom > 0 ? effectiveZoom : 1;

        setSelectedRect({
          left: (rect.left - baseBounding.left) / scale,
          top: (rect.top - baseBounding.top) / scale,
          width: rect.width / scale,
          height: rect.height / scale,
        });
      } else {
        setSelectedRect(null);
      }
    } else {
      setSelectedRect(null);
    }
  }, [selectedElement, effectiveZoom]);

  useEffect(() => {
    ensureEditIds();
    updateSelectedRect();
  }, [slide.htmlContent, ensureEditIds, updateSelectedRect, effectiveZoom]);

  // Handle element selection
  const handleElementSelect = (target: HTMLElement) => {
    if (!slideRef.current || target === slideRef.current) {
      onSelectElement(null);
      return;
    }

    const editId = target.getAttribute('data-edit-id') || `el-${Date.now().toString(36)}`;
    target.setAttribute('data-edit-id', editId);

    // Build breadcrumbs
    const breadcrumbs: Array<{ id: string; tagName: string; className: string }> = [];
    let current: HTMLElement | null = target;
    while (current && current !== slideRef.current) {
      breadcrumbs.unshift({
        id: current.getAttribute('data-edit-id') || '',
        tagName: current.tagName.toLowerCase(),
        className: current.getAttribute('class') || '',
      });
      current = current.parentElement;
    }

    const computed = window.getComputedStyle(target);
    const tagName = target.tagName.toUpperCase();
    const isText = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'STRONG', 'EM', 'B', 'I', 'LI', 'LABEL', 'BUTTON'].includes(tagName);

    const animType = target.getAttribute('data-animate') || '';
    const animDuration = target.getAttribute('data-animate-duration') || '0.6s';
    const animDelay = target.getAttribute('data-animate-delay') || '0s';
    const animEasing = target.getAttribute('data-animate-easing') || 'cubic-bezier(0.16, 1, 0.3, 1)';

    const info: SelectedElementInfo = {
      id: editId,
      tagName,
      className: target.getAttribute('class') || '',
      textContent: target.textContent || '',
      innerHTML: target.innerHTML || '',
      isTextElement: isText,
      element: target,
      breadcrumbs,
      animation:
        animType && animType !== 'none'
          ? {
              type: animType,
              duration: animDuration,
              delay: animDelay,
              easing: animEasing,
            }
          : undefined,
      computedStyle: {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        textAlign: computed.textAlign,
        fontFamily: computed.fontFamily,
        borderRadius: computed.borderRadius,
        padding: computed.padding,
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
      },
    };

    onSelectElement(info);
  };

  // Click on slide canvas
  const handleSlideClick = (e: React.MouseEvent) => {
    if (isEditingText) return;
    const target = e.target as HTMLElement;
    handleElementSelect(target);
  };

  // Double click for direct inline text editing
  const handleSlideDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!slideRef.current || target === slideRef.current) return;

    const tagName = target.tagName.toUpperCase();
    const isText = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'STRONG', 'EM', 'B', 'I', 'LI', 'TD', 'TH', 'BUTTON'].includes(tagName);

    if (isText) {
      setIsEditingText(true);
      target.contentEditable = 'true';
      target.focus();

      const onBlur = () => {
        target.contentEditable = 'false';
        setIsEditingText(false);
        if (slideRef.current) {
          onUpdateSlideHtml(slideRef.current.innerHTML);
        }
        target.removeEventListener('blur', onBlur);
      };

      target.addEventListener('blur', onBlur);
    }
  };

  // Mouse hover outline effect normalized to scale
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEditingText) return;
    const target = e.target as HTMLElement;
    const baseTarget = stageRef.current || slideRef.current;
    if (!baseTarget || !slideRef.current || target === slideRef.current || target === stageRef.current) {
      setHoveredElement(null);
      setHoverRect(null);
      return;
    }

    if (target !== hoveredElement) {
      setHoveredElement(target);
      const rect = target.getBoundingClientRect();
      const baseBounding = baseTarget.getBoundingClientRect();
      const scale = effectiveZoom > 0 ? effectiveZoom : 1;

      setHoverRect({
        left: (rect.left - baseBounding.left) / scale,
        top: (rect.top - baseBounding.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
    setHoverRect(null);
  };

  // Mobile Touch Swipe Navigation
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isEditingText) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Minimum swipe distance of 45px, mostly horizontal, within 600ms
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && deltaTime < 600) {
      if (deltaX < 0) {
        // Swiped Left -> Next Slide
        onNextSlide();
      } else {
        // Swiped Right -> Previous Slide
        onPrevSlide();
      }
    }
    touchStartRef.current = null;
  };

  // Keyboard navigation & element deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingText) return;

      if (e.key === 'Escape') {
        onSelectElement(null);
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement?.element) {
        if (selectedElement.element !== slideRef.current && slideRef.current) {
          e.preventDefault();
          selectedElement.element.remove();
          onSelectElement(null);
          onUpdateSlideHtml(slideRef.current.innerHTML);
        }
      }

      if (document.activeElement === document.body) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          onNextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          onPrevSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingText, selectedElement, onSelectElement, onUpdateSlideHtml, onNextSlide, onPrevSlide]);

  // AI action rewriter handler
  const handleApplyAiAction = async (action: string) => {
    if (!selectedElement?.element || !slideRef.current) return;
    const currentText = selectedElement.element.textContent || '';
    if (!currentText.trim()) return;

    try {
      const res = await fetch('/api/gemini/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          action,
          context: slide.title,
        }),
      });

      const data = await res.json();
      if (data.rewritten) {
        selectedElement.element.textContent = data.rewritten;
        onUpdateSlideHtml(slideRef.current.innerHTML);
        updateSelectedRect();
      }
    } catch (err) {
      console.error('Error applying AI rewrite:', err);
    }
  };

  // Duplicate current selected element
  const handleDuplicateElement = () => {
    if (!selectedElement?.element || !slideRef.current) return;
    const clone = selectedElement.element.cloneNode(true) as HTMLElement;
    clone.setAttribute('data-edit-id', `el-${Date.now().toString(36)}`);
    selectedElement.element.after(clone);
    onUpdateSlideHtml(slideRef.current.innerHTML);
    handleElementSelect(clone);
  };

  // Delete current selected element
  const handleDeleteElement = () => {
    if (!selectedElement?.element || !slideRef.current) return;
    selectedElement.element.remove();
    onSelectElement(null);
    onUpdateSlideHtml(slideRef.current.innerHTML);
  };

  // Select parent container
  const handleSelectParent = () => {
    if (!selectedElement?.element || !slideRef.current) return;
    const parent = selectedElement.element.parentElement;
    if (parent && parent !== slideRef.current) {
      handleElementSelect(parent);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 bg-slate-900/95 relative overflow-hidden flex flex-col items-center justify-between w-full min-w-0 transition-all duration-150 order-1 md:order-2 ${
        isCompactMode
          ? 'p-1.5 sm:p-3 pb-2 sm:pb-3 max-h-[44vh] md:max-h-none'
          : 'p-2 sm:p-4 md:p-6 pb-16 md:pb-4'
      }`}
    >
      {/* Top Floating Canvas Toolbar (Zoom, Ratio, Info) */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-1.5 mb-1.5 sm:mb-3 text-xs text-slate-300 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold bg-slate-800 text-slate-300 px-2 sm:px-2.5 py-1 rounded-md border border-slate-700/80 text-[11px] sm:text-xs">
            {slideIndex + 1} / {totalSlides}
          </span>
          <span className="text-slate-400 hidden md:inline truncate max-w-xs text-xs">
            {slide.title}
          </span>
        </div>

        {/* Center/Right: Zoom and Aspect Ratio controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-800/90 backdrop-blur-md px-1.5 sm:px-2 py-1 rounded-lg border border-slate-700 shadow-md">
          {/* Zoom Out */}
          <button
            onClick={() => {
              setZoomMode('manual');
              setManualZoom((z) => Math.max(0.3, Number((effectiveZoom - 0.1).toFixed(2))));
            }}
            className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Percent Indicator */}
          <span className="text-[10px] sm:text-[11px] font-mono w-9 sm:w-11 text-center text-slate-300">
            {Math.round(effectiveZoom * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => {
              setZoomMode('manual');
              setManualZoom((z) => Math.min(1.8, Number((effectiveZoom + 0.1).toFixed(2))));
            }}
            className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Auto Fit Toggle Button */}
          <button
            onClick={() => {
              setZoomMode('fit');
              updateResponsiveScale();
            }}
            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded transition flex items-center gap-1 ${
              zoomMode === 'fit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="Ajustar automaticamente ao tamanho da tela (Auto-Fit)"
          >
            <Maximize2 className="w-2.5 h-2.5" />
            <span>Enquadrar</span>
          </button>

          <div className="h-3.5 w-px bg-slate-700 mx-0.5 sm:mx-1" />

          {/* Aspect Ratio Switch */}
          <button
            onClick={() => setAspectRatio(aspectRatio === '16:9' ? '4:3' : '16:9')}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-300 hover:text-white px-1 sm:px-1.5 py-0.5 rounded hover:bg-slate-700 transition"
            title="Alternar proporção do slide (16:9 ou 4:3)"
          >
            <Monitor className="w-3 h-3 text-blue-400" />
            <span>{aspectRatio}</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas Center Stage with Touch Gestures */}
      <div
        className="flex-1 flex items-center justify-center w-full my-auto relative overflow-hidden py-1 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Previous Button */}
        <button
          onClick={onPrevSlide}
          disabled={slideIndex === 0}
          className={`absolute left-1 sm:left-2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 shadow-xl border border-slate-700 backdrop-blur-md transition ${
            slideIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-105 active:scale-95'
          }`}
          title="Slide Anterior (←)"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scaled Layout Wrapper: gives the browser exact scaled footprint to center perfectly */}
        <div
          style={{
            width: `${baseWidth * effectiveZoom}px`,
            height: `${baseHeight * effectiveZoom}px`,
            position: 'relative',
            flexShrink: 0,
            transition: 'width 0.15s ease-out, height 0.15s ease-out',
          }}
          className="mx-auto"
        >
          {/* Virtual Slide Container scaled from top-left */}
          <div
            ref={stageRef}
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
              transform: `scale(${effectiveZoom})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="slidestudio-scope slidestudio-virtual-stage rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
          >
            {/* Presentation container frame */}
            <div
              className={`w-full h-full flex flex-col overflow-hidden relative select-none ${
                presentation?.containerClass || 'presentation-container'
              }`}
              style={cssStringToStyleObject(presentation?.containerStyle)}
            >
              {/* If presentation has a corporate header bar, render it */}
              {presentation?.headerHtml && (
                <div
                  className="slidestudio-corporate-header shrink-0 select-none"
                  dangerouslySetInnerHTML={{ __html: presentation.headerHtml }}
                />
              )}

              <main
                className={`slidestudio-viewport flex-1 overflow-hidden relative flex flex-col ${
                  presentation?.viewportClass || 'slide-viewport'
                }`}
                style={cssStringToStyleObject(presentation?.viewportStyle)}
              >
                <section
                  ref={slideRef}
                  id={slide.id}
                  className={`slide active ${slide.className || ''} w-full h-full relative select-none`}
                  style={{
                    ...cssStringToStyleObject(slide.style),
                    boxSizing: 'border-box',
                  }}
                  onClick={handleSlideClick}
                  onDoubleClick={handleSlideDoubleClick}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  dangerouslySetInnerHTML={{ __html: slide.htmlContent }}
                />
              </main>

              {/* If presentation has a corporate footer bar, render it */}
              {presentation?.footerHtml && (
                <div
                  className="slidestudio-corporate-footer shrink-0 select-none"
                  dangerouslySetInnerHTML={{ __html: presentation.footerHtml }}
                />
              )}
            </div>

            {/* Hover outline overlay */}
            {hoverRect && !selectedRect && (
              <div
                style={{
                  position: 'absolute',
                  top: `${hoverRect.top}px`,
                  left: `${hoverRect.left}px`,
                  width: `${hoverRect.width}px`,
                  height: `${hoverRect.height}px`,
                  pointerEvents: 'none',
                }}
                className="border-2 border-dashed border-blue-400/80 bg-blue-500/10 rounded transition-all duration-75 z-30"
              />
            )}

            {/* Selected Element outline overlay with handles */}
            {selectedRect && selectedElement && (
              <div
                style={{
                  position: 'absolute',
                  top: `${selectedRect.top}px`,
                  left: `${selectedRect.left}px`,
                  width: `${selectedRect.width}px`,
                  height: `${selectedRect.height}px`,
                  pointerEvents: 'none',
                }}
                className="border-2 border-blue-600 ring-2 ring-blue-400/40 rounded transition-all duration-75 z-40"
              >
                {/* Corner markers */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />

                {/* Tag label badge */}
                <span className="absolute -top-6 left-0 text-[10px] font-mono uppercase bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded shadow">
                  {selectedElement.tagName.toLowerCase()}
                </span>
              </div>
            )}

            {/* Floating AI Toolbar attached to selection */}
            {selectedRect && selectedElement && !isEditingText && (
              <FloatingAIToolbar
                position={{
                  top: selectedRect.top,
                  left: selectedRect.left,
                  width: selectedRect.width,
                  height: selectedRect.height,
                }}
                selectedTagName={selectedElement.tagName}
                selectedText={selectedElement.textContent}
                isTextElement={selectedElement.isTextElement}
                onApplyAiAction={handleApplyAiAction}
                onDuplicateElement={handleDuplicateElement}
                onDeleteElement={handleDeleteElement}
                onSelectParent={handleSelectParent}
              />
            )}
          </div>
        </div>

        {/* Navigation Next Button */}
        <button
          onClick={onNextSlide}
          disabled={slideIndex === totalSlides - 1}
          className={`absolute right-1 sm:right-2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 shadow-xl border border-slate-700 backdrop-blur-md transition ${
            slideIndex === totalSlides - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-105 active:scale-95'
          }`}
          title="Próximo Slide (→)"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Mobile Dot Navigation & Swipe Hint (shown only in full canvas view) */}
      {!isCompactMode && (
        <>
          <div className="md:hidden flex flex-col items-center gap-1.5 my-1.5 select-none shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 rounded-full border border-slate-700/80 shadow-md">
              {Array.from({ length: Math.min(totalSlides, 8) }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === slideIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-600'
                  }`}
                />
              ))}
              {totalSlides > 8 && (
                <span className="text-[9px] text-slate-400 font-mono">+{totalSlides - 8}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              👈 Deslize para navegar entre os slides 👉
            </span>
          </div>

          {/* Bottom Hint */}
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-4 select-none shrink-0 text-center">
            <span>💡 <strong>Toque</strong> para selecionar elemento.</span>
            <span>✍️ <strong>Dois toques</strong> para editar texto.</span>
            <span className="hidden sm:inline">⌨️ <strong>Delete</strong> para remover elemento.</span>
          </div>
        </>
      )}
    </div>
  );
};
