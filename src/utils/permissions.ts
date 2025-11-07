/**
 * Permissions Utility - Kullanıcı Yetki Kontrolleri
 * Kullanıcı tiplerine göre yetki kontrolü
 */

import { User, UserType } from '@types';

/**
 * Kullanıcı ana kullanıcı mı?
 */
export const isMainUser = (user: User | null): boolean => {
  return user?.userType === UserType.MAIN_USER;
};

/**
 * Kullanıcı alt müşavir mi?
 */
export const isSubAdvisor = (user: User | null): boolean => {
  return user?.userType === UserType.SUB_ADVISOR;
};

/**
 * Kullanıcı mükellef mi?
 */
export const isTaxpayer = (user: User | null): boolean => {
  return user?.userType === UserType.TAXPAYER;
};

/**
 * Kullanıcı müşavir mi? (Ana kullanıcı veya Alt Müşavir)
 */
export const isAdvisor = (user: User | null): boolean => {
  return isMainUser(user) || isSubAdvisor(user);
};

/**
 * Fiş silme yetkisi var mı?
 * Sadece ana kullanıcı ve alt müşavir silebilir
 */
export const canDeleteReceipt = (user: User | null): boolean => {
  return isAdvisor(user);
};

/**
 * Fiş muhasebeleştirme yetkisi var mı?
 * Sadece müşavirler muhasebeleştirebilir
 */
export const canAccountReceipt = (user: User | null): boolean => {
  return isAdvisor(user);
};

/**
 * Mükelleften gelen fişleri görebilir mi?
 * Sadece müşavirler görebilir
 */
export const canViewTaxpayerReceipts = (user: User | null): boolean => {
  return isAdvisor(user);
};

/**
 * Dashboard'a erişim var mı?
 * Mükellefler dashboard göremez
 */
export const canAccessDashboard = (user: User | null): boolean => {
  return !isTaxpayer(user);
};

/**
 * Tüm firmalara erişim var mı?
 * Sadece ana kullanıcı tüm firmalara erişebilir
 */
export const canAccessAllFirmas = (user: User | null): boolean => {
  return isMainUser(user);
};

/**
 * Belirli bir firmaya erişim var mı?
 */
export const canAccessFirma = (user: User | null, firmaId: string): boolean => {
  if (isMainUser(user)) {
    return true; // Ana kullanıcı tüm firmalara erişebilir
  }
  
  if (isSubAdvisor(user) || isTaxpayer(user)) {
    return user?.assignedFirmaIds?.includes(firmaId) || false;
  }
  
  return false;
};

/**
 * Kullanıcının erişebileceği firma ID'lerini getir
 */
export const getAccessibleFirmaIds = (user: User | null): string[] => {
  if (!user) return [];
  
  if (isMainUser(user)) {
    return []; // Boş array = tüm firmalar
  }
  
  return user.assignedFirmaIds || [];
};

/**
 * Yetki mesajları
 */
export const PERMISSION_MESSAGES = {
  NO_DELETE: 'Bu işlemi yapma yetkiniz yok. Sadece müşavirler fiş silebilir.',
  NO_ACCOUNT: 'Bu işlemi yapma yetkiniz yok. Sadece müşavirler muhasebeleştirme yapabilir.',
  NO_DASHBOARD: 'Dashboard\'a erişim yetkiniz yok.',
  NO_FIRMA_ACCESS: 'Bu firmaya erişim yetkiniz yok.',
  TAXPAYER_LIMITED: 'Mükellef kullanıcıları sadece kendilerine atanan firmalar ile ilgili fiş ekleyebilir.',
};

/**
 * Kullanıcı tipi etiketleri
 */
export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.MAIN_USER]: 'Ana Kullanıcı',
  [UserType.SUB_ADVISOR]: 'Alt Müşavir',
  [UserType.TAXPAYER]: 'Mükellef',
};

/**
 * Kullanıcı tipi renkleri
 */
export const USER_TYPE_COLORS: Record<UserType, string> = {
  [UserType.MAIN_USER]: '#10B981',    // Green
  [UserType.SUB_ADVISOR]: '#3B82F6',  // Blue
  [UserType.TAXPAYER]: '#F59E0B',     // Amber
};
