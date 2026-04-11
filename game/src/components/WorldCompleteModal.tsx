/**
 * World completion celebration modal.
 * Shown when a player completes all levels in a world.
 * Shows clear or perfect rewards.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorldReward } from '../game/rewards/WorldRewards';
import { GameIcon } from './GameIcon';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { COLORS, RADII, SPACING } from '../utils/constants';

interface WorldCompleteModalProps {
  visible: boolean;
  reward: WorldReward | null;
  isPerfect: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export const WorldCompleteModal: React.FC<WorldCompleteModalProps> = ({
  visible,
  reward,
  isPerfect,
  onClaim,
  onClose,
}) => {
  if (!reward) return null;

  const rewardData = isPerfect ? reward.perfectReward : reward.clearReward;

  return (
    <Modal visible={visible} onClose={onClose} dismissable>
      {/* World icon */}
      <View style={[styles.iconCircle, { borderColor: reward.worldColor }]}>
        <GameIcon name={reward.worldIcon as any} size={36} color={reward.worldColor} />
      </View>

      <Text style={styles.title}>
        {isPerfect ? 'World Perfected!' : 'World Complete!'}
      </Text>
      <Text style={[styles.worldName, { color: reward.worldColor }]}>
        {reward.worldName}
      </Text>

      {isPerfect && (
        <View style={styles.perfectBadge}>
          <GameIcon name="star" size={12} color={COLORS.accentGold} />
          <Text style={styles.perfectText}>All 50 Levels 3-Starred</Text>
          <GameIcon name="star" size={12} color={COLORS.accentGold} />
        </View>
      )}

      {/* Rewards */}
      <View style={styles.rewardCard}>
        <Text style={styles.rewardTitle}>REWARDS</Text>
        <View style={styles.rewardRow}>
          <GameIcon name="coin" size={16} />
          <Text style={styles.rewardValue}>+{rewardData.coins}</Text>
        </View>
        <View style={styles.rewardRow}>
          <GameIcon name="gem" size={16} />
          <Text style={styles.rewardValue}>+{rewardData.gems}</Text>
        </View>
        {isPerfect && (
          <>
            <View style={styles.rewardRow}>
              <GameIcon name="bomb" size={16} />
              <Text style={styles.rewardValue}>+{reward.perfectReward.powerUps.bomb} Bombs</Text>
            </View>
            <View style={styles.rewardRow}>
              <GameIcon name="lightning" size={16} />
              <Text style={styles.rewardValue}>+{reward.perfectReward.powerUps.rowClear} Row Clears</Text>
            </View>
            <View style={styles.rewardRow}>
              <GameIcon name="palette" size={16} />
              <Text style={styles.rewardValue}>+{reward.perfectReward.powerUps.colorClear} Color Clears</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Button title="Claim!" onPress={onClaim} variant="primary" size="large" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: `${COLORS.surface}80`,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  worldName: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${COLORS.accentGold}15`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 12,
  },
  perfectText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentGold,
    letterSpacing: 0.5,
  },
  rewardCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.lg,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accentGold,
  },
  actions: {
    alignItems: 'center',
  },
});
