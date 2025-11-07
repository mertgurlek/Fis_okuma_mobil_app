# 📱 Fiş Okuma Mobil Uygulama

Mali müşavirler için AI destekli fiş okuma ve yönetim uygulaması.

## 🚀 Teknoloji Stack

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npx expo start
```

## 📁 Proje Yapısı

```
fis_okuma_mobil_app/
├── app/                  # Expo Router ekranları
├── src/
│   ├── components/       # Yeniden kullanılabilir bileşenler
│   ├── theme/           # Tema sistemi (colors, typography, spacing)
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type tanımları
│   ├── services/        # API servisler
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Yardımcı fonksiyonlar
│   └── assets/          # Statik dosyalar (resim, icon)
└── PROJE_PLANI.md       # Detaylı proje planı
```

## 🎨 Özellikler

### ✅ Temel Özellikler
- 🔐 Kullanıcı girişi ve yetkilendirme
- 🎭 Demo kullanım modu
- 🏢 Çoklu firma yönetimi
- 📸 Kamera ile fiş çekimi
- 🖼️ Galeriden fiş seçimi
- 🤖 AI destekli OCR ile fiş okuma
- ✏️ Manuel düzenleme ve onaylama
- 📊 Fiş listeleme ve filtreleme
- 🌓 Light/Dark mode desteği

### 🎯 Planlanan Özellikler
- 📚 Seri çekim modu
- 📤 Fiş dışa aktarma (JSON, Excel)
- 🔔 Bildirim sistemi
- 📈 İstatistikler ve raporlama

## 🔑 Önemli Notlar

### Global State Yönetimi
- **authStore:** Kullanıcı kimlik bilgileri
- **firmaStore:** Firma listesi ve seçili firma
- **receiptStore:** Fiş CRUD işlemleri
- **uiStore:** UI durumları (tema, loading, modal)

### Tema Sistemi
- Merkezi renk paleti (`theme/colors.ts`)
- Tüm ekranlar `useTheme()` hook kullanır
- Light/Dark mod otomatik geçiş

### TypeScript
- Strict mode aktif
- Tüm API response'lar typed
- `any` kullanımı yasak

## 📄 Lisans

© 2025 Uyumsoft - Tüm hakları saklıdır.

## 👥 Katkıda Bulunanlar

Uyumsoft Geliştirme Ekibi

## 📞 İletişim

Destek için: support@uyumsoft.com
