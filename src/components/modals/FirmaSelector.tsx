/**
 * FirmaSelector Component - Modern Popup Firma Seçim Modal
 * 
 * Centered popup modal ile firma seçimi
 */

import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useFirma } from '@hooks';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  gradients,
} from '@theme';
import { Input } from '@components/forms';
import { useUIStore } from '@store';
import { Firma } from '@types';

const spacing = spacingSystem.spacing;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * FirmaSelector Component
 */
export const FirmaSelector: React.FC = () => {
  const { colors, shadows } = useTheme();
  const { firmaList, recentFirmas, selectedFirma, selectFirma } = useFirma();
  const { modals, hideModal } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const isVisible = modals.firmaSelector;

  // Filtrelenmiş firma listesi
  const filteredFirmas = useMemo(() => {
    if (!searchQuery.trim()) {
      return firmaList;
    }

    const query = searchQuery.toLowerCase();
    return firmaList.filter(
      (firma) =>
        firma.shortName.toLowerCase().includes(query) ||
        firma.unvan.toLowerCase().includes(query) ||
        firma.vkn.includes(query)
    );
  }, [firmaList, searchQuery]);

  const handleSelectFirma = (firma: Firma) => {
    selectFirma(firma);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    hideModal('firmaSelector');
  };

  const renderFirmaItem = ({ item }: { item: Firma }) => {
    const isSelected = selectedFirma?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.firmaItem,
          {
            backgroundColor: isSelected ? `${colors.primaryLight}20` : 'transparent',
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => handleSelectFirma(item)}
      >
        <View style={styles.firmaInfo}>
          <Text
            style={[
              styles.firmaName,
              textStyles.labelLarge,
              { color: colors.textPrimary },
            ]}
          >
            {item.shortName}
          </Text>
          <Text
            style={[
              styles.firmaDetail,
              textStyles.caption,
              { color: colors.textSecondary },
            ]}
          >
            {item.unvan}
          </Text>
          <Text
            style={[
              styles.firmaVkn,
              textStyles.caption,
              { color: colors.textTertiary },
            ]}
          >
            VKN: {item.vkn}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={[styles.modalContainer, elevation[5]]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.gradientContainer}
          >
            {/* Header with Gradient */}
            <LinearGradient
              colors={gradients.primaryLight}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Text style={[styles.title, textStyles.h3, { color: '#FFF' }]}>
                  Firma Seçin
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={[styles.closeText, { color: '#FFF' }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Input
                placeholder="Firma adı veya VKN ile ara"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                variant="outlined"
              />
            </View>

            {/* Recent Firmas */}
            {!searchQuery && recentFirmas.length > 0 && (
              <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                textStyles.labelSmall,
                { color: colors.textSecondary },
              ]}
            >
              SON KULLANILANLAR
            </Text>
                {recentFirmas.map((firma) => {
                  const fullFirma = firmaList.find((f) => f.id === firma.id);
                  if (!fullFirma) return null;
                  return (
                    <View key={firma.id}>
                      {renderFirmaItem({ item: fullFirma })}
                    </View>
                  );
                })}
              </View>
            )}

            {/* All Firmas */}
            <View style={[styles.section, styles.flexSection]}>
              <Text
                style={[
                  styles.sectionTitle,
                  textStyles.labelSmall,
                  { color: colors.textSecondary },
                ]}
              >
                {searchQuery ? 'ARAMA SONUÇLARI' : 'TÜM FİRMALAR'}
              </Text>
              <FlatList
                data={filteredFirmas}
                renderItem={renderFirmaItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={[textStyles.body, { color: colors.textSecondary }]}>
                      {searchQuery
                        ? 'Arama kriterlerine uygun firma bulunamadı'
                        : 'Henüz firma eklenmemiş'}
                    </Text>
                  </View>
                }
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  section: {
    paddingTop: spacing.md,
  },
  flexSection: {
    flex: 1,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  firmaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  firmaInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  firmaName: {
    marginBottom: 2,
    fontWeight: '600',
  },
  firmaDetail: {
    marginBottom: 2,
    fontSize: 12,
  },
  firmaVkn: {
    fontSize: 11,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: spacing.lg,
    alignItems: 'center',
  },
});

export default FirmaSelector;
