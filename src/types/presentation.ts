export interface SlideElement {
  id: string;
  tagName: string;
  className: string;
  inlineStyle: Record<string, string>;
  textContent: string;
  innerHTML: string;
  attributes: Record<string, string>;
}

export interface SlideData {
  id: string;
  title: string;
  htmlContent: string; // The inner or outer HTML of the slide container
  tagName: string; // 'section' or 'div'
  className: string;
  style: string;
  attributes: Record<string, string>;
  notes?: string;
}

export interface PresentationDoc {
  title: string;
  headHtml: string; // <style>, <link>, CSS variables, fonts, scripts
  slides: SlideData[];
  globalStyles: string;
  headerHtml?: string; // Persistent top header (e.g. .header-bar with logo and metadata)
  footerHtml?: string; // Persistent bottom footer (e.g. .footer-bar)
  containerClass?: string; // e.g. 'presentation-container'
  containerStyle?: string;
  viewportClass?: string; // e.g. 'slide-viewport'
  viewportStyle?: string;
  scriptContent?: string; // Embedded JS for charts, tab switching, etc.
  theme: {
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    textColor: string;
    fontFamily: string;
  };
}

export type ViewMode = 'edit' | 'present' | 'code' | 'preview';

export interface AIActionResponse {
  rewritten?: string;
  html?: string;
  chartHtml?: string;
  overallScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  designTips?: string[];
  error?: string;
}
