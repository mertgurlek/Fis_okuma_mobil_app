/**
 * Hesap Ekranı - Modern Profil Sayfası
 * Responsive, gradient kartlar ve animasyonlu tasarım
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useAuth, useFirma } from '@hooks';
import { TopBar, Button, Switch } from '@components';
import { useAuthStore } from '@store';
import { 
  spacing as spacingSystem, 
  textStyles,
  responsiveSpacing,
  moderateScale,
  getContainerWidth,
  gradients,
  elevation,
} from '@theme';

const spacing = spacingSystem.spacing;

export default function AccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isDemo, logout } = useAuth();
  const { selectedFirma, firmaList } = useFirma();
  const { updateAutoRecharge, updateNotificationSettings } = useAuthStore();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.replace('/(auth)/login');
    }
  };

  const credits = user?.credits;
  const usage = user?.usage;
  const subscription = user?.subscription;
  const settings = user?.settings;

  const getPlanName = (plan?: string) => {
    const plans: { [key: string]: string } = {
      free: 'Ücretsiz',
      basic: 'Temel',
      premium: 'Premium',
      enterprise: 'Kurumsal',
    };
    return plans[plan || 'free'];
  };

  const getStatusName = (status?: string) => {
    const statuses: { [key: string]: string } = {
      active: 'Aktif',
      expired: 'Süresi Dolmuş',
      cancelled: 'İptal Edilmiş',
      trial: 'Deneme',
    };
    return statuses[status || 'trial'];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Hesabım" showFirmaChip />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card - Compact */}
        <LinearGradient
          colors={gradients.primaryLight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.userCard, elevation[2]]}
        >
          <View style={styles.userInfo}>
            <View style={styles.avatarSmall}>
              <Text style={styles.userIconSmall}>👤</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, textStyles.h4, { color: colors.white }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={[styles.userEmail, textStyles.caption, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                {user?.email || user?.username}
              </Text>
            </View>
            {isDemo && (
              <View style={[styles.demoBadge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                <Text style={[styles.demoText, textStyles.caption, { color: colors.white }]}>
                  🎭 Demo
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Grid Layout - 2 Columns */}
        <View style={styles.gridRow}>
          {/* Kontör Bilgileri */}
          <View style={[styles.gridCard, { backgroundColor: colors.surface }, elevation[2]]}>
            <Text style={[styles.cardTitle, textStyles.label, { color: colors.textPrimary }]}>
              💳 Kontör
            </Text>
            <View style={styles.creditCompact}>
              <View style={styles.creditRow}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Kalan</Text>
                <Text style={[textStyles.h3, { color: colors.success, fontWeight: 'bold' }]}>
                  {credits?.remaining || 0}
                </Text>
              </View>
              <View style={[styles.dividerSmall, { backgroundColor: colors.border }]} />
              <View style={styles.creditRow}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Kullanılan</Text>
                <Text style={[textStyles.bodyLarge, { color: colors.textSecondary }]}>
                  {credits?.used || 0}
                </Text>
              </View>
            </View>
            <View style={[styles.progressBarSmall, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${((credits?.used || 0) / (credits?.total || 1)) * 100}%`,
                  }
                ]} 
              />
            </View>
          </View>

          {/* Abonelik */}
          <View style={[styles.gridCard, { backgroundColor: colors.surface }, elevation[2]]}>
            <Text style={[styles.cardTitle, textStyles.label, { color: colors.textPrimary }]}>
              🎯 Abonelik
            </Text>
            <View style={styles.creditCompact}>
              <View style={styles.creditRow}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Plan</Text>
                <Text style={[textStyles.bodyLarge, { color: colors.textPrimary, fontWeight: '600' }]}>
                  {getPlanName(subscription?.plan)}
                </Text>
              </View>
              <View style={[styles.dividerSmall, { backgroundColor: colors.border }]} />
              <View style={styles.creditRow}>
                <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Durum</Text>
                <Text style={[textStyles.bodyLarge, { color: colors.success, fontWeight: '600' }]}>
                  {getStatusName(subscription?.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* İstatistikler - Compact Grid */}
        <View style={[styles.card, { backgroundColor: colors.surface }, elevation[2]]}>
          <Text style={[styles.cardTitle, textStyles.label, { color: colors.textPrimary, marginBottom: responsiveSpacing(spacing.sm) }]}>
            📊 İstatistikler
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[textStyles.h2, { color: colors.primary, fontWeight: 'bold' }]}>
                {usage?.totalReceipts || 0}
              </Text>
              <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Toplam Fiş</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[textStyles.h2, { color: '#27AE60', fontWeight: 'bold' }]}>
                {usage?.monthlyReceipts || 0}
              </Text>
              <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Bu Ay</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[textStyles.h2, { color: '#E67E22', fontWeight: 'bold' }]}>
                {usage?.weeklyReceipts || 0}
              </Text>
              <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Bu Hafta</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[textStyles.h2, { color: '#9B59B6', fontWeight: 'bold' }]}>
                {usage?.dailyAverage?.toFixed(1) || '0.0'}
              </Text>
              <Text style={[textStyles.caption, { color: colors.textTertiary }]}>Günlük Ort.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {}}
          >
            <Text style={[textStyles.button, { color: colors.white, fontSize: moderateScale(13) }]}>
              💳 Kontör Al
            </Text>
          </Pressable>
          {!isDemo && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={() => {}}
            >
              <Text style={[textStyles.button, { color: colors.white, fontSize: moderateScale(13) }]}>
                ⬆️ Paket Yükselt
              </Text>
            </Pressable>
          )}
        </View>

        {/* Ayarlar - Compact */}
        <View style={[styles.card, { backgroundColor: colors.surface }, elevation[2]]}>
          <Text style={[styles.cardTitle, textStyles.label, { color: colors.textPrimary, marginBottom: responsiveSpacing(spacing.xs) }]}>
            ⚙️ Ayarlar
          </Text>
          <Switch
            label="Otomatik Kontör Yenileme"
            description={`${settings?.rechargeThreshold || 0} altında ${settings?.rechargeAmount || 0} kontör ekle`}
            value={settings?.autoRecharge || false}
            onValueChange={updateAutoRecharge}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Switch
            label="Düşük Kontör Bildirimi"
            value={settings?.notifications.lowCredit || false}
            onValueChange={(value) => updateNotificationSettings('lowCredit', value)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Switch
            label="Haftalık Rapor"
            value={settings?.notifications.weeklyReport || false}
            onValueChange={(value) => updateNotificationSettings('weeklyReport', value)}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Çıkış Yap"
            variant="destructive"
            onPress={handleLogout}
            fullWidth
            elevation={true}
          />
        </View>

        {/* Version */}
        <Text style={[styles.version, textStyles.caption, { color: colors.textTertiary }]}>
          v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: responsiveSpacing(spacing.md),
    paddingBottom: 100,
    maxWidth: getContainerWidth(),
    width: '100%',
    alignSelf: 'center',
  },
  // User Card - Compact
  userCard: {
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.md),
    marginBottom: responsiveSpacing(spacing.md),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveSpacing(spacing.sm),
  },
  userIconSmall: {
    fontSize: moderateScale(24),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    marginTop: responsiveSpacing(2),
  },
  demoBadge: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(12),
  },
  demoText: {
    fontWeight: '600',
  },
  // Grid Layout
  gridRow: {
    flexDirection: 'row',
    marginBottom: responsiveSpacing(spacing.md),
  },
  gridCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.md),
    marginHorizontal: responsiveSpacing(spacing.xs),
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  creditCompact: {
    marginVertical: responsiveSpacing(spacing.xs),
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSpacing(spacing.xxs),
  },
  dividerSmall: {
    height: 1,
    marginVertical: responsiveSpacing(spacing.xxs),
  },
  progressBarSmall: {
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    overflow: 'hidden',
    marginTop: responsiveSpacing(spacing.sm),
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(3),
  },
  // Card
  card: {
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.md),
    marginBottom: responsiveSpacing(spacing.md),
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: responsiveSpacing(spacing.sm),
    marginBottom: responsiveSpacing(spacing.sm),
  },
  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    marginBottom: responsiveSpacing(spacing.md),
  },
  actionButton: {
    flex: 1,
    paddingVertical: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: responsiveSpacing(spacing.xs),
  },
  // Divider
  divider: {
    height: 1,
    marginVertical: responsiveSpacing(spacing.xs),
  },
  // Actions
  actions: {
    marginTop: responsiveSpacing(spacing.md),
  },
  version: {
    textAlign: 'center',
    marginTop: responsiveSpacing(spacing.lg),
  },
});
