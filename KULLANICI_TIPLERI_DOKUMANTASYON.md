# Kullanıcı Tipleri ve Yetkilendirme Sistemi

## 📋 Genel Bakış

Fiş Okuma uygulamasında 3 farklı kullanıcı tipi bulunmaktadır:

### 1. **Ana Kullanıcı** (Main User)
- Tam yetkili kullanıcı
- Tüm firmalara erişim
- Tüm özellikleri kullanabilir

### 2. **Alt Müşavir** (Sub Advisor)
- Kendisine atanan firmalarla işlem yapabilir
- Fiş ekleme, düzenleme, onaylama, silme yetkisi
- Muhasebeleştirme yapabilir
- Mükelleften gelen fişleri onaylayabilir/reddedebilir

### 3. **Mükellef** (Taxpayer)
- Sadece kendine atanan firma/firmalara fiş ekleyebilir
- Yüklediği fişi onaylama yapabilir
- Fiş SİLEMEZ
- Muhasebeleştirme YAPAMAZ
- Dashboard GÖREMEz

---

## 🔐 Yetki Matrisi

| Özellik | Ana Kullanıcı | Alt Müşavir | Mükellef |
|---------|---------------|-------------|----------|
| Dashboard Erişimi | ✅ | ✅ | ❌ |
| Tüm Firmalara Erişim | ✅ | ❌ | ❌ |
| Atanan Firmalara Erişim | N/A | ✅ | ✅ |
| Fiş Ekleme | ✅ | ✅ | ✅ |
| Fiş Düzenleme | ✅ | ✅ | ✅ |
| Fiş Onaylama | ✅ | ✅ | ✅ |
| Fiş Silme | ✅ | ✅ | ❌ |
| Muhasebeleştirme | ✅ | ✅ | ❌ |
| Mükellef Fişlerini Görme | ✅ | ✅ | ❌ |
| Mükellef Fişlerini Onaylama | ✅ | ✅ | ❌ |

---

## 🔄 Mükellef Fiş Akışı

### 1. Mükellef Fiş Yükleme
```
Mükellef → Fiş Yükle → source: TAXPAYER
                     → advisorApprovalStatus: WAITING
```

### 2. Müşavir Onay Süreci
```
Müşavir → "Mükellef Fişleri" Ekranı
       → Fişi İncele
       → ONAYLA veya REDDET
```

#### Onaylandığında:
```
advisorApprovalStatus: APPROVED
advisorApprovedBy: <müşavir_id>
advisorApprovedAt: <zaman>
→ Genel havuza eklenir
→ "Mükelleften Geldi" etiketi ile görünür
```

#### Reddedildiğinde:
```
advisorApprovalStatus: REJECTED
advisorApprovedBy: <müşavir_id>
advisorRejectionReason: <neden>
→ Mükellefe bildirim gönderilir
```

---

## 📁 Dosya Değişiklikleri

### Yeni Dosyalar
1. **`src/utils/permissions.ts`** - Yetki kontrol fonksiyonları
2. **`app/taxpayer-receipts.tsx`** - Mükellef fişleri ekranı (root seviyede)
3. **`KULLANICI_TIPLERI_DOKUMANTASYON.md`** - Bu dokümantasyon

### Güncellenen Dosyalar
1. **`src/types/auth.types.ts`**
   - `UserType` enum eklendi
   - `User` interface'ine `userType`, `assignedFirmaIds`, `parentUserId` eklendi

2. **`src/types/receipt.types.ts`**
   - `ReceiptSource` enum eklendi
   - `AdvisorApprovalStatus` enum eklendi
   - `Receipt` interface'ine kaynak ve onay bilgileri eklendi

3. **`src/store/authStore.ts`**
   - Mock kullanıcılara `userType` eklendi

4. **`src/store/receiptStore.ts`**
   - `fetchTaxpayerReceipts()` fonksiyonu
   - `approveFromTaxpayer()` fonksiyonu
   - `rejectFromTaxpayer()` fonksiyonu
   - Mock data'ya `source` ve `advisorApprovalStatus` eklendi

5. **`src/hooks/useReceipt.ts`**
   - Mükellef işlemleri için fonksiyonlar export edildi

6. **`app/(tabs)/_layout.tsx`**
   - Kullanıcı tipine göre tab görünürlüğü
   - "Mükellef Fişleri" tab'ı eklendi

---

## 💻 Kullanım Örnekleri

