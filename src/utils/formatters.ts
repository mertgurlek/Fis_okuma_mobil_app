/**
 * Formatters - Veri Formatlama Fonksiyonları
 * 
 * Para, tarih, telefon gibi verileri formatlar
 */

import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Para formatı (TL)
 * @param amount - Tutar
 * @param showCurrency - Para birimi göster
 * @returns Formatlanmış para string
 * 
 * @example
 * formatCurrency(1234.56) // "1.234,56 ₺"
 * formatCurrency(1234.56, false) // "1.234,56"
 */
export const formatCurrency = (amount: number, showCurrency: boolean = true): string => {
  if (amount === null || amount === undefined) return '-';
  
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showCurrency ? `${formatted} ₺` : formatted;
};

/**
 * Tarih formatı
 * @param date - ISO tarih string veya Date
 * @param formatStr - Format pattern (default: 'dd.MM.yyyy')
 * @returns Formatlanmış tarih
 * 
 * @example
 * formatDate('2024-01-15') // "15.01.2024"
 * formatDate('2024-01-15', 'dd MMMM yyyy') // "15 Ocak 2024"
 */
export const formatDate = (
  date: string | Date, 
  formatStr: string = 'dd.MM.yyyy'
): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: tr });
  } catch (error) {
    return '-';
  }
};

/**
 * Tarih ve saat formatı
 * @param date - ISO tarih string veya Date
 * @returns Formatlanmış tarih ve saat
 * 
 * @example
 * formatDateTime('2024-01-15T10:30:00') // "15.01.2024 10:30"
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
};

/**
 * Göreli zaman (relative time)
 * @param date - ISO tarih string veya Date
 * @returns Göreli zaman string
 * 
 * @example
 * formatRelativeTime('2024-01-15T10:00:00') // "2 saat önce"
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: tr, addSuffix: true });
  } catch (error) {
    return '-';
  }
};

/**
 * Telefon formatı
 * @param phone - Ham telefon numarası
 * @returns Formatlanmış telefon
 * 
 * @example
 * formatPhone('5551234567') // "555 123 45 67"
 * formatPhone('905551234567') // "+90 555 123 45 67"
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '-';
  
  // Sadece rakamları al
  const cleaned = phone.replace(/\D/g, '');
  
  // Türkiye formatı (10 haneli)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  // Uluslararası format (12 haneli: 90 ile başlayan)
  if (cleaned.length === 12 && cleaned.startsWith('90')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  }
  
  return phone;
};

/**
 * VKN formatı (Vergi Kimlik Numarası)
 * @param vkn - Ham VKN
 * @returns Formatlanmış VKN
 * 
 * @example
 * formatVKN('1234567890') // "1234567890"
 */
export const formatVKN = (vkn: string): string => {
  if (!vkn) return '-';
  
  // Sadece rakamları al
  const cleaned = vkn.replace(/\D/g, '');
  
  // 10 haneli olmalı
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  return vkn;
};

/**
 * Büyük sayıları kısaltma (1K, 1M gibi)
 * @param num - Sayı
 * @returns Kısaltılmış string
 * 
 * @example
 * formatCompactNumber(1234) // "1,2K"
 * formatCompactNumber(1234567) // "1,2M"
 */
export const formatCompactNumber = (num: number): string => {
  if (num === null || num === undefined) return '-';
  
  if (num < 1000) return num.toString();
  
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return `${(num / 1000000).toFixed(1)}M`;
};

/**
 * Yüzde formatı
 * @param value - Değer (0-100 arası)
 * @param decimals - Ondalık basamak sayısı
 * @returns Formatlanmış yüzde
 * 
 * @example
 * formatPercentage(45.678) // "45,68%"
 * formatPercentage(45.678, 0) // "46%"
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (value === null || value === undefined) return '-';
  
  return `${value.toFixed(decimals).replace('.', ',')}%`;
};

/**
 * Dosya boyutu formatı
 * @param bytes - Byte cinsinden boyut
 * @returns Formatlanmış boyut
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * String'i başlık formatına çevir (Title Case)
 * @param str - String
 * @returns Başlık formatında string
 * 
 * @example
 * toTitleCase('merhaba dünya') // "Merhaba Dünya"
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * String'i kısalt ve ... ekle
 * @param str - String
 * @param maxLength - Maksimum uzunluk
 * @returns Kısaltılmış string
 * 
 * @example
 * truncateString('Çok uzun bir metin', 10) // "Çok uzun..."
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatVKN,
  formatCompactNumber,
  formatPercentage,
  formatFileSize,
  toTitleCase,
  truncateString,
};
