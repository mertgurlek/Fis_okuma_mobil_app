/**
 * Firma User Store - Firma Kullanıcıları State Management
 * 
 * Firma bazında kullanıcı yönetimi
 */

import { create } from 'zustand';
import { 
  FirmaUser, 
  CreateFirmaUserData, 
  UpdateFirmaUserData
} from '@types';

interface FirmaUserState {
  // State
  firmaUsers: FirmaUser[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFirmaUsers: (firmaId: string) => Promise<void>;
  createFirmaUser: (data: CreateFirmaUserData) => Promise<void>;
  updateFirmaUser: (data: UpdateFirmaUserData) => Promise<void>;
  deleteFirmaUser: (userId: string) => Promise<void>;
  getFirmaUsers: (firmaId: string) => FirmaUser[];
  clearError: () => void;
}

/**
 * Firma User Store
 */
export const useFirmaUserStore = create<FirmaUserState>((set, get) => ({
  // Initial State
  firmaUsers: [],
  isLoading: false,
  error: null,

  /**
   * Firma kullanıcılarını yükle
   */
  loadFirmaUsers: async (firmaId: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaUserApi.getFirmaUsers(firmaId);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data - gerçek uygulamada API'den gelecek
      const existingUsers = get().firmaUsers;
      const mockUsers: FirmaUser[] = existingUsers.filter(u => u.firmaId === firmaId);

      set({
        firmaUsers: [...existingUsers.filter(u => u.firmaId !== firmaId), ...mockUsers],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Kullanıcılar yüklenemedi',
        isLoading: false,
      });
    }
  },

  /**
   * Yeni firma kullanıcısı oluştur
   */
  createFirmaUser: async (data: CreateFirmaUserData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaUserApi.createFirmaUser(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: FirmaUser = {
        id: Date.now().toString(),
        ...data,
        isActive: true,
        createdBy: '1', // TODO: Gerçek kullanıcı ID'si
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        firmaUsers: [...state.firmaUsers, newUser],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Kullanıcı oluşturulamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Firma kullanıcısını güncelle
   */
  updateFirmaUser: async (data: UpdateFirmaUserData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaUserApi.updateFirmaUser(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        firmaUsers: state.firmaUsers.map(user =>
          user.id === data.id
            ? { ...user, ...data, updatedAt: new Date().toISOString() }
            : user
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Kullanıcı güncellenemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Firma kullanıcısını sil
   */
  deleteFirmaUser: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaUserApi.deleteFirmaUser(userId);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        firmaUsers: state.firmaUsers.filter(user => user.id !== userId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Kullanıcı silinemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Belirli bir firmaya ait kullanıcıları getir
   */
  getFirmaUsers: (firmaId: string) => {
    return get().firmaUsers.filter(user => user.firmaId === firmaId);
  },

  /**
   * Error temizle
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useFirmaUserStore;
