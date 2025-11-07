/**
 * Receipt Store - Fiş Yönetimi State Management
 * 
 * Fiş CRUD, filtreleme, OCR işlemleri
 */

import { create } from 'zustand';
import { 
  Receipt, 
  ReceiptListItem,
  CreateReceiptData, 
  UpdateReceiptData,
  ReceiptFilter,
  ReceiptStatus,
  ReceiptSource,
  AdvisorApprovalStatus,
  DiffLog
} from '@types';

interface ReceiptState {
  // State
  receipts: Receipt[];
  selectedReceipt: Receipt | null;
  filters: ReceiptFilter;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReceipts: (firmaId?: string) => Promise<void>;
  fetchReceiptById: (id: string) => Promise<void>;
  createReceipt: (data: CreateReceiptData) => Promise<Receipt>;
  updateReceipt: (data: UpdateReceiptData) => Promise<void>;
  approveReceipt: (id: string, diffLog?: DiffLog[]) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  
  // Mükellef işlemleri
  fetchTaxpayerReceipts: () => Promise<void>;
  approveFromTaxpayer: (id: string, advisorId: string) => Promise<void>;
  rejectFromTaxpayer: (id: string, advisorId: string, reason: string) => Promise<void>;
  
  setFilters: (filters: Partial<ReceiptFilter>) => void;
  clearFilters: () => void;
  setSelectedReceipt: (receipt: Receipt | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Receipt Store
 */
export const useReceiptStore = create<ReceiptState>((set, get) => ({
  // Initial State
  receipts: [],
  selectedReceipt: null,
  filters: {},
  isLoading: false,
  error: null,

  /**
   * Fişleri getir (firmaya göre)
   */
  fetchReceipts: async (firmaId?: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.getReceipts(firmaId, filters);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - Gerçek fişlerden analiz edilen + çeşitli fake fişler
      const mockReceipts: any[] = [
        // 🔴 GERÇEK FİŞ #1 - Hasgül Fotoğrafçılık
        {
          id: 'real-1',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-07-12',
          fisNo: 'FIS-NO-3',
          vkn: '4184246643',
          unvan: 'Hasgül Fotoğrafçılık - Gülten Duman',
          imagePath: 'C:\\Users\\Mert\\OneDrive - Uyumsoft\\Masaüstü\\Fiş denemeleri\\hasgul.jpg',
          kdvSatirlari: [
            { oran: 20, matrah: 675, kdvTutari: 135 },
          ],
          toplamKdv: 135,
          toplamTutar: 810,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          source: ReceiptSource.TAXPAYER,
          advisorApprovalStatus: AdvisorApprovalStatus.APPROVED,
          advisorApprovedBy: '1',
          advisorApprovedAt: new Date('2024-07-12T11:00:00').toISOString(),
          userEdited: false,
          createdAt: new Date('2024-07-12T10:27:00').toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: {
            rawText: 'HASGÜL FOTOĞRAFÇILIK GÜLTEN DUMAN, ŞİRİNEVLER MH., FOTOĞRAF x20 +810,00, KDV +135,00',
            confidence: 0.94,
          },
        },
        // 🔴 GERÇEK FİŞ #2 - Garanti BBVA (Otel/Konaklama)
        {
          id: 'real-2',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-07-15',
          fisNo: '0028',
          vkn: '6231866843',
          unvan: 'Kartal - Çetinkaya Şok.',
          imagePath: 'C:\\Users\\Mert\\OneDrive - Uyumsoft\\Masaüstü\\Fiş denemeleri\\kartal.jpg',
          kdvSatirlari: [
            { oran: 10, matrah: 1220.5, kdvTutari: 122.05 },
            { oran: 1, matrah: 2441, kdvTutari: 24.41 },
          ],
          toplamKdv: 146.46,
          toplamTutar: 1367,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: true,
          createdAt: new Date('2024-07-15T13:48:55').toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: {
            rawText: 'KONAKLAMA %10 *1.342,59, %2 Konaklama V. *24,41, TOPKDV *122,05, TOPLAM *1.367,00',
            confidence: 0.89,
          },
        },
        // 🔴 GERÇEK FİŞ #3 - Yaşa Gıda (Cafe/Restaurant)
        {
          id: 'real-3',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-07-20',
          fisNo: '0078',
          vkn: '9380492010',
          unvan: 'Yaşa Gıda Sanayi ve Ticaret Ltd. Şti.',
          imagePath: 'C:\\Users\\Mert\\OneDrive - Uyumsoft\\Masaüstü\\Fiş denemeleri\\yasa.jpg',
          kdvSatirlari: [
            { oran: 10, matrah: 413.6, kdvTutari: 41.36 },
          ],
          toplamKdv: 41.36,
          toplamTutar: 455,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date('2024-07-20T11:31:16').toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: {
            rawText: '1 TEK CİGBÖREK %10 *110,00, KARISIK TOST %10 *230,00, AYRAN %10 *80,00, SU %10 *35,00',
            confidence: 0.92,
          },
        },
        // 🔴 GERÇEK FİŞ #4 - E-Arşiv Eczane Fişi
        {
          id: 'real-4',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-07-04',
          fisNo: '99334/A63',
          vkn: 'XL1302200060419',
          unvan: 'E.Ü İ.L.İ Zamesi - Serriyat Ali',
          imagePath: 'C:\\Users\\Mert\\OneDrive - Uyumsoft\\Masaüstü\\Fiş denemeleri\\eczane.jpg',
          kdvSatirlari: [
            { oran: 1, matrah: 1848.4, kdvTutari: 18.3 },
            { oran: 20, matrah: 300, kdvTutari: 60 },
          ],
          toplamKdv: 78.3,
          toplamTutar: 2208.4,
          fisType: 'e_arsiv' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date('2024-07-04T11:53:00').toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: {
            rawText: 'E Arşiv, SONLÜK 10CL TL/500L M. %01 754,90, OCEAN PLUS 50 KAPSÜL %01 714,50, ALİFE 0.5 AVRA %20 366,00',
            confidence: 0.91,
          },
        },
        {
          id: '1',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-03',
          fisNo: 'FIS-2024-0378',
          vkn: '1234567890',
          unvan: 'TechMart Elektronik A.Ş.',
          kdvSatirlari: [
            { oran: 20, matrah: 4500, kdvTutari: 900 },
            { oran: 10, matrah: 1200, kdvTutari: 120 },
          ],
          toplamKdv: 1020,
          toplamTutar: 6720,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-02',
          fisNo: 'FIS-2024-0377',
          vkn: '9876543210',
          unvan: 'Gourmet Market Ltd. Şti.',
          kdvSatirlari: [
            { oran: 20, matrah: 2850, kdvTutari: 570 },
          ],
          toplamKdv: 570,
          toplamTutar: 3420,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-01',
          fisNo: 'FIS-2024-0376',
          vkn: '5555444433',
          unvan: 'City Coffee & Bistro',
          kdvSatirlari: [
            { oran: 10, matrah: 850, kdvTutari: 85 },
            { oran: 20, matrah: 450, kdvTutari: 90 },
          ],
          toplamKdv: 175,
          toplamTutar: 1475,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-10-31',
          fisNo: 'FIS-2024-0375',
          vkn: '7777888899',
          unvan: 'FashionHub Mağazacılık A.Ş.',
          kdvSatirlari: [
            { oran: 20, matrah: 8500, kdvTutari: 1700 },
          ],
          toplamKdv: 1700,
          toplamTutar: 10200,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-10-30',
          fisNo: 'FIS-2024-0374',
          vkn: '3333222211',
          unvan: 'BookWorld Kitap Kırtasiye',
          kdvSatirlari: [
            { oran: 10, matrah: 1500, kdvTutari: 150 },
          ],
          toplamKdv: 150,
          toplamTutar: 1650,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-10-29',
          fisNo: 'FIS-2024-0373',
          vkn: '1111222233',
          unvan: 'HomeDecor Mobilya ve Dekorasyon',
          kdvSatirlari: [
            { oran: 20, matrah: 12000, kdvTutari: 2400 },
            { oran: 10, matrah: 3500, kdvTutari: 350 },
          ],
          toplamKdv: 2750,
          toplamTutar: 18250,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '7',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-10-28',
          fisNo: 'FIS-2024-0372',
          vkn: '6666777788',
          unvan: 'SportZone Spor Malzemeleri',
          kdvSatirlari: [
            { oran: 20, matrah: 3200, kdvTutari: 640 },
          ],
          toplamKdv: 640,
          toplamTutar: 3840,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '8',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-10-27',
          fisNo: 'FIS-2024-0371',
          vkn: '4444555566',
          unvan: 'PetShop Hayvan Ürünleri',
          kdvSatirlari: [
            { oran: 10, matrah: 950, kdvTutari: 95 },
            { oran: 20, matrah: 550, kdvTutari: 110 },
          ],
          toplamKdv: 205,
          toplamTutar: 1705,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // XYZ A.Ş. (Firma ID: 2) Fişleri
        {
          id: '9',
          firmaId: '2',
          userId: '1',
          tarih: '2024-11-02',
          fisNo: 'FIS-2024-0400',
          vkn: '8888999900',
          unvan: 'TechStore Bilgisayar Ltd.',
          kdvSatirlari: [
            { oran: 20, matrah: 15000, kdvTutari: 3000 },
          ],
          toplamKdv: 3000,
          toplamTutar: 18000,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.APPROVED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '10',
          firmaId: '2',
          userId: '1',
          tarih: '2024-11-01',
          fisNo: 'FIS-2024-0399',
          vkn: '2222333344',
          unvan: 'Mega Market AVM',
          kdvSatirlari: [
            { oran: 20, matrah: 5500, kdvTutari: 1100 },
            { oran: 10, matrah: 2200, kdvTutari: 220 },
          ],
          toplamKdv: 1320,
          toplamTutar: 9020,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '11',
          firmaId: '2',
          userId: '1',
          tarih: '2024-10-30',
          fisNo: 'FIS-2024-0398',
          vkn: '5555666677',
          unvan: 'Lezzet Restaurant',
          kdvSatirlari: [
            { oran: 10, matrah: 1800, kdvTutari: 180 },
          ],
          toplamKdv: 180,
          toplamTutar: 1980,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.PENDING,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // 🔥 SERİ ONAY TESTİ İÇİN - 15 ADET ONAY BEKLEYEN FİŞ
        {
          id: 'bulk-1',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0500',
          vkn: '1234567890',
          unvan: 'ABC Market',
          kdvSatirlari: [{ oran: 20, matrah: 500, kdvTutari: 100 }],
          toplamKdv: 100,
          toplamTutar: 600,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'ABC Market Test', confidence: 0.95 },
        },
        {
          id: 'bulk-2',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0501',
          vkn: '2345678901',
          unvan: 'XYZ Restaurant',
          kdvSatirlari: [{ oran: 10, matrah: 800, kdvTutari: 80 }],
          toplamKdv: 80,
          toplamTutar: 880,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'XYZ Restaurant Test', confidence: 0.92 },
        },
        {
          id: 'bulk-3',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0502',
          vkn: '3456789012',
          unvan: 'Tech Store',
          kdvSatirlari: [{ oran: 20, matrah: 2000, kdvTutari: 400 }],
          toplamKdv: 400,
          toplamTutar: 2400,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Tech Store Test', confidence: 0.88 },
        },
        {
          id: 'bulk-4',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0503',
          vkn: '4567890123',
          unvan: 'Fashion Boutique',
          kdvSatirlari: [{ oran: 20, matrah: 1500, kdvTutari: 300 }],
          toplamKdv: 300,
          toplamTutar: 1800,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Fashion Boutique Test', confidence: 0.91 },
        },
        {
          id: 'bulk-5',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0504',
          vkn: '5678901234',
          unvan: 'Coffee House',
          kdvSatirlari: [{ oran: 10, matrah: 350, kdvTutari: 35 }],
          toplamKdv: 35,
          toplamTutar: 385,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Coffee House Test', confidence: 0.96 },
        },
        {
          id: 'bulk-6',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0505',
          vkn: '6789012345',
          unvan: 'Book Store',
          kdvSatirlari: [{ oran: 10, matrah: 600, kdvTutari: 60 }],
          toplamKdv: 60,
          toplamTutar: 660,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Book Store Test', confidence: 0.93 },
        },
        {
          id: 'bulk-7',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0506',
          vkn: '7890123456',
          unvan: 'Pet Shop',
          kdvSatirlari: [{ oran: 20, matrah: 450, kdvTutari: 90 }],
          toplamKdv: 90,
          toplamTutar: 540,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Pet Shop Test', confidence: 0.89 },
        },
        {
          id: 'bulk-8',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0507',
          vkn: '8901234567',
          unvan: 'Sports Center',
          kdvSatirlari: [{ oran: 20, matrah: 3000, kdvTutari: 600 }],
          toplamKdv: 600,
          toplamTutar: 3600,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Sports Center Test', confidence: 0.94 },
        },
        {
          id: 'bulk-9',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0508',
          vkn: '9012345678',
          unvan: 'Beauty Salon',
          kdvSatirlari: [{ oran: 20, matrah: 850, kdvTutari: 170 }],
          toplamKdv: 170,
          toplamTutar: 1020,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Beauty Salon Test', confidence: 0.90 },
        },
        {
          id: 'bulk-10',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0509',
          vkn: '0123456789',
          unvan: 'Pharmacy Plus',
          kdvSatirlari: [{ oran: 10, matrah: 1200, kdvTutari: 120 }],
          toplamKdv: 120,
          toplamTutar: 1320,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Pharmacy Plus Test', confidence: 0.97 },
        },
        {
          id: 'bulk-11',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0510',
          vkn: '1357924680',
          unvan: 'Home Decor',
          kdvSatirlari: [{ oran: 20, matrah: 5000, kdvTutari: 1000 }],
          toplamKdv: 1000,
          toplamTutar: 6000,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Home Decor Test', confidence: 0.86 },
        },
        {
          id: 'bulk-12',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0511',
          vkn: '2468013579',
          unvan: 'Auto Parts',
          kdvSatirlari: [{ oran: 20, matrah: 2500, kdvTutari: 500 }],
          toplamKdv: 500,
          toplamTutar: 3000,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Auto Parts Test', confidence: 0.91 },
        },
        {
          id: 'bulk-13',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0512',
          vkn: '3692581470',
          unvan: 'Garden Center',
          kdvSatirlari: [{ oran: 10, matrah: 950, kdvTutari: 95 }],
          toplamKdv: 95,
          toplamTutar: 1045,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Garden Center Test', confidence: 0.88 },
        },
        {
          id: 'bulk-14',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0513',
          vkn: '1472583690',
          unvan: 'Electronics Hub',
          kdvSatirlari: [{ oran: 20, matrah: 4200, kdvTutari: 840 }],
          toplamKdv: 840,
          toplamTutar: 5040,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Electronics Hub Test', confidence: 0.92 },
        },
        {
          id: 'bulk-15',
          firmaId: firmaId || '1',
          userId: '1',
          tarih: '2024-11-06',
          fisNo: 'FIS-2024-0514',
          vkn: '9517532486',
          unvan: 'Kids Toys Store',
          kdvSatirlari: [{ oran: 20, matrah: 1800, kdvTutari: 360 }],
          toplamKdv: 360,
          toplamTutar: 2160,
          fisType: 'yazar_kasa' as any,
          status: ReceiptStatus.VERIFIED,
          userEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ocrData: { rawText: 'Kids Toys Store Test', confidence: 0.95 },
        },
      ];

      // Mock receipts'e eksik alanları ekle
      const processedReceipts = mockReceipts.map((receipt, index) => {
        // İlk 3 receipt mükellef tarafından yüklendi (onaylandı)
        // 4-5. receiptler mükelleften geldi ama onay bekliyor
        // Diğerleri ana kullanıcı/müşavir tarafından yüklendi
        
        const isTaxpayerSubmitted = index < 5;
        const isWaitingApproval = index >= 3 && index < 5;
        
        return {
          ...receipt,
          source: isTaxpayerSubmitted 
            ? ReceiptSource.TAXPAYER 
            : ReceiptSource.MAIN_USER,
          advisorApprovalStatus: isTaxpayerSubmitted
            ? (isWaitingApproval 
                ? AdvisorApprovalStatus.WAITING 
                : AdvisorApprovalStatus.APPROVED)
            : AdvisorApprovalStatus.NOT_REQUIRED,
          advisorApprovedBy: (!isWaitingApproval && isTaxpayerSubmitted) ? '1' : undefined,
          advisorApprovedAt: (!isWaitingApproval && isTaxpayerSubmitted) 
            ? new Date(receipt.createdAt).toISOString() 
            : undefined,
        };
      });

      set({
        receipts: processedReceipts,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Fişler alınamadı',
        isLoading: false,
      });
    }
  },

  /**
   * Fiş detayını getir
   */
  fetchReceiptById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.getReceiptById(id);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      const receipt = get().receipts.find(r => r.id === id);
      
      if (receipt) {
        set({ selectedReceipt: receipt, isLoading: false });
      } else {
        throw new Error('Fiş bulunamadı');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Fiş detayı alınamadı',
        isLoading: false,
      });
    }
  },

