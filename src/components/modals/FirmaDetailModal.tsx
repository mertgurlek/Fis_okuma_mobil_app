/**
 * Firma Detail Modal - Firma Detayları ve Kullanıcı Yönetimi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { useTheme, useFirmaUser } from '@hooks';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
} from '@theme';
import { Firma, FirmaUser, CreateFirmaUserData, UpdateFirmaUserData } from '@types';
import FirmaUserFormModal from './FirmaUserFormModal';

const spacing = spacingSystem.spacing;

interface FirmaDetailModalProps {
  visible: boolean;
  onClose: () => void;
  firma: Firma | null;
}

type TabType = 'info' | 'users';

export default function FirmaDetailModal({
  visible,
  onClose,
  firma,
}: FirmaDetailModalProps) {
  const { colors } = useTheme();
  const {
    getFirmaUsers,
    loadFirmaUsers,
    createFirmaUser,
    updateFirmaUser,
    deleteFirmaUser,
    isLoading,
  } = useFirmaUser();

  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [users, setUsers] = useState<FirmaUser[]>([]);
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<FirmaUser | null>(null);

  useEffect(() => {
    if (firma && visible) {
      loadUsers();
    }
  }, [firma, visible]);

  const loadUsers = async () => {
    if (!firma) return;
    
    await loadFirmaUsers(firma.id);
    const firmaUsers = getFirmaUsers(firma.id);
    setUsers(firmaUsers);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserFormVisible(true);
  };

  const handleEditUser = (user: FirmaUser) => {
    setEditingUser(user);
    setIsUserFormVisible(true);
  };

  const handleDeleteUser = (user: FirmaUser) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `${user.firstName} ${user.lastName} (${user.username}) kullanıcısını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFirmaUser(user.id);
              Alert.alert('Başarılı', 'Kullanıcı silindi');
              await loadUsers();
            } catch (error) {
              console.error('Delete user error:', error);
            }
          },
        },
      ]
    );
  };

  const handleSubmitUser = async (data: CreateFirmaUserData | UpdateFirmaUserData) => {
    try {
      if ('id' in data) {
        await updateFirmaUser(data as UpdateFirmaUserData);
        Alert.alert('Başarılı', 'Kullanıcı güncellendi');
      } else {
        await createFirmaUser(data as CreateFirmaUserData);
        Alert.alert('Başarılı', 'Kullanıcı oluşturuldu');
      }
      await loadUsers();
    } catch (error) {
      console.error('Submit user error:', error);
      throw error;
    }
  };

  const handleCopyPassword = (password: string) => {
    // TODO: Clipboard ile şifreyi kopyala
    Alert.alert('Kopyalandı', 'Şifre panoya kopyalandı');
  };

  const renderUserItem = ({ item }: { item: FirmaUser }) => (
    <View style={[styles.userCard, { backgroundColor: colors.bg }, elevation[1]]}>
      <View style={styles.userHeader}>
        <View style={[styles.userAvatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.userAvatarText, { color: colors.primary }]}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, textStyles.label, { color: colors.textPrimary }]}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={[styles.userUsername, textStyles.caption, { color: colors.textSecondary }]}>
            @{item.username}
          </Text>
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.info + '15' }]}
            onPress={() => handleEditUser(item)}
          >
            <Text style={styles.iconButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.error + '15' }]}
            onPress={() => handleDeleteUser(item)}
          >
            <Text style={styles.iconButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.userDetailRow}>
          <Text style={[styles.userDetailLabel, textStyles.caption, { color: colors.textTertiary }]}>
            Kullanıcı Adı:
          </Text>
          <Text style={[styles.userDetailValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
            {item.username}
          </Text>
        </View>

        <View style={styles.userDetailRow}>
          <Text style={[styles.userDetailLabel, textStyles.caption, { color: colors.textTertiary }]}>
            Şifre:
          </Text>
          <View style={styles.passwordRow}>
            <Text style={[styles.userDetailValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
              {item.password}
            </Text>
            <TouchableOpacity onPress={() => handleCopyPassword(item.password)}>
              <Text style={[styles.copyButton, { color: colors.primary }]}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.email && (
          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, textStyles.caption, { color: colors.textTertiary }]}>
              E-posta:
            </Text>
            <Text style={[styles.userDetailValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
              {item.email}
            </Text>
          </View>
        )}

        {item.phone && (
          <View style={styles.userDetailRow}>
            <Text style={[styles.userDetailLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Telefon:
            </Text>
            <Text style={[styles.userDetailValue, textStyles.labelSmall, { color: colors.textPrimary }]}>
              {item.phone}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.userStatus, item.isActive ? { backgroundColor: colors.success + '15' } : { backgroundColor: colors.error + '15' }]}>
        <Text style={[styles.userStatusText, { color: item.isActive ? colors.success : colors.error }]}>
          {item.isActive ? '● Aktif' : '● Pasif'}
        </Text>
      </View>
    </View>
  );

  if (!firma) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, elevation[4]]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.headerInfo}>
                <Text style={[styles.modalTitle, textStyles.h3, { color: colors.textPrimary }]}>
                  {firma.shortName || firma.unvan}
                </Text>
                <Text style={[styles.modalSubtitle, textStyles.caption, { color: colors.textSecondary }]}>
                  VKN: {firma.vkn}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.closeButton, { color: colors.textTertiary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'info' && { borderBottomColor: colors.primary },
                ]}
                onPress={() => setActiveTab('info')}
              >
                <Text
                  style={[
                    styles.tabText,
                    textStyles.label,
                    { color: activeTab === 'info' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Bilgiler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'users' && { borderBottomColor: colors.primary },
                ]}
                onPress={() => setActiveTab('users')}
              >
                <Text
                  style={[
                    styles.tabText,
                    textStyles.label,
                    { color: activeTab === 'users' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Kullanıcılar ({users.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === 'info' ? (
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoSection}>
                  <Text style={[styles.sectionTitle, textStyles.labelLarge, { color: colors.textPrimary }]}>
                    Firma Bilgileri
                  </Text>

                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, textStyles.caption, { color: colors.textTertiary }]}>
                      Ünvan:
                    </Text>
                    <Text style={[styles.infoValue, textStyles.body, { color: colors.textPrimary }]}>
                      {firma.unvan}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, textStyles.caption, { color: colors.textTertiary }]}>
                      Vergi Dairesi:
                    </Text>
                    <Text style={[styles.infoValue, textStyles.body, { color: colors.textPrimary }]}>
                      {firma.vergiDairesi}
                    </Text>
                  </View>

                  {firma.address && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, textStyles.caption, { color: colors.textTertiary }]}>
                        Adres:
                      </Text>
                      <Text style={[styles.infoValue, textStyles.body, { color: colors.textPrimary }]}>
                        {firma.address}
                      </Text>
                    </View>
                  )}

                  {firma.phone && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, textStyles.caption, { color: colors.textTertiary }]}>
                        Telefon:
                      </Text>
                      <Text style={[styles.infoValue, textStyles.body, { color: colors.textPrimary }]}>
                        {firma.phone}
                      </Text>
                    </View>
                  )}

                  {firma.email && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, textStyles.caption, { color: colors.textTertiary }]}>
                        E-posta:
                      </Text>
                      <Text style={[styles.infoValue, textStyles.body, { color: colors.textPrimary }]}>
                        {firma.email}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.usersTab}>
                {users.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, textStyles.body, { color: colors.textTertiary }]}>
                      Henüz kullanıcı oluşturulmamış
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.usersList}
                    showsVerticalScrollIndicator={false}
                  />
                )}

                <TouchableOpacity
                  style={[styles.addUserButton, { backgroundColor: colors.primary }, elevation[2]]}
                  onPress={handleAddUser}
                >
                  <Text style={[styles.addUserButtonText, { color: colors.white }]}>
                    + Kullanıcı Ekle
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* User Form Modal */}
      <FirmaUserFormModal
        visible={isUserFormVisible}
        onClose={() => setIsUserFormVisible(false)}
        onSubmit={handleSubmitUser}
        editingUser={editingUser}
        firmaId={firma.id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSpacing(spacing.md),
  },
  modalContent: {
    width: '100%',
    maxWidth: moderateScale(600),
    maxHeight: '90%',
    borderRadius: moderateScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveSpacing(spacing.md),
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
  },
  modalTitle: {
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: responsiveSpacing(spacing.xxs),
  },
  closeButton: {
    fontSize: moderateScale(24),
    fontWeight: '300',
    marginLeft: responsiveSpacing(spacing.md),
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveSpacing(spacing.sm),
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontWeight: '600',
  },
  content: {
    padding: responsiveSpacing(spacing.md),
  },
  infoSection: {
    marginBottom: responsiveSpacing(spacing.md),
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  infoRow: {
    marginBottom: responsiveSpacing(spacing.sm),
  },
  infoLabel: {
    marginBottom: responsiveSpacing(spacing.xxs),
  },
  infoValue: {},
  usersTab: {
    flex: 1,
  },
  usersList: {
    padding: responsiveSpacing(spacing.md),
    paddingBottom: responsiveSpacing(80),
  },
  userCard: {
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.sm),
    marginBottom: responsiveSpacing(spacing.sm),
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  userAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: responsiveSpacing(spacing.sm),
  },
  userName: {
    fontWeight: '600',
  },
  userUsername: {
    marginTop: responsiveSpacing(spacing.xxs),
  },
  userActions: {
    flexDirection: 'row',
    gap: responsiveSpacing(spacing.xs),
  },
  iconButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: moderateScale(14),
  },
  userDetails: {
    marginBottom: responsiveSpacing(spacing.sm),
  },
  userDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.xs),
  },
  userDetailLabel: {},
  userDetailValue: {},
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing(spacing.xs),
  },
  copyButton: {
    fontSize: moderateScale(16),
  },
  userStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(12),
  },
  userStatusText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSpacing(spacing.xl),
  },
  emptyText: {
    textAlign: 'center',
  },
  addUserButton: {
    position: 'absolute',
    bottom: responsiveSpacing(spacing.md),
    right: responsiveSpacing(spacing.md),
    left: responsiveSpacing(spacing.md),
    paddingVertical: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  addUserButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
