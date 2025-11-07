/**
 * User Types - Kullanıcı ve Alt Kullanıcı Tipleri
 */

import { UserRole } from './auth.types';

/**
 * Alt Kullanıcı Rolleri (UserRole'e ek)
 */
export enum SubUserRole {
  MUSAVIR = 'musavir',          // Müşavir
  MUKELLEF = 'mukellef',        // Mükellef
  SUB_USER = 'sub_user',        // Alt kullanıcı
}

/**
 * Kullanıcı Durumu
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * Alt Kullanıcı (SubUser) - Yönetim için kullanılan detaylı tip
 */
export interface SubUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: SubUserRole;
  status: UserStatus;
  
  // Kontör bilgileri
  kontorTotal: number;          // Toplam atanan kontör
  kontorUsed: number;           // Kullanılan kontör
  kontorRemaining: number;      // Kalan kontör
  
  // Firma atamaları
  assignedFirmaIds: string[];   // Atanmış firma ID'leri
  
  // Diğer bilgiler
  parentUserId: string;         // Ana kullanıcının ID'si
  lastLoginAt?: string;         // Son giriş tarihi
  createdAt: string;
  updatedAt: string;
}

/**
 * Kullanıcı Oluşturma Verisi
 */
export interface CreateSubUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: SubUserRole;
  kontorTotal: number;
  assignedFirmaIds: string[];
}

/**
 * Kullanıcı Güncelleme Verisi
 */
export interface UpdateSubUserData {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: SubUserRole;
  status?: UserStatus;
  kontorTotal?: number;
  assignedFirmaIds?: string[];
}

/**
 * Kontör Kullanım Geçmişi
 */
export interface KontorUsageLog {
  id: string;
  userId: string;
  amount: number;              // Kullanılan miktar
  description: string;         // İşlem açıklaması (örn: "OCR işlemi")
  createdAt: string;
}

/**
 * SubUser State
 */
export interface SubUserState {
  subUsers: SubUser[];
  selectedUser: SubUser | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * SubUser Actions
 */
export interface SubUserActions {
  fetchSubUsers: () => Promise<void>;
  createSubUser: (data: CreateSubUserData) => Promise<void>;
  updateSubUser: (data: UpdateSubUserData) => Promise<void>;
  deleteSubUser: (userId: string) => Promise<void>;
  sendPasswordReset: (userId: string) => Promise<void>;
  assignKontor: (userId: string, amount: number) => Promise<void>;
  getKontorUsage: (userId: string) => Promise<KontorUsageLog[]>;
  clearError: () => void;
}

export const SUB_USER_ROLE_LABELS: Record<SubUserRole, string> = {
  [SubUserRole.MUSAVIR]: 'Müşavir',
  [SubUserRole.MUKELLEF]: 'Mükellef',
  [SubUserRole.SUB_USER]: 'Alt Kullanıcı',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Aktif',
  [UserStatus.INACTIVE]: 'Pasif',
  [UserStatus.SUSPENDED]: 'Askıya Alındı',
};
