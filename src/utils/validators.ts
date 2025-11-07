/**
 * Validators - Validasyon Fonksiyonları
 * 
 * Form validasyonu, veri doğrulama
 */

/**
 * Email validasyonu
 * @param email - Email adresi
 * @returns Geçerli mi?
 * 
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Telefon validasyonu (Türkiye)
 * @param phone - Telefon numarası
 * @returns Geçerli mi?
 * 
 * @example
 * isValidPhone('5551234567') // true
 * isValidPhone('123') // false
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Sadece rakamları al
  const cleaned = phone.replace(/\D/g, '');
  
  // 10 haneli (5XX XXX XX XX) veya 11 haneli (0 ile başlayan)
  if (cleaned.length === 10 && cleaned.startsWith('5')) {
    return true;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('05')) {
    return true;
  }
  
  // 12 haneli uluslararası format (90 ile başlayan)
  if (cleaned.length === 12 && cleaned.startsWith('90')) {
    return true;
  }
  
  return false;
};

/**
 * VKN validasyonu (Vergi Kimlik Numarası - 10 haneli)
 * @param vkn - VKN
 * @returns Geçerli mi?
 * 
 * @example
 * isValidVKN('1234567890') // true (format kontrolü)
 * isValidVKN('123') // false
 */
export const isValidVKN = (vkn: string): boolean => {
  if (!vkn) return false;
  
  // Sadece rakamları al
  const cleaned = vkn.replace(/\D/g, '');
  
  // 10 haneli olmalı
  if (cleaned.length !== 10) return false;
  
  // TODO: Mod11 algoritması ile gerçek VKN kontrolü yapılabilir
  // Şimdilik sadece format kontrolü
  
  return true;
};

/**
 * TCKN validasyonu (TC Kimlik No - 11 haneli)
 * @param tckn - TCKN
 * @returns Geçerli mi?
 * 
 * @example
 * isValidTCKN('12345678901') // true (format kontrolü)
 * isValidTCKN('123') // false
 */
export const isValidTCKN = (tckn: string): boolean => {
  if (!tckn) return false;
  
  // Sadece rakamları al
  const cleaned = tckn.replace(/\D/g, '');
  
  // 11 haneli olmalı
  if (cleaned.length !== 11) return false;
  
  // İlk hane 0 olamaz
  if (cleaned.charAt(0) === '0') return false;
  
  // TODO: Mod10 algoritması ile gerçek TCKN kontrolü yapılabilir
  
  return true;
};

/**
 * Şifre güvenlik kontrolü
 * @param password - Şifre
 * @returns Validasyon sonucu ve mesaj
 * 
 * @example
 * validatePassword('Test123!') // { isValid: true, message: '' }
 * validatePassword('123') // { isValid: false, message: 'Şifre en az 8 karakter olmalıdır' }
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (!password) {
    return { isValid: false, message: 'Şifre boş olamaz' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Şifre en az 8 karakter olmalıdır' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Şifre en az bir büyük harf içermelidir' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Şifre en az bir küçük harf içermelidir' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Şifre en az bir rakam içermelidir' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * String boş mu kontrolü (null, undefined, empty, whitespace)
 * @param value - Kontrol edilecek değer
 * @returns Boş mu?
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  
  return false;
};

/**
 * Sayı aralığı kontrolü
 * @param value - Kontrol edilecek sayı
 * @param min - Minimum değer
 * @param max - Maksimum değer
 * @returns Aralıkta mı?
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Pozitif sayı kontrolü
 * @param value - Kontrol edilecek değer
 * @returns Pozitif mi?
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * URL validasyonu
 * @param url - URL
 * @returns Geçerli mi?
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Tarih formatı kontrolü (YYYY-MM-DD)
 * @param date - Tarih string
 * @returns Geçerli mi?
 */
export const isValidDateFormat = (date: string): boolean => {
  if (!date) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  // Geçerli bir tarih mi kontrol et
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Tutar validasyonu (pozitif sayı, 2 ondalık basamak)
 * @param amount - Tutar
 * @returns Geçerli mi?
 */
export const isValidAmount = (amount: number | string): boolean => {
  if (amount === null || amount === undefined) return false;
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return false;
  if (numAmount < 0) return false;
  
  // 2 ondalık basamak kontrolü
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) return false;
  
  return true;
};

/**
 * KDV oranı validasyonu
 * @param rate - KDV oranı
 * @returns Geçerli mi?
 */
export const isValidKDVRate = (rate: number): boolean => {
  // Türkiye'de geçerli KDV oranları: 1, 8, 10, 20
  const validRates = [1, 8, 10, 20];
  return validRates.includes(rate);
};

/**
 * Fiş numarası validasyonu
 * @param fisNo - Fiş numarası
 * @returns Geçerli mi?
 */
export const isValidFisNo = (fisNo: string): boolean => {
  if (!fisNo) return false;
  
  // En az 1 karakter, maksimum 50 karakter
  if (fisNo.length < 1 || fisNo.length > 50) return false;
  
  return true;
};

/**
 * Kullanıcı adı validasyonu
 * @param username - Kullanıcı adı
 * @returns Validasyon sonucu ve mesaj
 */
export const validateUsername = (username: string): {
  isValid: boolean;
  message: string;
} => {
  if (!username) {
    return { isValid: false, message: 'Kullanıcı adı boş olamaz' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır' };
  }
  
  if (username.length > 50) {
    return { isValid: false, message: 'Kullanıcı adı en fazla 50 karakter olabilir' };
  }
  
  // Sadece harf, rakam, _ ve - karakterleri
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, message: 'Kullanıcı adı sadece harf, rakam, _ ve - içerebilir' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Genel form validasyonu
 * @param fields - Alan adı ve değer objeleri
 * @param rules - Validasyon kuralları
 * @returns Hata mesajları objesi
 */
export const validateForm = (
  fields: Record<string, any>,
  rules: Record<string, (value: any) => { isValid: boolean; message: string }>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName];
    const validator = rules[fieldName];
    const result = validator(value);
    
    if (!result.isValid) {
      errors[fieldName] = result.message;
    }
  });
  
  return errors;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidVKN,
  isValidTCKN,
  validatePassword,
  isEmpty,
  isInRange,
  isPositive,
  isValidUrl,
  isValidDateFormat,
  isValidAmount,
  isValidKDVRate,
  isValidFisNo,
  validateUsername,
  validateForm,
};
