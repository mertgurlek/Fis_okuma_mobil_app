/**
 * useReceipt Hook - Fiş Yönetimi
 * 
 * Fiş CRUD, filtreleme, onaylama
 */

import { useReceiptStore } from '@store';
import { 
  CreateReceiptData, 
  UpdateReceiptData, 
  ReceiptFilter,
  DiffLog,
  Receipt
} from '@types';

/**
 * useReceipt Hook
 * 
 * @returns Receipt state ve fonksiyonları
 * 
 * @example
 * const { receipts, selectedReceipt, createReceipt, approveReceipt } = useReceipt();
 */
export const useReceipt = () => {
  const {
    receipts,
    selectedReceipt,
    filters,
    isLoading,
    error,
    fetchReceipts,
    fetchReceiptById,
    createReceipt,
    updateReceipt,
    approveReceipt,
    deleteReceipt,
    fetchTaxpayerReceipts,
    approveFromTaxpayer,
    rejectFromTaxpayer,
    setFilters,
    clearFilters,
    setSelectedReceipt,
    clearError,
  } = useReceiptStore();

  /**
   * Fişleri getir
   */
  const loadReceipts = async (firmaId?: string) => {
    try {
      await fetchReceipts(firmaId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Fiş detayını getir
   */
  const loadReceiptById = async (id: string) => {
    try {
      await fetchReceiptById(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Yeni fiş oluştur
   */
  const handleCreateReceipt = async (data: CreateReceiptData) => {
    try {
      const receipt = await createReceipt(data);
      return { success: true, data: receipt };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Fiş güncelle
   */
  const handleUpdateReceipt = async (data: UpdateReceiptData) => {
    try {
      await updateReceipt(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Fiş onayla
   */
  const handleApproveReceipt = async (id: string, diffLog?: DiffLog[]) => {
    try {
      await approveReceipt(id, diffLog);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Fiş sil
   */
  const handleDeleteReceipt = async (id: string) => {
    try {
      await deleteReceipt(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Filtreleri güncelle
   */
  const updateFilters = (newFilters: Partial<ReceiptFilter>) => {
    setFilters(newFilters);
  };

  /**
   * Filtreleri temizle
   */
  const resetFilters = () => {
    clearFilters();
  };

  /**
   * Seçili fişi ayarla
   */
  const selectReceipt = (receipt: Receipt | null) => {
    setSelectedReceipt(receipt);
  };

  /**
   * Filtrelenmiş fişler
   */
  const getFilteredReceipts = () => {
    let filtered = [...receipts];

    // Statü filtresi
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(r => filters.status!.includes(r.status));
    }

    // Fiş tipi filtresi
    if (filters.fisType && filters.fisType.length > 0) {
      filtered = filtered.filter(r => filters.fisType!.includes(r.fisType));
    }

    // Tarih aralığı filtresi
    if (filters.startDate) {
      filtered = filtered.filter(r => r.tarih >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(r => r.tarih <= filters.endDate!);
    }

    // Tutar aralığı filtresi
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(r => r.toplamTutar >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(r => r.toplamTutar <= filters.maxAmount!);
    }

    // Arama sorgusu (unvan veya VKN)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.unvan.toLowerCase().includes(query) ||
        r.vkn.includes(query)
      );
    }

    return filtered;
  };

  /**
   * Onaylı fiş sayısı
   */
  const getApprovedCount = () => {
    return receipts.filter(r => r.status === 'approved').length;
  };

  /**
   * Onaysız fiş sayısı
   */
  const getPendingCount = () => {
    return receipts.filter(r => r.status === 'pending').length;
  };

  /**
   * Toplam tutar
   */
  const getTotalAmount = () => {
    return receipts.reduce((sum, r) => sum + r.toplamTutar, 0);
  };

  /**
   * Fiş var mı?
   */
  const hasReceipts = receipts.length > 0;

  /**
   * Filtre aktif mi?
   */
  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    // State
    receipts,
    selectedReceipt,
    filters,
    isLoading,
    error,
    hasReceipts,
    hasActiveFilters,
    
    // Functions
    loadReceipts,
    loadReceiptById,
    createReceipt: handleCreateReceipt,
    updateReceipt: handleUpdateReceipt,
    approveReceipt: handleApproveReceipt,
    deleteReceipt: handleDeleteReceipt,
    updateFilters,
    resetFilters,
    selectReceipt,
    
    // Mükellef işlemleri
    fetchTaxpayerReceipts,
    approveFromTaxpayer,
    rejectFromTaxpayer,
    
    // Computed
    filteredReceipts: getFilteredReceipts(),
    approvedCount: getApprovedCount(),
    pendingCount: getPendingCount(),
    totalAmount: getTotalAmount(),
    
    clearError,
  };
};

export default useReceipt;
