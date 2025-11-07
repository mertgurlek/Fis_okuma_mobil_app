# FİŞ OKUMA UYGULAMASI - EKRAN ANALİZİ ÖZETİ

**Tarih:** 5 Kasım 2024

---

## 🎯 UYGULAMANIN 8 ANA EKRANI

### 1️⃣ LOGIN EKRANI (`app/(auth)/login.tsx`)
- **Amaç:** Kullanıcı girişi
- **Özellikler:** Username/password, Demo login, Gradient tasarım
- **API:** `POST /api/auth/login`, `POST /api/auth/login-demo`
- **Yönlendirme:** Başarılı → Dashboard

### 2️⃣ SIGNUP EKRANI (`app/(auth)/signup.tsx`)
- **Amaç:** Yeni müşteri lead'i toplama (CRM)
- **Form:** Ad, Soyad, Şirket, Telefon, E-posta, Not
- **API:** `POST /api/auth/signup` → CRM'e kaydet
- **İşlem:** Lead oluştur, satış ekibine bildir

### 3️⃣ DASHBOARD (`app/(tabs)/dashboard.tsx`)
- **Amaç:** Ana sayfa, özet istatistikler
- **4 Metrik Kartı:**
  - Mükelleften gelen fişler (toplam, onaylı, bekleyen)
  - Onay bekleyen fişler
  - Toplam KDV (bu ay)
  - Toplam tutar (bu ay)
- **Hızlı İşlemler:** Kamera/Galeri (Fiş & Z-raporu)
- **Son İşlemler:** Son 3 fiş
- **API:** `GET /api/dashboard/stats`, `GET /api/receipts/recent`

### 4️⃣ FİŞ LİSTESİ (`app/(tabs)/index.tsx`)
- **Amaç:** Tüm fişleri listeleme ve filtreleme
- **Hızlı Filtreler:** Doğrulanmış, Onaylanmış, Mükelleften
- **Detaylı Filtreler:**
  - Durum (processing, verified, approved, rejected)
  - Kaynak (müşavir, mükellef)
  - Müşavir onayı (waiting, approved, rejected)
  - Kategori, Tarih aralığı, Tutar aralığı
- **API:** `GET /api/receipts?[filters]&page=1&limit=20`
- **Responsive:** Grid layout (1-3 kolon)

### 5️⃣ YENİ FİŞ EKLEME (`app/(tabs)/new-receipt.tsx`)
- **Amaç:** Fiş görseli yükleme ve OCR başlatma
- **2 Kategori:** Kasa Fişi (mavi), Z-raporu (sarı)
- **Özellikler:**
  - Kamera ile çekme
  - Galeriden çoklu seçim
  - Önizleme
  - Toplu analiz başlatma
- **API:** `POST /api/receipts` (multipart), `POST /api/receipts/batch`
- **İşlem:** Upload → OCR kuyruğu → Status: "processing"

### 6️⃣ FİŞ DETAY & ONAY (`app/receipt/[id].tsx`)
- **Amaç:** Fiş inceleme, düzenleme ve onaylama
- **Split View:** Sol: Görsel (zoom), Sağ: Form
- **Editlenebilir Alanlar:**
  - Tarih, Fiş No, VKN, Ünvan
  - Toplam KDV, Toplam Tutar
  - **KDV Satırları:** Ekle/sil/düzenle (otomatik hesaplama)
  - Kategori dropdown, Etiket yönetimi
- **Özellikler:**
  - AI güven skoru gösterimi
  - Değişiklik takibi (AI vs User)
  - Ham OCR metni görüntüleme
- **İşlemler:**
  - Taslak Kaydet: `PUT /api/receipts/:id`
  - Onayla: `POST /api/receipts/:id/approve`
- **Kısıt:** Onaylı fişler düzenlenemez

### 7️⃣ HESAP EKRANI (`app/(tabs)/account.tsx`)
- **Amaç:** Kullanıcı profil ve ayarlar
- **Bölümler:**
  - Kullanıcı bilgi kartı (gradient)
  - Kontör & Abonelik bilgileri (2 kolon grid)
  - İstatistikler: Toplam fiş, Bu ay, Bu hafta, Günlük ort.
  - Aksiyon butonları: Kontör al, Paket yükselt
  - Ayarlar: Otomatik yenileme, Bildirimler (switches)
  - Çıkış Yap butonu
- **API:** `GET /api/user/profile`, `PUT /api/user/settings`

### 8️⃣ FIRMALAR EKRANI (`app/firmas/index.tsx`)
- **Amaç:** Firma yönetimi
- **Header İstatistik:** Toplam firma, fiş, KDV, kontör
- **Firma Kartları (Grid):**
  - Avatar, Short name, VKN
  - İstatistikler: Toplam fiş, Onaylı, Bekleyen
  - KDV & Tutar toplamları
  - Kontör progress bar
  - Aksiyonlar: Seç, Düzenle, Kullanıcılar
- **FAB:** Yeni firma ekle
- **Modaller:**
  - Firma Form: CRUD işlemleri
  - Firma Detay: Bilgiler + Kullanıcı yönetimi (mükellef hesapları)
- **API:** `GET /api/firmas`, `POST /api/firmas`, `GET /api/firmas/:id/users`

---

## 🔄 KULLANICI TİPLERİ VE YETKİLER

### Ana Kullanıcı (Main User)
- Tüm firmalara erişim
- Tüm CRUD işlemleri
- Kontör satın alma

