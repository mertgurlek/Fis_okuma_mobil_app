# FİŞ OKUMA MOBİL UYGULAMASI - BACKEND ENTEGRASYON DOKÜMANI

**Versiyon:** 1.0  
**Tarih:** 5 Kasım 2024  
**Proje:** Fiş Okuma & OCR Yönetim Sistemi  

---

## 📋 İÇİNDEKİLER

1. [Genel Mimari](#genel-mimari)
2. [Ekranlar ve API Gereksinimleri](#ekranlar-ve-api-gereksinimleri)
3. [Database Schema](#database-schema)
4. [API Endpoint Özeti](#api-endpoint-özeti)
5. [OCR & AI Entegrasyonu](#ocr--ai-entegrasyonu)
6. [Güvenlik](#güvenlik)

---

## 🏗️ GENEL MİMARİ

### Teknoloji Stack
**Frontend:** React Native (Expo), TypeScript, Zustand  
**Backend Önerisi:** Node.js/Express veya .NET Core  
**Database:** PostgreSQL/MySQL  
**Storage:** AWS S3 veya Azure Blob  
**OCR:** Google Vision API / Azure Computer Vision  

### Kullanıcı Tipleri
1. **Ana Kullanıcı:** Tam yetki, tüm firmalar
2. **Alt Müşavir:** Atanan firmalara erişim
3. **Mükellef:** Sadece fiş yükleme

---

## 📱 EKRANLAR VE API GEREKSİNİMLERİ

### 1. LOGIN EKRANI

**Dosya:** `app/(auth)/login.tsx`

**Özellikler:**
- Kullanıcı adı/şifre girişi
- Demo mode desteği
- Token tabanlı kimlik doğrulama

**API Endpoints:**

```
POST /api/auth/login
Body: { username, password, rememberMe }
Response: { token, refreshToken, user }

POST /api/auth/login-demo
Response: { token, demoUser }

GET /api/auth/validate
Header: Authorization: Bearer {token}
Response: { valid, user }
```

---

### 2. SIGNUP EKRANI (Lead Oluşturma)

**Dosya:** `app/(auth)/signup.tsx`

**Özellikler:**
- Yeni müşteri başvurusu
- CRM entegrasyonu için lead oluşturma

**API Endpoint:**

```
POST /api/auth/signup
Body: { firstName, lastName, companyName, phone, email, note }
Response: { success, message, leadId }
```

---

### 3. DASHBOARD

**Dosya:** `app/(tabs)/dashboard.tsx`

**Özellikler:**
- Bu ay metrikleri: Mükelleften gelen, onay bekleyen, KDV, tutar
- Hızlı kamera/galeri erişimi (fiş & Z raporu)
- Son 3 işlem gösterimi

**API Endpoints:**

```
GET /api/dashboard/stats?firmaId={id}&period=month
Response: { totalReceipts, approvedReceipts, pendingReceipts, totalKdv, totalAmount, taxpayerReceipts }

GET /api/receipts/recent?firmaId={id}&limit=3
Response: [ { id, tarih, unvan, toplamTutar, status } ]
```

---

### 4. FİRMALAR EKRANI

**Dosya:** `app/firmas/index.tsx`

**Özellikler:**
- Firma listesi, istatistikler
- Kontör gösterimi
- Firma CRUD işlemleri
- Firma kullanıcıları (mükellef) yönetimi

**API Endpoints:**

```
GET /api/firmas?page=1&limit=50
Response: { data: [], pagination }

POST /api/firmas
Body: { unvan, shortName, vkn, vergiDairesi, firmaTuru, ... }
Response: { success, data }

PUT /api/firmas/:id
Body: { partialUpdate }

GET /api/firmas/:id/stats
Response: { totalReceipts, totalKdv, kontorRemaining, ... }

GET /api/firmas/:id/users
Response: [ { id, username, firstName, isActive } ]

POST /api/firmas/:id/users
Body: { username, password, firstName, lastName, email }
Response: { success, user, credentials }
```

---

### 5. FİŞ LİSTESİ

**Dosya:** `app/(tabs)/index.tsx`

**Özellikler:**
- Filtreleme: Durum, kaynak, müşavir onayı, fiş tipi, tarih, tutar
- Arama: VKN, ünvan
- Pagination

**API Endpoint:**

```
GET /api/receipts?firmaId={id}&page=1&limit=20&status[]=verified&source[]=taxpayer&...
Response: { data: [], pagination, filterStats }
```

**Filtre Parametreleri:**
- `status[]`: processing, verified, approved, rejected
- `source[]`: main_user, sub_advisor, taxpayer
- `advisorApproval[]`: waiting, approved, rejected
- `fisType[]`: yazar_kasa, z_raporu
- `startDate`, `endDate`, `minAmount`, `maxAmount`, `search`

---

### 6. YENİ FİŞ EKLEME

**Dosya:** `app/(tabs)/new-receipt.tsx`

**Özellikler:**
- Kamera/galeri ile görsel yükleme
- Çoklu dosya desteği
- OCR işlemi başlatma

**API Endpoints:**

```
POST /api/receipts
Content-Type: multipart/form-data
Body: { firmaId, fisType, image }
Response: { id, status: "processing", imageUrl, estimatedTime }

POST /api/receipts/batch
Body: { firmaId, fisType, images[] }
Response: { data: [], batchId, totalCount }

GET /api/receipts/:id/status
Response: { status, progress, message }
```

---

### 7. FİŞ DETAY & ONAY

**Dosya:** `app/receipt/[id].tsx`

**Özellikler:**
- Split view (görsel + form)
- Tüm alanlar editlenebilir
- KDV satırları: ekle/sil/düzenle, otomatik hesaplama
- Kategori ve etiket yönetimi
- Değişiklik takibi (AI vs User değerleri)
- Taslak kaydet / Onayla

**API Endpoints:**

```
GET /api/receipts/:id
Response: { id, tarih, fisNo, vkn, unvan, kdvSatirlari, toplamKdv, toplamTutar, 
            category, tags, status, imageUrl, aiResult, ocrData, diffLog }

PUT /api/receipts/:id
Body: { tarih, fisNo, vkn, unvan, kdvSatirlari, category, tags, userEdited }
Response: { success, data }

POST /api/receipts/:id/approve
Body: { diffLog }
Response: { success, message }
```

---

### 8. HESAP EKRANI

**Dosya:** `app/(tabs)/account.tsx`

**Özellikler:**
- Kullanıcı bilgileri
- Kontör & abonelik detayları
- İstatistikler (toplam/aylık/haftalık fiş)
- Ayarlar: Otomatik yenileme, bildirimler

**API Endpoints:**

```
GET /api/user/profile
Response: { user, credits, subscription, usage, settings }

PUT /api/user/settings
Body: { autoRecharge, rechargeThreshold, notifications }
Response: { success }

POST /api/user/credits/purchase
Body: { amount }
Response: { success, transaction }
```

---

## 🗄️ DATABASE SCHEMA

### Users & Authentication

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50),  -- admin, user, demo
  user_type VARCHAR(50),  -- main_user, sub_advisor, taxpayer
  parent_user_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  total INTEGER DEFAULT 0,
  used INTEGER DEFAULT 0,
  remaining INTEGER DEFAULT 0,
  last_purchase_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(50),  -- free, basic, premium, enterprise
  status VARCHAR(50),  -- active, expired, trial
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT false
);
```

### Firmas

```sql
CREATE TABLE firmas (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  unvan VARCHAR(500) NOT NULL,
  short_name VARCHAR(255) NOT NULL,
  vkn VARCHAR(20) NOT NULL,
  vergi_dairesi VARCHAR(255),
  firma_turu VARCHAR(50),  -- sahis, limited, anonim
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  kontor INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE firma_users (
  id UUID PRIMARY KEY,
  firma_id UUID REFERENCES firmas(id),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id)
);

CREATE TABLE user_firma_assignments (
  user_id UUID REFERENCES users(id),
  firma_id UUID REFERENCES firmas(id),
  assigned_at TIMESTAMP,
  PRIMARY KEY (user_id, firma_id)
);
```

### Receipts

```sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY,
  firma_id UUID REFERENCES firmas(id),
  user_id UUID REFERENCES users(id),
  tarih DATE NOT NULL,
  fis_no VARCHAR(100),
  vkn VARCHAR(20),
  unvan VARCHAR(500),
  toplam_kdv DECIMAL(15,2),
  toplam_tutar DECIMAL(15,2),
  fis_type VARCHAR(50),  -- yazar_kasa, z_raporu, e_arsiv
  category VARCHAR(50),  -- yemek, yakit, ofis, ulasim
  tags TEXT[],  -- Array of strings
  status VARCHAR(50),  -- processing, verified, approved, rejected
  source VARCHAR(50),  -- main_user, sub_advisor, taxpayer
  advisor_approval_status VARCHAR(50),  -- waiting, approved, rejected
  advisor_approved_by UUID REFERENCES users(id),
  advisor_approved_at TIMESTAMP,
  advisor_rejection_reason TEXT,
  image_url TEXT,
  user_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  approved_at TIMESTAMP
);

CREATE TABLE receipt_kdv_lines (
  id UUID PRIMARY KEY,
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  oran INTEGER,  -- 1, 10, 20
  matrah DECIMAL(15,2),
  kdv_tutari DECIMAL(15,2)
);

CREATE TABLE receipt_ocr_data (
  receipt_id UUID PRIMARY KEY REFERENCES receipts(id),
  raw_text TEXT,
  confidence DECIMAL(3,2),  -- 0.00 - 1.00
  processing_time INTEGER,  -- milliseconds
  ai_result JSONB,  -- AI'ın extract ettiği ham data
  created_at TIMESTAMP
);

CREATE TABLE receipt_diff_logs (
  id UUID PRIMARY KEY,
  receipt_id UUID REFERENCES receipts(id),
  field_name VARCHAR(100),
  ai_value TEXT,
  user_value TEXT,
  changed_at TIMESTAMP
);
```

### Leads (CRM)

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  note TEXT,
  status VARCHAR(50) DEFAULT 'new',  -- new, contacted, qualified, converted
  source VARCHAR(50) DEFAULT 'mobile_app',
  created_at TIMESTAMP
);
```

---

## 📡 API ENDPOINT ÖZETİ

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/login-demo` - Demo login
- `GET /api/auth/validate` - Token validation
- `POST /api/auth/signup` - Lead creation
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - İstatistikler

### Firmas
- `GET /api/firmas` - Liste
- `POST /api/firmas` - Oluştur
- `PUT /api/firmas/:id` - Güncelle
- `DELETE /api/firmas/:id` - Sil
- `GET /api/firmas/:id/stats` - Firma istatistikleri
- `GET /api/firmas/:id/users` - Firma kullanıcıları
- `POST /api/firmas/:id/users` - Kullanıcı ekle

### Receipts
- `GET /api/receipts` - Liste (filtreleme destekli)
- `GET /api/receipts/recent` - Son işlemler
- `GET /api/receipts/:id` - Detay
- `POST /api/receipts` - Yeni fiş (dosya upload)
- `POST /api/receipts/batch` - Toplu upload
- `PUT /api/receipts/:id` - Güncelle
- `POST /api/receipts/:id/approve` - Onayla
- `GET /api/receipts/:id/status` - OCR durumu
- `DELETE /api/receipts/:id` - Sil

### User
- `GET /api/user/profile` - Profil bilgileri
- `PUT /api/user/settings` - Ayarları güncelle
- `POST /api/user/credits/purchase` - Kontör satın al

---

## 🤖 OCR & AI ENTEGRASYONU

### İşlem Akışı

1. **Upload**: Mobil → Backend (multipart/form-data)
2. **Storage**: S3/Azure Blob'a kaydet
3. **Queue**: OCR işini kuyruğa ekle (RabbitMQ/Bull/SQS)
4. **OCR Worker**:
   - Görseli indir
   - OCR API'sine gönder (Google Vision/Azure)
   - Ham metin al
5. **AI Parsing**:
   - GPT-4 Vision veya özel model ile parse
   - Alanları extract et: tarih, fisNo, vkn, unvan, KDV satırları
   - Confidence score hesapla
6. **DB Update**: Receipt'i güncelle (status: verified)
7. **Notify**: WebSocket veya polling ile frontend'e bildir

### OCR Servis Önerileri

**Google Cloud Vision API:**
- `TEXT_DETECTION` feature
- Yüksek doğruluk, Türkçe desteği

**Azure Computer Vision:**
- Read API
- Form Recognizer (yapılandırılmış belgeler için)

**Custom Training:**
- Fiş formatlarına özel model eğitimi
- YOLOv8 + Tesseract kombinasyonu

### AI Parsing Örneği

```javascript
// GPT-4 Vision ile parsing
const prompt = `
Bu fiş görselinden şu bilgileri çıkar:
- Tarih (DD.MM.YYYY)
- Fiş No
- VKN
- Firma Ünvanı
- KDV Satırları (oran, matrah, kdv tutarı)
- Toplam KDV
- Toplam Tutar

JSON formatında döndür.
`;

const result = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: imageUrl }
    ]
  }]
});
```

---

## 🔒 GÜVENLİK

### Authentication
- JWT token (access token: 1 saat, refresh token: 30 gün)
- Bcrypt password hashing (cost: 12)
- Rate limiting: 100 req/min per IP

### Authorization
- Role-based: admin, user, demo
- User type: main_user, sub_advisor, taxpayer
- Firma assignment kontrolü (alt müşavir için)

### File Upload
- Allowed types: image/jpeg, image/png, image/jpg
- Max size: 10MB
- Virus scanning önerilir
- Unique filename (UUID)

### API Security
- HTTPS zorunlu
- CORS configuration
- Input validation (Joi/Yup)
- SQL injection koruması (parametrized queries)
- XSS protection

---

## 📊 PERFORMANS ÖNERİLERİ

### Caching
- Dashboard stats: Redis, 5 dk TTL
- Firma listesi: Redis, 10 dk TTL
- User profile: Redis, 30 dk TTL

### Database Indexing
```sql
CREATE INDEX idx_receipts_firma_id ON receipts(firma_id);
CREATE INDEX idx_receipts_status ON receipts(status);
CREATE INDEX idx_receipts_tarih ON receipts(tarih);
CREATE INDEX idx_receipts_source ON receipts(source);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_firmas_user_id ON firmas(user_id);
```

### Pagination
- Limit: 20-50 items per page
- Cursor-based pagination önerilir (large datasets için)

---

## 🚀 DEPLOYMENT ÖNERİLERİ

### Backend
- Docker containerization
- CI/CD pipeline (GitHub Actions/GitLab CI)
- Environment variables (.env)
- Logging (Winston/Bunyan)
- Monitoring (New Relic/Datadog)

### Database
- Master-slave replication
- Automated backups (günlük)
- Connection pooling

### Queue System
- Redis/RabbitMQ for OCR jobs
- Worker pool (min 2-4 workers)
- Dead letter queue for failed jobs

---

## 📞 DESTEK & ENTEGRASYON

### Webhook Events (Opsiyonel)
```
receipt.created
receipt.verified (OCR tamamlandı)
receipt.approved
receipt.rejected
credit.low (kontör düşük)
```

### Export API
```
POST /api/receipts/export
Body: { format: "json|excel|csv", receiptIds: [], includeImages: boolean }
Response: { downloadUrl, expiresAt }
```

---

**SON GÜNCELLEM:** 5 Kasım 2024  
**HAZIRLAYAN:** Cascade AI  
**İLETİŞİM:** [Backend ekibi ile koordinasyon gereklidir]
