import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PresentationDoc, SlideData, ViewMode } from './types/presentation';
import {
  parseHtmlPresentation,
  serializePresentationToHtml,
  SAMPLE_PRESENTATIONS,
  createDefaultSlide,
} from './utils/slideParser';
import { TopToolbar } from './components/TopToolbar';
import { SlideNavigator } from './components/SlideNavigator';
import { SlideCanvas, SelectedElementInfo } from './components/SlideCanvas';
import { InspectorSidebar } from './components/InspectorSidebar';
import { AIAssistantModal } from './components/AIAssistantModal';
import { InsertElementModal } from './components/InsertElementModal';
import { PresentationMode } from './components/PresentationMode';
import { CodeViewModal } from './components/CodeViewModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { usePresentationStyles } from './utils/styleInjector';

export default function App() {
  // Initialize presentation with recommended executive sample
  const [presentation, setPresentation] = useState<PresentationDoc>(() => {
    return parseHtmlPresentation(SAMPLE_PRESENTATIONS.casasBahia.rawHtml);
  });

  // Dynamically inject and scope presentation styles, fonts, and CSS variables
  usePresentationStyles(presentation.headHtml);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  // Responsive panels visibility
  const [showNavigator, setShowNavigator] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [showInspector, setShowInspector] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
  );

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'generate-slide' | 'generate-chart' | 'analyze'>('generate-slide');
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  // History for Undo / Redo
  const [history, setHistory] = useState<PresentationDoc[]>([presentation]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Push new state to undo/redo history
  const pushHistory = useCallback((newDoc: PresentationDoc) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, newDoc].slice(-30); // keep last 30 states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const targetIndex = historyIndex - 1;
    setHistoryIndex(targetIndex);
    setPresentation(history[targetIndex]);
    setSelectedElement(null);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const targetIndex = historyIndex + 1;
    setHistoryIndex(targetIndex);
    setPresentation(history[targetIndex]);
    setSelectedElement(null);
  };

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Current active slide
  const currentSlide: SlideData = useMemo(() => {
    if (presentation.slides.length === 0) {
      return createDefaultSlide(1);
    }
    const safeIndex = Math.min(Math.max(0, activeSlideIndex), presentation.slides.length - 1);
    return presentation.slides[safeIndex];
  }, [presentation.slides, activeSlideIndex]);

  // Update HTML content of current slide
  const handleUpdateCurrentSlideHtml = (newHtml: string) => {
    setPresentation((prev) => {
      const updatedSlides = [...prev.slides];
      updatedSlides[activeSlideIndex] = {
        ...updatedSlides[activeSlideIndex],
        htmlContent: newHtml,
      };
      const updatedDoc = { ...prev, slides: updatedSlides };
      pushHistory(updatedDoc);
      return updatedDoc;
    });
  };

  // Update properties of current slide (e.g. style, title, notes)
  const handleUpdateSlideProps = (props: Partial<SlideData>) => {
    setPresentation((prev) => {
      const updatedSlides = [...prev.slides];
      updatedSlides[activeSlideIndex] = {
        ...updatedSlides[activeSlideIndex],
        ...props,
      };
      const updatedDoc = { ...prev, slides: updatedSlides };
      pushHistory(updatedDoc);
      return updatedDoc;
    });
  };

  // Update selected element inline style (e.g., color, fontSize, background, etc.)
  const handleUpdateElementStyle = (property: string, value: string) => {
    if (!selectedElement?.element) return;
    // Apply style to the live DOM node
    (selectedElement.element.style as any)[property] = value;

    // Refresh selected element computed styles
    const computed = window.getComputedStyle(selectedElement.element);
    setSelectedElement((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        computedStyle: {
          ...prev.computedStyle,
          [property]: value,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          textAlign: computed.textAlign,
          fontFamily: computed.fontFamily,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
        },
      };
    });

    // Sync to slide container
    const slideContainer = document.getElementById(currentSlide.id);
    if (slideContainer) {
      handleUpdateCurrentSlideHtml(slideContainer.innerHTML);
    }
  };

  // Update element text content directly
  const handleUpdateElementText = (text: string) => {
    if (!selectedElement?.element) return;
    selectedElement.element.textContent = text;
    setSelectedElement((prev) => (prev ? { ...prev, textContent: text } : null));

    const slideContainer = document.getElementById(currentSlide.id);
    if (slideContainer) {
      handleUpdateCurrentSlideHtml(slideContainer.innerHTML);
    }
  };

  // Update element attribute (e.g. src for images)
  const handleUpdateElementAttribute = (attr: string, value: string) => {
    if (!selectedElement?.element) return;
    selectedElement.element.setAttribute(attr, value);

    const slideContainer = document.getElementById(currentSlide.id);
    if (slideContainer) {
      handleUpdateCurrentSlideHtml(slideContainer.innerHTML);
    }
  };

  // Update entrance animation on selected element
  const handleUpdateElementAnimation = (
    animType: string,
    duration = '0.6s',
    delay = '0s',
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
  ) => {
    if (!selectedElement?.element) return;
    const target = selectedElement.element;

    if (!animType || animType === 'none') {
      target.removeAttribute('data-animate');
      target.removeAttribute('data-animate-duration');
      target.removeAttribute('data-animate-delay');
      target.removeAttribute('data-animate-easing');
      target.style.removeProperty('animation');
      target.style.removeProperty('animation-name');
      target.style.removeProperty('animation-duration');
      target.style.removeProperty('animation-delay');
      target.style.removeProperty('animation-timing-function');
      target.style.removeProperty('animation-fill-mode');
    } else {
      target.setAttribute('data-animate', animType);
      target.setAttribute('data-animate-duration', duration);
      target.setAttribute('data-animate-delay', delay);
      target.setAttribute('data-animate-easing', easing);

      const animKeyframe = 'ss-' + (animType === 'zoom' ? 'zoom-in' : animType);
      target.style.animation = `${animKeyframe} ${duration} ${easing} ${delay} both`;
    }

    // Refresh selectedElement state
    setSelectedElement((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        animation:
          animType && animType !== 'none'
            ? { type: animType, duration, delay, easing }
            : undefined,
      };
    });

    // Sync to slide container
    const slideContainer = document.getElementById(currentSlide.id);
    if (slideContainer) {
      handleUpdateCurrentSlideHtml(slideContainer.innerHTML);
    }
  };

  // Preview or replay animation on the canvas element
  const handlePreviewAnimation = () => {
    if (!selectedElement?.element) return;
    const target = selectedElement.element;
    const animType = target.getAttribute('data-animate') || selectedElement.animation?.type;
    if (!animType || animType === 'none') return;

    const duration = target.getAttribute('data-animate-duration') || selectedElement.animation?.duration || '0.6s';
    const delay = target.getAttribute('data-animate-delay') || selectedElement.animation?.delay || '0s';
    const easing = target.getAttribute('data-animate-easing') || selectedElement.animation?.easing || 'cubic-bezier(0.16, 1, 0.3, 1)';
    const animKeyframe = 'ss-' + (animType === 'zoom' ? 'zoom-in' : animType);

    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = `${animKeyframe} ${duration} ${easing} ${delay} both`;
  };

  // Select element from breadcrumb click
  const handleSelectBreadcrumb = (elementId: string) => {
    const el = document.querySelector(`[data-edit-id="${elementId}"]`) as HTMLElement;
    if (el) {
      el.click();
    }
  };

  // Add a new slide
  const handleAddSlide = () => {
    const newSlide = createDefaultSlide(presentation.slides.length + 1);
    setPresentation((prev) => {
      const updated = { ...prev, slides: [...prev.slides, newSlide] };
      pushHistory(updated);
      return updated;
    });
    setActiveSlideIndex(presentation.slides.length);
    setSelectedElement(null);
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const sourceSlide = presentation.slides[index];
    const duplicated: SlideData = {
      ...sourceSlide,
      id: `slide-${Math.random().toString(36).substring(2, 9)}`,
      title: `${sourceSlide.title} (Cópia)`,
    };

    setPresentation((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides.splice(index + 1, 0, duplicated);
      const updated = { ...prev, slides: nextSlides };
      pushHistory(updated);
      return updated;
    });
    setActiveSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (presentation.slides.length <= 1) return;
    setPresentation((prev) => {
      const nextSlides = prev.slides.filter((_, i) => i !== index);
      const updated = { ...prev, slides: nextSlides };
      pushHistory(updated);
      return updated;
    });
    setActiveSlideIndex((prev) => Math.min(prev, presentation.slides.length - 2));
    setSelectedElement(null);
  };

  // Reorder slide up/down
  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= presentation.slides.length) return;
    setPresentation((prev) => {
      const nextSlides = [...prev.slides];
      const [moved] = nextSlides.splice(fromIndex, 1);
      nextSlides.splice(toIndex, 0, moved);
      const updated = { ...prev, slides: nextSlides };
      pushHistory(updated);
      return updated;
    });
    setActiveSlideIndex(toIndex);
  };

  // Insert generated slide from AI
  const handleInsertNewSlide = (newSlide: SlideData) => {
    setPresentation((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides.splice(activeSlideIndex + 1, 0, newSlide);
      const updated = { ...prev, slides: nextSlides };
      pushHistory(updated);
      return updated;
    });
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  // Insert HTML block into active slide
  const handleInsertHtmlIntoActiveSlide = (html: string) => {
    const slideContainer = document.getElementById(currentSlide.id);
    if (slideContainer) {
      slideContainer.insertAdjacentHTML('beforeend', html);
      handleUpdateCurrentSlideHtml(slideContainer.innerHTML);
    }
  };

  // File upload handler
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsed = parseHtmlPresentation(text);
        setPresentation(parsed);
        pushHistory(parsed);
        setActiveSlideIndex(0);
        setSelectedElement(null);
      }
    };
    reader.readAsText(file);
  };

  // Load sample presentation
  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_PRESENTATIONS[sampleKey];
    if (sample) {
      const parsed = parseHtmlPresentation(sample.rawHtml);
      setPresentation(parsed);
      pushHistory(parsed);
      setActiveSlideIndex(0);
      setSelectedElement(null);
    }
  };

  // Export Standalone HTML
  const handleExportHtml = () => {
    const htmlString = serializePresentationToHtml(presentation);
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'apresentacao'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print / Save as PDF
  const handlePrintPdf = () => {
    const htmlString = serializePresentationToHtml(presentation);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlString);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  // Quick actions for selected element
  const handleDuplicateSelectedElement = useCallback(() => {
    if (!selectedElement?.element) return;
    const clone = selectedElement.element.cloneNode(true) as HTMLElement;
    clone.setAttribute('data-edit-id', `el-${Date.now().toString(36)}`);
    selectedElement.element.after(clone);
    const container = document.getElementById(currentSlide.id);
    if (container) handleUpdateCurrentSlideHtml(container.innerHTML);
  }, [selectedElement, currentSlide.id, handleUpdateCurrentSlideHtml]);

  const handleDeleteSelectedElement = useCallback(() => {
    if (!selectedElement?.element) return;
    selectedElement.element.remove();
    setSelectedElement(null);
    const container = document.getElementById(currentSlide.id);
    if (container) handleUpdateCurrentSlideHtml(container.innerHTML);
  }, [selectedElement, currentSlide.id, handleUpdateCurrentSlideHtml]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {/* Top Application Toolbar */}
      <TopToolbar
        presentation={presentation}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showNavigator={showNavigator}
        onToggleNavigator={() => setShowNavigator((prev) => !prev)}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector((prev) => !prev)}
        onFileUpload={handleFileUpload}
        onLoadSample={handleLoadSample}
        onExportHtml={handleExportHtml}
        onPrintPdf={handlePrintPdf}
        onOpenAiModal={(type) => {
          setAiModalType(type);
          setAiModalOpen(true);
        }}
        onOpenInsertModal={() => setInsertModalOpen(true)}
        onOpenCodeView={() => setCodeModalOpen(true)}
        onTitleChange={(title) => {
          setPresentation((prev) => {
            const updated = { ...prev, title };
            pushHistory(updated);
            return updated;
          });
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main Workspace: Navigator + Canvas + Inspector (Responsive Split View) */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Left Thumbnails Navigator */}
        <SlideNavigator
          slides={presentation.slides}
          presentation={presentation}
          activeSlideIndex={activeSlideIndex}
          isOpen={showNavigator}
          onClose={() => setShowNavigator(false)}
          onSelectSlide={(idx) => {
            setActiveSlideIndex(idx);
            setSelectedElement(null);
          }}
          onAddSlide={handleAddSlide}
          onAddAiSlide={() => {
            setAiModalType('generate-slide');
            setAiModalOpen(true);
          }}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
        />

        {/* Center Interactive Visual Canvas */}
        <SlideCanvas
          slide={currentSlide}
          slideIndex={activeSlideIndex}
          totalSlides={presentation.slides.length}
          presentation={presentation}
          isCompactMode={showInspector || showNavigator}
          onUpdateSlideHtml={handleUpdateCurrentSlideHtml}
          onUpdateSlideProps={handleUpdateSlideProps}
          selectedElement={selectedElement}
          onSelectElement={(info) => {
            setSelectedElement(info);
            // On mobile, selecting an element opens inspector below and closes navigator so slide stays visible
            if (info) {
              if (window.innerWidth < 768) {
                setShowNavigator(false);
              }
              setShowInspector(true);
            }
          }}
          onPrevSlide={() => {
            setActiveSlideIndex((prev) => Math.max(0, prev - 1));
            setSelectedElement(null);
          }}
          onNextSlide={() => {
            setActiveSlideIndex((prev) => Math.min(presentation.slides.length - 1, prev + 1));
            setSelectedElement(null);
          }}
        />

        {/* Right Styling Inspector & Slide Properties */}
        <InspectorSidebar
          selectedElement={selectedElement}
          currentSlide={currentSlide}
          isOpen={showInspector}
          onClose={() => setShowInspector(false)}
          onUpdateElementStyle={handleUpdateElementStyle}
          onUpdateElementClass={(cls) => {
            if (selectedElement?.element) {
              selectedElement.element.className = cls;
              const container = document.getElementById(currentSlide.id);
              if (container) handleUpdateCurrentSlideHtml(container.innerHTML);
            }
          }}
          onUpdateElementText={handleUpdateElementText}
          onUpdateElementAttribute={handleUpdateElementAttribute}
          onUpdateSlideProps={handleUpdateSlideProps}
          onSelectBreadcrumb={handleSelectBreadcrumb}
          onOpenAiAssistant={(action) => {
            setAiModalType('generate-slide');
            setAiModalOpen(true);
          }}
          onDuplicateElement={handleDuplicateSelectedElement}
          onDeleteElement={handleDeleteSelectedElement}
          onUpdateElementAnimation={handleUpdateElementAnimation}
          onPreviewAnimation={handlePreviewAnimation}
        />
      </div>

      {/* Mobile-First Bottom Navigation Dock */}
      <MobileBottomNav
        currentSlideIndex={activeSlideIndex}
        totalSlides={presentation.slides.length}
        selectedElement={selectedElement}
        showNavigator={showNavigator}
        onToggleNavigator={() => {
          // If inspector is open on mobile, close it so only one bottom sheet is active
          if (!showNavigator && showInspector && window.innerWidth < 768) {
            setShowInspector(false);
          }
          setShowNavigator((prev) => !prev);
        }}
        showInspector={showInspector}
        onToggleInspector={() => {
          // If navigator is open on mobile, close it so only one bottom sheet is active
          if (!showInspector && showNavigator && window.innerWidth < 768) {
            setShowNavigator(false);
          }
          setShowInspector((prev) => !prev);
        }}
        onOpenInsertModal={() => setInsertModalOpen(true)}
        onOpenAiModal={() => {
          setAiModalType('generate-slide');
          setAiModalOpen(true);
        }}
        onStartPresentation={() => setViewMode('present')}
      />

      {/* Fullscreen Presentation Mode */}
      {viewMode === 'present' && (
        <PresentationMode
          slides={presentation.slides}
          presentation={presentation}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setViewMode('edit')}
        />
      )}

      {/* AI Assistant Modal (Generate Slide, Chart, Diagnostic) */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialType={aiModalType}
        activeSlide={currentSlide}
        allSlides={presentation.slides}
        onInsertNewSlide={handleInsertNewSlide}
        onInsertHtmlIntoActiveSlide={handleInsertHtmlIntoActiveSlide}
      />

      {/* Insert Component Library Modal */}
      <InsertElementModal
        isOpen={insertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        onInsertHtml={handleInsertHtmlIntoActiveSlide}
      />

      {/* Code Inspector Modal */}
      <CodeViewModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        currentSlide={currentSlide}
        fullHtml={serializePresentationToHtml(presentation)}
        onUpdateCurrentSlideHtml={handleUpdateCurrentSlideHtml}
      />
    </div>
  );
}
