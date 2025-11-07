/**
 * UI Store - UI State Management
 * 
 * Tema, loading, modal ve genel UI durumları
 */

import { create } from 'zustand';
import { ThemeMode } from '@theme';

interface ModalState {
  firmaSelector: boolean;
  filterSheet: boolean;
  confirmDialog: boolean;
  confirmDialogData: ConfirmDialogData | null;
  demoInfo: boolean;
  drawer: boolean;
}

interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'info' | 'warning' | 'danger';
}

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Theme
  theme: ThemeMode;
  
  // Loading
  isGlobalLoading: boolean;
  loadingMessage: string | null;
  
  // Modals
  modals: ModalState;
  
  // Toast
  toasts: ToastData[];
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  showModal: (modalName: keyof ModalState) => void;
  hideModal: (modalName: keyof ModalState) => void;
  showConfirmDialog: (data: ConfirmDialogData) => void;
  hideConfirmDialog: () => void;
  showToast: (message: string, type?: ToastData['type'], duration?: number) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

/**
 * UI Store
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Initial State
  theme: 'light',
  isGlobalLoading: false,
  loadingMessage: null,
  modals: {
    firmaSelector: false,
    filterSheet: false,
    confirmDialog: false,
    confirmDialogData: null,
    demoInfo: false,
    drawer: false,
  },
  toasts: [],

  /**
   * Tema ayarla
   */
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    // TODO: AsyncStorage'a kaydet
    // await AsyncStorage.setItem('theme', theme);
  },

  /**
   * Tema değiştir (toggle)
   */
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  /**
   * Global loading göster/gizle
   */
  setGlobalLoading: (loading: boolean, message?: string) => {
    set({ 
      isGlobalLoading: loading, 
      loadingMessage: message || null 
    });
  },

  /**
   * Modal göster
   */
  showModal: (modalName: keyof ModalState) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },

  /**
   * Modal gizle
   */
  hideModal: (modalName: keyof ModalState) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },

  /**
   * Confirm dialog göster
   */
  showConfirmDialog: (data: ConfirmDialogData) => {
    set(state => ({
      modals: {
        ...state.modals,
        confirmDialog: true,
        confirmDialogData: data,
      },
    }));
  },

  /**
   * Confirm dialog gizle
   */
  hideConfirmDialog: () => {
    set(state => ({
      modals: {
        ...state.modals,
        confirmDialog: false,
        confirmDialogData: null,
      },
    }));
  },

  /**
   * Toast göster
   */
  showToast: (message: string, type: ToastData['type'] = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const toast: ToastData = { id, message, type, duration };

    set(state => ({
      toasts: [...state.toasts, toast],
    }));

    // Otomatik gizleme
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  /**
   * Toast gizle
   */
  hideToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },

  /**
   * Tüm toast'ları temizle
   */
  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));

export default useUIStore;
export type { ConfirmDialogData, ToastData };
