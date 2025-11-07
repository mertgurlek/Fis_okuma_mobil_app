/**
 * Receipt Types - Fiş Tipleri
 */

/**
 * Fiş Durumu
 */
export enum ReceiptStatus {
  PROCESSING = 'processing', // İşleniyor (OCR analiz ediyor)
  VERIFIED = 'verified',     // Doğrulanmış (OCR tamamlandı, inceleme bekliyor)
  APPROVED = 'approved',     // Onaylanmış (Muhasebeleştirmeye hazır)
  REJECTED = 'rejected',     // Reddedilmiş
  DELETED = 'deleted',       // Silindi (soft delete)
}

/**
 * Fiş Kaynağı (Kim yükledi)
 */
export enum ReceiptSource {
  MAIN_USER = 'main_user',         // Ana kullanıcı
  SUB_ADVISOR = 'sub_advisor',     // Alt müşavir
  TAXPAYER = 'taxpayer',           // Mükellef
}

/**
 * Müşavir Onay Durumu (Mükelleften gelen fişler için)
 */
export enum AdvisorApprovalStatus {
  WAITING = 'waiting',             // Müşavir onayı bekliyor
  APPROVED = 'approved',           // Müşavir onayladı
  REJECTED = 'rejected',           // Müşavir reddetti
  NOT_REQUIRED = 'not_required',   // Onay gerekmiyor (mükellef dışından gelen fişler)
}

/**
 * Fiş Tipi
 */
export enum ReceiptType {
  YAZAR_KASA = 'yazar_kasa',  // Yazar kasa fişi
  Z_RAPORU = 'z_raporu',      // Z-raporu
  DIGER = 'diger',            // Diğer
}

/**
 * Fiş Kategorisi
 */
export enum ReceiptCategory {
  YEMEK = 'yemek',           // Yemek
  YAKIT = 'yakit',           // Yakıt
  OFIS = 'ofis',             // Ofis malzemeleri
  ULASIM = 'ulasim',         // Ulaşım
  KONAKLAMA = 'konaklama',   // Konaklama
  SAGLIK = 'saglik',         // Sağlık
  EGITIM = 'egitim',         // Eğitim
  DIGER = 'diger',           // Diğer
}

/**
 * KDV Satırı
 */
export interface KDVLine {
  id?: string;
  oran: number;              // KDV Oranı (örn: 10, 20)
  matrah: number;            // KDV Matrahı
  kdvTutari: number;         // KDV Tutarı
}

/**
 * Fiş Bilgileri (Ana veri yapısı)
 */
export interface Receipt {
  id: string;
  firmaId: string;           // Hangi firmaya ait
  userId: string;            // Hangi kullanıcı tarafından oluşturuldu
  
  // Fiş bilgileri
  tarih: string;             // ISO date string
  fisNo: string;             // Fiş numarası
  vkn: string;               // Satıcı VKN
  unvan: string;             // Satıcı ünvanı
  
  // KDV detayları
  kdvSatirlari: KDVLine[];   // KDV satırları
  toplamKdv: number;         // Toplam KDV
  toplamTutar: number;       // Toplam tutar
  
  // Metadata
  fisType: ReceiptType;      // Fiş tipi
  category?: ReceiptCategory; // Kategori
  tags?: string[];           // Etiketler
  status: ReceiptStatus;     // Durum
  imageUrl?: string;         // Fiş görseli URL
  localImagePath?: string;   // Offline için local path
  imagePath?: string;        // Lokal disk path (demo için)
  
  // Kaynak ve onay bilgileri
  source: ReceiptSource;     // Fiş kaynağı (kim yükledi)
  advisorApprovalStatus: AdvisorApprovalStatus; // Müşavir onay durumu
  advisorApprovedBy?: string;  // Onaylayan müşavir ID
  advisorApprovedAt?: string;  // Müşavir onay tarihi
  advisorRejectionReason?: string; // Ret nedeni (varsa)
  
