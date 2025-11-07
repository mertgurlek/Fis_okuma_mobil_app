/**
 * User Store - Alt Kullanıcı Yönetim Store'u
 * Zustand ile state management
 */

import { create } from 'zustand';
import {
  SubUser,
  SubUserState,
  SubUserActions,
  CreateSubUserData,
  UpdateSubUserData,
  KontorUsageLog,
  SubUserRole,
  UserStatus,
} from '@types';

type UserStore = SubUserState & SubUserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial State
  subUsers: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  /**
   * Alt kullanıcıları yükle
   */
  fetchSubUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // const response = await api.get('/users/subusers');
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSubUsers: SubUser[] = [
        {
          id: '1',
          email: 'musavir1@example.com',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          phone: '0532 111 2233',
          role: SubUserRole.MUSAVIR,
          status: UserStatus.ACTIVE,
          kontorTotal: 500,
          kontorUsed: 120,
          kontorRemaining: 380,
          assignedFirmaIds: ['1', '2'],
          parentUserId: '1',
          lastLoginAt: '2024-11-03T10:30:00Z',
          createdAt: '2024-10-01T00:00:00Z',
          updatedAt: '2024-11-03T10:30:00Z',
        },
        {
          id: '2',
          email: 'mukellef1@example.com',
          firstName: 'Zeynep',
          lastName: 'Kaya',
          phone: '0533 444 5566',
          role: SubUserRole.MUKELLEF,
          status: UserStatus.ACTIVE,
          kontorTotal: 200,
          kontorUsed: 45,
          kontorRemaining: 155,
          assignedFirmaIds: ['1'],
          parentUserId: '1',
          lastLoginAt: '2024-11-02T15:20:00Z',
          createdAt: '2024-10-15T00:00:00Z',
          updatedAt: '2024-11-02T15:20:00Z',
        },
        {
          id: '3',
          email: 'subuser1@example.com',
          firstName: 'Mehmet',
          lastName: 'Demir',
          phone: '0534 777 8899',
          role: SubUserRole.SUB_USER,
          status: UserStatus.INACTIVE,
          kontorTotal: 100,
          kontorUsed: 25,
          kontorRemaining: 75,
          assignedFirmaIds: [],
          parentUserId: '1',
          createdAt: '2024-10-20T00:00:00Z',
          updatedAt: '2024-10-25T00:00:00Z',
        },
      ];

      set({
        subUsers: mockSubUsers,
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
   * Yeni alt kullanıcı oluştur
   */
  createSubUser: async (data: CreateSubUserData) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // const response = await api.post('/users/subusers', data);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser: SubUser = {
        id: Date.now().toString(),
        ...data,
        status: UserStatus.ACTIVE,
        kontorUsed: 0,
        kontorRemaining: data.kontorTotal,
        parentUserId: '1', // Current user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        subUsers: [...state.subUsers, newUser],
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
   * Alt kullanıcıyı güncelle
   */
  updateSubUser: async (data: UpdateSubUserData) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // const response = await api.put(`/users/subusers/${data.id}`, data);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        subUsers: state.subUsers.map(user =>
          user.id === data.id
            ? {
                ...user,
                ...data,
                updatedAt: new Date().toISOString(),
              }
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
   * Alt kullanıcıyı sil
   */
  deleteSubUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // await api.delete(`/users/subusers/${userId}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        subUsers: state.subUsers.filter(user => user.id !== userId),
        selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
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
   * Şifre sıfırlama linki gönder
   */
  sendPasswordReset: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // await api.post(`/users/subusers/${userId}/reset-password`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Başarılı mesajı göster (UI'da toast ile)
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Şifre sıfırlama linki gönderilemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Kontör ata
   */
  assignKontor: async (userId: string, amount: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: API call
      // await api.post(`/users/subusers/${userId}/assign-kontor`, { amount });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        subUsers: state.subUsers.map(user =>
          user.id === userId
            ? {
                ...user,
                kontorTotal: user.kontorTotal + amount,
                kontorRemaining: user.kontorRemaining + amount,
                updatedAt: new Date().toISOString(),
              }
            : user
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Kontör atanamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Kontör kullanım geçmişi getir
   */
  getKontorUsage: async (userId: string): Promise<KontorUsageLog[]> => {
    try {
      // TODO: API call
      // const response = await api.get(`/users/subusers/${userId}/kontor-usage`);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const mockLogs: KontorUsageLog[] = [
        {
          id: '1',
          userId,
          amount: 10,
          description: 'OCR işlemi - Fiş okuma',
          createdAt: '2024-11-03T10:30:00Z',
        },
        {
          id: '2',
          userId,
          amount: 5,
          description: 'Toplu onay işlemi',
          createdAt: '2024-11-02T14:20:00Z',
        },
      ];

      return mockLogs;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Hata temizle
   */
  clearError: () => {
    set({ error: null });
  },
}));

/**
 * Custom hook - useUsers
 */
export const useUsers = () => {
  const store = useUserStore();
  return store;
};
