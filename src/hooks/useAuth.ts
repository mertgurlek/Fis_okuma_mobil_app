/**
 * useAuth Hook - Kimlik Doğrulama
 * 
 * Login, logout, token validation
 */

import { useAuthStore } from '@store';
import { LoginCredentials, SignupData } from '@types';

/**
 * useAuth Hook
 * 
 * @returns Auth state ve fonksiyonları
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isDemo,
    error,
    login,
    logout,
    signup,
    loginDemo,
    validateToken,
    clearError,
    updateAutoRecharge,
    updateRechargeSettings,
    updateNotificationSettings,
  } = useAuthStore();

  /**
   * Login yap
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout yap
   */
  const handleLogout = async () => {
    try {
      await logout();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Kayıt başvurusu gönder
   */
  const handleSignup = async (data: SignupData) => {
    try {
      await signup(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Demo moduna gir
   */
  const handleDemoLogin = async () => {
    try {
      await loginDemo();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Token doğrula
   */
  const checkAuth = async () => {
    if (!token) return false;
    return await validateToken();
  };

  /**
   * Kullanıcı bilgilerini al
   */
  const getUserInfo = () => {
    return user;
  };

  /**
   * Kullanıcı adını al
   */
  const getUserName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim() || user.username;
  };

  /**
   * Demo kullanıcısı mı?
   */
  const isDemoUser = isDemo;

  /**
   * Admin mi?
   */
  const isAdmin = user?.role === 'admin';

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    isDemo: isDemoUser,
    isAdmin,
    error,
    
    // Functions
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
    loginDemo: handleDemoLogin,
    checkAuth,
    getUserInfo,
    getUserName,
    clearError,
    updateAutoRecharge,
    updateRechargeSettings,
    updateNotificationSettings,
  };
};

export default useAuth;
