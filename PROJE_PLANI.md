# FİŞ OKUMA MOBİL UYGULAMA - PROJE PLANI

## 📋 Genel Bakış
**Platform:** React Native + Expo + TypeScript  
**Durum Yönetimi:** Zustand (lightweight & modüler)  
**Navigasyon:** Expo Router  
**Stil Yaklaşımı:** StyleSheet + Theme System  

---

## 🏗️ PROJE YAPISI

```
fis_okuma_mobil_app/
├── app/                          # Expo Router - Ekranlar
│   ├── (auth)/                   # Auth grubu
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── demo-info.tsx
│   ├── (tabs)/                   # Ana tab navigasyonu
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Fiş Listesi
│   │   ├── new-receipt.tsx       # Yeni Fiş
│   │   └── account.tsx           # Hesap
│   ├── receipt/                  # Fiş detay rotaları
│   │   ├── [id].tsx              # Fiş Detay & Onay
│   │   └── camera.tsx            # Kamera ekranı
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Splash/Entry point
├── src/
│   ├── components/               # Yeniden kullanılabilir bileşenler
│   │   ├── global/
│   │   │   ├── TopBar.tsx
│   │   │   ├── TabBar.tsx
│   │   │   ├── FirmaChip.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── receipt/
│   │   │   ├── ReceiptCard.tsx
│   │   │   ├── ReceiptListItem.tsx
│   │   │   └── ReceiptImageViewer.tsx
│   │   ├── forms/
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Checkbox.tsx
│   │   └── modals/
│   │       ├── FirmaSelector.tsx
│   │       ├── FilterSheet.tsx
│   │       └── ConfirmDialog.tsx
│   ├── theme/                    # Tema ve stil sistemi
│   │   ├── colors.ts             # Renk paleti (light/dark)
│   │   ├── typography.ts         # Font boyutları
│   │   ├── spacing.ts            # Boşluk değerleri
│   │   ├── shadows.ts            # Gölge stilleri
│   │   └── index.ts              # Ana tema export
│   ├── store/                    # Zustand state management
│   │   ├── authStore.ts          # Auth state (user, token, isDemo)
│   │   ├── firmaStore.ts         # Firma yönetimi (selectedFirma, firmaList)
│   │   ├── receiptStore.ts       # Fiş state (receipts, filters)
│   │   ├── uiStore.ts            # UI state (theme, loading, modals)
│   │   └── index.ts              # Store exports
│   ├── types/                    # TypeScript type tanımları
│   │   ├── auth.types.ts
│   │   ├── firma.types.ts
│   │   ├── receipt.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── services/                 # API ve servisler
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   ├── firma.api.ts
│   │   │   ├── receipt.api.ts
│   │   │   └── ocr.api.ts
│   │   ├── storage/
│   │   │   └── secureStorage.ts  # Token & credential storage
│   │   └── camera/
│   │       └── cameraService.ts  # Kamera yardımcıları
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useAuth.ts
│   │   ├── useFirma.ts
│   │   └── useReceipt.ts
│   ├── utils/                    # Yardımcı fonksiyonlar
│   │   ├── formatters.ts         # Para, tarih formatlama
│   │   ├── validators.ts         # Form validasyon
│   │   └── constants.ts          # Sabitler
│   └── assets/                   # Statik dosyalar
│       ├── images/
│       └── icons/
├── package.json
├── tsconfig.json
├── app.json                      # Expo config
├── babel.config.js
├── .gitignore
└── README.md
```

---

## ✅ ADIM ADIM UYGULAMA PLANI

### FAZA 1: TEMEL ALTYAPI (Foundation) ✓
- [x] 1.1. package.json oluştur
- [x] 1.2. tsconfig.json oluştur
- [x] 1.3. app.json (Expo config) oluştur
- [x] 1.4. babel.config.js oluştur
- [x] 1.5. .gitignore oluştur
- [x] 1.6. README.md oluştur

### FAZA 2: TEMA SİSTEMİ (Theme System) ✓
- [x] 2.1. theme/colors.ts - Renk paleti (Light & Dark)
- [x] 2.2. theme/typography.ts - Font boyutları ve stiller
- [x] 2.3. theme/spacing.ts - Boşluk sistemi (4px base)
- [x] 2.4. theme/shadows.ts - Gölge tanımları
- [x] 2.5. theme/index.ts - Ana tema export

