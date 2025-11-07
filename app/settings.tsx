/**
 * Ayarlar Ekranı
 * Uygulama ayarları ve tercihler
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@hooks';
import { TopBar, DrawerMenu } from '@components';
import { DrawerProvider, useDrawer } from '../src/contexts/DrawerContext';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
} from '@theme';

const spacing = spacingSystem.spacing;

function SettingsContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const isTablet = width >= 768;
  
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Genel',
      items: [
        {
          id: 'notifications',
          label: 'Bildirimler',
          value: notifications,
          onToggle: setNotifications,
          type: 'switch',
        },
        {
          id: 'autoSync',
          label: 'Otomatik Senkronizasyon',
          value: autoSync,
          onToggle: setAutoSync,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Görünüm',
      items: [
        {
          id: 'darkMode',
          label: 'Koyu Tema',
          value: darkMode,
          onToggle: setDarkMode,
          type: 'switch',
        },
        {
          id: 'fontSize',
          label: 'Yazı Boyutu',
          value: 'Orta',
          type: 'selector',
        },
      ],
    },
    {
      title: 'Veri ve Depolama',
      items: [
        {
          id: 'cacheSize',
          label: 'Önbellek Boyutu',
          value: '45 MB',
          type: 'info',
        },
        {
          id: 'clearCache',
          label: 'Önbelleği Temizle',
          type: 'action',
          action: () => {
            // Clear cache logic
          },
        },
      ],
    },
    {
      title: 'Hakkında',
      items: [
        {
          id: 'version',
          label: 'Versiyon',
          value: '1.0.0',
          type: 'info',
        },
        {
          id: 'privacy',
          label: 'Gizlilik Politikası',
          type: 'link',
        },
        {
          id: 'terms',
          label: 'Kullanım Koşulları',
          type: 'link',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    switch (item.type) {
      case 'switch':
        return (
          <View key={item.id} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[textStyles.body, { color: colors.textPrimary }]}>
              {item.label}
            </Text>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        );
      
      case 'selector':
      case 'link':
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[textStyles.body, { color: colors.textPrimary }]}>
              {item.label}
            </Text>
            <View style={styles.settingValue}>
              {item.value && (
                <Text style={[textStyles.body, { color: colors.textSecondary, marginRight: spacing.xs }]}>
                  {item.value}
                </Text>
              )}
              <Text style={[textStyles.h3, { color: colors.textTertiary }]}>›</Text>
            </View>
          </TouchableOpacity>
        );
      
      case 'action':
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Text style={[textStyles.body, { color: colors.primary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      
      case 'info':
        return (
          <View key={item.id} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[textStyles.body, { color: colors.textPrimary }]}>
              {item.label}
            </Text>
            <Text style={[textStyles.body, { color: colors.textSecondary }]}>
              {item.value}
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar 
        title="Ayarlar" 
        showFirmaChip 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, textStyles.labelLarge, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface }, elevation[1]]}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={[textStyles.caption, { color: colors.textTertiary, textAlign: 'center' }]}>
            Fiş Okuma Uygulaması
          </Text>
          <Text style={[textStyles.caption, { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.xxs }]}>
            © 2024 Tüm hakları saklıdır
          </Text>
        </View>
      </ScrollView>

      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <DrawerProvider>
      <SettingsContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: responsiveSpacing(spacing.md),
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsiveSpacing(spacing.md),
    borderBottomWidth: 1,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: responsiveSpacing(spacing.md),
  },
});
