/**
 * Feature tile for the home hub grid.
 * Icon-driven button with label — replaces the flat text-only buttons
 * with a visually consistent, investor-demo-ready tile layout.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameIcon, IconName } from './GameIcon';
import { COLORS, RADII } from '../utils/constants';

interface FeatureTileProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  accent?: string;
  badge?: string;
  active?: boolean;
  disabled?: boolean;
}

export const FeatureTile: React.FC<FeatureTileProps> = ({
  icon,
  label,
  onPress,
  accent,
  badge,
  active = false,
  disabled = false,
}) => {
  const tileColor = accent || COLORS.textSecondary;

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        active && { borderColor: `${tileColor}50`, backgroundColor: `${tileColor}10` },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${tileColor}18` }]}>
        <GameIcon name={icon} size={18} color={tileColor} />
      </View>
      <Text style={[styles.label, active && { color: tileColor }]} numberOfLines={1}>
        {label}
      </Text>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: tileColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  disabled: {
    opacity: 0.35,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
