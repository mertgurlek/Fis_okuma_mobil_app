/**
 * Switch Component - Modern Toggle Switch
 * Responsive ve animasyonlu toggle switch
 */

import { Switch as RNSwitch, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  textStyles,
  responsiveSpacing,
  moderateScale,
} from '@theme';

const spacing = spacingSystem.spacing;

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.label, 
              textStyles.label, 
              { color: disabled ? colors.textTertiary : colors.textPrimary }
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text 
              style={[
                styles.description, 
                textStyles.caption, 
                { color: colors.textTertiary }
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ 
          false: colors.border, 
          true: colors.primary 
        }}
        thumbColor={value ? colors.white : colors.surface}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveSpacing(spacing.sm),
  },
  textContainer: {
    flex: 1,
    marginRight: responsiveSpacing(spacing.md),
  },
  label: {
    fontWeight: '600',
    marginBottom: responsiveSpacing(spacing.xxs),
  },
  description: {},
});

export default Switch;
