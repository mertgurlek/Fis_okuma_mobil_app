/**
 * Firma Store - Firma Yönetimi State Management
 * 
 * Çoklu firma desteği ve firma seçimi
 */

import { create } from 'zustand';
import { 
  Firma, 
  FirmaListItem, 
  CreateFirmaData, 
  UpdateFirmaData,
  FirmaTuru
} from '@types';

interface FirmaState {
  // State
  firmaList: Firma[];
  selectedFirma: Firma | null;
  recentFirmas: FirmaListItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFirmaList: () => Promise<void>;
  selectFirma: (firma: Firma) => void;
  createFirma: (data: CreateFirmaData) => Promise<void>;
  updateFirma: (data: UpdateFirmaData) => Promise<void>;
  deleteFirma: (firmaId: string) => Promise<void>;
  addToRecent: (firma: FirmaListItem) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Firma Store
 */
export const useFirmaStore = create<FirmaState>((set, get) => ({
  // Initial State
  firmaList: [],
  selectedFirma: null,
  recentFirmas: [],
  isLoading: false,
  error: null,

  /**
   * Firma listesini getir
   */
  fetchFirmaList: async () => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaApi.getFirmaList();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockFirmas: Firma[] = [
        {
          id: '1',
          unvan: 'ABC Bilişim Teknolojileri Limited Şirketi',
          shortName: 'ABC Ltd.',
          vkn: '1234567890',
          vergiDairesi: 'Kadıköy Vergi Dairesi',
          firmaTuru: FirmaTuru.LIMITED,
          address: 'Atatürk Cad. No: 123 Kadıköy',
          city: 'İstanbul',
          phone: '0216 555 12 34',
          email: 'info@abc.com',
          naceKodu: '62.01',
          sektor: 'Bilişim',
          userId: '1',
          isActive: true,
          kontor: 150,  // Kalan kontör
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          unvan: 'XYZ Danışmanlık Anonim Şirketi',
          shortName: 'XYZ A.Ş.',
          vkn: '0987654321',
          vergiDairesi: 'Beşiktaş Vergi Dairesi',
          firmaTuru: FirmaTuru.ANONIM,
          address: 'Barbaros Bulvarı No: 456 Beşiktaş',
          city: 'İstanbul',
          phone: '0212 555 98 76',
          email: 'iletisim@xyz.com',
          naceKodu: '70.22',
          sektor: 'Danışmanlık',
          userId: '1',
          isActive: true,
          kontor: 75,  // Kalan kontör
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      set({
        firmaList: mockFirmas,
        selectedFirma: mockFirmas[0], // İlk firmayı seç
        isLoading: false,
      });

      // İlk firmayı recent'a ekle
      get().addToRecent({
        id: mockFirmas[0].id,
        vkn: mockFirmas[0].vkn,
        unvan: mockFirmas[0].unvan,
        shortName: mockFirmas[0].shortName,
        isActive: mockFirmas[0].isActive,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Firma listesi alınamadı',
        isLoading: false,
      });
    }
  },

  /**
   * Firma seç
   */
  selectFirma: (firma: Firma) => {
    set({ selectedFirma: firma });
    
    // Recent listesine ekle
    get().addToRecent({
      id: firma.id,
      vkn: firma.vkn,
      unvan: firma.unvan,
      shortName: firma.shortName,
      isActive: firma.isActive,
    });
  },

  /**
   * Yeni firma oluştur
   */
  createFirma: async (data: CreateFirmaData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaApi.createFirma(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newFirma: Firma = {
        id: Date.now().toString(),
        ...data,
        userId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        firmaList: [...state.firmaList, newFirma],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Firma oluşturulamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Firma güncelle
   */
  updateFirma: async (data: UpdateFirmaData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaApi.updateFirma(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        firmaList: state.firmaList.map(firma =>
          firma.id === data.id
            ? { ...firma, ...data, updatedAt: new Date().toISOString() }
            : firma
        ),
        selectedFirma: state.selectedFirma?.id === data.id
          ? { ...state.selectedFirma, ...data, updatedAt: new Date().toISOString() }
          : state.selectedFirma,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Firma güncellenemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Firma sil (soft delete)
   */
  deleteFirma: async (firmaId: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await firmaApi.deleteFirma(firmaId);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        firmaList: state.firmaList.filter(firma => firma.id !== firmaId),
        selectedFirma: state.selectedFirma?.id === firmaId 
          ? null 
          : state.selectedFirma,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Firma silinemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Son kullanılan firmalara ekle
   */
  addToRecent: (firma: FirmaListItem) => {
    set(state => {
      // Zaten varsa çıkar
      const filtered = state.recentFirmas.filter(f => f.id !== firma.id);
      
      // Başa ekle
      const updated = [firma, ...filtered];
      
      // Maksimum 5 firma tut
      const limited = updated.slice(0, 5);

      return { recentFirmas: limited };
    });
  },

  /**
   * Error temizle
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
}));

export default useFirmaStore;
