/**
 * Drawer Menu - Sol Açılır Menü
 * 
 * Sol taraftan açılan navigasyon menüsü
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useAuth } from '@hooks';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
} from '@theme';

const spacing = spacingSystem.spacing;

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  badge?: number;
  requiresAuth?: boolean;
  userTypes?: string[]; // Hangi kullanıcı tipleri görebilir
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Ana Sayfa',
      icon: '🏠',
      route: '/(tabs)/dashboard',
      userTypes: ['main_user', 'sub_advisor'], // Mükellef görmez
    },
    {
      id: 'receipts',
      title: 'Fişler',
      icon: '📄',
      route: '/(tabs)/index',
    },
    {
      id: 'taxpayer-receipts',
      title: 'Mükellef Fişleri',
      icon: '📥',
      route: '/taxpayer-receipts',
      userTypes: ['main_user', 'sub_advisor'], // Sadece müşavir ve alt müşavir
    },
    {
      id: 'batch-approve',
      title: 'Seri Onay',
      icon: '📋',
      route: '/batch-approve',
      userTypes: ['main_user', 'sub_advisor'], // Ana kullanıcı ve müşavir
    },
    {
      id: 'firmas',
      title: 'Firmalar',
      icon: '🏢',
      route: '/firmas',
      userTypes: ['main_user', 'sub_advisor'], // Ana kullanıcı ve müşavir
    },
    {
      id: 'users',
      title: 'Kullanıcılar',
      icon: '👥',
      route: '/users',
      userTypes: ['main_user'], // Sadece ana kullanıcı
    },
    {
      id: 'new-receipt',
      title: 'Yeni Fiş',
      icon: '➕',
      route: '/(tabs)/new-receipt',
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      icon: '⚙️',
      route: '/settings',
    },
    {
      id: 'account',
      title: 'Hesabım',
      icon: '👤',
      route: '/(tabs)/account',
    },
  ];

  const handleMenuItemPress = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    // Kullanıcı tipi kontrolü
    if (item.userTypes && user?.userType) {
      return item.userTypes.includes(user.userType);
    }
    return true;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Content */}
        <Animated.View
          style={[
            styles.drawerContainer,
            { backgroundColor: colors.bg, transform: [{ translateX: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + 'DD']}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[textStyles.h3, { color: colors.white }]}>
                Menü
              </Text>
              {user && (
                <Text style={[textStyles.caption, { color: colors.white, marginTop: spacing.xxs }]}>
                  {user.email}
                </Text>
              )}
            </View>
          </LinearGradient>

          <ScrollView style={styles.menuScroll}>
            {filteredMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
                onPress={() => handleMenuItemPress(item.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                {item.badge && item.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.error }]}>
                    <Text style={[styles.badgeText, { color: colors.white }]}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </Text>
                  </View>
                )}
                <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[textStyles.caption, { color: colors.textTertiary }]}>
              Fiş Okuma v1.0.0
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: moderateScale(18),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    marginTop: spacing.sm,
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: moderateScale(20),
    marginRight: spacing.sm,
    width: 28,
  },
  menuTitle: {
    flex: 1,
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: moderateScale(24),
    marginLeft: spacing.xs,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
});

export default DrawerMenu;
