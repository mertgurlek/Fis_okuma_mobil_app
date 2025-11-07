/**
 * Fiş Listesi Ekranı - Modern Ana Sayfa
 * Responsive, animasyonlu liste görünümü
 */

import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Animated, RefreshControl, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useReceipt, useFirma, useResponsive } from '@hooks';
import { TopBar, LoadingSpinner, Drawer, Button } from '@components';
import { SafeReceiptCard } from '@components';
import { ConfirmDialog, FirmaSelector, DemoInfoModal } from '@components';
import { 
  spacing as spacingSystem, 
  textStyles,
  responsiveSpacing,
  getContainerWidth,
  getResponsiveColumns,
  elevation,
  moderateScale,
} from '@theme';
import { ReceiptStatus, ReceiptType, ReceiptSource, AdvisorApprovalStatus, ReceiptFilter } from '@types';
import { webStyles, getWebGridColumns, getWebContainerWidth, getWebPadding } from '@utils/webOptimizations';

const spacing = spacingSystem.spacing;

export default function ReceiptListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { filteredReceipts, loadReceipts, isLoading, selectReceipt, updateFilters, resetFilters } = useReceipt();
  const { selectedFirma } = useFirma();
  const { width } = useResponsive();
  const numColumns = getResponsiveColumns(width);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    status: [] as ReceiptStatus[],
    fisType: [] as ReceiptType[],
    source: [] as ReceiptSource[],
    advisorApproval: [] as AdvisorApprovalStatus[],
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    if (selectedFirma) {
      loadReceipts(selectedFirma.id);
    }
  }, [selectedFirma]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedFirma) {
      await loadReceipts(selectedFirma.id);
    }
    setRefreshing(false);
  };

  const handleReceiptPress = (receipt: any) => {
    selectReceipt(receipt);
    router.push(`/receipt/${receipt.id}` as any);
  };

  if (isLoading) {
    return <LoadingSpinner message="Fişler yükleniyor..." />;
  }

  // Animated header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const toggleFilter = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const applyFilters = () => {
    const filters: Partial<ReceiptFilter> = {
      ...tempFilters,
      minAmount: tempFilters.minAmount ? parseFloat(tempFilters.minAmount) : undefined,
      maxAmount: tempFilters.maxAmount ? parseFloat(tempFilters.maxAmount) : undefined,
    };
    updateFilters(filters);
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    setTempFilters({ 
      status: [], 
      fisType: [],
      source: [],
      advisorApproval: [],
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    resetFilters();
  };

  const toggleStatusFilter = (status: ReceiptStatus) => {
    setTempFilters(prev => ({
      ...prev,
      status: (prev.status || []).includes(status)
        ? (prev.status || []).filter((s: ReceiptStatus) => s !== status)
        : [...(prev.status || []), status]
    }));
  };

  const toggleFisTypeFilter = (type: ReceiptType) => {
    setTempFilters(prev => ({
      ...prev,
      fisType: (prev.fisType || []).includes(type)
        ? (prev.fisType || []).filter((t: ReceiptType) => t !== type)
        : [...(prev.fisType || []), type]
    }));
  };

  const toggleSourceFilter = (source: ReceiptSource) => {
    setTempFilters(prev => ({
      ...prev,
      source: (prev.source || []).includes(source)
        ? (prev.source || []).filter((s: ReceiptSource) => s !== source)
        : [...(prev.source || []), source]
    }));
  };

  const toggleAdvisorApprovalFilter = (approval: AdvisorApprovalStatus) => {
    setTempFilters(prev => ({
      ...prev,
      advisorApproval: (prev.advisorApproval || []).includes(approval)
        ? (prev.advisorApproval || []).filter((a: AdvisorApprovalStatus) => a !== approval)
        : [...(prev.advisorApproval || []), approval]
    }));
  };

  // İstatistikleri hesapla
  const stats = {
    processing: filteredReceipts.filter(r => r.status === ReceiptStatus.PROCESSING).length,
    verified: filteredReceipts.filter(r => r.status === ReceiptStatus.VERIFIED).length,
    approved: filteredReceipts.filter(r => r.status === ReceiptStatus.APPROVED).length,
    rejected: filteredReceipts.filter(r => r.status === ReceiptStatus.REJECTED).length,
    fromTaxpayer: filteredReceipts.filter(r => r.source === ReceiptSource.TAXPAYER).length,
    waitingApproval: filteredReceipts.filter(r => r.advisorApprovalStatus === AdvisorApprovalStatus.WAITING).length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Bar */}
      <Animated.View style={{ opacity: headerOpacity }}>
        <TopBar title="Fişlerim" showFirmaChip showFilterButton onFilterPress={toggleFilter} />
      </Animated.View>

      {/* Hızlı Filtre Çipleri - Horizontal Scroll */}
      <View style={[styles.quickFilters, { backgroundColor: colors.bg }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFilterScrollContent}
        >
          <TouchableOpacity
            style={[styles.quickFilterChip, tempFilters.status?.includes(ReceiptStatus.VERIFIED) && { backgroundColor: colors.info + '20', borderColor: colors.info }]}
            onPress={() => toggleStatusFilter(ReceiptStatus.VERIFIED)}
          >
            <Text style={[styles.quickFilterText, tempFilters.status?.includes(ReceiptStatus.VERIFIED) && { color: colors.info, fontWeight: '600' }]}>
              🔍 Doğrulanmış ({stats.verified})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickFilterChip, tempFilters.status?.includes(ReceiptStatus.APPROVED) && { backgroundColor: colors.success + '20', borderColor: colors.success }]}
            onPress={() => toggleStatusFilter(ReceiptStatus.APPROVED)}
          >
            <Text style={[styles.quickFilterText, tempFilters.status?.includes(ReceiptStatus.APPROVED) && { color: colors.success, fontWeight: '600' }]}>
              ✓ Onaylanmış ({stats.approved})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickFilterChip, tempFilters.source?.includes(ReceiptSource.TAXPAYER) && { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}
            onPress={() => toggleSourceFilter(ReceiptSource.TAXPAYER)}
          >
            <Text style={[styles.quickFilterText, tempFilters.source?.includes(ReceiptSource.TAXPAYER) && { color: colors.warning, fontWeight: '600' }]}>
              👤 Mükelleften ({stats.fromTaxpayer})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Detaylı Filtre Paneli - Collapsible */}
      {showFilterPanel && (
        <View style={[styles.filterPanel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {/* Durum Filtreleri */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textPrimary, fontWeight: '600' }]}>📊 Durum:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.status?.includes(ReceiptStatus.PROCESSING) && { backgroundColor: colors.primary }]}
                onPress={() => toggleStatusFilter(ReceiptStatus.PROCESSING)}
              >
                <Text style={[styles.filterChipText, tempFilters.status?.includes(ReceiptStatus.PROCESSING) && { color: colors.white }]}>
                  ⏳ İşleniyor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.status?.includes(ReceiptStatus.VERIFIED) && { backgroundColor: colors.primary }]}
                onPress={() => toggleStatusFilter(ReceiptStatus.VERIFIED)}
              >
                <Text style={[styles.filterChipText, tempFilters.status?.includes(ReceiptStatus.VERIFIED) && { color: colors.white }]}>
                  🔍 Doğrulanmış
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.status?.includes(ReceiptStatus.APPROVED) && { backgroundColor: colors.primary }]}
                onPress={() => toggleStatusFilter(ReceiptStatus.APPROVED)}
              >
                <Text style={[styles.filterChipText, tempFilters.status?.includes(ReceiptStatus.APPROVED) && { color: colors.white }]}>
                  ✓ Onaylanmış
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.status?.includes(ReceiptStatus.REJECTED) && { backgroundColor: colors.primary }]}
                onPress={() => toggleStatusFilter(ReceiptStatus.REJECTED)}
              >
                <Text style={[styles.filterChipText, tempFilters.status?.includes(ReceiptStatus.REJECTED) && { color: colors.white }]}>
                  ✕ Reddedilmiş
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kaynak Filtreleri */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textPrimary, fontWeight: '600' }]}>👥 Kaynak:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.source?.includes(ReceiptSource.MAIN_USER) && { backgroundColor: colors.primary }]}
                onPress={() => toggleSourceFilter(ReceiptSource.MAIN_USER)}
              >
                <Text style={[styles.filterChipText, tempFilters.source?.includes(ReceiptSource.MAIN_USER) && { color: colors.white }]}>
                  💼 Müşavir Yükledi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.source?.includes(ReceiptSource.TAXPAYER) && { backgroundColor: colors.primary }]}
                onPress={() => toggleSourceFilter(ReceiptSource.TAXPAYER)}
              >
                <Text style={[styles.filterChipText, tempFilters.source?.includes(ReceiptSource.TAXPAYER) && { color: colors.white }]}>
                  👤 Mükellef Yükledi
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Müşavir Onay Durumu */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textPrimary, fontWeight: '600' }]}>✅ Müşavir Onayı:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.WAITING) && { backgroundColor: colors.primary }]}
                onPress={() => toggleAdvisorApprovalFilter(AdvisorApprovalStatus.WAITING)}
              >
                <Text style={[styles.filterChipText, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.WAITING) && { color: colors.white }]}>
                  ⏰ Onay Bekliyor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.APPROVED) && { backgroundColor: colors.primary }]}
                onPress={() => toggleAdvisorApprovalFilter(AdvisorApprovalStatus.APPROVED)}
              >
                <Text style={[styles.filterChipText, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.APPROVED) && { color: colors.white }]}>
                  ✓ Onaylandı
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.REJECTED) && { backgroundColor: colors.primary }]}
                onPress={() => toggleAdvisorApprovalFilter(AdvisorApprovalStatus.REJECTED)}
              >
                <Text style={[styles.filterChipText, tempFilters.advisorApproval?.includes(AdvisorApprovalStatus.REJECTED) && { color: colors.white }]}>
                  ✕ Reddedildi
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kategori/Fiş Tipi */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>Kategori:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.fisType?.includes(ReceiptType.YAZAR_KASA) && { backgroundColor: colors.primary }]}
                onPress={() => toggleFisTypeFilter(ReceiptType.YAZAR_KASA)}
              >
                <Text style={[styles.filterChipText, tempFilters.fisType?.includes(ReceiptType.YAZAR_KASA) && { color: colors.white }]}>
                  Yazar Kasa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, tempFilters.fisType?.includes(ReceiptType.Z_RAPORU) && { backgroundColor: colors.primary }]}
                onPress={() => toggleFisTypeFilter(ReceiptType.Z_RAPORU)}
              >
                <Text style={[styles.filterChipText, tempFilters.fisType?.includes(ReceiptType.Z_RAPORU) && { color: colors.white }]}>
                  Z-Raporu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tarih Aralığı */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>Tarih Aralığı:</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                  {tempFilters.startDate || 'Başlangıç'}
                </Text>
              </View>
              <Text style={[textStyles.caption, { color: colors.textSecondary, marginHorizontal: spacing.xs }]}>-</Text>
              <View style={styles.dateInput}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                  {tempFilters.endDate || 'Bitiş'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tutar Aralığı */}
          <View style={styles.filterRow}>
            <Text style={[textStyles.labelSmall, { color: colors.textSecondary }]}>Tutar Aralığı:</Text>
            <View style={styles.dateRow}>
              <View style={styles.amountInput}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                  {tempFilters.minAmount || 'Min'}
                </Text>
              </View>
              <Text style={[textStyles.caption, { color: colors.textSecondary, marginHorizontal: spacing.xs }]}>-</Text>
              <View style={styles.amountInput}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
                  {tempFilters.maxAmount || 'Max'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.filterActions}>
            <Button title="Temizle" variant="ghost" onPress={clearFilters} />
            <Button 
              title="Uygula" 
              variant="gradient" 
              onPress={applyFilters}
              style={{ marginLeft: spacing.sm }}
            />
          </View>
        </View>
      )}

      {/* Receipt List */}
      <FlatList
        data={filteredReceipts}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              flex: 1,
              opacity: 1,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [
                      -1,
                      0,
                      index * 100,
                      (index + 2) * 100,
                    ],
                    outputRange: [0, 0, 0, 0],
                  }),
                },
              ],
            }}
          >
            <SafeReceiptCard receipt={item} onPress={handleReceiptPress} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        numColumns={numColumns}
        key={`grid-${numColumns}`}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      />

      {/* Modals */}
      <ConfirmDialog />
      <FirmaSelector />
      <DemoInfoModal />
      <Drawer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: spacing.md,
    paddingBottom: 100, // TabBar için boşluk
    maxWidth: getContainerWidth() as any,
    alignSelf: 'center',
    width: '100%',
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  quickFilters: {
    paddingVertical: responsiveSpacing(spacing.xs),
    maxWidth: getContainerWidth() as any,
    alignSelf: 'center',
    width: '100%',
  },
  quickFilterScrollContent: {
    paddingHorizontal: responsiveSpacing(spacing.md),
  },
  quickFilterChip: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xs),
    borderRadius: moderateScale(16),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    marginRight: spacing.xs,
  },
  quickFilterText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: '#666',
  },
  filterPanel: {
    padding: responsiveSpacing(spacing.md),
    borderBottomWidth: 1,
    maxWidth: getContainerWidth() as any,
    alignSelf: 'center',
    width: '100%',
  },
  filterRow: {
    marginBottom: responsiveSpacing(spacing.sm),
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xs),
    borderRadius: moderateScale(16),
    backgroundColor: '#F0F0F0',
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  filterChipText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#333',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateInput: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(8),
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amountInput: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(8),
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