### FAZA 3: TYPE TANIMLARI (TypeScript Types) ✓
- [x] 3.1. types/auth.types.ts - User, LoginCredentials, SignupData
- [x] 3.2. types/firma.types.ts - Firma, FirmaListItem
- [x] 3.3. types/receipt.types.ts - Receipt, ReceiptStatus, KDVLine
- [x] 3.4. types/api.types.ts - ApiResponse, ApiError
- [x] 3.5. types/index.ts - Type exports

### FAZA 4: STATE MANAGEMENT (Zustand Stores) ✓
- [x] 4.1. store/authStore.ts - Authentication state
- [x] 4.2. store/firmaStore.ts - Firma yönetimi
- [x] 4.3. store/receiptStore.ts - Fiş CRUD operations
- [x] 4.4. store/uiStore.ts - UI durumları (theme, loading, modals)
- [x] 4.5. store/index.ts - Store exports

### FAZA 5: SERVİSLER (API & Services) 🔌
- [ ] 5.1. services/storage/secureStorage.ts - Token storage
- [ ] 5.2. services/api/client.ts - Axios instance + interceptors
- [ ] 5.3. services/api/auth.api.ts - Login, signup endpoints
- [ ] 5.4. services/api/firma.api.ts - Firma CRUD
- [ ] 5.5. services/api/receipt.api.ts - Fiş CRUD
- [ ] 5.6. services/api/ocr.api.ts - OCR processing
- [ ] 5.7. services/camera/cameraService.ts - Kamera helpers
**NOT:** Store'larda mock data kullanıldığı için bu faz şimdilik atlandı.

### FAZA 6: CUSTOM HOOKS ✓
- [x] 6.1. hooks/useTheme.ts - Tema değiştirme & okuma
- [x] 6.2. hooks/useAuth.ts - Login, logout, token check
- [x] 6.3. hooks/useFirma.ts - Firma seçme & listeleme
- [x] 6.4. hooks/useReceipt.ts - Fiş CRUD operations

### FAZA 7: TEMEL BİLEŞENLER (Core Components) ⏳
- [x] 7.1. components/forms/Input.tsx - Text input
- [x] 7.2. components/forms/Button.tsx - Primary, secondary, destructive
- [x] 7.3. components/forms/Checkbox.tsx - Checkbox
- [x] 7.4. components/global/LoadingSpinner.tsx - Loading indicator
- [x] 7.5. components/global/TopBar.tsx - Üst başlık bar
- [x] 7.6. components/global/FirmaChip.tsx - Firma seçici chip
- [ ] 7.7. components/global/TabBar.tsx - Alt tab bar (custom)
**NOT:** Form ve temel global bileşenler tamamlandı. TabBar, modal ve diğer bileşenler sonraki fazlarda eklenecek.

### FAZA 8: MODAL & DIALOG BİLEŞENLERİ ✓
- [x] 8.1. components/modals/FirmaSelector.tsx - Firma seçim modal
- [x] 8.2. components/modals/FilterSheet.tsx - Fiş filtreleme
- [x] 8.3. components/modals/ConfirmDialog.tsx - Onay dialog

### FAZA 9: FİŞ BİLEŞENLERİ ✓
- [x] 9.1. components/receipt/ReceiptCard.tsx - Liste kartı
- [x] 9.2. components/receipt/ReceiptListItem.tsx - Liste satırı
- [x] 9.3. components/index.ts - Ana component export

### FAZA 10: NAVİGASYON (Expo Router Setup) ✓
- [x] 10.1. app/_layout.tsx - Root layout
- [x] 10.2. app/index.tsx - Splash screen
- [x] 10.3. app/(tabs)/_layout.tsx - Tab layout
- [x] 10.4. app/(auth)/_layout.tsx - Auth layout

### FAZA 11: AUTH EKRANLARI ✓
- [x] 11.1. app/(auth)/login.tsx - Login ekranı
- [ ] 11.2. app/(auth)/signup.tsx - Kayıt başvuru formu (TODO)
- [ ] 11.3. app/(auth)/demo-info.tsx - Demo bilgilendirme (TODO)