### Alt Müşavir (Sub Advisor)
- Atanan firmalara erişim
- Fiş işleme, onaylama
- Kısıtlı firma yönetimi

### Mükellef (Taxpayer)
- Tek firmaya erişim (kendisine ait)
- Sadece fiş yükleme
- Görüntüleme (readonly)

---

## 📊 VERİ AKIŞI

### Fiş Yaşam Döngüsü
```
1. UPLOAD → Status: "processing"
2. OCR WORKER → Ham metin + AI parsing
3. UPDATE → Status: "verified"
4. USER REVIEW → Düzenleme (opsiyonel)
5. APPROVE → Status: "approved" (muhasebe için hazır)
```

### OCR İşlem Akışı
```
Mobil App
  ↓ (POST multipart)
Backend API
  ↓ (S3 upload)
Storage
  ↓ (Queue job)
OCR Worker
  ↓ (Google Vision API)
AI Parser (GPT-4 Vision)
  ↓ (Extract fields)
Database Update
  ↓ (WebSocket/Polling)
Mobil App (notification)
```

---

## 🗄️ TEMEL DATABASE TABLOLARI

### users
- Kimlik bilgileri, roller, user type
- Parent user (alt kullanıcılar için)

### user_credits
- Kontör bilgileri

### user_subscriptions
- Plan, durum, otomatik yenileme

### firmas
- Firma bilgileri, VKN, vergi dairesi
- Kontör (firma bazında)

### firma_users
- Mükellef hesapları (firmaya bağlı kullanıcılar)

### user_firma_assignments
- Alt müşavir - firma atamaları

### receipts
- Fiş ana bilgileri
- Status, source, advisor approval

### receipt_kdv_lines
- KDV satırları (oran, matrah, tutar)

### receipt_ocr_data
- Ham OCR metni, confidence
- AI parsing sonuçları

### receipt_diff_logs
- Kullanıcı düzenlemeleri (AI vs User)

### leads
- CRM için müşteri başvuruları

---

## 🔌 KRİTİK API ENDPOINT'LER

### Auth
- `POST /api/auth/login`
- `POST /api/auth/login-demo`
- `POST /api/auth/signup` (Lead)
- `GET /api/auth/validate`

### Dashboard
- `GET /api/dashboard/stats?firmaId&period`

### Receipts
- `GET /api/receipts` (filtreleme destekli)
- `GET /api/receipts/:id`
- `POST /api/receipts` (upload)
- `POST /api/receipts/batch`
- `PUT /api/receipts/:id`
- `POST /api/receipts/:id/approve`
- `GET /api/receipts/:id/status` (OCR durumu)

### Firmas
- `GET /api/firmas`
- `POST /api/firmas`
- `PUT /api/firmas/:id`
- `GET /api/firmas/:id/stats`
- `GET /api/firmas/:id/users`
- `POST /api/firmas/:id/users`

### User
- `GET /api/user/profile`
- `PUT /api/user/settings`
- `POST /api/user/credits/purchase`

---

## 🎨 UI/UX ÖZELLİKLERİ

### Responsive Tasarım
- Mobil (< 768px): Tek kolon
- Tablet (768-1024px): İki kolon
- Large (> 1024px): Üç kolon

### Animasyonlar
- Fade in/out
- Slide animasyonları
- Progress bar animasyonları
- Skeleton loaders

### Renkler & Temalar
- Primary: Mavi tonu
- Success: Yeşil (onaylı)
- Warning: Turuncu/Sarı (bekleyen)
- Error: Kırmızı (reddedilmiş)
- Gradient'ler: Header'larda, kartlarda

### İkonlar
- Emoji bazlı (📄, 💳, 📊, 👤, vb.)
- Evrensel tanınabilirlik

---

## ⚙️ BACKEND GEREKSİNİMLERİ

### Teknoloji
- REST API (Node.js/Express veya .NET Core)
- JWT Authentication
- PostgreSQL/MySQL
- Redis (caching)
- S3/Azure Blob (dosya storage)
- RabbitMQ/Bull (queue system)

### OCR & AI
- Google Cloud Vision API veya Azure Computer Vision
- GPT-4 Vision (field extraction)
- Asenkron işlem (queue worker)

### Güvenlik
- HTTPS
- JWT token (1 saat + refresh token)
- Bcrypt password hashing
- Rate limiting
- File upload validation
- CORS configuration

### Performans
- Database indexing (firma_id, status, tarih)
- Caching (dashboard stats, firma listesi)
- Pagination (20-50 items/page)
- Connection pooling

---

## 📝 SONUÇ

Bu uygulama, **OCR tabanlı fiş yönetim sistemidir**. Ana akış:

1. Kullanıcı giriş yapar
2. Firma seçer
3. Fiş görseli yükler (kamera/galeri)
4. OCR otomatik analiz eder
5. Kullanıcı sonuçları kontrol eder, düzenler
6. Fişi onaylar
7. Muhasebe için hazır hale gelir

**3 tip kullanıcı:**
- Ana Kullanıcı (tam yetki)
- Alt Müşavir (atanan firmalara)
- Mükellef (sadece fiş yükleme)

**Backend'den beklenen:**
- Kullanıcı & firma yönetimi
- OCR & AI entegrasyonu
- Fiş CRUD işlemleri
- İstatistik hesaplamaları
- Güvenli dosya yükleme
- CRM entegrasyonu

---

**SON GÜNCELLEME:** 5 Kasım 2024  
**HAZIRLAYAN:** Cascade AI  
