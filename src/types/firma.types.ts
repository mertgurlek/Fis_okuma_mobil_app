/**
 * Firma Types - Firma (Şirket) Tipleri
 */

/**
 * Firma Türü
 */
export enum FirmaTuru {
  SAHIS = 'sahis',
  LIMITED = 'limited',
  ANONIM = 'anonim',
  KOLLEKTIF = 'kollektif',
  KOMANDIT = 'komandit',
  KOOPERATIF = 'kooperatif',
  DIGER = 'diger',
}

/**
 * API Servisi
 */
export interface ApiServis {
  servisAdi: string;           // E-Arşiv, E-Fatura vb.
  kullaniciAdi?: string;
  sifre?: string;
  apiUrl?: string;
  aktif: boolean;
}

/**
 * Firma Bilgileri
 */
export interface Firma {
  id: string;
  
  // Temel Bilgiler
  unvan: string;               // Firma Ünvanı (Tam)
  shortName: string;           // Kısa isim (UI'da gösterilecek)
  vkn: string;                 // Vergi Kimlik Numarası
  tckn?: string;               // TC Kimlik No (Şahıs firmaları için)
  vergiDairesi: string;        // Vergi Dairesi
  
  // İletişim Bilgileri
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  
  // Firma Detayları
  firmaTuru: FirmaTuru;        // Firma Türü
  naceKodu?: string;           // NACE Kodu
  sektor?: string;             // Sektör açıklaması
  
  // API Servisleri
  apiServisleri?: ApiServis[]; // E-Arşiv, E-Fatura vb.
  
  // Sistem
  userId: string;              // Hangi kullanıcıya ait
  isActive: boolean;
  kontor?: number;             // Kalan kontör sayısı
  createdAt: string;
  updatedAt: string;
}

/**
 * Firma Liste Item (Listelerde kullanılacak minimal data)
 */
export interface FirmaListItem {
  id: string;
  vkn: string;
  unvan: string;
  shortName: string;
  isActive: boolean;
}

/**
 * Firma Oluşturma Verisi
 */
export interface CreateFirmaData {
  unvan: string;
  shortName: string;
  vkn: string;
  tckn?: string;
  vergiDairesi: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  firmaTuru: FirmaTuru;
  naceKodu?: string;
  sektor?: string;
  apiServisleri?: ApiServis[];
}

/**
 * Firma Güncelleme Verisi
 */
export interface UpdateFirmaData {
  id: string;
  unvan?: string;
  shortName?: string;
  vkn?: string;
  tckn?: string;
  vergiDairesi?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  firmaTuru?: FirmaTuru;
  naceKodu?: string;
  sektor?: string;
  apiServisleri?: ApiServis[];
  isActive?: boolean;
}

/**
 * Firma Seçimi State
 */
export interface FirmaState {
  firmaList: Firma[];
  selectedFirma: Firma | null;
  recentFirmas: FirmaListItem[];  // Son kullanılan firmalar (max 3-5)
  isLoading: boolean;
  error: string | null;
}

/**
 * Firma Actions
 */
export interface FirmaActions {
  fetchFirmaList: () => Promise<void>;
  selectFirma: (firma: Firma) => void;
  createFirma: (data: CreateFirmaData) => Promise<void>;
  updateFirma: (data: UpdateFirmaData) => Promise<void>;
  deleteFirma: (firmaId: string) => Promise<void>;
  addToRecent: (firma: FirmaListItem) => void;
  clearError: () => void;
}

/**
 * Firma Selector Modal State
 */
export interface FirmaSelectorState {
  isVisible: boolean;
  searchQuery: string;
  filteredFirmas: FirmaListItem[];
}

/**
 * Firma Kullanıcısı
 */
export interface FirmaUser {
  id: string;
  firmaId: string;             // Hangi firmaya ait
  username: string;            // Kullanıcı adı
  password: string;            // Şifre (gerçek uygulamada hash'li olacak)
  firstName: string;           // Ad
  lastName: string;            // Soyad
  email?: string;              // E-posta
  phone?: string;              // Telefon
  isActive: boolean;           // Aktif mi?
  createdBy: string;           // Oluşturan kullanıcı ID
  createdAt: string;
  updatedAt: string;
}

/**
 * Firma Kullanıcısı Oluşturma Verisi
 */
export interface CreateFirmaUserData {
  firmaId: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

/**
 * Firma Kullanıcısı Güncelleme Verisi
 */
export interface UpdateFirmaUserData {
  id: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}
