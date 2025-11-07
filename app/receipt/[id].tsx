/**
 * Fiş Detay & Onay Ekranı
 * Split View: Sol tarafta görsel, sağ tarafta editlenebilir form
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme, useReceipt } from '@hooks';
import { Button, Input, TopBar, ReceiptImageViewer, DrawerMenu } from '@components';
import { DrawerProvider, useDrawer } from '../../src/contexts/DrawerContext';
import { ReceiptCategory } from '@types';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
} from '@theme';

const spacing = spacingSystem.spacing;

function ReceiptDetailContent() {
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { receipts, approveReceipt, updateReceipt, isLoading } = useReceipt();
  
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  
  const receipt = receipts.find((r) => r.id === id);
  const [isEdited, setIsEdited] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Editable form data
  const [formData, setFormData] = useState({
    tarih: receipt?.tarih || '',
    fisNo: receipt?.fisNo || '',
    vkn: receipt?.vkn || '',
    unvan: receipt?.unvan || '',
    toplamKdv: receipt?.toplamKdv?.toString() || '',
    toplamTutar: receipt?.toplamTutar?.toString() || '',
    kdvSatirlari: receipt?.kdvSatirlari || [],
    category: receipt?.category,
    tags: receipt?.tags || [],
  });

  const [newTag, setNewTag] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (receipt) {
      setFormData({
        tarih: receipt.tarih,
        fisNo: receipt.fisNo,
        vkn: receipt.vkn,
        unvan: receipt.unvan,
        toplamKdv: receipt.toplamKdv.toString(),
        toplamTutar: receipt.toplamTutar.toString(),
        kdvSatirlari: receipt.kdvSatirlari || [],
        category: receipt.category,
        tags: receipt.tags || [],
      });
    }
  }, [receipt]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Track changes
    const originalValue = receipt?.[field as keyof typeof receipt]?.toString();
    if (value !== originalValue && !changedFields.includes(field)) {
      setChangedFields([...changedFields, field]);
      setIsEdited(true);
    }
  };

  // KDV Satırı Ekleme
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

  // KDV Satırı Silme
  const handleRemoveKdvLine = (index: number) => {
    const updatedKdvSatirlari = formData.kdvSatirlari.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      kdvSatirlari: updatedKdvSatirlari,
    });
    setIsEdited(true);
  };

  // KDV Satırı Güncelleme
  const handleUpdateKdvLine = (index: number, field: 'oran' | 'matrah' | 'kdvTutari', value: string) => {
    const updatedKdvSatirlari = [...formData.kdvSatirlari];
    updatedKdvSatirlari[index] = {
      ...updatedKdvSatirlari[index],
      [field]: parseFloat(value) || 0,
    };
    
    // Otomatik KDV hesaplama
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

  // Kategori Değiştirme
  const handleCategoryChange = (category: ReceiptCategory) => {
    setFormData({
      ...formData,
      category,
    });
    setIsEdited(true);
  };

  // Etiket Ekleme
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

  // Etiket Silme
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
    setIsEdited(true);
  };

  const handleApprove = () => {
    const message = isEdited
      ? `${changedFields.length} alan AI çıktısından farklı: ${changedFields.join(', ')}.\n\nBu fişi onaylamak istiyor musunuz?`
      : 'Bu fişi onaylamak istiyor musunuz? Onayladıktan sonra düzenleyemezsiniz.';

    Alert.alert('Fiş Onaylama', message, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Onayla',
        onPress: async () => {
          if (receipt) {
            // Update if edited
            if (isEdited) {
              await updateReceipt({
                id: receipt.id,
                ...formData,
                toplamKdv: parseFloat(formData.toplamKdv),
                toplamTutar: parseFloat(formData.toplamTutar),
                kdvSatirlari: formData.kdvSatirlari,
                category: formData.category,
                tags: formData.tags,
              } as any);
            }
            
            // Approve
            await approveReceipt(receipt.id);
            
            Alert.alert('Başarılı', 'Fiş onaylandı', [
              { text: 'Tamam', onPress: () => router.back() },
            ]);
          }
        },
      },
    ]);
  };

  const handleSaveDraft = async () => {
    if (receipt && isEdited) {
      await updateReceipt({
        id: receipt.id,
        ...formData,
        toplamKdv: parseFloat(formData.toplamKdv),
        toplamTutar: parseFloat(formData.toplamTutar),
        kdvSatirlari: formData.kdvSatirlari,
        category: formData.category,
        tags: formData.tags,
      } as any);
      
      Alert.alert('Kaydedildi', 'Taslak olarak kaydedildi');
    }
  };

  if (!receipt) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <TopBar 
          title="Fiş Detayı" 
          showBackButton 
          onBackPress={() => router.back()} 
        />
        <View style={styles.centerContent}>
          <Text style={[textStyles.body, { color: colors.textSecondary }]}>
            Fiş bulunamadı
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar 
        title="Fiş Detayı" 
        showFirmaChip 
        showBackButton 
        onBackPress={() => router.back()} 
      />

      <View style={styles.contentContainer}>
        {/* Split View Layout */}
        <View style={[styles.splitContainer, isTablet && styles.splitContainerTablet, isLargeTablet && styles.splitContainerLarge]}>
          {/* Left Panel - Image */}
          <TouchableOpacity 
            style={[styles.imagePanel, isTablet && styles.imagePanelTablet, isLargeTablet && styles.imagePanelLarge]}
            onPress={() => setShowImageViewer(true)}
            activeOpacity={0.9}
          >
            {receipt.imagePath ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: receipt.imagePath }}
                  style={styles.receiptImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>🔍 Büyüt</Text>
                </View>
              </View>
            ) : (
              <LinearGradient
                colors={['#F5F7FA', '#E8EBF0']}
                style={styles.imagePlaceholder}
              >
                <Text style={styles.imagePlaceholderIcon}>📄</Text>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                  Fiş Görseli Yok
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          {/* Right Panel - Form */}
          <ScrollView
            style={[styles.formPanel, isTablet && styles.formPanelTablet]}
            contentContainerStyle={isTablet && styles.formPanelContent}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={() => {
              setShowCategoryPicker(false);
              setShowTagInput(false);
            }}
          >
            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      receipt.status === 'approved'
                        ? 'rgba(52, 168, 83, 0.1)'
                        : 'rgba(251, 140, 0, 0.1)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    textStyles.labelSmall,
                    {
                      color: receipt.status === 'approved' ? '#34A853' : '#FB8C00',
                    },
                  ]}
                >
                  {receipt.status === 'approved' ? '✓ Onaylandı' : '⏳ Onay Bekliyor'}
                </Text>
              </View>
            </View>

            {/* OCR Confidence */}
            {receipt.ocrData && (
              <View style={[styles.infoBox, { backgroundColor: 'rgba(31, 75, 143, 0.1)' }]}>
                <Text style={[textStyles.caption, { color: colors.primary }]}>
                  🤖 AI Güven Skoru: %{(receipt.ocrData.confidence * 100).toFixed(0)}
                </Text>
              </View>
            )}

            {/* Changed Fields Info */}
            {isEdited && changedFields.length > 0 && (
              <View style={[styles.infoBox, { backgroundColor: 'rgba(251, 140, 0, 0.1)' }]}>
                <Text style={[textStyles.caption, { color: '#FB8C00' }]}>
                  📝 {changedFields.length} alan değiştirildi: {changedFields.join(', ')}
                </Text>
              </View>
            )}

            {/* Form Fields - Compact 2x2 Grid */}
            <View style={styles.formFields}>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Tarih"
                    value={formData.tarih}
                    onChangeText={(text: string) => handleFieldChange('tarih', text)}
                    variant="outlined"
                    editable={receipt.status !== 'approved'}
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Fiş No"
                    value={formData.fisNo}
                    onChangeText={(text: string) => handleFieldChange('fisNo', text)}
                    variant="outlined"
                    editable={receipt.status !== 'approved'}
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
                    editable={receipt.status !== 'approved'}
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Ünvan"
                    value={formData.unvan}
                    onChangeText={(text: string) => handleFieldChange('unvan', text)}
                    variant="outlined"
                    editable={receipt.status !== 'approved'}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Toplam KDV"
                    value={formData.toplamKdv}
                    onChangeText={(text: string) => handleFieldChange('toplamKdv', text)}
                    variant="outlined"
                    keyboardType="decimal-pad"
                    editable={receipt.status !== 'approved'}
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Toplam Tutar"
                    value={formData.toplamTutar}
                    onChangeText={(text: string) => handleFieldChange('toplamTutar', text)}
                    variant="outlined"
                    keyboardType="decimal-pad"
                    editable={receipt.status !== 'approved'}
                  />
                </View>
              </View>
            </View>

            {/* KDV Satırları */}
            <View style={styles.kdvSection}>
              <View style={styles.kdvHeader}>
                <Text style={[textStyles.label, { color: colors.textPrimary }]}>
                  📊 KDV Satırları
                </Text>
                {receipt.status !== 'approved' && (
                  <TouchableOpacity
                    style={[styles.addKdvButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddKdvLine}
                  >
                    <Text style={[textStyles.labelSmall, { color: colors.white }]}>+ KDV Ekle</Text>
                  </TouchableOpacity>
                )}
              </View>

              {formData.kdvSatirlari.map((kdv, index) => (
                <View key={index} style={[styles.kdvEditRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.kdvEditFields}>
                    <View style={styles.kdvEditCol}>
                      <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: spacing.xxs }]}>
                        KDV %
                      </Text>
                      <Input
                        value={kdv.oran.toString()}
                        onChangeText={(text) => handleUpdateKdvLine(index, 'oran', text)}
                        keyboardType="decimal-pad"
                        variant="outlined"
                        editable={receipt.status !== 'approved'}
                        style={styles.kdvInput}
                      />
                    </View>
                    <View style={styles.kdvEditCol}>
                      <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: spacing.xxs }]}>
                        Matrah
                      </Text>
                      <Input
                        value={kdv.matrah.toString()}
                        onChangeText={(text) => handleUpdateKdvLine(index, 'matrah', text)}
                        keyboardType="decimal-pad"
                        variant="outlined"
                        editable={receipt.status !== 'approved'}
                        style={styles.kdvInput}
                      />
                    </View>
                    <View style={styles.kdvEditCol}>
                      <Text style={[textStyles.caption, { color: colors.textSecondary, marginBottom: spacing.xxs }]}>
                        KDV Tutarı
                      </Text>
                      <Input
                        value={kdv.kdvTutari.toFixed(2)}
                        onChangeText={(text) => handleUpdateKdvLine(index, 'kdvTutari', text)}
                        keyboardType="decimal-pad"
                        variant="outlined"
                        editable={receipt.status !== 'approved'}
                        style={styles.kdvInput}
                      />
                    </View>
                  </View>
                  {receipt.status !== 'approved' && (
                    <TouchableOpacity
                      style={[styles.removeKdvButton, { backgroundColor: colors.error + '15' }]}
                      onPress={() => handleRemoveKdvLine(index)}
                    >
                      <Text style={[textStyles.caption, { color: colors.error }]}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              {formData.kdvSatirlari.length === 0 && (
                <View style={[styles.emptyKdvBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                    KDV satırı bulunamadı
                  </Text>
                  {receipt.status !== 'approved' && (
                    <TouchableOpacity
                      style={[styles.addKdvButtonLarge, { backgroundColor: colors.primary, marginTop: spacing.sm }]}
                      onPress={handleAddKdvLine}
                    >
                      <Text style={[textStyles.labelSmall, { color: colors.white }]}>+ İlk KDV Satırını Ekle</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Kategori ve Etiketler - Açılır Alanlar */}
            <View style={styles.metadataSection}>
              {/* Kategori Seçici */}
              <View style={styles.pickerColumn}>
                <Text style={[textStyles.labelSmall, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
                  Kategori
                </Text>
                <TouchableOpacity
                  style={[styles.pickerField, { backgroundColor: '#FFF9E6', borderColor: '#FFD54F' }]}
                  onPress={() => receipt.status !== 'approved' && setShowCategoryPicker(!showCategoryPicker)}
                  disabled={receipt.status === 'approved'}
                >
                  <Text style={[textStyles.body, { color: colors.textPrimary, fontSize: moderateScale(13) }]}>
                    {formData.category 
                      ? (formData.category === 'yemek' && '🍽️ Yemek' ||
                         formData.category === 'yakit' && '⛽ Yakıt' ||
                         formData.category === 'ofis' && '🏢 Ofis' ||
                         formData.category === 'ulasim' && '🚗 Ulaşım' ||
                         formData.category === 'konaklama' && '🏨 Konaklama' ||
                         formData.category === 'saglik' && '🏥 Sağlık' ||
                         formData.category === 'egitim' && '📚 Eğitim' ||
                         formData.category === 'diger' && '📦 Diğer')
                      : 'Kategori seçin...'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>

                {/* Kategori Dropdown */}
                {showCategoryPicker && receipt.status !== 'approved' && (
                  <ScrollView 
                    style={[styles.dropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    nestedScrollEnabled
                  >
                    {Object.values(ReceiptCategory).map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.dropdownItem,
                          formData.category === cat && { backgroundColor: colors.primary + '10' }
                        ]}
                        onPress={() => {
                          handleCategoryChange(cat);
                          setShowCategoryPicker(false);
                        }}
                      >
                        <Text style={[textStyles.body, { color: colors.textPrimary, fontSize: moderateScale(13) }]}>
                          {cat === 'yemek' && '🍽️ Yemek'}
                          {cat === 'yakit' && '⛽ Yakıt'}
                          {cat === 'ofis' && '🏢 Ofis'}
                          {cat === 'ulasim' && '🚗 Ulaşım'}
                          {cat === 'konaklama' && '🏨 Konaklama'}
                          {cat === 'saglik' && '🏥 Sağlık'}
                          {cat === 'egitim' && '📚 Eğitim'}
                          {cat === 'diger' && '📦 Diğer'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Etiket Yönetimi */}
              <View style={styles.pickerColumn}>
                <Text style={[textStyles.labelSmall, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
                  Etiketler
                </Text>
                <TouchableOpacity
                  style={[styles.pickerField, { backgroundColor: '#FFF9E6', borderColor: '#FFD54F' }]}
                  onPress={() => receipt.status !== 'approved' && setShowTagInput(!showTagInput)}
                  disabled={receipt.status === 'approved'}
                >
                  <View style={styles.tagsPreview}>
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tag) => (
                        <View key={tag} style={[styles.tagMini, { backgroundColor: colors.primary + '20' }]}>
                          <Text style={[{ color: colors.primary, fontSize: moderateScale(10) }]}>{tag}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={[textStyles.body, { color: colors.textSecondary, fontSize: moderateScale(13) }]}>
                        + Ekle
                      </Text>
                    )}
                  </View>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>

                {/* Etiket Dropdown */}
                {showTagInput && receipt.status !== 'approved' && (
                  <View style={[styles.dropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {/* Mevcut Etiketler */}
                    {formData.tags.map((tag) => (
                      <View key={tag} style={styles.dropdownTagItem}>
                        <Text style={[textStyles.body, { color: colors.textPrimary, fontSize: moderateScale(13), flex: 1 }]}>
                          {tag}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveTag(tag)}
                          style={styles.tagRemoveButton}
                        >
                          <Text style={[{ color: colors.error, fontSize: moderateScale(14) }]}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    {/* Yeni Etiket Ekleme */}
                    <View style={styles.tagInputContainer}>
                      <Input
                        value={newTag}
                        onChangeText={setNewTag}
                        placeholder="Yeni etiket..."
                        variant="outlined"
                        style={{ flex: 1 }}
                        onSubmitEditing={() => {
                          handleAddTag();
                          setShowTagInput(false);
                        }}
                      />
                      <TouchableOpacity
                        style={[styles.addTagBtn, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          handleAddTag();
                          setShowTagInput(false);
                        }}
                      >
                        <Text style={[textStyles.labelSmall, { color: colors.white, fontSize: moderateScale(11) }]}>Ekle</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* OCR Raw Text */}
            {receipt.ocrData && (
              <View style={styles.ocrSection}>
                <Text style={[textStyles.labelSmall, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
                  Ham OCR Metni:
                </Text>
                <View style={[styles.ocrBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
                    {receipt.ocrData.rawText}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bottom Action Bar */}
        {receipt.status !== 'approved' && (
          <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }, elevation[3]]}>
            <Button
              title="Taslak Kaydet"
              variant="ghost"
              onPress={handleSaveDraft}
              disabled={!isEdited}
            />
            <View style={{ width: spacing.sm }} />
            <Button
              title="Bilgiler Doğru (Onayla)"
              variant="gradient"
              onPress={handleApprove}
              loading={isLoading}
              elevation
            />
          </View>
        )}
      </View>

      {/* Image Viewer Modal */}
      {receipt.imagePath && (
        <ReceiptImageViewer
          imageUri={receipt.imagePath}
          visible={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      {/* Drawer Menu */}
      <DrawerMenu
        visible={isDrawerOpen}
        onClose={closeDrawer}
      />
    </View>
  );
}

export default function ReceiptDetailScreen() {
  return (
    <DrawerProvider>
      <ReceiptDetailContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  splitContainerTablet: {
    flexDirection: 'row',
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  splitContainerLarge: {
    maxWidth: 1400,
  },
  imagePanel: {
    height: moderateScale(300),
  },
  imagePanelTablet: {
    flex: 1,
    height: 'auto',
    maxWidth: '50%',
  },
  imagePanelLarge: {
    maxWidth: '45%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(12),
  },
  imagePlaceholderIcon: {
    fontSize: moderateScale(64),
    marginBottom: spacing.xs,
  },
  formPanel: {
    flex: 1,
  },
  formPanelTablet: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  formPanelContent: {
    paddingRight: responsiveSpacing(spacing.sm),
  },
  statusContainer: {
    padding: responsiveSpacing(spacing.xs),
    paddingBottom: 0,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontWeight: '600',
  },
  infoBox: {
    marginHorizontal: responsiveSpacing(spacing.md),
    marginTop: spacing.xxs,
    marginBottom: spacing.xxs,
    padding: responsiveSpacing(spacing.xs),
    borderRadius: moderateScale(8),
  },
  formFields: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: spacing.xxs,
  },
  formCol: {
    flex: 1,
    paddingHorizontal: spacing.xxs,
  },
  ocrSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  ocrBox: {
    padding: spacing.sm,
    borderRadius: moderateScale(8),
    borderWidth: 1,
  },
  actionBar: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.md),
    borderTopWidth: 1,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  // Image styles
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(12),
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.sm,
    borderBottomLeftRadius: moderateScale(12),
    borderBottomRightRadius: moderateScale(12),
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  // KDV Styles
  kdvSection: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingVertical: spacing.xs,
  },
  kdvRow: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.sm),
    marginBottom: spacing.xs,
    borderRadius: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  kdvInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  kdvValueCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyKdvBox: {
    padding: spacing.md,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    alignItems: 'center',
  },
  // KDV Edit Styles
  kdvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addKdvButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: moderateScale(6),
  },
  addKdvButtonLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(8),
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
  // Metadata Section - Açılır Kategori ve Etiketler
  metadataSection: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pickerColumn: {
    flex: 1,
    position: 'relative',
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
    minHeight: 40,
  },
  pickerArrow: {
    fontSize: moderateScale(10),
    color: '#666',
    marginLeft: spacing.xs,
  },
  tagsPreview: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
  },
  tagMini: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: moderateScale(6),
  },
  // Dropdown Menu
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xxs,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagRemoveButton: {
    padding: spacing.xs,
  },
  tagInputContainer: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    alignItems: 'center',
  },
  addTagBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: moderateScale(6),
    height: 36,
    justifyContent: 'center',
  },
});
