/**
 * Auth Types - Kimlik Doğrulama Tipleri
 */

/**
 * Kullanıcı Bilgileri
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  role: UserRole;
  userType: UserType;                // Kullanıcı tipi
  assignedFirmaIds?: string[];       // Alt müşavir/mükellef için atanan firmalar
  parentUserId?: string;             // Alt kullanıcılar için ana kullanıcı ID'si
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Kontör ve Kullanım Bilgileri
  credits?: CreditInfo;
  usage?: UsageStats;
  subscription?: SubscriptionInfo;
  settings?: UserSettings;
}

/**
 * Kontör Bilgileri
 */
export interface CreditInfo {
  total: number;                     // Toplam satın alınan kontör
  used: number;                      // Kullanılan kontör
  remaining: number;                 // Kalan kontör
  lastPurchaseDate?: string;         // Son satın alma tarihi
  lastUsageDate?: string;            // Son kullanım tarihi
}

/**
 * Kullanım İstatistikleri
 */
export interface UsageStats {
  totalReceipts: number;             // Toplam işlenen fiş sayısı
  monthlyReceipts: number;           // Bu ayki fiş sayısı
  weeklyReceipts: number;            // Bu haftaki fiş sayısı
  dailyAverage: number;              // Günlük ortalama
  lastActivityDate?: string;         // Son aktivite tarihi
  mostUsedFirma?: string;            // En çok kullanılan firma ID'si
}

/**
 * Abonelik Bilgileri
 */
export interface SubscriptionInfo {
  plan: SubscriptionPlan;            // Abonelik planı
  status: SubscriptionStatus;        // Abonelik durumu
  startDate: string;                 // Başlangıç tarihi
  endDate?: string;                  // Bitiş tarihi
  autoRenew: boolean;                // Otomatik yenileme
}

/**
 * Abonelik Planları
 */
export enum SubscriptionPlan {
  FREE = 'free',                     // Ücretsiz
  BASIC = 'basic',                   // Temel
  PREMIUM = 'premium',               // Premium
  ENTERPRISE = 'enterprise',         // Kurumsal
}

/**
 * Abonelik Durumu
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',                 // Aktif
  EXPIRED = 'expired',               // Süresi dolmuş
  CANCELLED = 'cancelled',           // İptal edilmiş
  TRIAL = 'trial',                   // Deneme
}

/**
 * Kullanıcı Ayarları
 */
export interface UserSettings {
  autoRecharge: boolean;             // Otomatik kontör yenileme
  rechargeThreshold: number;         // Yenileme eşiği
  rechargeAmount: number;            // Yenileme miktarı
  notifications: NotificationSettings;
}

/**
 * Bildirim Ayarları
 */
export interface NotificationSettings {
  lowCredit: boolean;                // Düşük kontör bildirimi
  receiptProcessed: boolean;         // Fiş işlendi bildirimi
  weeklyReport: boolean;             // Haftalık rapor
  monthlyReport: boolean;            // Aylık rapor
}

/**
 * Kullanıcı Rolleri
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DEMO = 'demo',
}

/**
 * Kullanıcı Tipleri
 * Ana kullanıcı, Alt Müşavir, Mükellef ayrımı için
 */
export enum UserType {
  MAIN_USER = 'main_user',           // Ana kullanıcı - Tam yetkili
  SUB_ADVISOR = 'sub_advisor',       // Alt Müşavir - Atanan firmalarda işlem yapabilir
  TAXPAYER = 'taxpayer',             // Mükellef - Sadece fiş ekleme/onaylama
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login Response
 */
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn: number; // Saniye cinsinden
}

/**
 * Signup (Kayıt Başvurusu) Verileri
 */
export interface SignupData {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  email: string;
  note?: string;
}

/**
 * Signup Response (Lead oluşturma)
 */
export interface SignupResponse {
  success: boolean;
  message: string;
  leadId?: string;
}

/**
 * Token Doğrulama Response
 */
export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
  expiresAt?: string;
}

/**
 * Auth State (Store için)
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  error: string | null;
}

/**
 * Auth Actions
 */
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginDemo: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password Reset Response
 */
export interface PasswordResetResponse {
  success: boolean;
  message: string;
}
