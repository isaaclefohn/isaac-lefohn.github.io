/**
 * Block Mastery modal.
 * Shows mastery progress for each color with tier labels and the total
 * coin bonus the player earns from leveled-up blocks.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import {
  BLOCK_COLORS,
  BLOCK_COLOR_META,
  getMasteryTier,
  getNextMasteryTier,
  getMasteryProgress,
  getTotalMasteryBonus,
} from '../game/systems/BlockMastery';
import { Modal } from './common/Modal';
import { COLORS, RADII } from '../utils/constants';

interface BlockMasteryModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BlockMasteryModal: React.FC<BlockMasteryModalProps> = ({
  visible,
  onClose,
}) => {
  const { blockMastery } = usePlayerStore();
  const totalBonus = getTotalMasteryBonus(blockMastery);

  return (
    <Modal visible={visible} onClose={onClose} dismissable>
      <Text style={styles.title}>Block Mastery</Text>
      <Text style={styles.subtitle}>
        Place blocks to level them up and earn passive coin bonuses
      </Text>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>TOTAL COIN BONUS</Text>
        <Text style={styles.totalValue}>+{totalBonus}%</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {BLOCK_COLORS.map((color) => {
          const xp = blockMastery[color] ?? 0;
          const tier = getMasteryTier(xp);
          const next = getNextMasteryTier(xp);
          const progress = getMasteryProgress(xp);
          const meta = BLOCK_COLOR_META[color];

          return (
            <View key={color} style={[styles.card, { borderColor: meta.hex }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.swatch, { backgroundColor: meta.hex }]} />
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardName}>{meta.name}</Text>
                  <Text style={[styles.tierLabel, { color: meta.hex }]}>
                    {tier.label} • Lv {tier.level}
                  </Text>
                </View>
                <Text style={styles.bonusText}>+{tier.coinBonusPct}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%`, backgroundColor: meta.hex },
                  ]}
                />
              </View>
              <Text style={styles.xpText}>
                {next
                  ? `${xp} / ${next.xpRequired} XP`
                  : `${xp} XP • MAXED`}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  totalBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.accentGold,
  },
  scroll: {
    maxHeight: 380,
    width: '100%',
  },
  scrollContent: {
    gap: 8,
  },
  card: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.md,
    borderLeftWidth: 3,
    padding: 10,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bonusText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.accentGold,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'right',
  },
});
