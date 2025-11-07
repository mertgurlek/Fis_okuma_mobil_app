/**
 * Auth Store - Kimlik Doğrulama State Management
 * 
 * Zustand kullanarak global auth state yönetimi
 */

import { create } from 'zustand';
import { 
  User, 
  LoginCredentials, 
  SignupData, 
  UserRole,
  UserType,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginDemo: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  setToken: (token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  updateAutoRecharge: (enabled: boolean) => void;
  updateRechargeSettings: (threshold: number, amount: number) => void;
  updateNotificationSettings: (key: string, value: boolean) => void;
}

/**
 * Auth Store
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isDemo: false,
  error: null,

  /**
   * Login işlemi
   */
  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı yapılacak
      // const response = await authApi.login(credentials);
      
      // Mock response (şimdilik)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kullanıcı adına göre farklı kullanıcı tipleri
      let userType = UserType.MAIN_USER;
      let firstName = 'Ana';
      let lastName = 'Kullanıcı';
      let email = 'ana@example.com';
      let assignedFirmaIds: string[] | undefined = undefined;
      
      if (credentials.username.toLowerCase() === 'musavir' || credentials.username.toLowerCase() === 'advisor') {
        userType = UserType.SUB_ADVISOR;
        firstName = 'Alt';
        lastName = 'Müşavir';
        email = 'musavir@example.com';
        assignedFirmaIds = ['1', '2']; // Tüm firmalara erişim
      } else if (credentials.username.toLowerCase() === 'mukellef' || credentials.username.toLowerCase() === 'taxpayer') {
        userType = UserType.TAXPAYER;
        firstName = 'Test';
        lastName = 'Mükellef';
        email = 'mukellef@example.com';
        assignedFirmaIds = ['1']; // Sadece 1 firmaya erişim
      }
      
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: UserRole.USER,
        userType: userType,
        assignedFirmaIds: assignedFirmaIds,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Kontör ve Kullanım Bilgileri
        credits: {
          total: 1000,
          used: 350,
          remaining: 650,
          lastPurchaseDate: '2024-10-15T10:30:00.000Z',
          lastUsageDate: new Date().toISOString(),
        },
        usage: {
          totalReceipts: 350,
          monthlyReceipts: 45,
          weeklyReceipts: 12,
          dailyAverage: 2.8,
          lastActivityDate: new Date().toISOString(),
        },
        subscription: {
          plan: SubscriptionPlan.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
          startDate: '2024-01-01T00:00:00.000Z',
          autoRenew: true,
        },
        settings: {
          autoRecharge: false,
          rechargeThreshold: 100,
          rechargeAmount: 500,
          notifications: {
            lowCredit: true,
            receiptProcessed: true,
            weeklyReport: true,
            monthlyReport: false,
          },
        },
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isDemo: false,
        isLoading: false,
      });

      // Token'ı secure storage'a kaydet
      // await secureStorage.setToken(mockToken);
    } catch (error: any) {
      set({
        error: error.message || 'Giriş yapılamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Logout işlemi
   */
  logout: async () => {
    try {
      set({ isLoading: true });

      // Token'ı temizle
      // await secureStorage.clearToken();

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isDemo: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Çıkış yapılamadı',
        isLoading: false 
      });
    }
  },

  /**
   * Signup (Kayıt başvurusu)
   */
  signup: async (data: SignupData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı - CRM'e lead oluştur
      // const response = await authApi.signup(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      set({ isLoading: false });
      
      // Başarılı mesajı UI'da gösterilecek
    } catch (error: any) {
      set({
        error: error.message || 'Kayıt başvurusu gönderilemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Demo mode girişi
   */
  loginDemo: async () => {
    try {
      set({ isLoading: true, error: null });

      await new Promise(resolve => setTimeout(resolve, 500));

      const demoUser: User = {
        id: 'demo',
        username: 'demo',
        email: 'demo@fisokuma.com',
        firstName: 'Demo',
        lastName: 'Müşavir',
        role: UserRole.DEMO,
        userType: UserType.SUB_ADVISOR,
        assignedFirmaIds: ['1', '2'], // Demo müşavirine tüm firmaları atıyoruz
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Demo Kullanıcı İçin Kontör ve Kullanım Bilgileri
        credits: {
          total: 50,
          used: 25,
          remaining: 25,
          lastPurchaseDate: new Date().toISOString(),
          lastUsageDate: new Date().toISOString(),
        },
        usage: {
          totalReceipts: 25,
          monthlyReceipts: 15,
          weeklyReceipts: 8,
          dailyAverage: 1.5,
          lastActivityDate: new Date().toISOString(),
        },
        subscription: {
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.TRIAL,
          startDate: new Date().toISOString(),
          autoRenew: false,
        },
        settings: {
          autoRecharge: false,
          rechargeThreshold: 10,
          rechargeAmount: 50,
          notifications: {
            lowCredit: true,
            receiptProcessed: false,
            weeklyReport: false,
            monthlyReport: false,
          },
        },
      };

      set({
        user: demoUser,
        token: 'demo-token',
        isAuthenticated: true,
        isDemo: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Demo moduna giriş yapılamadı',
        isLoading: false,
      });
    }
  },

  /**
   * Token doğrulama
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const { token } = get();
      if (!token) return false;

      // TODO: API çağrısı - token doğrulama
      // const response = await authApi.validateToken(token);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock: token geçerli kabul ediliyor
      return true;
    } catch (error) {
      set({ 
        isAuthenticated: false, 
        token: null,
        user: null 
      });
      return false;
    }
  },

  /**
   * Token setter
   */
  setToken: (token: string, refreshToken?: string) => {
    set({ 
      token, 
      refreshToken: refreshToken || null,
      isAuthenticated: true 
    });
  },

  /**
   * User setter
   */
  setUser: (user: User) => {
    set({ user });
  },

  /**
   * Error temizleme
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Loading setter
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * Otomatik yenileme ayarını güncelle
   */
  updateAutoRecharge: (enabled: boolean) => {
    const { user } = get();
    if (!user || !user.settings) return;

    set({
      user: {
        ...user,
        settings: {
          ...user.settings,
          autoRecharge: enabled,
        },
      },
    });
  },

  /**
   * Yenileme ayarlarını güncelle
   */
  updateRechargeSettings: (threshold: number, amount: number) => {
    const { user } = get();
    if (!user || !user.settings) return;

    set({
      user: {
        ...user,
        settings: {
          ...user.settings,
          rechargeThreshold: threshold,
          rechargeAmount: amount,
        },
      },
    });
  },

  /**
   * Bildirim ayarlarını güncelle
   */
  updateNotificationSettings: (key: string, value: boolean) => {
    const { user } = get();
    if (!user || !user.settings) return;

    set({
      user: {
        ...user,
        settings: {
          ...user.settings,
          notifications: {
            ...user.settings.notifications,
            [key]: value,
          },
        },
      },
    });
  },
}));

export default useAuthStore;
