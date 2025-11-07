/**
 * Yeni Fiş Ekranı - Modern Upload Sayfası
 * Responsive, animasyonlu ve gelişmiş UI
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Alert, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTheme, useReceipt, useFirma } from '@hooks';
import { TopBar, Button } from '@components';
import { ReceiptStatus, ReceiptType } from '@types';
import { 
  spacing as spacingSystem, 
  textStyles,
  responsiveSpacing,
  moderateScale,
  getContainerWidth,
  deviceInfo,
  gradients,
  elevation,
} from '@theme';

const spacing = spacingSystem.spacing;

export default function NewReceiptScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { createReceipt } = useReceipt();
  const { selectedFirma } = useFirma();
  const scaleAnim1 = new Animated.Value(1);
  const scaleAnim2 = new Animated.Value(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ReceiptType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Kamera kullanmak için izin vermeniz gerekiyor.');
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeriye erişmek için izin vermeniz gerekiyor.');
      return false;
    }
    return true;
  };

  const handleCameraPress = async (type: ReceiptType) => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
        setSelectedType(type);
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Kamera açılırken bir hata oluştu.');
    }
  };

  const handleGalleryPress = async (type: ReceiptType) => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUris = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...imageUris]);
        setSelectedType(type);
      }
    } catch (error) {
      console.error('Galeri hatası:', error);
      Alert.alert('Hata', 'Galeri açılırken bir hata oluştu.');
    }
  };

  const handleClearSelection = () => {
    Alert.alert(
      'Fişleri Temizle',
      'Seçili tüm fişler kaldırılsın mı?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Temizle', 
          style: 'destructive', 
          onPress: () => {
            setSelectedImages([]);
            setSelectedType(null);
          }
        },
      ]
    );
  };

  const handleProcessReceipts = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir fiş seçin.');
      return;
    }

    if (!selectedFirma) {
      Alert.alert('Uyarı', 'Lütfen önce bir firma seçin.');
      return;
    }

    setIsLoading(true);

    try {
      const count = selectedImages.length;
      
      // Her fiş için PROCESSING durumunda kayıt oluştur
      for (let i = 0; i < count; i++) {
        const imageUri = selectedImages[i];
        
        await createReceipt({
          firmaId: selectedFirma.id,
          tarih: new Date().toISOString().split('T')[0], // Bugünün tarihi
          fisNo: `PROCESSING-${Date.now()}-${i}`, // Geçici fiş no
          vkn: '', // OCR sonrası doldurulacak
          unvan: 'Analiz ediliyor...', // OCR sonrası doldurulacak
          imagePath: imageUri, // Fiş görselinin URI'si
          kdvSatirlari: [], // OCR sonrası doldurulacak
          toplamKdv: 0, // OCR sonrası doldurulacak
          toplamTutar: 0, // OCR sonrası doldurulacak
          fisType: selectedType || ReceiptType.YAZAR_KASA, // Kullanıcının seçtiği tip
          status: ReceiptStatus.PROCESSING, // İşleniyor durumu
        });
      }

      // Seçili fişleri temizle
      setSelectedImages([]);
      setSelectedType(null);
      
      // Başarı mesajı göster
      Alert.alert(
        '✅ Analize Başlandı',
        `${count} adet fiş analiz için sıraya eklendi. Fişler sekmesinden takip edebilirsiniz.`,
        [
          {
            text: 'Fişler Sekmesine Git',
            onPress: () => router.push('/(tabs)')
          },
          {
            text: 'Tamam',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Fiş ekleme hatası:', error);
      Alert.alert('Hata', 'Fişler eklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Yeni Fiş" showFirmaChip />
      
      <ScrollView style={styles.content}>
        <View style={styles.contentWrapper}>
          {/* Kasa Fişi Section - Blue */}
          <View style={[styles.categoryBar, styles.categoryBarBlue, elevation[2]]}>
            <Text style={[styles.categoryTitle, textStyles.label, { color: colors.white }]}>
              Kasa Fişi
            </Text>
          </View>
          
          {/* Kasa Fişi Actions */}
          <View style={styles.categoryActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, elevation[1]]}
              onPress={() => handleCameraPress(ReceiptType.YAZAR_KASA)}
            >
              <Text style={styles.actionButtonIcon}>📷</Text>
              <Text style={[styles.actionButtonText, textStyles.labelSmall, { color: colors.textPrimary }]}>
                Kamera ile Çek
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, elevation[1]]}
              onPress={() => handleGalleryPress(ReceiptType.YAZAR_KASA)}
            >
              <Text style={styles.actionButtonIcon}>🖼️</Text>
              <Text style={[styles.actionButtonText, textStyles.labelSmall, { color: colors.textPrimary }]}>
                Galeriden Seç
              </Text>
            </TouchableOpacity>
          </View>

          {/* Z Raporu Section - Yellow */}
          <View style={[styles.categoryBar, styles.categoryBarYellow, elevation[2]]}>
            <Text style={[styles.categoryTitle, textStyles.label, { color: '#8B6914' }]}>
              Z Raporu
            </Text>
          </View>
          
          {/* Z Raporu Actions */}
          <View style={styles.categoryActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, elevation[1]]}
              onPress={() => handleCameraPress(ReceiptType.Z_RAPORU)}
            >
              <Text style={styles.actionButtonIcon}>📷</Text>
              <Text style={[styles.actionButtonText, textStyles.labelSmall, { color: colors.textPrimary }]}>
                Kamera ile Çek
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, elevation[1]]}
              onPress={() => handleGalleryPress(ReceiptType.Z_RAPORU)}
            >
              <Text style={styles.actionButtonIcon}>🖼️</Text>
              <Text style={[styles.actionButtonText, textStyles.labelSmall, { color: colors.textPrimary }]}>
                Galeriden Seç
              </Text>
            </TouchableOpacity>
          </View>

          {/* Preview Selected Images */}
          {selectedImages.length > 0 && (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Text style={[styles.previewTitle, textStyles.labelSmall, { color: colors.textPrimary }]}>
                  Seçilen {selectedType === ReceiptType.Z_RAPORU ? 'Z Raporları' : 'Kasa Fişleri'} ({selectedImages.length})
                </Text>
                <TouchableOpacity onPress={handleClearSelection}>
                  <Text style={[textStyles.caption, { color: colors.error }]}>
                    Temizle
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.previewImage}
                  />
                ))}
              </ScrollView>
              
              {/* Process Button */}
              <View style={{ marginTop: spacing.md }}>
                <Button 
                  title={`${selectedImages.length} Fişi Analiz Et`}
                  variant="gradient" 
                  onPress={handleProcessReceipts}
                  fullWidth
                  size="medium"
                  loading={isLoading}
                />
              </View>
            </View>
          )}

          {/* Info Card - Compact */}
          <View style={[styles.infoCard, { backgroundColor: 'rgba(45, 156, 219, 0.1)' }]}>
            <Text style={[styles.infoIcon, { color: colors.info }]}>ℹ️</Text>
            <Text style={[styles.infoText, textStyles.caption, { color: colors.info }]}>
              En iyi sonuç için fişin tamamının net bir şekilde göründüğünden emin olun.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentWrapper: {
    maxWidth: getContainerWidth(),
    width: '100%',
    alignSelf: 'center',
    padding: spacing.md,
    paddingBottom: 100, // TabBar için boşluk
  },
  headerCard: {
    borderRadius: moderateScale(16),
    padding: responsiveSpacing(spacing.lg),
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.md),
  },
  iconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.xs),
  },
  icon: {
    fontSize: moderateScale(30),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: responsiveSpacing(spacing.xs),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: responsiveSpacing(spacing.md),
  },
  actionCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.md),
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  actionIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(31, 75, 143, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  actionEmoji: {
    fontSize: moderateScale(24),
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: responsiveSpacing(spacing.xxs),
    textAlign: 'center',
  },
  actionDescription: {
    marginBottom: responsiveSpacing(spacing.sm),
    textAlign: 'center',
    fontSize: moderateScale(11),
  },
  infoCard: {
    borderRadius: moderateScale(8),
    padding: responsiveSpacing(spacing.sm),
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: moderateScale(16),
    marginRight: responsiveSpacing(spacing.xs),
  },
  infoText: {
    flex: 1,
    lineHeight: 16,
    fontSize: moderateScale(11),
  },
  previewContainer: {
    marginBottom: responsiveSpacing(spacing.md),
    padding: responsiveSpacing(spacing.md),
    backgroundColor: 'rgba(31, 75, 143, 0.05)',
    borderRadius: moderateScale(12),
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewTitle: {
    fontWeight: '600',
  },
  previewImage: {
    width: moderateScale(100),
    height: moderateScale(130),
    borderRadius: moderateScale(8),
    marginRight: spacing.sm,
  },
  categoryBar: {
    borderRadius: moderateScale(10),
    padding: responsiveSpacing(spacing.sm),
    paddingHorizontal: responsiveSpacing(spacing.md),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
    minHeight: moderateScale(45),
  },
  categoryBarBlue: {
    backgroundColor: '#4A90E2',
  },
  categoryBarYellow: {
    backgroundColor: '#FFD54F',
  },
  categoryTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: responsiveSpacing(spacing.lg),
  },
  actionButton: {
    flex: 1,
    borderRadius: moderateScale(10),
    padding: responsiveSpacing(spacing.md),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: moderateScale(70),
  },
  actionButtonIcon: {
    fontSize: moderateScale(28),
    marginBottom: responsiveSpacing(spacing.xs),
  },
  actionButtonText: {
    fontWeight: '500',
    textAlign: 'center',
  },
});
