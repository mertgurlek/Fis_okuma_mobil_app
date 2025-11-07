# 🚀 Kurulum ve Çalıştırma Kılavuzu

## 📋 Ön Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS için: Mac + Xcode
- Android için: Android Studio

---

## 🔧 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut aşağıdaki paketleri yükleyecek:
- React Native ve Expo
- Navigation kütüphaneleri
- State management (Zustand)
- Yeni eklenen: `expo-linear-gradient` (gradient desteği için)

### 2. TypeScript Kontrolü (Opsiyonel)

```bash
npm run type-check
```

**Not:** İlk kurulumdan sonra tüm TypeScript hataları düzelecektir.

---

## ▶️ Uygulamayı Çalıştırma

### Development Mode

```bash
# Expo development server'ı başlat
npm start

# Veya doğrudan platform seç
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

### Expo Go İle Test

1. Telefona **Expo Go** uygulamasını indirin
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Terminal'de `npm start` çalıştırın

3. QR kodu telefonla okutun

4. Uygulama Expo Go'da açılacak

---

## 🎨 Modern Tasarım Özellikleri

### Responsive Design
✅ Telefon ve tablet desteği
✅ Dinamik spacing ve typography
✅ Grid layout (tablet'te çoklu kolon)

### Modern UI Elements
✅ Gradient backgrounds
✅ Glassmorphism effects
✅ Smooth animations
✅ Press feedback
✅ Pull-to-refresh
✅ Elevation shadows

### Ekranlar
- **Login:** Full-screen gradient, glassmorphic form
- **Home:** Animated list, responsive grid
- **Account:** Gradient profile card, statistics
- **New Receipt:** Action cards, info banner

---

## 📱 Test Senaryoları

### 1. Login Ekranı
```
✓ Gradient arka plan yüklendiği
✓ Form kartının glassmorphic olduğu
✓ Butonlarda press animasyonu
✓ Input focus animasyonu
```

### 2. Ana Ekran
```
✓ Pull-to-refresh çalıştığı
✓ Kart animasyonlarının smooth olduğu
✓ Tablet'te grid layout
✓ Telefonda tek kolon
```

### 3. Hesap Ekranı
```
✓ Profil kartının gradient olduğu
✓ İstatistik kartlarının renkli olduğu
✓ Responsive spacing
```

### 4. Responsive Test
```
✓ Farklı ekran boyutlarında test edin
✓ Tablet ve telefon arasında geçiş yapın
✓ Landscape mode'u deneyin
```

---

## 🐛 Sorun Giderme

### TypeScript Hataları
```bash
# node_modules'u temizle ve tekrar yükle
rm -rf node_modules
npm install

# Cache'i temizle
npx expo start --clear
```

### Metro Bundler Sorunları
```bash
# Expo cache'i temizle
npx expo start -c

# React Native cache'i temizle
npx react-native start --reset-cache
```

### Build Hataları
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod install && cd ..
```

---

## 📊 Performans İpuçları

1. **Native Driver:** Tüm animasyonlarda native driver kullanılıyor
2. **Lazy Loading:** FlatList ile büyük listeler optimize
3. **Memoization:** React.memo kullanımı
4. **Image Optimization:** Doğru boyutlarda resimler

---

## 🔍 Kod Yapısı

```
src/
├── theme/
│   ├── responsive.ts      # 📱 Responsive helper'lar
│   ├── animations.ts      # 🎭 Animasyon presets
│   ├── effects.ts         # ✨ Visual effects
│   ├── colors.ts          # 🎨 Renk paleti
│   ├── typography.ts      # 📝 Font sistemleri
│   ├── spacing.ts         # 📏 Spacing değerleri
│   └── shadows.ts         # 🌑 Shadow tanımları
├── components/
│   ├── forms/
│   │   ├── Button.tsx     # Modern, animated
│   │   └── Input.tsx      # Floating label, animated
│   ├── receipt/
│   │   └── ReceiptCard.tsx # Gradient bar, animated
│   └── global/
│       └── TopBar.tsx
├── hooks/
├── store/
├── types/
└── utils/
```

---

## 🎯 Kullanım Örnekleri

### Responsive Spacing
```typescript
import { responsiveSpacing, moderateScale } from '@theme';

const styles = StyleSheet.create({
  container: {
    padding: responsiveSpacing(spacing.md), // Cihaza göre ayarlanır
  },
  button: {
    height: moderateScale(48), // Scale edilir
  },
});
```

### Gradient Button
```typescript
<Button 
  title="Giriş Yap"
  variant="gradient"
  elevation={true}
  onPress={handleLogin}
/>
```

### Animated Input
```typescript
<Input
  label="Email"
  variant="outlined"
  floatingLabel={true}
  leftIcon={<MailIcon />}
/>
```

---

## 📦 Production Build

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS IPA
```bash
eas build --platform ios --profile preview
```

### Web Deploy
```bash
npx expo export:web
```

---

## 🎓 Kaynaklar

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Material Design Guidelines](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## ✅ Checklist

- [ ] `npm install` çalıştırıldı
- [ ] Expo CLI kurulu
- [ ] `npm start` ile uygulama başlatıldı
- [ ] Expo Go ile test edildi
- [ ] Gradient'ler doğru görünüyor
- [ ] Animasyonlar smooth çalışıyor
- [ ] Responsive davranış kontrol edildi

---

**Başarılar! 🎉**

Sorularınız için: Detaylı açıklamalar `DESIGN_UPDATES.md` dosyasında.
