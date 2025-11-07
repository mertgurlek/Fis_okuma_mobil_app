/**
 * Constants - Sabit Değerler
 * 
 * Uygulama genelinde kullanılan sabitler
 */

/**
 * API Endpoints
 */
export const API_CONFIG = {
  BASE_URL: 'https://api.fisokuma.com/v1', // TODO: Gerçek API URL'i eklenecek
  TIMEOUT: 30000, // 30 saniye
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/signup',
  VALIDATE_TOKEN: '/auth/validate',
  REFRESH_TOKEN: '/auth/refresh',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Firma
  FIRMA_LIST: '/firma/list',
  FIRMA_CREATE: '/firma/create',
  FIRMA_UPDATE: '/firma/update',
  FIRMA_DELETE: '/firma/delete',
  
  // Receipt (Fiş)
  RECEIPT_LIST: '/receipt/list',
  RECEIPT_GET: '/receipt/get',
  RECEIPT_CREATE: '/receipt/create',
  RECEIPT_UPDATE: '/receipt/update',
  RECEIPT_APPROVE: '/receipt/approve',
  RECEIPT_DELETE: '/receipt/delete',
  RECEIPT_EXPORT: '/receipt/export',
  
  // OCR
  OCR_PROCESS: '/ocr/process',
  OCR_BATCH: '/ocr/batch',
  
  // Kontör
  KONTOR_INFO: '/kontor/info',
  KONTOR_REQUEST: '/kontor/request',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
};

/**
 * Storage Keys (AsyncStorage & SecureStore)
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'app_theme',
  SELECTED_FIRMA: 'selected_firma',
  RECENT_FIRMAS: 'recent_firmas',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LANGUAGE: 'app_language',
};

/**
 * Fiş Tipleri
 */
export const RECEIPT_TYPES = {
  YAZAR_KASA: 'yazar_kasa',
  Z_RAPORU: 'z_raporu',
  DIGER: 'diger',
} as const;

export const RECEIPT_TYPE_LABELS = {
  [RECEIPT_TYPES.YAZAR_KASA]: 'Yazar Kasa Fişi',
  [RECEIPT_TYPES.Z_RAPORU]: 'Z-Raporu',
  [RECEIPT_TYPES.DIGER]: 'Diğer',
};

/**
 * Fiş Durumları
 */
export const RECEIPT_STATUS = {
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELETED: 'deleted',
} as const;

export const RECEIPT_STATUS_LABELS = {
  [RECEIPT_STATUS.PROCESSING]: 'Analiz Ediliyor',
  [RECEIPT_STATUS.VERIFIED]: 'Doğrulanmış',
  [RECEIPT_STATUS.APPROVED]: 'Onaylı',
  [RECEIPT_STATUS.REJECTED]: 'Reddedilmiş',
  [RECEIPT_STATUS.DELETED]: 'Silindi',
};

/**
 * KDV Oranları (Türkiye)
 */
export const KDV_RATES = [1, 8, 10, 20];

export const KDV_RATE_LABELS = {
  1: '%1',
  8: '%8',
  10: '%10',
  20: '%20',
};

/**
 * Kullanıcı Rolleri
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DEMO: 'demo',
} as const;

/**
 * Tema Modları
 */
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/**
 * Dışa Aktarma Formatları
 */
export const EXPORT_FORMATS = {
  JSON: 'json',
  EXCEL: 'excel',
  CSV: 'csv',
} as const;

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.JSON]: 'JSON',
  [EXPORT_FORMATS.EXCEL]: 'Excel',
  [EXPORT_FORMATS.CSV]: 'CSV',
};

/**
 * Sayfalama
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * Dosya Yükleme Limitleri
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_SIZE_LABEL: '10 MB',
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

/**
 * Demo Mode Limitleri
 */
export const DEMO_LIMITS = {
  MAX_RECEIPTS: 5,
  MAX_FIRMAS: 1,
  RETENTION_DAYS: 7,
  FEATURES_DISABLED: ['export', 'api_token', 'bulk_upload'],
};

/**
 * Toast/Snackbar Süreleri (ms)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

/**
 * Animation Süreleri (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

/**
 * Kamera Ayarları
 */
export const CAMERA_SETTINGS = {
  QUALITY: 0.8, // 0-1 arası
  ASPECT_RATIO: [4, 3] as [number, number],
  AUTO_CAPTURE_DELAY: 2000, // Seri modda otomatik çekim süresi
  MIN_CONFIDENCE: 0.7, // OCR için minimum güven skoru
};

/**
 * Validasyon Limitleri
 */
