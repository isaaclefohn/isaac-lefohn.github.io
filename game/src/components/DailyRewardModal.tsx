/**
 * Daily reward calendar modal.
 * Shows a 7-day reward track with escalating prizes.
 * Appears on first open each day if reward is available.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { GameIcon } from './GameIcon';
import { DAILY_REWARDS, usePlayerStore } from '../store/playerStore';
import { scheduleDailyRewardReminder } from '../services/notifications';
import { COLORS, RADII, SPACING, SHADOWS } from '../utils/constants';

interface DailyRewardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ visible, onClose }) => {
  const { dailyRewardDay, dailyRewardLastClaimed, claimDailyReward } = usePlayerStore();
  const bounceAnim = useRef(new Animated.Value(0.8)).current;

  const today = new Date().toISOString().split('T')[0];
  const canClaim = dailyRewardLastClaimed !== today;
  const currentDayIndex = dailyRewardDay % DAILY_REWARDS.length;

  useEffect(() => {
    if (visible && canClaim) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: 1.1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0.95, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [visible, canClaim]);

  const handleClaim = () => {
    const reward = claimDailyReward();
    if (reward) {
      // Schedule next daily reward notification
      scheduleDailyRewardReminder().catch(() => {});
      onClose();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} dismissable>
      <View style={styles.header}>
        <GameIcon name="calendar" size={32} color={COLORS.accentGold} />
        <Text style={styles.title}>Daily Rewards</Text>
        <Text style={styles.subtitle}>Day {dailyRewardDay + 1} of 7</Text>
      </View>

      <View style={styles.grid}>
        {DAILY_REWARDS.map((reward, i) => {
          const isCurrent = i === currentDayIndex && canClaim;
          const isClaimed = i < currentDayIndex || (i === currentDayIndex && !canClaim);

          return (
            <Animated.View
              key={i}
              style={[
                styles.dayCard,
                isClaimed && styles.dayCardClaimed,
                isCurrent && styles.dayCardCurrent,
                isCurrent ? { transform: [{ scale: bounceAnim }] } : undefined,
              ]}
            >
              <Text style={[styles.dayLabel, isClaimed && styles.dayLabelClaimed]}>
                Day {i + 1}
              </Text>
              <GameIcon
                name={reward.gems ? 'gem' : reward.powerUp ? 'bomb' : 'coin'}
                size={20}
                color={isClaimed ? COLORS.textMuted : COLORS.accentGold}
              />
              <Text style={[styles.dayReward, isClaimed && styles.dayRewardClaimed]}>
                {reward.coins}
              </Text>
              {reward.gems && (
                <Text style={styles.dayBonus}>+{reward.gems} gems</Text>
              )}
              {isClaimed && (
                <View style={styles.claimedBadge}>
                  <GameIcon name="check" size={12} color={COLORS.success} />
                </View>
              )}
            </Animated.View>
          );
        })}
      </View>

      <Button
        title={canClaim ? 'Claim Reward!' : 'Come Back Tomorrow'}
        onPress={canClaim ? handleClaim : onClose}
        variant={canClaim ? 'primary' : 'ghost'}
        size="medium"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  dayCard: {
    width: 72,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...SHADOWS.small,
  },
  dayCardClaimed: {
    backgroundColor: COLORS.gridEmpty,
    borderColor: COLORS.gridLine,
    opacity: 0.6,
  },
  dayCardCurrent: {
    borderColor: COLORS.accentGold,
    borderWidth: 2,
    backgroundColor: `${COLORS.accentGold}10`,
    shadowColor: COLORS.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  dayLabelClaimed: {
    color: COLORS.textMuted,
  },
  dayReward: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accentGold,
  },
  dayRewardClaimed: {
    color: COLORS.textMuted,
  },
  dayBonus: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.accent,
  },
  claimedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
