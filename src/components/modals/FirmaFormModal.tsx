/**
 * Firma Form Modal - Yeni Firma Ekleme veya Düzenleme
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useTheme } from '@hooks';
import { Button } from '@components';
import { Firma, CreateFirmaData, UpdateFirmaData, FirmaTuru, ApiServis } from '@types';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  responsiveSpacing,
  elevation,
} from '@theme';

const spacing = spacingSystem.spacing;

interface FirmaFormModalProps {
  visible: boolean;
  firma?: Firma | null; // Düzenleme için
  onClose: () => void;
  onSubmit: (data: CreateFirmaData | UpdateFirmaData) => Promise<void>;
}

export default function FirmaFormModal({
  visible,
  firma,
  onClose,
  onSubmit,
}: FirmaFormModalProps) {
  const { colors } = useTheme();
  const isEdit = !!firma;

  // Form state
  const [unvan, setUnvan] = useState('');
  const [shortName, setShortName] = useState('');
  const [vkn, setVkn] = useState('');
  const [tckn, setTckn] = useState('');
  const [vergiDairesi, setVergiDairesi] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firmaTuru, setFirmaTuru] = useState<FirmaTuru>(FirmaTuru.LIMITED);
  const [naceKodu, setNaceKodu] = useState('');
  const [sektor, setSektor] = useState('');
  const [apiServisleri, setApiServisleri] = useState<ApiServis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load firma data when editing
  useEffect(() => {
    if (firma) {
      setUnvan(firma.unvan);
      setShortName(firma.shortName);
      setVkn(firma.vkn);
      setTckn(firma.tckn || '');
      setVergiDairesi(firma.vergiDairesi);
      setAddress(firma.address || '');
      setCity(firma.city || '');
      setPhone(firma.phone || '');
      setEmail(firma.email || '');
      setFirmaTuru(firma.firmaTuru);
      setNaceKodu(firma.naceKodu || '');
      setSektor(firma.sektor || '');
      setApiServisleri(firma.apiServisleri || []);
    } else {
      // Reset form for new firma
      resetForm();
    }
  }, [firma, visible]);

  const resetForm = () => {
    setUnvan('');
    setShortName('');
    setVkn('');
    setTckn('');
    setVergiDairesi('');
    setAddress('');
    setCity('');
    setPhone('');
    setEmail('');
    setFirmaTuru(FirmaTuru.LIMITED);
    setNaceKodu('');
    setSektor('');
    setApiServisleri([]);
  };

  const handleAddApiServis = () => {
    const newServis: ApiServis = {
      servisAdi: '',
      kullaniciAdi: '',
      sifre: '',
      apiUrl: '',
      aktif: true,
    };
    setApiServisleri([...apiServisleri, newServis]);
  };

  const handleRemoveApiServis = (index: number) => {
    const updated = apiServisleri.filter((_, i) => i !== index);
    setApiServisleri(updated);
  };

  const handleUpdateApiServis = (index: number, field: keyof ApiServis, value: any) => {
    const updated = [...apiServisleri];
    updated[index] = { ...updated[index], [field]: value };
    setApiServisleri(updated);
  };

  const validateForm = () => {
    if (!unvan.trim()) {
      Alert.alert('Hata', 'Firma ünvanı zorunludur');
      return false;
    }
    if (!shortName.trim()) {
      Alert.alert('Hata', 'Kısa isim zorunludur');
      return false;
    }
    if (!vkn.trim()) {
      Alert.alert('Hata', 'VKN zorunludur');
      return false;
    }
    if (vkn.length !== 10 && vkn.length !== 11) {
      Alert.alert('Hata', 'VKN 10 veya 11 haneli olmalıdır');
      return false;
    }
    if (tckn && tckn.length !== 11) {
      Alert.alert('Hata', 'TCKN 11 haneli olmalıdır');
      return false;
    }
    if (!vergiDairesi.trim()) {
      Alert.alert('Hata', 'Vergi dairesi zorunludur');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data: CreateFirmaData | UpdateFirmaData = isEdit
        ? {
            id: firma!.id,
            unvan,
            shortName,
            vkn,
            tckn: tckn || undefined,
            vergiDairesi,
            address: address || undefined,
            city: city || undefined,
            phone: phone || undefined,
            email: email || undefined,
            firmaTuru,
            naceKodu: naceKodu || undefined,
            sektor: sektor || undefined,
            apiServisleri: apiServisleri.length > 0 ? apiServisleri : undefined,
          }
        : {
            unvan,
            shortName,
            vkn,
            tckn: tckn || undefined,
            vergiDairesi,
            address: address || undefined,
            city: city || undefined,
            phone: phone || undefined,
            email: email || undefined,
            firmaTuru,
            naceKodu: naceKodu || undefined,
            sektor: sektor || undefined,
            apiServisleri: apiServisleri.length > 0 ? apiServisleri : undefined,
          };

      await onSubmit(data);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const firmaTuruOptions = [
    { label: 'Şahıs Firması', value: FirmaTuru.SAHIS },
    { label: 'Limited Şirket', value: FirmaTuru.LIMITED },
    { label: 'Anonim Şirket', value: FirmaTuru.ANONIM },
    { label: 'Kollektif Şirket', value: FirmaTuru.KOLLEKTIF },
    { label: 'Komandit Şirket', value: FirmaTuru.KOMANDIT },
    { label: 'Kooperatif', value: FirmaTuru.KOOPERATIF },
    { label: 'Diğer', value: FirmaTuru.DIGER },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }, elevation[2]]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, textStyles.h3, { color: colors.textPrimary }]}>
            {isEdit ? 'Firma Düzenle' : 'Yeni Firma Ekle'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Temel Bilgiler Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.label, { color: colors.textPrimary }]}>
                📋 Temel Bilgiler
              </Text>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Firma Ünvanı *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={unvan}
                  onChangeText={setUnvan}
                  placeholder="Örn: ABC Bilişim Teknolojileri Ltd. Şti."
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Kısa İsim *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={shortName}
                  onChangeText={setShortName}
                  placeholder="Örn: ABC Bilişim"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                    VKN *
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                    value={vkn}
                    onChangeText={setVkn}
                    placeholder="10 veya 11 hane"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    maxLength={11}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                    TCKN (Şahıs Firma)
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                    value={tckn}
                    onChangeText={setTckn}
                    placeholder="11 hane"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    maxLength={11}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Vergi Dairesi *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={vergiDairesi}
                  onChangeText={setVergiDairesi}
                  placeholder="Örn: Kadıköy Vergi Dairesi"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Firma Türü *
                </Text>
                <View style={styles.radioGroup}>
                  {firmaTuruOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioButton,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        firmaTuru === option.value && { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
                      ]}
                      onPress={() => setFirmaTuru(option.value)}
                    >
                      <Text
                        style={[
                          styles.radioButtonText,
                          textStyles.caption,
                          { color: colors.textSecondary },
                          firmaTuru === option.value && { color: colors.primary, fontWeight: '600' },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* İletişim Bilgileri Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.label, { color: colors.textPrimary }]}>
                📞 İletişim Bilgileri
              </Text>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Adres
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Firma adresi"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Şehir
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Örn: İstanbul"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Telefon
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Örn: 0212 123 45 67"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  E-posta
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Örn: info@firma.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Sektör Bilgileri Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.label, { color: colors.textPrimary }]}>
                🏢 Sektör Bilgileri
              </Text>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  NACE Kodu
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={naceKodu}
                  onChangeText={setNaceKodu}
                  placeholder="Örn: 62.01"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                  Sektör
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                  value={sektor}
                  onChangeText={setSektor}
                  placeholder="Örn: Bilişim, Yazılım"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            {/* API Servisleri Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, textStyles.label, { color: colors.textPrimary }]}>
                  🔌 API Servisleri
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddApiServis}
                >
                  <Text style={[styles.addButtonText, { color: colors.white }]}>+ Ekle</Text>
                </TouchableOpacity>
              </View>

              {apiServisleri.length === 0 ? (
                <Text style={[styles.emptyText, textStyles.caption, { color: colors.textTertiary }]}>
                  Henüz API servisi eklenmedi
                </Text>
              ) : (
                apiServisleri.map((servis, index) => (
                  <View
                    key={index}
                    style={[styles.apiServisCard, { backgroundColor: colors.surface, borderColor: colors.border }, elevation[1]]}
                  >
                    <View style={styles.apiServisHeader}>
                      <Text style={[styles.apiServisTitle, textStyles.labelSmall, { color: colors.textPrimary }]}>
                        Servis {index + 1}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveApiServis(index)}>
                        <Text style={[styles.removeButton, { color: colors.error }]}>Kaldır</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.field}>
                      <Text style={[styles.label, textStyles.caption, { color: colors.textSecondary }]}>
                        Servis Adı
                      </Text>
                      <TextInput
                        style={[styles.inputSmall, { backgroundColor: colors.bg, color: colors.textPrimary, borderColor: colors.border }]}
                        value={servis.servisAdi}
                        onChangeText={(value) => handleUpdateApiServis(index, 'servisAdi', value)}
                        placeholder="Örn: E-Arşiv, E-Fatura"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>

                    <View style={styles.field}>
                      <Text style={[styles.label, textStyles.caption, { color: colors.textSecondary }]}>
                        Kullanıcı Adı
                      </Text>
                      <TextInput
                        style={[styles.inputSmall, { backgroundColor: colors.bg, color: colors.textPrimary, borderColor: colors.border }]}
                        value={servis.kullaniciAdi}
                        onChangeText={(value) => handleUpdateApiServis(index, 'kullaniciAdi', value)}
                        placeholder="API kullanıcı adı"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>

                    <View style={styles.field}>
                      <Text style={[styles.label, textStyles.caption, { color: colors.textSecondary }]}>
                        Şifre
                      </Text>
                      <TextInput
                        style={[styles.inputSmall, { backgroundColor: colors.bg, color: colors.textPrimary, borderColor: colors.border }]}
                        value={servis.sifre}
                        onChangeText={(value) => handleUpdateApiServis(index, 'sifre', value)}
                        placeholder="API şifresi"
                        placeholderTextColor={colors.textTertiary}
                        secureTextEntry
                      />
                    </View>

                    <View style={styles.field}>
                      <Text style={[styles.label, textStyles.caption, { color: colors.textSecondary }]}>
                        API URL
                      </Text>
                      <TextInput
                        style={[styles.inputSmall, { backgroundColor: colors.bg, color: colors.textPrimary, borderColor: colors.border }]}
                        value={servis.apiUrl}
                        onChangeText={(value) => handleUpdateApiServis(index, 'apiUrl', value)}
                        placeholder="https://api.example.com"
                        placeholderTextColor={colors.textTertiary}
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.switchRow}>
                      <Text style={[styles.label, textStyles.caption, { color: colors.textSecondary }]}>
                        Aktif
                      </Text>
                      <Switch
                        value={servis.aktif}
                        onValueChange={(value) => handleUpdateApiServis(index, 'aktif', value)}
                        trackColor={{ false: colors.border, true: colors.primary + '80' }}
                        thumbColor={servis.aktif ? colors.primary : colors.textTertiary}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <Button
                title={isEdit ? 'Değişiklikleri Kaydet' : 'Firma Ekle'}
                variant="gradient"
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: moderateScale(24),
    fontWeight: '300',
  },
  headerTitle: {
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl + spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: responsiveSpacing(spacing.sm),
    fontSize: moderateScale(14),
  },
  inputSmall: {
    borderWidth: 1,
    borderRadius: moderateScale(6),
    padding: responsiveSpacing(spacing.xs),
    fontSize: moderateScale(13),
  },
  textArea: {
    minHeight: moderateScale(80),
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  radioButton: {
    borderWidth: 1.5,
    borderRadius: moderateScale(8),
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  radioButtonText: {
    fontSize: moderateScale(12),
  },
  addButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(6),
  },
  addButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  apiServisCard: {
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: responsiveSpacing(spacing.sm),
    marginBottom: spacing.sm,
  },
  apiServisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  apiServisTitle: {
    fontWeight: '600',
  },
  removeButton: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  submitContainer: {
    marginTop: spacing.md,
  },
});