export const VALIDATION_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 100,
  FIRMA_NAME_MIN: 2,
  FIRMA_NAME_MAX: 200,
  FIS_NO_MAX: 50,
  AMOUNT_MAX: 999999999.99,
};

/**
 * Regex Pattern'leri
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,12}$/,
  VKN: /^[0-9]{10}$/,
  TCKN: /^[0-9]{11}$/,
  NUMERIC: /^[0-9]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
};

/**
 * Hata Mesajları
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  TIMEOUT_ERROR: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
  UNAUTHORIZED: 'Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.',
  FORBIDDEN: 'Bu işlem için yetkiniz yok.',
  NOT_FOUND: 'İstenen kaynak bulunamadı.',
  VALIDATION_ERROR: 'Lütfen tüm alanları doğru doldurun.',
  UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu.',
};

/**
 * Başarı Mesajları
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Giriş başarılı!',
  LOGOUT_SUCCESS: 'Çıkış yapıldı.',
  SIGNUP_SUCCESS: 'Başvurunuz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.',
  RECEIPT_CREATED: 'Fiş başarıyla oluşturuldu.',
  RECEIPT_UPDATED: 'Fiş güncellendi.',
  RECEIPT_APPROVED: 'Fiş onaylandı.',
  RECEIPT_DELETED: 'Fiş silindi.',
  FIRMA_CREATED: 'Firma oluşturuldu.',
  FIRMA_UPDATED: 'Firma güncellendi.',
  SAVE_SUCCESS: 'Değişiklikler kaydedildi.',
};

/**
 * Info Mesajları
 */
export const INFO_MESSAGES = {
  DEMO_MODE: 'Demo modunda çalışıyorsunuz. Bazı özellikler kısıtlıdır.',
  DEMO_LIMIT_REACHED: 'Demo modunda maksimum fiş sayısına ulaştınız.',
  OFFLINE_MODE: 'Çevrimdışı modasınız. Sadece daha önce inen veriler görüntülenir.',
  PROCESSING: 'İşleniyor, lütfen bekleyin...',
  NO_DATA: 'Henüz veri bulunmuyor.',
};

/**
 * Route İsimleri
 */
export const ROUTES = {
  SPLASH: '/',
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',
  DEMO_INFO: '/(auth)/demo-info',
  TABS: '/(tabs)',
  RECEIPT_LIST: '/(tabs)/index',
  NEW_RECEIPT: '/(tabs)/new-receipt',
  ACCOUNT: '/(tabs)/account',
  RECEIPT_DETAIL: '/receipt/[id]',
  RECEIPT_CAMERA: '/receipt/camera',
} as const;

/**
 * Tab İsimleri
 */
export const TAB_NAMES = {
  RECEIPTS: 'Fişler',
  NEW_RECEIPT: 'Yeni Fiş',
  ACCOUNT: 'Hesap',
};

/**
 * Deep Link Scheme
 */
export const DEEP_LINK = {
  SCHEME: 'fisokuma',
  PREFIX: 'fisokuma://',
};

/**
 * Social/Contact Links
 */
export const CONTACT_INFO = {
  SUPPORT_EMAIL: 'support@uyumsoft.com',
  SALES_EMAIL: 'sales@uyumsoft.com',
  PHONE: '+90 555 123 45 67',
  WEBSITE: 'https://uyumsoft.com',
  PRIVACY_POLICY: 'https://uyumsoft.com/privacy',
  TERMS_OF_SERVICE: 'https://uyumsoft.com/terms',
};

/**
 * Feature Flags
 */
export const FEATURES = {
  ENABLE_DEMO_MODE: true,
  ENABLE_DARK_MODE: true,
  ENABLE_SERI_MODE: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_EXPORT: true,
  ENABLE_BULK_UPLOAD: false, // Gelecekte eklenecek
  ENABLE_ANALYTICS: false, // Gelecekte eklenecek
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  RECEIPT_TYPES,
  RECEIPT_TYPE_LABELS,
  RECEIPT_STATUS,
  RECEIPT_STATUS_LABELS,
  KDV_RATES,
  KDV_RATE_LABELS,
  USER_ROLES,
  THEME_MODES,
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
  PAGINATION,
  FILE_UPLOAD,
  DEMO_LIMITS,
  TOAST_DURATION,
  ANIMATION_DURATION,
  CAMERA_SETTINGS,
  VALIDATION_LIMITS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  INFO_MESSAGES,
  ROUTES,
  TAB_NAMES,
  DEEP_LINK,
  CONTACT_INFO,
  FEATURES,
};
