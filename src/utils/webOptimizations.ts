/**
 * Web Platform Optimizations
 * React Native Web için özel optimizasyonlar
 */

import { Platform } from 'react-native';

/**
 * Web platform kontrolü
 */
export const isWeb = Platform.OS === 'web';

/**
 * Web için optimize edilmiş stiller
 */
export const webStyles = {
  // Scrollbar gizleme
  hideScrollbar: isWeb ? {
    scrollbarWidth: 'none' as any,
    msOverflowStyle: 'none' as any,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  } : {},

  // Hover efektleri
  hoverEffect: isWeb ? {
    '&:hover': {
      transform: 'translateY(-2px)',
      transition: 'all 0.2s ease',
    },
  } : {},

  // Text selection
  textSelectable: isWeb ? {
    userSelect: 'text' as any,
    WebkitUserSelect: 'text' as any,
  } : {},

  noSelect: isWeb ? {
    userSelect: 'none' as any,
    WebkitUserSelect: 'none' as any,
  } : {},

  // Cursor pointer
  pointer: isWeb ? {
    cursor: 'pointer',
  } : {},

  // Focus outline
  focusOutline: isWeb ? {
    '&:focus': {
      outline: '2px solid #1f4b8f',
      outlineOffset: '2px',
    },
  } : {},
};

/**
 * Web için responsive breakpoint helper
 */
export const webBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1366,
};

/**
 * Media query helper
 */
export const mediaQuery = (minWidth: number) => {
  if (!isWeb) return {};
  
  return {
    [`@media (min-width: ${minWidth}px)`]: true,
  };
};

/**
 * Web için grid sistem helper
 */
export const getWebGridColumns = (width: number): number => {
  if (!isWeb) return 1;
  
  if (width < webBreakpoints.mobile) return 1;
  if (width < webBreakpoints.tablet) return 2;
  if (width < webBreakpoints.desktop) return 3;
  return 4;
};

/**
 * Web için container genişlik helper
 */
export const getWebContainerWidth = (width: number): number => {
  if (!isWeb) return width;
  
  if (width < webBreakpoints.mobile) return width;
  if (width < webBreakpoints.tablet) return Math.min(width * 0.95, 800);
  if (width < webBreakpoints.desktop) return Math.min(width * 0.9, 1200);
  return Math.min(width * 0.85, 1400);
};

/**
 * Web için padding helper
 */
export const getWebPadding = (width: number) => {
  if (!isWeb) return 16;
  
  if (width < webBreakpoints.mobile) return 16;
  if (width < webBreakpoints.tablet) return 24;
  if (width < webBreakpoints.desktop) return 32;
  return 48;
};

/**
 * Web için smooth scroll
 */
export const enableSmoothScroll = () => {
  if (!isWeb || typeof document === 'undefined') return;
  
  document.documentElement.style.scrollBehavior = 'smooth';
};

/**
 * Web için CSS class helper
 */
export const addWebClass = (element: any, className: string) => {
  if (!isWeb || !element?.ref?.current) return;
  
  element.ref.current.classList.add(className);
};

/**
 * Web için focus yönetimi
 */
export const manageFocus = {
  trap: (container: any) => {
    if (!isWeb) return () => {};
    
    const focusableElements = container?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements?.length) return () => {};
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },
  
  restore: (previousElement?: HTMLElement) => {
    if (!isWeb) return;
    
    if (previousElement) {
      previousElement.focus();
    } else {
      document.body.focus();
    }
  },
};

/**
 * Web için keyboard shortcuts
 */
export const setupKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  if (!isWeb) return () => {};
  
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const combo = [
      e.ctrlKey && 'ctrl',
      e.altKey && 'alt',
      e.shiftKey && 'shift',
      key
    ].filter(Boolean).join('+');
    
    if (shortcuts[combo]) {
      e.preventDefault();
      shortcuts[combo]();
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Web için clipboard yönetimi
 */
export const clipboard = {
  copy: async (text: string): Promise<boolean> => {
    if (!isWeb || !navigator.clipboard) return false;
    
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  },
  
  paste: async (): Promise<string | null> => {
    if (!isWeb || !navigator.clipboard) return null;
    
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Paste failed:', error);
      return null;
    }
  },
};

/**
 * Web için print optimizasyonları
 */
export const printOptimizations = {
  setup: () => {
    if (!isWeb) return;
    
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        body { background: white !important; color: black !important; }
        * { box-shadow: none !important; }
      }
    `;
    document.head.appendChild(style);
  },
  
  print: (elementId?: string) => {
    if (!isWeb) return;
    
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Print</title></head>
              <body>${element.outerHTML}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
      }
    } else {
      window.print();
    }
  },
};

export default {
  isWeb,
  webStyles,
  webBreakpoints,
  mediaQuery,
  getWebGridColumns,
  getWebContainerWidth,
  getWebPadding,
  enableSmoothScroll,
  addWebClass,
  manageFocus,
  setupKeyboardShortcuts,
  clipboard,
  printOptimizations,
};
