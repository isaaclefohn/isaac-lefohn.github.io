/**
 * Offline reward modal.
 * Shows "While you were away" coins earned passively.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OfflineReward } from '../game/rewards/OfflineRewards';
import { GameIcon } from './GameIcon';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { COLORS, RADII, SPACING } from '../utils/constants';

interface OfflineRewardModalProps {
  visible: boolean;
  reward: OfflineReward | null;
  onClaim: () => void;
}

export const OfflineRewardModal: React.FC<OfflineRewardModalProps> = ({
  visible,
  reward,
  onClaim,
}) => {
  if (!reward) return null;

  return (
    <Modal visible={visible} onClose={onClaim} dismissable>
      <View style={styles.iconWrap}>
        <GameIcon name="clock" size={40} color={COLORS.accent} />
      </View>
      <Text style={styles.title}>While You Were Away</Text>
      <Text style={styles.subtitle}>
        {reward.hoursAway >= 1
          ? `You were away for ${reward.hoursAway} hour${reward.hoursAway > 1 ? 's' : ''}`
          : `You were away for ${reward.minutesAway} minutes`}
      </Text>
      <View style={styles.rewardCard}>
        <GameIcon name="coin" size={28} />
        <Text style={styles.rewardAmount}>+{reward.coins}</Text>
      </View>
      <Text style={styles.tip}>Level up to earn more passive coins!</Text>
      <Button title="Collect" onPress={onClaim} variant="primary" size="medium" />
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.lg,
    padding: 16,
    marginBottom: 12,
  },
  rewardAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.accentGold,
  },
  tip: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
});
