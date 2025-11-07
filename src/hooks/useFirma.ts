/**
 * useFirma Hook - Firma Yönetimi
 * 
 * Firma seçimi, CRUD operations
 */

import { useFirmaStore } from '@store';
import { Firma, CreateFirmaData, UpdateFirmaData } from '@types';

/**
 * useFirma Hook
 * 
 * @returns Firma state ve fonksiyonları
 * 
 * @example
 * const { selectedFirma, firmaList, selectFirma } = useFirma();
 */
export const useFirma = () => {
  const {
    firmaList,
    selectedFirma,
    recentFirmas,
    isLoading,
    error,
    fetchFirmaList,
    selectFirma,
    createFirma,
    updateFirma,
    deleteFirma,
    addToRecent,
    clearError,
  } = useFirmaStore();

  /**
   * Firma listesini getir
   */
  const loadFirmas = async () => {
    try {
      await fetchFirmaList();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Firma seç
   */
  const handleSelectFirma = (firma: Firma) => {
    selectFirma(firma);
  };

  /**
   * Yeni firma oluştur
   */
  const handleCreateFirma = async (data: CreateFirmaData) => {
    try {
      await createFirma(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Firma güncelle
   */
  const handleUpdateFirma = async (data: UpdateFirmaData) => {
    try {
      await updateFirma(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Firma sil
   */
  const handleDeleteFirma = async (firmaId: string) => {
    try {
      await deleteFirma(firmaId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Seçili firma adını al
   */
  const getSelectedFirmaName = () => {
    return selectedFirma?.shortName || selectedFirma?.unvan || 'Firma Seçin';
  };

  /**
   * Firma ID'sine göre firma bul
   */
  const getFirmaById = (id: string) => {
    return firmaList.find(firma => firma.id === id);
  };

  /**
   * Firma var mı kontrol et
   */
  const hasFirmas = firmaList.length > 0;

  /**
   * Firma seçili mi?
   */
  const haSelectedFirma = selectedFirma !== null;

  /**
   * Tek firma mı var?
   */
  const isSingleFirma = firmaList.length === 1;

  return {
    // State
    firmaList,
    selectedFirma,
    recentFirmas,
    isLoading,
    error,
    hasFirmas,
    hasSelectedFirma: haSelectedFirma,
    isSingleFirma,
    
    // Functions
    loadFirmas,
    selectFirma: handleSelectFirma,
    createFirma: handleCreateFirma,
    updateFirma: handleUpdateFirma,
    deleteFirma: handleDeleteFirma,
    getSelectedFirmaName,
    getFirmaById,
    clearError,
  };
};

export default useFirma;
