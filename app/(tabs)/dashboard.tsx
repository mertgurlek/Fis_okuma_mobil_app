/**
 * Dashboard - Ana Ekran
 * Firma istatistikleri ve metrikleri gösterir
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTheme, useReceipt, useFirma } from '@hooks';
import { TopBar } from '@components';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
} from '@theme';
import { ReceiptStatus, ReceiptSource, AdvisorApprovalStatus, ReceiptType } from '@types';

const spacing = spacingSystem.spacing;

interface MetricCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  gradient: string[];
}

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { receipts, loadReceipts, isLoading, updateFilters, resetFilters, createReceipt } = useReceipt();
  const { selectedFirma } = useFirma();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedFirma) {
      loadReceipts(selectedFirma.id);
    }
  }, [selectedFirma]);

  // Kamera izni iste
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Kamera kullanmak için izin vermeniz gerekiyor.');
      return false;
    }
    return true;
  };

  // Galeri izni iste
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeriye erişmek için izin vermeniz gerekiyor.');
      return false;
    }
    return true;
  };

  // Quick action handlers - Kamera ve Galeri
  const handleQuickAction = async (action: any) => {
    const { action: actionType, type } = action;
    
    if (actionType === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Yeni fiş oluştur
        await createReceipt({
          firmaId: selectedFirma?.id || '',
          tarih: new Date().toISOString().split('T')[0],
          fisNo: `PROCESSING-${Date.now()}`,
          vkn: '',
          unvan: 'Analiz ediliyor...',
          imagePath: result.assets[0].uri,
          kdvSatirlari: [],
          toplamKdv: 0,
          toplamTutar: 0,
          fisType: type,
          status: ReceiptStatus.PROCESSING,
        });
        
        Alert.alert('Başarılı', 'Fiş analiz için eklendi.');
      }
    } else if (actionType === 'gallery') {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        // Her seçili görsel için fiş oluştur
        for (const asset of result.assets) {
          await createReceipt({
            firmaId: selectedFirma?.id || '',
            tarih: new Date().toISOString().split('T')[0],
            fisNo: `PROCESSING-${Date.now()}`,
            vkn: '',
            unvan: 'Analiz ediliyor...',
            imagePath: asset.uri,
            kdvSatirlari: [],
            toplamKdv: 0,
            toplamTutar: 0,
            fisType: type,
            status: ReceiptStatus.PROCESSING,
          });
        }
        
        Alert.alert('Başarılı', `${result.assets.length} fiş analiz için eklendi.`);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedFirma) {
      await loadReceipts(selectedFirma.id);
    }
    setRefreshing(false);
  };

  // Bu ay tarihi
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Bu ayki fişleri filtrele
  const thisMonthReceipts = receipts.filter((receipt) => {
    const receiptDate = new Date(receipt.tarih);
    return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
  });

  // Mükelleften gelen fişleri filtrele
  const taxpayerReceipts = thisMonthReceipts.filter((r) => r.source === ReceiptSource.TAXPAYER);
  const taxpayerWaiting = taxpayerReceipts.filter((r) => r.advisorApprovalStatus === AdvisorApprovalStatus.WAITING).length;
  const taxpayerApproved = taxpayerReceipts.filter((r) => r.advisorApprovalStatus === AdvisorApprovalStatus.APPROVED).length;
  const taxpayerTotal = taxpayerReceipts.length;

  // İstatistikler
  const totalThisMonth = thisMonthReceipts.length;
  const approvedThisMonth = thisMonthReceipts.filter((r) => r.status === ReceiptStatus.APPROVED).length;
  const pendingThisMonth = thisMonthReceipts.filter((r) => r.status === ReceiptStatus.VERIFIED).length;
  const processingThisMonth = thisMonthReceipts.filter((r) => r.status === ReceiptStatus.PROCESSING).length;

  // Onaylanmış fişlerden toplam KDV ve Tutar
  const approvedReceipts = thisMonthReceipts.filter((r) => r.status === ReceiptStatus.APPROVED);
  const totalKdv = approvedReceipts.reduce((sum, r) => sum + (r.toplamKdv || 0), 0);
  const totalAmount = approvedReceipts.reduce((sum, r) => sum + (r.toplamTutar || 0), 0);

  // Ortalama fiş tutarı
  const avgAmount = approvedThisMonth > 0 ? totalAmount / approvedThisMonth : 0;

  const metrics: MetricCard[] = [
    {
      title: 'Mükelleften Gelen',
      value: taxpayerTotal,
      subtitle: `${taxpayerApproved} onaylı, ${taxpayerWaiting} bekliyor`,
      icon: '📥',
      color: '#FF6B35',
      gradient: ['#FFF4E6', '#FFE8CC'],
    },
    {
      title: 'Onay Bekleyen',
      value: pendingThisMonth,
      subtitle: 'Bekleyen işlemler',
      icon: '⏳',
      color: '#E67E22',
      gradient: ['#FFF4E6', '#FFE8CC'],
    },
    {
      title: 'Toplam KDV',
      value: `₺${totalKdv.toFixed(2)}`,
      subtitle: `${approvedThisMonth} onaylı fiş`,
      icon: '💰',
      color: '#27AE60',
      gradient: ['#E8F8F0', '#D1F2E0'],
    },
    {
      title: 'Toplam Tutar',
      value: `₺${totalAmount.toFixed(2)}`,
      subtitle: `Ort: ₺${avgAmount.toFixed(2)}`,
      icon: '📊',
      color: '#8E44AD',
      gradient: ['#F4ECF7', '#E8DAEF'],
    },
  ];

  // Hızlı erişim butonları - Kamera ve Galeri
  const quickActions = [
    {
      id: 'receipt-camera',
      title: 'Fiş Kamera',
      icon: '📷',
      type: 'yazar_kasa' as any,
      action: 'camera',
      color: '#4A90E2',
    },
    {
      id: 'receipt-gallery',
      title: 'Fiş Galeri',
      icon: '🖼️',
      type: 'yazar_kasa' as any,
      action: 'gallery',
      color: '#5DADE2',
    },
    {
      id: 'zrapor-camera',
      title: 'Z Raporu Kamera',
      icon: '📷',
      type: 'z_raporu' as any,
      action: 'camera',
      color: '#F39C12',
    },
    {
      id: 'zrapor-gallery',
      title: 'Z Raporu Galeri',
      icon: '🖼️',
      type: 'z_raporu' as any,
      action: 'gallery',
      color: '#F8B739',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Ana Sayfa" showFirmaChip />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Metrics Grid */}
        <View style={styles.metricsSection}>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.metricCardWrapper}
                onPress={() => {
                  if (index === 0) {
                    // Mükelleften Gelen Fişler ekranına git
                    router.push('/taxpayer-receipts' as any);
                  } else if (index === 1) {
                    // Onay Bekleyen fişler
                    updateFilters({ status: [ReceiptStatus.VERIFIED] });
                    router.push('/(tabs)/index' as any);
                  } else {
                    // Diğer kartlar - Fişler sayfasına git
                    resetFilters();
                    router.push('/(tabs)/index' as any);
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <LinearGradient
                    colors={metric.gradient}
                    style={styles.metricIconBg}
                  >
                    <Text style={styles.metricIcon}>{metric.icon}</Text>
                  </LinearGradient>
                  <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>
                    {metric.title}
                  </Text>
                  <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                    {metric.value}
                  </Text>
                  <Text style={[styles.metricSubtitle, { color: colors.textTertiary }]}>
                    {metric.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Hızlı İşlemler
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}10` }]}>
                  <Text style={styles.quickActionIconText}>{action.icon}</Text>
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.textPrimary }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {receipts.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Son İşlemler
              </Text>
              <TouchableOpacity onPress={() => {
                resetFilters();
                router.push('/(tabs)/index' as any);
              }}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  Tümünü Gör
                </Text>
              </TouchableOpacity>
            </View>

            {receipts.slice(0, 3).map((receipt, index) => (
              <TouchableOpacity
                key={receipt.id}
                style={[styles.recentCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/receipt/${receipt.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.recentCardLeft}>
                  <Text style={[styles.recentCompany, { color: colors.textPrimary }]}>
                    {receipt.unvan}
                  </Text>
                  <Text style={[styles.recentDate, { color: colors.textSecondary }]}>
                    {receipt.tarih}
                  </Text>
                </View>
                <View style={styles.recentCardRight}>
                  <Text style={[styles.recentAmount, { color: colors.textPrimary }]}>
                    ₺{receipt.toplamTutar.toFixed(2)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: receipt.status === 'approved' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                      borderWidth: 1,
                      borderColor: receipt.status === 'approved' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(230, 126, 34, 0.2)'
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: receipt.status === 'approved' ? '#27AE60' : '#E67E22' }
                    ]}>
                      {receipt.status === 'approved' ? 'Onaylı' : 'Bekliyor'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: responsiveSpacing(spacing.md) }} />
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
  metricsSection: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingTop: responsiveSpacing(spacing.sm),
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCardWrapper: {
    width: '48%',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  metricCard: {
    padding: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
    minHeight: moderateScale(110),
    justifyContent: 'space-between',
  },
  metricIconBg: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.xs),
  },
  metricIcon: {
    fontSize: moderateScale(18),
  },
  metricTitle: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    marginBottom: responsiveSpacing(spacing.xxs),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: responsiveSpacing(2),
  },
  metricSubtitle: {
    fontSize: moderateScale(9),
    fontWeight: '400',
    lineHeight: moderateScale(11),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  quickActionsSection: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingTop: responsiveSpacing(spacing.md),
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '23%',
    padding: responsiveSpacing(spacing.xs),
    alignItems: 'center',
    borderRadius: moderateScale(10),
    marginBottom: responsiveSpacing(spacing.xs),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.015,
    shadowRadius: 2,
    elevation: 1,
    minHeight: moderateScale(75),
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.xxs),
  },
  quickActionIconText: {
    fontSize: moderateScale(20),
  },
  quickActionTitle: {
    fontSize: moderateScale(9),
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: moderateScale(11),
  },
  recentSection: {
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingTop: responsiveSpacing(spacing.md),
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewAllText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  recentCard: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(10),
    marginBottom: responsiveSpacing(spacing.xs),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.015,
    shadowRadius: 2,
    elevation: 1,
  },
  recentCardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  recentCompany: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: 2,
  },
  recentDate: {
    fontSize: moderateScale(10),
    fontWeight: '400',
  },
  recentCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  recentAmount: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    marginBottom: responsiveSpacing(spacing.xxs),
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(9),
    fontWeight: '600',
  },
});
