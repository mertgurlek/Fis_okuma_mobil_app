/**
 * Drawer Component - Soldan Açılan Sidebar
 * Modern navigation ve yönetim menüsü
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useAuth, useFirma } from '@hooks';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  gradients,
} from '@theme';
import { useUIStore } from '@store';
import { UserType } from '@types';
import { canViewTaxpayerReceipts } from '../../utils/permissions';

const spacing = spacingSystem.spacing;

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  badge?: string;
}

export const Drawer: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout, isDemo } = useAuth();
  const { selectedFirma, firmaList } = useFirma();
  const { modals, hideModal, showModal } = useUIStore();

  const isVisible = modals.drawer || false;
  const slideAnim = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    hideModal('drawer' as any);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'receipts',
      title: 'Fişlerim',
      icon: '📄',
      route: '/(tabs)',
    },
    {
      id: 'new-receipt',
      title: 'Yeni Fiş',
      icon: '➕',
      route: '/(tabs)/new-receipt',
    },
    // Mükellef Fişleri - Sadece müşavirler görebilir
    ...(canViewTaxpayerReceipts(user) ? [{
      id: 'taxpayer-receipts',
      title: 'Mükellef Fişleri',
      icon: '📥',
      route: '/taxpayer-receipts',
    }] : []),
    {
      id: 'batch-approve',
      title: 'Seri Onay',
      icon: '✓',
      route: '/batch-approve',
    },
    {
      id: 'account',
      title: 'Hesabım',
      icon: '👤',
      route: '/(tabs)/account',
    },
    {
      id: 'firmas',
      title: 'Firmalar',
      icon: '🏢',
      route: '/firmas',
    },
    {
      id: 'users',
      title: 'Kullanıcılar',
      icon: '👥',
      route: '/users',
    },
    {
      id: 'divider-2',
      title: '',
      icon: '',
    },
    {
      id: 'help',
      title: 'Yardım & Destek',
      icon: '❓',
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      icon: '⚙️',
      route: '/settings',
    },
    {
      id: 'logout',
      title: 'Çıkış Yap',
      icon: '🚪',
      action: handleLogout,
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.id.startsWith('divider')) return;
    
    if (item.action) {
      item.action();
    } else if (item.route) {
      handleClose();
      router.push(item.route as any);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Drawer Panel - SOLDA */}
        <Animated.View 
          style={[
            styles.drawerPanel, 
            { backgroundColor: colors.surface },
            elevation[5],
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={gradients.primaryLight}
            style={styles.header}
          >
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, textStyles.labelLarge, { color: colors.white }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={[styles.userEmail, textStyles.caption, { color: 'rgba(255,255,255,0.9)' }]}>
                  {user?.email || user?.username}
                </Text>
                {isDemo && (
                  <View style={styles.demoBadge}>
                    <Text style={[styles.demoText, textStyles.caption]}>
                      🎭 Demo
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Selected Firma */}
            {selectedFirma && (
              <View style={styles.firmaInfo}>
                <Text style={[styles.firmaLabel, textStyles.caption, { color: 'rgba(255,255,255,0.7)' }]}>
                  Aktif Firma
                </Text>
                <Text style={[styles.firmaName, textStyles.labelSmall, { color: colors.white }]}>
                  {selectedFirma.shortName}
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
              if (item.id.startsWith('divider')) {
                return (
                  <View
                    key={item.id}
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                );
              }

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    item.id === 'logout' && { backgroundColor: 'rgba(235, 87, 87, 0.1)' },
                  ]}
                  onPress={() => handleMenuPress(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.menuTitle,
                      textStyles.body,
                      {
                        color: item.id === 'logout' ? colors.error : colors.textPrimary,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.badgeText, { color: colors.white }]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.version, textStyles.caption, { color: colors.textTertiary }]}>
              Fiş Okuma v1.0.0
            </Text>
          </View>
        </Animated.View>

        {/* Backdrop - SAĞDA */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  drawerPanel: {
    width: 280,
    maxWidth: '80%',
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#FFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    marginBottom: 4,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  demoText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  firmaInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.sm,
    borderRadius: moderateScale(8),
  },
  firmaLabel: {
    marginBottom: 2,
  },
  firmaName: {
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    fontSize: moderateScale(20),
    marginRight: spacing.sm,
    width: 30,
  },
  menuTitle: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  version: {},
});

export default Drawer;
