/**
 * Firma User Hook
 * 
 * Firma kullanıcı yönetimi için hook
 */

import { useFirmaUserStore } from '@store';

export const useFirmaUser = () => {
  const {
    firmaUsers,
    isLoading,
    error,
    loadFirmaUsers,
    createFirmaUser,
    updateFirmaUser,
    deleteFirmaUser,
    getFirmaUsers,
    clearError,
  } = useFirmaUserStore();

  return {
    firmaUsers,
    isLoading,
    error,
    loadFirmaUsers,
    createFirmaUser,
    updateFirmaUser,
    deleteFirmaUser,
    getFirmaUsers,
    clearError,
  };
};

export default useFirmaUser;
