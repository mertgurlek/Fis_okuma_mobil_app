/**
 * Mükelleften Gelen Fişler Ekranı - Seri İnceleme
 * Fişleri tek tek göster, görsel + detay + onay/red
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useReceipt, useAuth } from '@hooks';
import { Button, TopBar, DrawerMenu } from '@components';
import { DrawerProvider, useDrawer } from '../src/contexts/DrawerContext';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
  gradients,
} from '@theme';
import { Receipt, ReceiptSource, AdvisorApprovalStatus, UserType } from '@types';

const spacing = spacingSystem.spacing;

function TaxpayerReceiptsContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { receipts, approveFromTaxpayer, rejectFromTaxpayer, loadReceipts, isLoading } = useReceipt();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  
  const isTablet = width >= 768;

  // Sadece müşavirler bu ekranı görebilir
  useEffect(() => {
    if (user && user.userType === UserType.TAXPAYER) {
      Alert.alert('Yetki Hatası', 'Bu ekrana erişim yetkiniz yok.');
      router.back();
    }
  }, [user]);

  // Mükelleften gelen ve onay bekleyen fişleri eskiden yeniye sırala
  const taxpayerPendingReceipts = receipts
    .filter((r) => r.source === ReceiptSource.TAXPAYER && 
                   r.advisorApprovalStatus === AdvisorApprovalStatus.WAITING)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const currentReceipt = taxpayerPendingReceipts[currentIndex];
  const totalCount = taxpayerPendingReceipts.length;
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  const handleApprove = async () => {
    if (currentReceipt) {
      try {
        await approveFromTaxpayer(currentReceipt.id, user?.id || '');
        setApprovedCount(approvedCount + 1);
        await loadReceipts(); // Listeyi yenile
        goToNext();
      } catch (error) {
        Alert.alert('Hata', 'Fiş onaylanırken bir hata oluştu.');
      }
    }
  };

  const handleRejectStart = () => {
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Uyarı', 'Lütfen ret nedenini giriniz.');
      return;
    }

    if (currentReceipt) {
      try {
        await rejectFromTaxpayer(currentReceipt.id, user?.id || '', rejectionReason);
        setRejectedCount(rejectedCount + 1);
        setShowRejectModal(false);
        setRejectionReason('');
        await loadReceipts(); // Listeyi yenile
        goToNext();
      } catch (error) {
        Alert.alert('Hata', 'Fiş reddedilirken bir hata oluştu.');
      }
    }
  };

  const handleSkip = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Tamamlandı
      showSummary();
    }
  };

  const showSummary = () => {
    Alert.alert(
      'İnceleme Tamamlandı',
      `✅ ${approvedCount} fiş onaylandı\n❌ ${rejectedCount} fiş reddedildi`,
      [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleExit = () => {
    Alert.alert(
      'Çıkmak istediğinizden emin misiniz?',
      `Şu ana kadar ${approvedCount} fiş onaylandı, ${rejectedCount} fiş reddedildi.`,
      [
        { text: 'Devam Et', style: 'cancel' },
        {
          text: 'Çık',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (totalCount === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <TopBar 
          title="Mükellef Fişleri" 
          showFirmaChip 
        />
        <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📥</Text>
          <Text style={[textStyles.h2, { color: colors.textPrimary, marginTop: spacing.md }]}>
            Onay Bekleyen Fiş Yok
          </Text>
          <Text style={[textStyles.body, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Mükelleflerden gelen tüm fişler incelendi
          </Text>
          <View style={{ marginTop: spacing.xl }}>
            <Button title="Geri Dön" variant="outline" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar 
        title="Mükellef Fişleri" 
        showFirmaChip 
      />

      {/* Progress Bar with Stats */}
      <View style={styles.progressContainer}>
        <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
          {currentIndex + 1} / {totalCount} Fiş
        </Text>
        
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <LinearGradient
            colors={['#FF6B35', '#FFA26B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
        
        {/* Stats on the right */}
        <View style={styles.statsInline}>
          <View style={styles.statItemInline}>
            <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Onaylanan</Text>
            <Text style={[textStyles.labelLarge, { color: '#34A853', fontWeight: '600' }]}>
              {approvedCount}
            </Text>
          </View>
          <View style={styles.statItemInline}>
            <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Reddedilen</Text>
            <Text style={[textStyles.labelLarge, { color: '#EA4335', fontWeight: '600' }]}>
              {rejectedCount}
            </Text>
          </View>
          <View style={styles.statItemInline}>
            <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Kalan</Text>
            <Text style={[textStyles.labelLarge, { color: colors.textSecondary, fontWeight: '600' }]}>
              {totalCount - currentIndex - 1}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Receipt Card */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mükelleften Geldi Badge */}
        <View style={styles.taxpayerBadgeContainer}>
          <View style={styles.taxpayerBadge}>
            <Text style={styles.taxpayerBadgeText}>📥 Mükelleften Gelen Fiş</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }, elevation[2]]}>
          {/* Receipt Details - Split Layout for Tablet */}
          <View style={[styles.cardBody, isTablet && styles.cardBodyTablet]}>
            {/* Left Column - Details */}
            <View style={[styles.detailsColumn, isTablet && styles.detailsColumnTablet]}>
              {/* Compact 2x2 Grid Layout */}
              <View style={styles.compactGrid}>
                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, textStyles.caption, { color: colors.textSecondary }]}>
                    Tarih
                  </Text>
                  <Text style={[styles.gridValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
                    {currentReceipt?.tarih || '-'}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, textStyles.caption, { color: colors.textSecondary }]}>
                    Fiş No
                  </Text>
                  <Text style={[styles.gridValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
                    {currentReceipt?.fisNo || '-'}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, textStyles.caption, { color: colors.textSecondary }]}>
                    VKN
                  </Text>
                  <Text style={[styles.gridValue, textStyles.caption, { color: colors.textPrimary }]}>
                    {currentReceipt?.vkn || '-'}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={[styles.gridLabel, textStyles.caption, { color: colors.textSecondary }]}>
                    Ünvan
                  </Text>
                  <Text style={[styles.gridValue, textStyles.caption, { color: colors.textPrimary, fontWeight: '600' }]} numberOfLines={2}>
                    {currentReceipt?.unvan || '-'}
                  </Text>
                </View>
              </View>

              {/* KDV Matrahları - Kompakt */}
              {currentReceipt?.kdvSatirlari && currentReceipt.kdvSatirlari.length > 0 && (
                <View style={styles.kdvSectionCompact}>
                  <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: 2 }]}>
                    KDV Matrahları
                  </Text>
                  {currentReceipt.kdvSatirlari.map((kdv, index) => (
                    <View key={index} style={styles.kdvRowCompact}>
                      <Text style={[textStyles.caption, { color: '#FF6B35', fontWeight: '600', minWidth: 30 }]}>
                        %{kdv.oran}
                      </Text>
                      <Text style={[textStyles.caption, { color: colors.textSecondary, flex: 1 }]}>
                        ₺{kdv.matrah.toFixed(2)}
                      </Text>
                      <Text style={[textStyles.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
                        ₺{kdv.kdvTutari.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={[styles.dividerThin, { backgroundColor: colors.border }]} />

              <View style={styles.totalRowCompact}>
                <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Toplam KDV
                </Text>
                <Text style={[textStyles.labelLarge, { color: '#FF6B35', fontWeight: '600' }]}>
                  ₺{currentReceipt?.toplamKdv?.toFixed(2) || '0.00'}
                </Text>
              </View>

              <View style={styles.totalRowCompact}>
                <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Toplam Tutar
                </Text>
                <Text style={[textStyles.h3, { color: colors.textPrimary, fontWeight: '700' }]}>
                  ₺{currentReceipt?.toplamTutar?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>

            {/* Right Column - Receipt Image */}
            <View style={[styles.imageColumn, isTablet && styles.imageColumnTablet]}>
              <LinearGradient
                colors={['#FFF4E6', '#FFE8CC']}
                style={[styles.imagePlaceholder, isTablet && styles.imagePlaceholderTablet]}
              >
                <Text style={styles.imageIcon}>📄</Text>
                <Text style={[textStyles.caption, { color: colors.textTertiary, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.sm }]}>
                  {currentReceipt?.imagePath ? currentReceipt.imagePath.split('\\').pop() : 'fiş görseli'}
                </Text>
                <Text style={[textStyles.caption, { color: '#FF6B35', marginTop: spacing.md, fontStyle: 'italic' }]}>
                  Görsel yakında eklenecek
                </Text>
              </LinearGradient>
              
              {/* AI Güven Skoru */}
              {currentReceipt?.ocrData && (
                <View style={styles.ocrBelowImage}>
                  <Text style={[textStyles.caption, { color: '#FF6B35', fontWeight: '600' }]}>
                    🤖 AI Güven Skoru: %{(currentReceipt.ocrData.confidence * 100).toFixed(0)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Warning Card - Muhasebe Uyarısı */}
        <View style={[styles.warningCard, { backgroundColor: '#FFF4E6', borderColor: '#FF6B35' }]}>
          <Text style={[textStyles.labelSmall, { color: '#FF6B35', marginBottom: spacing.xs }]}>
            ⚠️ Muhasebe Kontrolü
          </Text>
          <Text style={[textStyles.caption, { color: '#9E5A00' }]}>
            Bu fişin firma işi ile ilgili olduğundan emin olun. Örneğin: Tekstil firması için çocuk oyuncağı gideri muhasebeleştirilmemelidir.
          </Text>
        </View>

        {/* Quick Actions Info */}
        <View style={styles.tipsCard}>
          <Text style={[textStyles.labelSmall, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
            💡 İpucu
          </Text>
          <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
            • Onayla: Fişi genel havuza ekler (mükelleften geldi etiketi ile){'\n'}
            • Reddet: Fişi reddeder ve mükellefe bildirim gönderir{'\n'}
            • Atla: Fişi şimdilik atlayıp sonra incelersin
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons - Compact */}
      <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }, elevation[3]]}>
        <TouchableOpacity 
          style={[styles.compactButton, { backgroundColor: colors.bg }]}
          onPress={handleExit}
        >
          <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>Çık</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.compactButton, { borderColor: colors.textSecondary, borderWidth: 1 }]}
          onPress={handleSkip}
        >
          <Text style={[textStyles.labelSmall, { color: colors.textSecondary, fontWeight: '600' }]}>Atla</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.compactButtonDanger, elevation[2]]}
          onPress={handleRejectStart}
          disabled={isLoading}
        >
          <View style={[styles.gradientButton, { backgroundColor: colors.error }]}>
            <Text style={[textStyles.labelSmall, { color: colors.white, fontWeight: '600' }]}>
              Reddet
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.compactButtonPrimary, elevation[2]]}
          onPress={handleApprove}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#FF6B35', '#FFA26B']}
            style={styles.gradientButton}
          >
            <Text style={[textStyles.labelSmall, { color: colors.white, fontWeight: '600' }]}>
              {isLoading ? 'Yükleniyor...' : 'Onayla'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Reject Modal */}
      {showRejectModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, elevation[5]]}>
            <Text style={[textStyles.h3, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Fişi Reddet
            </Text>
            <Text style={[textStyles.body, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              Lütfen ret nedenini açıklayınız:
            </Text>
            
            <TextInput
              style={[
                styles.reasonInput,
                { 
                  backgroundColor: colors.bg,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                }
              ]}
              placeholder="Örn: Firma işi ile ilgili değil"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={handleRejectConfirm}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Reddet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function TaxpayerReceiptsScreen() {
  return (
    <DrawerProvider>
      <TaxpayerReceiptsContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: moderateScale(80),
  },
  taxpayerBadgeContainer: {
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  taxpayerBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxpayerBadgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingVertical: spacing.xs,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  statsInline: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItemInline: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: responsiveSpacing(spacing.md),
  },
  card: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: spacing.md,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  cardBody: {
    padding: responsiveSpacing(spacing.md),
  },
  cardBodyTablet: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailsColumn: {
    flex: 1,
  },
  detailsColumnTablet: {
    flex: 1,
  },
  imageColumn: {
    marginTop: spacing.md,
  },
  imageColumnTablet: {
    flex: 1,
    marginTop: 0,
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.xs,
  },
  gridLabel: {
    marginBottom: 2,
  },
  gridValue: {
    fontWeight: '600',
  },
  kdvSectionCompact: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  kdvRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: spacing.xs,
  },
  dividerThin: {
    height: 1,
    marginVertical: spacing.sm,
  },
  totalRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  imagePlaceholder: {
    aspectRatio: 1,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  imagePlaceholderTablet: {
    aspectRatio: 0.7,
  },
  imageIcon: {
    fontSize: moderateScale(60),
  },
  ocrBelowImage: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  warningCard: {
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    marginBottom: spacing.md,
    borderWidth: 1,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  tipsCard: {
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(100, 150, 255, 0.05)',
    marginBottom: spacing.md,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  actionBar: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  compactButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  compactButtonDanger: {
    flex: 1,
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  compactButtonPrimary: {
    flex: 1,
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(8),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: moderateScale(20),
    padding: spacing.xl,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