  /**
   * Yeni fiş oluştur
   */
  createReceipt: async (data: CreateReceiptData): Promise<Receipt> => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.createReceipt(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReceipt: Receipt = {
        id: Date.now().toString(),
        ...data,
        userId: '1',
        status: ReceiptStatus.PENDING,
        source: ReceiptSource.MAIN_USER, // Varsayılan olarak ana kullanıcı
        advisorApprovalStatus: AdvisorApprovalStatus.NOT_REQUIRED,
        userEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        receipts: [newReceipt, ...state.receipts],
        selectedReceipt: newReceipt,
        isLoading: false,
      }));

      return newReceipt;
    } catch (error: any) {
      set({
        error: error.message || 'Fiş oluşturulamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fiş güncelle
   */
  updateReceipt: async (data: UpdateReceiptData) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.updateReceipt(data);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        receipts: state.receipts.map(receipt =>
          receipt.id === data.id
            ? { ...receipt, ...data, updatedAt: new Date().toISOString() }
            : receipt
        ),
        selectedReceipt: state.selectedReceipt?.id === data.id
          ? { ...state.selectedReceipt, ...data, updatedAt: new Date().toISOString() }
          : state.selectedReceipt,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Fiş güncellenemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fiş onayla
   */
  approveReceipt: async (id: string, diffLog?: DiffLog[]) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı - diffLog backend'e gönderilecek
      // const response = await receiptApi.approveReceipt(id, diffLog);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        receipts: state.receipts.map(receipt =>
          receipt.id === id
            ? { 
                ...receipt, 
                status: ReceiptStatus.APPROVED,
                approvedAt: new Date().toISOString(),
                diffLog: diffLog || receipt.diffLog,
                updatedAt: new Date().toISOString(),
              }
            : receipt
        ),
        selectedReceipt: state.selectedReceipt?.id === id
          ? { 
              ...state.selectedReceipt, 
              status: ReceiptStatus.APPROVED,
              approvedAt: new Date().toISOString(),
              diffLog: diffLog || state.selectedReceipt.diffLog,
              updatedAt: new Date().toISOString(),
            }
          : state.selectedReceipt,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Fiş onaylanamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Fiş sil (soft delete)
   */
  deleteReceipt: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.deleteReceipt(id);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        receipts: state.receipts.map(receipt =>
          receipt.id === id
            ? { ...receipt, status: ReceiptStatus.DELETED, updatedAt: new Date().toISOString() }
            : receipt
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Fiş silinemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Mükelleften gelen fişleri getir (Müşavir onayı bekleyen)
   */
  fetchTaxpayerReceipts: async () => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.getTaxpayerReceipts();
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Sadece mükelleften gelip onay bekleyen fişleri getir
      const taxpayerReceipts = get().receipts.filter(
        r => r.source === ReceiptSource.TAXPAYER && 
             r.advisorApprovalStatus === AdvisorApprovalStatus.WAITING
      );

      set({
        receipts: taxpayerReceipts,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Mükellef fişleri alınamadı',
        isLoading: false,
      });
    }
  },

  /**
   * Mükelleften gelen fişi onayla (Müşavir onayı)
   */
  approveFromTaxpayer: async (id: string, advisorId: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.approveFromTaxpayer(id, advisorId);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        receipts: state.receipts.map(receipt =>
          receipt.id === id
            ? { 
                ...receipt, 
                advisorApprovalStatus: AdvisorApprovalStatus.APPROVED,
                advisorApprovedBy: advisorId,
                advisorApprovedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : receipt
        ),
        selectedReceipt: state.selectedReceipt?.id === id
          ? { 
              ...state.selectedReceipt, 
              advisorApprovalStatus: AdvisorApprovalStatus.APPROVED,
              advisorApprovedBy: advisorId,
              advisorApprovedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : state.selectedReceipt,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Fiş onaylanamadı',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Mükelleften gelen fişi reddet
   */
  rejectFromTaxpayer: async (id: string, advisorId: string, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API çağrısı
      // const response = await receiptApi.rejectFromTaxpayer(id, advisorId, reason);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        receipts: state.receipts.map(receipt =>
          receipt.id === id
            ? { 
                ...receipt, 
                advisorApprovalStatus: AdvisorApprovalStatus.REJECTED,
                advisorApprovedBy: advisorId,
                advisorRejectionReason: reason,
                updatedAt: new Date().toISOString(),
              }
            : receipt
        ),
        selectedReceipt: state.selectedReceipt?.id === id
          ? { 
              ...state.selectedReceipt, 
              advisorApprovalStatus: AdvisorApprovalStatus.REJECTED,
              advisorApprovedBy: advisorId,
              advisorRejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : state.selectedReceipt,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Fiş reddedilemedi',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Filtreleri ayarla
   */
  setFilters: (filters: Partial<ReceiptFilter>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  /**
   * Filtreleri temizle
   */
  clearFilters: () => {
    set({ filters: {} });
  },

  /**
   * Seçili fişi ayarla
   */
  setSelectedReceipt: (receipt: Receipt | null) => {
    set({ selectedReceipt: receipt });
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

export default useReceiptStore;