### Yetki Kontrolü
```typescript
import { canDeleteReceipt, canAccountReceipt, isTaxpayer } from '@/src/utils/permissions';
import { useAuth } from '@hooks';

const { user } = useAuth();

// Fiş silme yetkisi kontrolü
if (canDeleteReceipt(user)) {
  // Silme işlemi
}

// Mükellef kontrolü
if (isTaxpayer(user)) {
  // Mükellef için özel davranış
}
```

### Mükellef Fişi Onaylama
```typescript
const { approveFromTaxpayer } = useReceipt();
const { user } = useAuth();

await approveFromTaxpayer(receiptId, user?.id || '');
```

### Mükellef Fişi Reddetme
```typescript
const { rejectFromTaxpayer } = useReceipt();
const { user } = useAuth();

await rejectFromTaxpayer(receiptId, user?.id || '', 'Fiş bilgileri eksik');
```

---

## 🎨 UI Özellikleri

### Mükellef Fişleri Ekranı
- **Erişim**: Sol drawer menüsünden (📥 ikonu)
- **Yapı**: Ana fiş listesi ile birebir aynı (ReceiptCard kullanımı)
- **Badge**: "📥 Mükelleften Geldi" etiketi (turuncu)
- **Onay/Red Butonları**: Her fiş kartının altında
- **Filtreleme**: Ana liste ile aynı filtre sistemi
- **Görünüm**: Grid/liste responsive yapısı

### Tab Görünürlüğü
- **Ana Sayfa**: Müşavirler ✅ | Mükellefler ❌
- **Fişler**: Herkes ✅
- **Yeni Fiş**: Herkes ✅
- **Hesap**: Herkes ✅

### Drawer (Sol Menü) Özellikleri
- **Mükellef Fişleri** (📥): Sadece müşavirler görebilir
- Dinamik menü görünürlüğü (yetki kontrolü ile)

---

## 🔜 Gelecek Geliştirmeler

### Backend Entegrasyonu
- [ ] API endpoint'leri oluşturulacak
- [ ] Real-time bildirimler (mükellef fiş yüklediğinde)
- [ ] Firma atama yönetimi UI'ı
- [ ] Alt kullanıcı oluşturma/düzenleme ekranı
- [ ] Yetki geçmişi logları

### Ek Özellikler
- [ ] Mükellefe e-posta bildirimi (onay/red durumunda)
- [ ] Fiş onay süreci için dashboard widget'ı
- [ ] Toplu onay/red işlemleri
- [ ] Mükellef bazlı raporlama
- [ ] Firma atama yapılandırması

---

## 📝 Notlar

1. **Mock Data**: Şu anda ilk 5 receipt mükelleften gelmiş gibi işaretlenmiş (ilk 3'ü onaylı, 4-5 onay bekliyor)
2. **Backend**: Tüm işlemler şu anda mock olarak çalışıyor, backend entegrasyonu yapılacak
3. **Bildirimler**: Mükellef fiş yüklediğinde müşavirlere bildirim gönderilmesi planlanıyor
4. **Firma Atama**: Kullanıcılara firma atama UI'ı eklenmesi planlanıyor

---

## 🚀 Test Senaryoları

### Mükellef Kullanıcısı
1. Login ol (userType: TAXPAYER olacak şekilde)
2. Dashboard'u görememelisin
3. Sadece atanan firmalar için fiş ekleyebilmelisin
4. Yüklediğin fişi onaylayabilmelisin
5. Fişi silememelisin

### Alt Müşavir
1. Login ol (userType: SUB_ADVISOR)
2. Sadece atanan firmalar için işlem yapabilmelisin
3. "Mükellef Fişleri" tab'ını görebilmelisin
4. Mükelleften gelen fişleri onaylayabilir/reddedebilmelisin

### Ana Kullanıcı
1. Login ol (userType: MAIN_USER)
2. Tüm özelliklere erişebilmelisin
3. Tüm firmalar için işlem yapabilmelisin

---

## 🆘 Sorun Giderme

### "Bu işlemi yapma yetkiniz yok" hatası
- Kullanıcı tipini kontrol edin
- `user.userType` değeri doğru mu?
- Firma atamaları yapılmış mı?

### Mükellef fişleri görünmüyor
- `fetchTaxpayerReceipts()` çağrıldı mı?
- Receipt'lerde `source: TAXPAYER` ve `advisorApprovalStatus: WAITING` var mı?

### Tab görünmüyor
- `user.userType` kontrolünü tab layout'ta kontrol edin
- `href: null` doğru kullanılmış mı?

---

**Son Güncelleme**: 2024-11-04
**Versiyon**: 1.0.0
