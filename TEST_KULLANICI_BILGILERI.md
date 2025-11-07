# Test Kullanıcı Bilgileri

Bu dosya, uygulamayı test etmek için kullanabileceğiniz farklı kullanıcı tiplerini içerir.

## 🔑 Giriş Bilgileri

### 1. Ana Kullanıcı (MAIN_USER) - Tam Yetkili

**Kullanıcı Adı**: `admin` veya `main` veya herhangi bir ad  
**Şifre**: `123456` (herhangi bir şifre - minimum 6 karakter)

**Yetkiler**:
- ✅ Tüm firmalara erişim (firma ataması yok)
- ✅ Dashboard görüntüleme
- ✅ Tüm fişleri görüntüleme
- ✅ Fiş ekleme, düzenleme, silme
- ✅ Muhasebeleştirme yapabilme
- ✅ Mükelleften gelen fişleri onaylama/reddetme
- ✅ Tüm özelliklere tam erişim

---

### 2. Alt Müşavir (SUB_ADVISOR) - Atanan Firmalar

**Kullanıcı Adı**: `musavir` veya `advisor`  
**Şifre**: `123456` (herhangi bir şifre - minimum 6 karakter)

**Yetkiler**:
- ✅ Atanan firmalara erişim (Firma 1 ve Firma 2)
- ✅ Dashboard görüntüleme
- ✅ Atanan firmaların fişlerini görüntüleme
- ✅ Fiş ekleme, düzenleme, silme
- ✅ Muhasebeleştirme yapabilme
- ✅ Mükelleften gelen fişleri onaylama/reddetme

---

### 3. Mükellef (TAXPAYER) - Kısıtlı Yetki

**Kullanıcı Adı**: `mukellef` veya `taxpayer`  
**Şifre**: `123456` (herhangi bir şifre - minimum 6 karakter)

**Yetkiler**:
- ✅ Sadece atanan firmaya erişim (Firma 1)
- ❌ Dashboard göremez
- ✅ Sadece fiş ekleme
- ✅ Eklediği fişi onaylama
- ❌ Fiş silme YAPAMAZ
- ❌ Muhasebeleştirme YAPAMAZ
- ❌ Mükellef fişlerini göremez

---

### 4. Demo Modu (SUB_ADVISOR)

**Giriş**: Login ekranında "Demo Modunda Deneyin" butonuna tıklayın

**Yetkiler**:
- Alt müşavir yetkileriyle aynı
- Firma 1 ve Firma 2'ye atanmış
- Dashboard erişimi var
- Mükellef fişlerini görebilir

---

## 🎯 Test Senaryoları

### Ana Kullanıcı Testi

1. Kullanıcı adı: `admin`, Şifre: `123456`
2. Dashboard'a erişebildiğinizi kontrol edin
3. Tüm firmalar için işlem yapabildiğinizi kontrol edin
4. Drawer menüsünden "Mükellef Fişleri"ne erişebildiğinizi kontrol edin
5. Fiş ekleme, düzenleme, silme işlemlerini test edin

### Alt Müşavir Testi

1. Kullanıcı adı: `musavir`, Şifre: `123456`
2. Dashboard'a erişebildiğinizi kontrol edin
3. Sadece atanan firmalar (Firma 1, Firma 2) görünmeli
4. Mükellef fişlerini onaylayabildiğinizi test edin
5. Fiş işlemlerini yapabildiğinizi kontrol edin

### Mükellef Testi

1. Kullanıcı adı: `mukellef`, Şifre: `123456`
2. Dashboard'ın görünmediğini kontrol edin
3. Sadece "Fişler", "Yeni Fiş", "Hesap" tablarını görebilmelisiniz
4. Fiş ekleyebildiğinizi ama silemediğinizi kontrol edin
5. Drawer menüsünde "Mükellef Fişleri" seçeneğinin olmadığını kontrol edin

---

## 📊 Kullanıcı Karşılaştırma Tablosu

| Özellik | Ana Kullanıcı | Alt Müşavir | Mükellef |
|---------|---------------|-------------|----------|
| Dashboard | ✅ | ✅ | ❌ |
| Tüm Firmalar | ✅ | ❌ | ❌ |
| Atanan Firmalar | N/A | ✅ (1,2) | ✅ (1) |
| Fiş Ekleme | ✅ | ✅ | ✅ |
| Fiş Düzenleme | ✅ | ✅ | ✅ |
| Fiş Silme | ✅ | ✅ | ❌ |
| Muhasebeleştirme | ✅ | ✅ | ❌ |
| Mükellef Fişleri | ✅ | ✅ | ❌ |

---

## 💡 İpuçları

1. **Şifre**: Tüm kullanıcılar için minimum 6 karakter gerekli
2. **Büyük/Küçük Harf**: Kullanıcı adları büyük/küçük harf duyarlı değil
3. **Hızlı Geçiş**: Çıkış yapıp farklı kullanıcı tipiyle tekrar giriş yaparak hızlıca test edebilirsiniz
4. **Demo Mod**: Hızlı test için demo modu kullanabilirsiniz

---

## 🔄 Kullanıcı Değiştirme

Farklı bir kullanıcı tipi ile test etmek için:

1. Sağ alttaki "Hesap" tabına gidin
2. "Çıkış Yap" butonuna tıklayın
3. Login ekranında istediğiniz kullanıcı adı ile giriş yapın

---

**Son Güncelleme**: 2024-11-05  
**Versiyon**: 1.0.0
