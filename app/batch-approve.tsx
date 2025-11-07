/**
 * Seri Onay Ekranı
 * Eskiden yeniye doğru fişleri teker teker onaylama
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useReceipt as useReceiptHook } from '@hooks';
import { Button, TopBar, DrawerMenu, Input } from '@components';
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
import { Receipt, ReceiptStatus, ReceiptCategory } from '@types';

const spacing = spacingSystem.spacing;

function BatchApproveContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { receipts, approveReceipt, updateReceipt, isLoading } = useReceiptHook();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  
  const isTablet = width >= 768;

  // Verified (onay bekleyen) fişleri eskiden yeniye doğru sırala
  const pendingReceipts = receipts
    .filter((r) => r.status === ReceiptStatus.VERIFIED)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  // Editable form data
  const [formData, setFormData] = useState({
    tarih: '',
    fisNo: '',
    vkn: '',
    unvan: '',
    toplamKdv: '',
    toplamTutar: '',
    kdvSatirlari: [] as any[],
    category: undefined as ReceiptCategory | undefined,
    tags: [] as string[],
  });
  const [isEdited, setIsEdited] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const currentReceipt = pendingReceipts[currentIndex];
  const totalCount = pendingReceipts.length;
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  // Update form data when receipt changes
  useEffect(() => {
    if (currentReceipt) {
      setFormData({
        tarih: currentReceipt.tarih,
        fisNo: currentReceipt.fisNo,
        vkn: currentReceipt.vkn,
        unvan: currentReceipt.unvan,
        toplamKdv: currentReceipt.toplamKdv.toString(),
        toplamTutar: currentReceipt.toplamTutar.toString(),
        kdvSatirlari: currentReceipt.kdvSatirlari || [],
        category: currentReceipt.category,
        tags: currentReceipt.tags || [],
      });
      setIsEdited(false);
      setChangedFields([]);
    }
  }, [currentReceipt]);

  // Form field handlers
  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    const originalValue = currentReceipt?.[field as keyof typeof currentReceipt]?.toString();
    if (value !== originalValue && !changedFields.includes(field)) {
      setChangedFields([...changedFields, field]);
      setIsEdited(true);
    }
  };

  const handleAddKdvLine = () => {
    const newKdvLine = {
      id: Date.now().toString(),
      oran: 20,
      matrah: 0,
      kdvTutari: 0,
    };
    setFormData({
      ...formData,
      kdvSatirlari: [...formData.kdvSatirlari, newKdvLine],
    });
    setIsEdited(true);
  };

  const handleRemoveKdvLine = (index: number) => {
    const updatedKdvSatirlari = formData.kdvSatirlari.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      kdvSatirlari: updatedKdvSatirlari,
    });
    setIsEdited(true);
  };

  const handleUpdateKdvLine = (index: number, field: 'oran' | 'matrah' | 'kdvTutari', value: string) => {
    const updatedKdvSatirlari = [...formData.kdvSatirlari];
    updatedKdvSatirlari[index] = {
      ...updatedKdvSatirlari[index],
      [field]: parseFloat(value) || 0,
    };
    
    if (field === 'matrah' || field === 'oran') {
      const matrah = field === 'matrah' ? (parseFloat(value) || 0) : updatedKdvSatirlari[index].matrah;
      const oran = field === 'oran' ? (parseFloat(value) || 0) : updatedKdvSatirlari[index].oran;
      updatedKdvSatirlari[index].kdvTutari = (matrah * oran) / 100;
    }
    
    setFormData({
      ...formData,
      kdvSatirlari: updatedKdvSatirlari,
    });
    setIsEdited(true);
  };

  const handleCategoryChange = (category: ReceiptCategory) => {
    setFormData({
      ...formData,
      category,
    });
    setIsEdited(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
      setIsEdited(true);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
    setIsEdited(true);
  };

  const handleApprove = async () => {
    if (currentReceipt) {
      // Update if edited
      if (isEdited) {
        await updateReceipt({
          id: currentReceipt.id,
          ...formData,
          toplamKdv: parseFloat(formData.toplamKdv),
          toplamTutar: parseFloat(formData.toplamTutar),
          kdvSatirlari: formData.kdvSatirlari,
          category: formData.category,
          tags: formData.tags,
        } as any);
      }
      
      await approveReceipt(currentReceipt.id);
      setApprovedCount(approvedCount + 1);
      goToNext();
    }
  };

  const handleSkip = () => {
    setSkippedCount(skippedCount + 1);
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
      'Seri Onay Tamamlandı',
      `✅ ${approvedCount} fiş onaylandı\n⏭️ ${skippedCount} fiş atlandı`,
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
      `Şu ana kadar ${approvedCount} fiş onaylandı.`,
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
          title="Seri Onay" 
          showFirmaChip 
        />
        <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={[textStyles.h2, { color: colors.textPrimary, marginTop: spacing.md }]}>
            Tüm Fişler Onaylı
          </Text>
          <Text style={[textStyles.body, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Onay bekleyen fiş bulunmuyor
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
        title="Seri Onay" 
        showFirmaChip 
      />

      {/* Progress Bar with Stats - Ultra Compact */}
      <View style={styles.progressContainer}>
        <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
          {currentIndex + 1} / {totalCount} Fiş
        </Text>
        
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <LinearGradient
            colors={gradients.primaryLight}
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
            <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Atlanan</Text>
            <Text style={[textStyles.labelLarge, { color: '#FB8C00', fontWeight: '600' }]}>
              {skippedCount}
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
        <View style={[styles.card, { backgroundColor: colors.surface }, elevation[2]]}>
          {/* Receipt Details - Split Layout for Tablet */}
          <View style={[styles.cardBody, isTablet && styles.cardBodyTablet]}>
            {/* Left Column - Details */}
            <View style={[styles.detailsColumn, isTablet && styles.detailsColumnTablet]}>
              {/* Changed Fields Info */}
              {isEdited && changedFields.length > 0 && (
                <View style={[styles.infoBox, { backgroundColor: 'rgba(251, 140, 0, 0.1)' }]}>
                  <Text style={[textStyles.caption, { color: '#FB8C00' }]}>
                    📝 {changedFields.length} alan değiştirildi
                  </Text>
                </View>
              )}

              {/* Editable 2x2 Grid Layout */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Tarih"
                    value={formData.tarih}
                    onChangeText={(text: string) => handleFieldChange('tarih', text)}
                    variant="outlined"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Fiş No"
                    value={formData.fisNo}
                    onChangeText={(text: string) => handleFieldChange('fisNo', text)}
                    variant="outlined"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="VKN"
                    value={formData.vkn}
                    onChangeText={(text: string) => handleFieldChange('vkn', text)}
                    variant="outlined"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Ünvan"
                    value={formData.unvan}
                    onChangeText={(text: string) => handleFieldChange('unvan', text)}
                    variant="outlined"
                  />
                </View>
              </View>

              {/* KDV Satırları - Editable */}
              <View style={styles.kdvSection}>
                <View style={styles.kdvHeader}>
                  <Text style={[textStyles.labelSmall, { color: colors.textPrimary }]}>
                    📊 KDV Satırları
                  </Text>
                  <TouchableOpacity
                    style={[styles.addKdvButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddKdvLine}
                  >
                    <Text style={[textStyles.caption, { color: colors.white }]}>+ Ekle</Text>
                  </TouchableOpacity>
                </View>

                {formData.kdvSatirlari.map((kdv: any, index: number) => (
                  <View key={index} style={[styles.kdvEditRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.kdvEditFields}>
                      <View style={styles.kdvEditCol}>
                        <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: 2 }]}>
                          KDV %
                        </Text>
                        <Input
                          value={kdv.oran.toString()}
                          onChangeText={(text) => handleUpdateKdvLine(index, 'oran', text)}
                          keyboardType="decimal-pad"
                          variant="outlined"
                          style={styles.kdvInput}
                        />
                      </View>
                      <View style={styles.kdvEditCol}>
                        <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: 2 }]}>
                          Matrah
                        </Text>
                        <Input
                          value={kdv.matrah.toString()}
                          onChangeText={(text) => handleUpdateKdvLine(index, 'matrah', text)}
                          keyboardType="decimal-pad"
                          variant="outlined"
                          style={styles.kdvInput}
                        />
                      </View>
                      <View style={styles.kdvEditCol}>
                        <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: 2 }]}>
                          KDV Tutarı
                        </Text>
                        <Input
                          value={kdv.kdvTutari.toFixed(2)}
                          onChangeText={(text) => handleUpdateKdvLine(index, 'kdvTutari', text)}
                          keyboardType="decimal-pad"
                          variant="outlined"
                          style={styles.kdvInput}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.removeKdvButton, { backgroundColor: colors.error + '15' }]}
                      onPress={() => handleRemoveKdvLine(index)}
                    >
                      <Text style={[textStyles.caption, { color: colors.error }]}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {formData.kdvSatirlari.length === 0 && (
                  <View style={[styles.emptyKdvBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                      KDV satırı bulunamadı
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.dividerThin, { backgroundColor: colors.border }]} />

              {/* Toplam KDV ve Tutar */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Toplam KDV"
                    value={formData.toplamKdv}
                    onChangeText={(text: string) => handleFieldChange('toplamKdv', text)}
                    variant="outlined"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Toplam Tutar"
                    value={formData.toplamTutar}
                    onChangeText={(text: string) => handleFieldChange('toplamTutar', text)}
                    variant="outlined"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

            </View>

            {/* Right Column - Receipt Image */}
            <View style={[styles.imageColumn, isTablet && styles.imageColumnTablet]}>
              <LinearGradient
                colors={['#F5F7FA', '#E8EBF0']}
                style={[styles.imagePlaceholder, isTablet && styles.imagePlaceholderTablet]}
              >
                <Text style={styles.imageIcon}>📄</Text>
                <Text style={[textStyles.caption, { color: colors.textTertiary, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.sm }]}>
                  {currentReceipt?.imagePath ? currentReceipt.imagePath.split('\\').pop() : 'fiş görseli'}
                </Text>
                <Text style={[textStyles.caption, { color: colors.info, marginTop: spacing.md, fontStyle: 'italic' }]}>
                  Görsel yakında eklenecek
                </Text>
              </LinearGradient>
              
              {/* AI Güven Skoru - Görselin altında */}
              {currentReceipt?.ocrData && (
                <View style={styles.ocrBelowImage}>
                  <Text style={[textStyles.caption, { color: colors.primary, fontWeight: '600' }]}>
                    🤖 AI Güven Skoru: %{(currentReceipt.ocrData.confidence * 100).toFixed(0)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions Info */}
        <View style={styles.tipsCard}>
          <Text style={[textStyles.labelSmall, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
            💡 İpucu
          </Text>
          <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
            • Onay: Fişi doğrudan onaylar ve sonrakine geçer{'\n'}
            • Atla: Fişi atlar, daha sonra manuel onaylanabilir{'\n'}
            • Detay: Detaylı inceleme için fiş detay ekranına gider{'\n'}
            • Düzenleme: Fiş alanları hatalı ise burada düzeltebilirsiniz
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons - 4 Button Layout */}
      <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }, elevation[3]]}>
        <TouchableOpacity 
          style={[styles.compactButtonSmall, { backgroundColor: colors.bg }]}
          onPress={handleExit}
        >
          <Text style={[textStyles.caption, { color: colors.textSecondary }]}>Çık</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.compactButtonSmall, { borderColor: colors.textTertiary, borderWidth: 1 }]}
          onPress={() => router.push(`/receipt/${currentReceipt?.id}`)}
        >
          <Text style={[textStyles.caption, { color: colors.textSecondary, fontWeight: '600' }]}>Detay</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.compactButtonSmall, { borderColor: colors.primary, borderWidth: 1 }]}
          onPress={handleSkip}
        >
          <Text style={[textStyles.caption, { color: colors.primary, fontWeight: '600' }]}>Atla</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.compactButtonPrimary, elevation[2]]}
          onPress={handleApprove}
          disabled={isLoading}
        >
          <LinearGradient
            colors={gradients.primaryLight}
            style={styles.gradientButton}
          >
            <Text style={[textStyles.labelSmall, { color: colors.white, fontWeight: '600' }]}>
              {isLoading ? 'Yükleniyor...' : 'Onayla'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function BatchApproveScreen() {
  return (
    <DrawerProvider>
      <BatchApproveContent />
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
  cardHeader: {
    paddingVertical: spacing.sm,
    paddingHorizontal: responsiveSpacing(spacing.md),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: moderateScale(12),
  },
  cardBody: {
    padding: responsiveSpacing(spacing.sm),
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
  imagePreview: {
    marginBottom: responsiveSpacing(spacing.md),
  },
  imagePlaceholder: {
    height: moderateScale(120),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderTablet: {
    height: '100%',
    minHeight: moderateScale(400),
  },
  imageIcon: {
    fontSize: moderateScale(40),
    marginBottom: spacing.xs,
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  gridItem: {
    width: '50%',
    marginBottom: spacing.xs,
    paddingRight: spacing.xs,
  },
  gridLabel: {
    marginBottom: 2,
  },
  gridValue: {
    fontWeight: '500',
  },
  infoBox: {
    marginBottom: spacing.xs,
    padding: responsiveSpacing(spacing.xs),
    borderRadius: moderateScale(8),
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  formCol: {
    flex: 1,
    paddingHorizontal: spacing.xxs,
  },
  kdvSection: {
    marginBottom: spacing.sm,
  },
  kdvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addKdvButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: moderateScale(6),
  },
  kdvEditRow: {
    padding: responsiveSpacing(spacing.xs),
    marginBottom: spacing.xs,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  kdvEditFields: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  kdvEditCol: {
    flex: 1,
  },
  kdvInput: {
    minHeight: 40,
  },
  removeKdvButton: {
    width: 36,
    height: 36,
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  emptyKdvBox: {
    padding: spacing.md,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    alignItems: 'center',
  },
  kdvSectionCompact: {
    marginBottom: spacing.sm,
  },
  kdvRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 75, 143, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(6),
    marginBottom: 4,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
  dividerThin: {
    height: 1,
    marginVertical: spacing.sm,
  },
  totalRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ocrBelowImage: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(6),
    alignItems: 'center',
  },
  tipsCard: {
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  actionBar: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.sm),
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
    gap: spacing.sm,
  },
  compactButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButtonSmall: {
    flex: 0.8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButtonPrimary: {
    flex: 1.5,
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
