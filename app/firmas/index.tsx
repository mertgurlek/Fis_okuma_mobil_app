/**
 * Firmalar Ekranı - Firma Yönetimi ve İstatistikler
 * Firmaları görüntüleme, düzenleme ve istatistikleri
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useFirma, useReceipt } from '@hooks';
import { TopBar, Button, LoadingSpinner, DrawerMenu } from '@components';
import { DrawerProvider, useDrawer } from '../../src/contexts/DrawerContext';
import FirmaFormModal from '@components/modals/FirmaFormModal';
import FirmaDetailModal from '@components/modals/FirmaDetailModal';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
  gradients,
  getResponsiveColumns,
} from '@theme';
import { Firma, ReceiptStatus, CreateFirmaData, UpdateFirmaData } from '@types';

const spacing = spacingSystem.spacing;

function FirmasContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { firmaList, isLoading, loadFirmas, selectedFirma, selectFirma, createFirma, updateFirma } = useFirma();
  const { receipts } = useReceipt();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const [selectedFirmaDetails, setSelectedFirmaDetails] = useState<Firma | null>(null);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingFirma, setEditingFirma] = useState<Firma | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailFirma, setDetailFirma] = useState<Firma | null>(null);

  const numColumns = getResponsiveColumns(width);

  useEffect(() => {
    loadFirmas();
  }, []);

  // Firma istatistiklerini hesapla
  const getFirmaStats = (firmaId: string) => {
    const firmaReceipts = receipts.filter(r => r.firmaId === firmaId);
    const totalReceipts = firmaReceipts.length;
    const approvedReceipts = firmaReceipts.filter(r => r.status === ReceiptStatus.APPROVED).length;
    const pendingReceipts = firmaReceipts.filter(r => r.status === ReceiptStatus.VERIFIED).length;
    const totalKdv = firmaReceipts.reduce((sum, r) => sum + r.toplamKdv, 0);
    const totalAmount = firmaReceipts.reduce((sum, r) => sum + r.toplamTutar, 0);

    return {
      totalReceipts,
      approvedReceipts,
      pendingReceipts,
      totalKdv,
      totalAmount,
    };
  };

  const handleFirmaPress = (firma: Firma) => {
    setDetailFirma(firma);
    setIsDetailModalVisible(true);
  };

  const handleSelectFirma = (firma: Firma) => {
    selectFirma(firma);
    Alert.alert('Başarılı', `${firma.shortName} firma olarak seçildi`);
  };

  const handleEditFirma = (firma: Firma) => {
    setEditingFirma(firma);
    setIsFormModalVisible(true);
  };

  const handleAddFirma = () => {
    setEditingFirma(null);
    setIsFormModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsFormModalVisible(false);
    setEditingFirma(null);
  };

  const handleSubmitFirma = async (data: CreateFirmaData | UpdateFirmaData) => {
    try {
      if ('id' in data) {
        // Update
        await updateFirma(data as UpdateFirmaData);
        Alert.alert('Başarılı', 'Firma güncellendi');
      } else {
        // Create
        await createFirma(data as CreateFirmaData);
        Alert.alert('Başarılı', 'Yeni firma eklendi');
      }
      await loadFirmas();
    } catch (error) {
      console.error('Firma save error:', error);
      throw error;
    }
  };

  const renderFirmaCard = ({ item }: { item: Firma }) => {
    const stats = getFirmaStats(item.id);
    const kontorPercentage = item.kontor ? (item.kontor / 200) * 100 : 0; // 200 maksimum kontör varsayımı
    const isSelected = selectedFirma?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.firmaCard,
          { backgroundColor: colors.surface },
          elevation[2],
          isSelected && { borderWidth: 2, borderColor: colors.primary }
        ]}
        onPress={() => handleFirmaPress(item)}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.firmaInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {item.shortName?.substring(0, 2).toUpperCase() || item.unvan.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.firmaDetails}>
              <Text style={[styles.firmaName, textStyles.labelLarge, { color: colors.textPrimary }]}>
                {item.shortName || item.unvan}
              </Text>
              <Text style={[styles.firmaVkn, textStyles.caption, { color: colors.textSecondary }]}>
                VKN: {item.vkn}
              </Text>
            </View>
          </View>

          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.selectedText, { color: colors.white }]}>✓ Aktif</Text>
            </View>
          )}
        </View>

        {/* Unvan - Tam */}
        {item.shortName && (
          <Text style={[styles.firmaUnvan, textStyles.caption, { color: colors.textTertiary }]}>
            {item.unvan}
          </Text>
        )}

        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          {/* Fiş Sayısı */}
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalReceipts}
            </Text>
            <Text style={[styles.statLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Toplam Fiş
            </Text>
          </View>

          {/* Onaylı/Onaysız */}
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.approvedReceipts}
            </Text>
            <Text style={[styles.statLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Onaylı
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {stats.pendingReceipts}
            </Text>
            <Text style={[styles.statLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Bekleyen
            </Text>
          </View>
        </View>

        {/* KDV ve Tutar */}
        <View style={styles.amountContainer}>
          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Toplam KDV:
            </Text>
            <Text style={[styles.amountValue, textStyles.labelSmall, { color: colors.error }]}>
              ₺{stats.totalKdv.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Toplam Tutar:
            </Text>
            <Text style={[styles.amountValue, textStyles.labelSmall, { color: colors.primary }]}>
              ₺{stats.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Kontör Durumu */}
        {item.kontor !== undefined && (
          <View style={styles.kontorContainer}>
            <View style={styles.kontorHeader}>
              <Text style={[styles.kontorLabel, textStyles.caption, { color: colors.textTertiary }]}>
                Kalan Kontör
              </Text>
              <Text style={[styles.kontorValue, textStyles.labelSmall, { color: colors.primary }]}>
                {item.kontor}
              </Text>
            </View>
            <View style={[styles.kontorBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.kontorFill,
                  {
                    width: `${Math.min(kontorPercentage, 100)}%`,
                    backgroundColor: kontorPercentage > 30 ? colors.success : kontorPercentage > 15 ? colors.warning : colors.error,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardActions}>
          {!isSelected && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => handleSelectFirma(item)}
            >
              <Text style={[styles.actionText, { color: colors.primary }]}>
                ✓ Seç
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info + '15' }]}
            onPress={() => handleEditFirma(item)}
          >
            <Text style={[styles.actionText, { color: colors.info }]}>
              ✏️ Düzenle
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success + '15' }]}
            onPress={() => {
              setDetailFirma(item);
              setIsDetailModalVisible(true);
            }}
          >
            <Text style={[styles.actionText, { color: colors.success }]}>
              👤 Kullanıcılar
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && firmaList.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <TopBar title="Firmalar" showFirmaChip />
        <LoadingSpinner />
        <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
      </View>
    );
  }

  // Toplam istatistikler
  const totalStats = firmaList.reduce((acc, firma) => {
    const stats = getFirmaStats(firma.id);
    return {
      totalReceipts: acc.totalReceipts + stats.totalReceipts,
      totalKdv: acc.totalKdv + stats.totalKdv,
      totalKontor: acc.totalKontor + (firma.kontor || 0),
    };
  }, { totalReceipts: 0, totalKdv: 0, totalKontor: 0 });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Firmalar" showFirmaChip />

      {/* Header Stats */}
      <LinearGradient
        colors={gradients.primaryLight}
        style={styles.statsHeader}
      >
        <View style={styles.stat}>
          <Text style={[styles.statHeaderValue, { color: colors.white }]}>
            {firmaList.length}
          </Text>
          <Text style={[styles.statHeaderLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Toplam Firma
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statHeaderValue, { color: colors.white }]}>
            {totalStats.totalReceipts}
          </Text>
          <Text style={[styles.statHeaderLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Toplam Fiş
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statHeaderValue, { color: colors.white }]}>
            ₺{(totalStats.totalKdv / 1000).toFixed(1)}K
          </Text>
          <Text style={[styles.statHeaderLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Toplam KDV
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statHeaderValue, { color: colors.white }]}>
            {totalStats.totalKontor}
          </Text>
          <Text style={[styles.statHeaderLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Kalan Kontör
          </Text>
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={firmaList}
        renderItem={renderFirmaCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        key={`grid-${numColumns}`}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      />

      {/* FAB - Add Firma */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, elevation[4]]}
        onPress={handleAddFirma}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Firma Form Modal */}
      <FirmaFormModal
        visible={isFormModalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFirma}
        firma={editingFirma}
      />

      {/* Firma Detail Modal */}
      <FirmaDetailModal
        visible={isDetailModalVisible}
        onClose={() => {
          setIsDetailModalVisible(false);
          setDetailFirma(null);
        }}
        firma={detailFirma}
      />

      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function FirmasScreen() {
  return (
    <DrawerProvider>
      <FirmasContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.sm),
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statHeaderValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  statHeaderLabel: {
    fontSize: moderateScale(9),
    marginTop: responsiveSpacing(spacing.xxs),
    textAlign: 'center',
  },
  listContent: {
    padding: responsiveSpacing(spacing.sm),
    paddingBottom: 100,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  firmaCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.sm),
    marginBottom: responsiveSpacing(spacing.sm),
    marginHorizontal: responsiveSpacing(spacing.xxs),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.xs),
  },
  firmaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  firmaDetails: {
    marginLeft: responsiveSpacing(spacing.xs),
    flex: 1,
  },
  firmaName: {
    fontWeight: '600',
  },
  firmaVkn: {
    marginTop: spacing.xxs,
  },
  firmaUnvan: {
    marginBottom: responsiveSpacing(spacing.xs),
    marginLeft: moderateScale(40) + responsiveSpacing(spacing.xs),
  },
  selectedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: moderateScale(12),
  },
  selectedText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: responsiveSpacing(spacing.xs),
    paddingVertical: responsiveSpacing(spacing.xs),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  statLabel: {
    marginTop: responsiveSpacing(2),
  },
  amountContainer: {
    marginBottom: responsiveSpacing(spacing.xs),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.xxs),
  },
  amountLabel: {},
  amountValue: {
    fontWeight: '700',
  },
  kontorContainer: {
    marginBottom: spacing.sm,
  },
  kontorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  kontorLabel: {},
  kontorValue: {
    fontWeight: '700',
  },
  kontorBar: {
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  kontorFill: {
    height: '100%',
    borderRadius: moderateScale(3),
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: responsiveSpacing(spacing.xs),
  },
  actionButton: {
    flex: 1,
    paddingVertical: responsiveSpacing(spacing.xs),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: responsiveSpacing(2),
  },
  actionText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: moderateScale(32),
    color: '#FFF',
    fontWeight: '300',
  },
});
