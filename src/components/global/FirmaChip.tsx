/**
 * FirmaChip Component - Firma Seçici Chip
 * 
 * Seçili firmayı gösterir ve firma seçim modal'ını açar
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme, useFirma } from '@hooks';
import { spacing, borderRadius, textStyles, chipColors } from '@theme';
import { useUIStore } from '@store';

interface FirmaChipProps {
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * FirmaChip Component
 */
export const FirmaChip: React.FC<FirmaChipProps> = ({
  style,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { selectedFirma } = useFirma();
  const { showModal } = useUIStore();

  if (!selectedFirma) return null;

  const handlePress = () => {
    if (!disabled) {
      showModal('firmaSelector');
    }
  };

  // Firma baş harflerini al
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { 
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          { color: colors.white },
        ]}
        numberOfLines={1}
      >
        {getInitials(selectedFirma.shortName)}
      </Text>
      <Text style={[styles.arrow, { color: colors.white }]}>▼</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 50,
    height: 32,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },
  arrow: {
    fontSize: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default FirmaChip;
