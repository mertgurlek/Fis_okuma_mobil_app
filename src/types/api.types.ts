/**
 * API Types - Genel API İstek/Cevap Tipleri
 */

/**
 * Standart API Response Wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp?: string;
}

/**
 * API Hata Yapısı
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

/**
 * Pagination (Sayfalama)
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * HTTP Metodları
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * API Request Config
 */
export interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

/**
 * API Client Options
 */
export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Upload Progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * File Upload Request
 */
export interface FileUploadRequest {
  file: File | Blob;
  fieldName: string;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Kontör Bilgisi
 */
export interface KontorInfo {
  userId: string;
  remaining: number;         // Kalan kontör
  total: number;             // Toplam kontör
  used: number;              // Kullanılan kontör
  packageName: string;       // Paket adı
  expiresAt?: string;        // Paket bitiş tarihi
  isActive: boolean;
}

/**
 * Kontör Response
 */
export interface KontorResponse {
  success: boolean;
  data: KontorInfo;
}
