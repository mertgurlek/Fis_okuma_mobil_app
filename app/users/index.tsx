/**
 * Kullanıcılar Ekranı - Alt Kullanıcı Yönetimi
 * Müşavir ve Mükellefleri yönetme ekranı
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useUsers, useFirma } from '@hooks';
import { TopBar, Button, LoadingSpinner, DrawerMenu } from '@components';
import { DrawerProvider, useDrawer } from '../../src/contexts/DrawerContext';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
  gradients,
} from '@theme';
import {
  SubUser,
  SubUserRole,
  UserStatus,
  SUB_USER_ROLE_LABELS,
  USER_STATUS_LABELS,
} from '@types';

const spacing = spacingSystem.spacing;

function UsersContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { subUsers, isLoading, fetchSubUsers, deleteSubUser, sendPasswordReset } = useUsers();
  const { firmaList } = useFirma();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const [selectedUser, setSelectedUser] = useState<SubUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isTablet = width >= 768;

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const handleDeleteUser = (user: SubUser) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `${user.firstName} ${user.lastName} kullanıcısını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSubUser(user.id);
              Alert.alert('Başarılı', 'Kullanıcı silindi');
            } catch (error) {
              Alert.alert('Hata', 'Kullanıcı silinemedi');
            }
          },
        },
      ]
    );
  };

  const handleSendPassword = async (user: SubUser) => {
    try {
      await sendPasswordReset(user.id);
      Alert.alert('Başarılı', `Şifre ${user.email} adresine gönderildi`);
    } catch (error) {
      Alert.alert('Hata', 'Şifre gönderilemedi');
    }
  };

  const renderUserCard = ({ item }: { item: SubUser }) => {
    const assignedFirmas = firmaList.filter(f => item.assignedFirmaIds.includes(f.id));
    const kontorPercentage = (item.kontorRemaining / item.kontorTotal) * 100;

    return (
      <TouchableOpacity
        style={[styles.userCard, { backgroundColor: colors.surface }, elevation[2]]}
        onPress={() => {
          setSelectedUser(item);
          setShowDetailModal(true);
        }}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {item.firstName[0]}{item.lastName[0]}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, textStyles.labelLarge, { color: colors.textPrimary }]}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={[styles.userEmail, textStyles.caption, { color: colors.textSecondary }]}>
                {item.email}
              </Text>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === UserStatus.ACTIVE
                ? colors.success + '20'
                : colors.textTertiary + '20',
            },
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: item.status === UserStatus.ACTIVE
                  ? colors.success
                  : colors.textSecondary,
              },
            ]}>
              {USER_STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        {/* Role */}
        <View style={styles.roleContainer}>
          <Text style={[styles.roleLabel, textStyles.caption, { color: colors.textTertiary }]}>
            Rol:
          </Text>
          <Text style={[styles.roleValue, textStyles.body, { color: colors.textPrimary }]}>
            {SUB_USER_ROLE_LABELS[item.role]}
          </Text>
        </View>

        {/* Kontör */}
        <View style={styles.kontorContainer}>
          <View style={styles.kontorHeader}>
            <Text style={[styles.kontorLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Kont\u00f6r Durumu
            </Text>
            <Text style={[styles.kontorValue, textStyles.labelLarge, { color: colors.primary }]}>
              {item.kontorRemaining} / {item.kontorTotal}
            </Text>
          </View>
          <View style={[styles.kontorBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.kontorFill,
                {
                  width: `${kontorPercentage}%`,
                  backgroundColor: kontorPercentage > 20 ? colors.success : colors.warning,
                },
              ]}
            />
          </View>
        </View>

        {/* Firmalar */}
        {assignedFirmas.length > 0 && (
          <View style={styles.firmasContainer}>
            <Text style={[styles.firmasLabel, textStyles.caption, { color: colors.textTertiary }]}>
              Atanm\u0131\u015f Firmalar:
            </Text>
            <View style={styles.firmasList}>
              {assignedFirmas.map((firma, index) => (
                <View
                  key={firma.id}
                  style={[styles.firmaChip, { backgroundColor: colors.primary + '15' }]}
                >
                  <Text style={[styles.firmaText, { color: colors.primary }]}>
                    {firma.shortName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info + '15' }]}
            onPress={() => handleSendPassword(item)}
          >
            <Text style={[styles.actionText, { color: colors.info }]}>
              🔑 Şifre Gönder
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + '15' }]}
            onPress={() => handleDeleteUser(item)}
          >
            <Text style={[styles.actionText, { color: colors.error }]}>
              🗑️ Sil
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && subUsers.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <TopBar title="Kullanıcılar" showFirmaChip />
        <LoadingSpinner />
        <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Kullanıcılar" showFirmaChip />

      {/* Header Stats */}
      <LinearGradient
        colors={gradients.primaryLight}
        style={styles.statsHeader}
      >
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.white }]}>
            {subUsers.length}
          </Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Toplam Kullanıcı
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.white }]}>
            {subUsers.filter(u => u.status === UserStatus.ACTIVE).length}
          </Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Aktif
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.white }]}>
            {subUsers.reduce((sum, u) => sum + u.kontorRemaining, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
            Kalan Kont\u00f6r
          </Text>
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={subUsers}
        renderItem={renderUserCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB - Add User */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, elevation[4]]}
        onPress={() => router.push('/users/create')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function UsersScreen() {
  return (
    <DrawerProvider>
      <UsersContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.lg),
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(28),
    fontWeight: '700',
  },
  statLabel: {
    fontSize: moderateScale(12),
    marginTop: spacing.xxs,
  },
  listContent: {
    padding: responsiveSpacing(spacing.md),
    paddingBottom: 100,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  userCard: {
    borderRadius: moderateScale(16),
    padding: responsiveSpacing(spacing.md),
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  userDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  userName: {
    fontWeight: '600',
  },
  userEmail: {
    marginTop: spacing.xxs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  roleLabel: {
    marginRight: spacing.xs,
  },
  roleValue: {
    fontWeight: '600',
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
  firmasContainer: {
    marginBottom: spacing.sm,
  },
  firmasLabel: {
    marginBottom: spacing.xs,
  },
  firmasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  firmaChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: moderateScale(8),
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  firmaText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: spacing.xxs,
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