  // AI & Diff tracking
  aiResult?: AIResult;       // AI'dan gelen ham veri
  ocrData?: {                // OCR ham verisi
    rawText: string;         // Ham metin
    confidence: number;      // Güven skoru (0-1)
  };
  userEdited: boolean;       // Kullanıcı düzenledi mi?
  diffLog?: DiffLog[];       // Hangi alanlar değişti
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;       // Onaylandığı tarih
}

/**
 * AI OCR Sonucu
 */
export interface AIResult {
  tarih: string | null;
  fisNo: string | null;
  vkn: string | null;
  unvan: string | null;
  kdvSatirlari: KDVLine[];
  toplamKdv: number | null;
  toplamTutar: number | null;
  confidence: number;        // Güven skoru (0-100)
  processingTime: number;    // İşlem süresi (ms)
}

/**
 * Diff Log (Kullanıcı düzenlemesi takibi)
 */
export interface DiffLog {
  field: string;             // Değiştirilen alan adı
  aiValue: any;              // AI'ın önerdiği değer
  userValue: any;            // Kullanıcının girdiği değer
  timestamp: string;         // Değişiklik zamanı
}

/**
 * Fiş Liste Item (Listelerde gösterilecek minimal data)
 */
export interface ReceiptListItem {
  id: string;
  tarih: string;
  unvan: string;
  toplamTutar: number;
  status: ReceiptStatus;
  fisType: ReceiptType;
  userEdited: boolean;
}

/**
 * Fiş Oluşturma Verisi
 */
export interface CreateReceiptData {
  firmaId: string;
  tarih: string;
  fisNo: string;
  vkn: string;
  unvan: string;
  kdvSatirlari: KDVLine[];
  toplamKdv: number;
  toplamTutar: number;
  fisType: ReceiptType;
  status?: ReceiptStatus;
  imageUrl?: string;
  localImagePath?: string;
  imagePath?: string; // Lokal disk path (demo için)
  aiResult?: AIResult;
}

/**
 * Fiş Güncelleme Verisi
 */
export interface UpdateReceiptData {
  id: string;
  tarih?: string;
  fisNo?: string;
  vkn?: string;
  unvan?: string;
  kdvSatirlari?: KDVLine[];
  toplamKdv?: number;
  toplamTutar?: number;
  category?: ReceiptCategory;
  tags?: string[];
  status?: ReceiptStatus;
  userEdited?: boolean;
  diffLog?: DiffLog[];
}

/**
 * Fiş Filtreleme
 */
export interface ReceiptFilter {
  firmaId?: string;
  status?: ReceiptStatus[];
  fisType?: ReceiptType[];
  source?: ReceiptSource[];           // Kaynak filtresi (Müşavir/Mükellef)
  advisorApproval?: AdvisorApprovalStatus[]; // Müşavir onay durumu filtresi
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;      // Unvan veya VKN arama
}

/**
 * Fiş State (Store için)
 */
export interface ReceiptState {
  receipts: Receipt[];
  selectedReceipt: Receipt | null;
  filters: ReceiptFilter;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fiş Actions
 */
export interface ReceiptActions {
  fetchReceipts: (firmaId?: string) => Promise<void>;
  fetchReceiptById: (id: string) => Promise<void>;
  createReceipt: (data: CreateReceiptData) => Promise<Receipt>;
  updateReceipt: (data: UpdateReceiptData) => Promise<void>;
  approveReceipt: (id: string, diffLog?: DiffLog[]) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ReceiptFilter>) => void;
  clearFilters: () => void;
  setSelectedReceipt: (receipt: Receipt | null) => void;
  clearError: () => void;
}

/**
 * OCR İşleme Request
 */
export interface OCRProcessRequest {
  imageBase64: string;
  fisType: ReceiptType;
  firmaId: string;
}

/**
 * OCR İşleme Response
 */
export interface OCRProcessResponse {
  success: boolean;
  data: AIResult;
  error?: string;
}

/**
 * Dışa Aktarma Formatı
 */
export enum ExportFormat {
  JSON = 'json',
  EXCEL = 'excel',
  CSV = 'csv',
}

/**
 * Dışa Aktarma Options
 */
export interface ExportOptions {
  format: ExportFormat;
  receiptIds: string[];
  includeImages: boolean;
}