### FAZA 12: ANA EKRANLAR (Main Screens) ✓
- [x] 12.1. app/(tabs)/index.tsx - Fiş Listesi ekranı
- [x] 12.2. app/(tabs)/new-receipt.tsx - Yeni Fiş akışı
- [x] 12.3. app/(tabs)/account.tsx - Hesap/Ayarlar
- [ ] 12.4. app/receipt/[id].tsx - Fiş Detay & Onay (TODO)
- [ ] 12.5. app/receipt/camera.tsx - Kamera ekranı (TODO)

### FAZA 13: YARDIMCI FONKSİYONLAR (Utils) ✓
- [x] 13.1. utils/formatters.ts - Para, tarih formatlama
- [x] 13.2. utils/validators.ts - Email, VKN validasyon
- [x] 13.3. utils/constants.ts - Sabit değerler

### FAZA 14: MODERN TASARIM & RESPONSIVE ✅
- [x] 14.1. Responsive breakpoints sistemi (tablet/phone)
- [x] 14.2. Modern gradients ve glassmorphism efektleri
- [x] 14.3. Animasyon ve micro-interaction sistemi
- [x] 14.4. Button, Input, ReceiptCard modernizasyonu
- [x] 14.5. Login, Home, Account, New Receipt ekranları responsive
- [x] 14.6. Visual hierarchy ve UX iyileştirmeleri
- [x] 14.7. Theme sistemi genişletildi (responsive, animations, effects)

### FAZA 15: TEST & POLISH ✨
- [ ] 15.1. Tüm ekranları test et
- [ ] 15.2. Dark mode geçişini test et
- [ ] 15.3. Offline mode test
- [ ] 15.4. Performance optimization

---

## 🎯 MODÜLER TASARIM PRENSİPLERİ

### 1. Global State (Zustand Store)
- **authStore**: user, token, isDemo, login(), logout()
- **firmaStore**: selectedFirma, firmaList, selectFirma(), fetchFirmaList()
- **receiptStore**: receipts, filters, addReceipt(), updateReceipt()
- **uiStore**: theme (light/dark), showModal(), hideModal()

### 2. Tema Sistemi
- Tüm renkler `theme/colors.ts`'den gelir
- Tüm ekranlarda `useTheme()` hook kullanılır
- Light/Dark mod otomatik geçiş

### 3. Type Safety
- Her veri yapısı TypeScript interface ile tanımlı
- API response'ları typed
- Store'lar typed

### 4. Bileşen Yeniden Kullanımı
- Button, Input gibi form elemanları tek bir yerde
- Her ekran bu bileşenleri import eder
- Tutarlı UI/UX

### 5. API Katmanı
- Tüm API çağrıları `services/api/` içinde
- Axios interceptor ile token yönetimi
- Error handling merkezi

---

## 🚀 İLK ÇALIŞTIRMA ADIMLARI

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. TypeScript kontrolü
npm run type-check

# 3. Uygulamayı başlat
npm start

# 4. Android/iOS'ta çalıştır
npm run android
npm run ios
```

---

## 📌 ÖNEMLİ NOTLAR

1. **Global değişkenler store'larda tutulur** - Component state değil
2. **Her ekran theme'i hook ile alır** - Hardcoded renk yok
3. **API çağrıları store action'larında** - Component'te API çağrısı yok
4. **Type güvenliği her yerde** - `any` kullanımı yasak
5. **Modüler yapı** - Bir değişiklik tüm sistemi etkilemez

---

## 🎨 RENK PALETİ REFERANSI

```typescript
// Primary (Ana Mavi)
primary: '#1F4B8F'
primary-light: '#3C6BB8'
primary-dark: '#16366A'

// Status
success: '#27AE60'  // Onaylı
warning: '#F2C94C'  // Dikkat
error: '#E53935'    // Hata
info: '#2D9CDB'     // Bilgi

// Light Mode
bg: '#F4F5F7'
surface: '#FFFFFF'
text-primary: '#111827'
text-secondary: '#6B7280'

// Dark Mode
bg: '#0F1419'
surface: '#111827'
text-primary: '#F9FAFB'
text-secondary: '#9CA3AF'
```

---

Bu planda her bir adımı tamamladıkça ✅ işaretleyeceğim.
Şimdi FAZA 1'den başlıyorum! 🚀
