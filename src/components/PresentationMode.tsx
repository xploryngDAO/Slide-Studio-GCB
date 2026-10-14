import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  X,
  FileText,
  MousePointer,
  HelpCircle
} from 'lucide-react';
import { SlideData, PresentationDoc } from '../types/presentation';
import { cssStringToStyleObject } from '../utils/styleHelper';
import { initSlideCharts, initSlideTabs } from '../utils/chartHelper';

interface PresentationModeProps {
  slides: SlideData[];
  presentation?: PresentationDoc;
  initialSlideIndex?: number;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  slides,
  presentation,
  initialSlideIndex = 0,
  onClose,
}) => {
  const stageRef = React.useRef<HTMLDivElement>(null);

  // Mark body with in-presentation-mode class for full dark backdrop and scoped styling
  useEffect(() => {
    document.body.classList.add('in-presentation-mode');
    return () => {
      document.body.classList.remove('in-presentation-mode');
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize charts, tabs and entrance animations for active slide in presentation mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!stageRef.current) return;
      const cleanupCharts = initSlideCharts(stageRef.current);
      const cleanupTabs = initSlideTabs(stageRef.current);

      // Re-trigger entrance animations on slide elements
      const animatedEls = stageRef.current.querySelectorAll('[data-animate]');
      animatedEls.forEach((el: any) => {
        const animType = el.getAttribute('data-animate');
        if (!animType || animType === 'none') return;
        const duration = el.getAttribute('data-animate-duration') || '0.6s';
        const delay = el.getAttribute('data-animate-delay') || '0s';
        const easing = el.getAttribute('data-animate-easing') || 'cubic-bezier(0.16, 1, 0.3, 1)';
        const animKeyframe = 'ss-' + (animType === 'zoom' ? 'zoom-in' : animType);

        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = `${animKeyframe} ${duration} ${easing} ${delay} both`;
      });

      return () => {
        cleanupCharts();
        cleanupTabs();
      };
    }, 60);

    return () => clearTimeout(timer);
  }, [currentIndex, slides[currentIndex]?.id, slides[currentIndex]?.htmlContent]);

  const baseWidth = 960;
  const baseHeight = 540;
  // Calculate scale ensuring slide fits comfortably within viewport
  const scale = Math.min(
    (windowDimensions.width * 0.95) / baseWidth,
    (windowDimensions.height * 0.88) / baseHeight
  );

  const currentSlide = slides[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'l' || e.key === 'L') {
        setLaserActive((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length]);

  // Laser Pointer Mouse Tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (laserActive) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Laser pointer effect */}
      {laserActive && (
        <div
          className="fixed w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.8)] pointer-events-none z-[99999] transition-transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

      {/* Slide Center Frame Scaled Responsively */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div
          style={{
            width: `${baseWidth * scale}px`,
            height: `${baseHeight * scale}px`,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            ref={stageRef}
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
              minWidth: `${baseWidth}px`,
              minHeight: `${baseHeight}px`,
              maxWidth: `${baseWidth}px`,
              maxHeight: `${baseHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="slidestudio-scope slidestudio-virtual-stage rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
          >
            <div
              className={`w-full h-full flex flex-col overflow-hidden relative select-none ${
                presentation?.containerClass || 'presentation-container'
              }`}
              style={cssStringToStyleObject(presentation?.containerStyle)}
            >
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
                  id={currentSlide.id}
                  className={`slide active ${currentSlide.className || ''} w-full h-full relative select-none`}
                  style={{
                    ...cssStringToStyleObject(currentSlide.style),
                    boxSizing: 'border-box',
                  }}
                  dangerouslySetInnerHTML={{ __html: currentSlide.htmlContent }}
                />
              </main>
              {presentation?.footerHtml && (
                <div
                  className="slidestudio-corporate-footer shrink-0 select-none"
                  dangerouslySetInnerHTML={{ __html: presentation.footerHtml }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Speaker Notes Overlay Drawer */}
      {showNotes && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xl bg-slate-900/90 text-white backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Anotações do Apresentador (Slide {currentIndex + 1})
            </span>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
            {currentSlide.notes || 'Nenhuma anotação registrada para este slide.'}
          </p>
        </div>
      )}

      {/* Floating Presentation Control Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md text-white px-4 py-2 rounded-full border border-slate-700/80 shadow-2xl z-40">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-1.5 hover:bg-white/10 rounded-full transition disabled:opacity-30"
          title="Slide Anterior (←)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold font-mono px-2 text-slate-300">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          onClick={goToNext}
          disabled={currentIndex === slides.length - 1}
          className="p-1.5 hover:bg-white/10 rounded-full transition disabled:opacity-30"
          title="Próximo Slide (→ / Espaço)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Laser pointer button */}
        <button
          onClick={() => setLaserActive(!laserActive)}
          className={`p-1.5 rounded-full transition ${
            laserActive ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Apontador Laser (L)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* Speaker notes button */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`p-1.5 rounded-full transition ${
            showNotes ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Notas do Apresentador (N)"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition"
          title="Tela Cheia (F)"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Exit Presentation */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-rose-600 rounded-full text-slate-300 hover:text-white transition"
          title="Sair do Modo Apresentação (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
