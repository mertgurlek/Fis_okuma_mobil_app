/**
 * Tabs Layout - Modern Tab Navigation
 * Ultra-modern floating tab bar
 */

import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useTheme, useFirma, useAuth } from '@hooks';
import { ModernTabBar, DrawerMenu } from '@components';
import { UserType } from '@types';
import { DrawerProvider, useDrawer } from '../../src/contexts/DrawerContext';

function TabsContent() {
  const { colors } = useTheme();
  const { loadFirmas } = useFirma();
  const { user } = useAuth();
  const { isDrawerOpen, closeDrawer } = useDrawer();

  // Firma listesini uygulama başladığında yükle
  useEffect(() => {
    loadFirmas();
  }, []);

  // Kullanıcı tipine göre hangi tabların gösterileceğini belirle
  const isTaxpayer = user?.userType === UserType.TAXPAYER;
  const isMainUserOrAdvisor = user?.userType === UserType.MAIN_USER || user?.userType === UserType.SUB_ADVISOR;

  return (
    <>
      <Tabs
        tabBar={(props) => <ModernTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Ana Sayfa',
            href: isTaxpayer ? null : undefined, // Mükellef göremez
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Fişler',
          }}
        />
        <Tabs.Screen
          name="new-receipt"
          options={{
            title: 'Yeni Fiş',
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Hesap',
          }}
        />
      </Tabs>
      
      {/* Drawer Menu */}
      <DrawerMenu visible={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}

export default function TabsLayout() {
  return (
    <DrawerProvider>
      <TabsContent />
    </DrawerProvider>
  );
}
