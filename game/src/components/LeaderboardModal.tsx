/**
 * Weekly leaderboard modal.
 * Shows a simulated top-20 leaderboard with the player's current position.
 * Tapping an entry could eventually open a friend challenge — for now it's
 * a display-only ranking view.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import {
  generateWeeklyLeaderboard,
  getCurrentWeekSeed,
  getRankMedal,
} from '../game/leaderboards/Leaderboards';
import { generateFriendCode, formatFriendCode } from '../game/social/FriendSystem';
import { GameIcon } from './GameIcon';
import { Modal } from './common/Modal';
import { COLORS, RADII } from '../utils/constants';
import { formatScore } from '../utils/formatters';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ visible, onClose }) => {
  const { displayName, weeklyBestScore, skillRating } = usePlayerStore();

  const playerCode = generateFriendCode(displayName, 42);
  const weekSeed = getCurrentWeekSeed();
  const entries = generateWeeklyLeaderboard({
    playerName: displayName,
    playerCode,
    playerScore: weeklyBestScore,
    playerSR: skillRating,
    weekSeed,
  });

  const playerEntry = entries.find((e) => e.isPlayer);
  const topEntries = entries.slice(0, 20);

  return (
    <Modal visible={visible} onClose={onClose} dismissable>
      <Text style={styles.title}>Weekly Leaderboard</Text>
      <Text style={styles.subtitle}>
        Your rank: #{playerEntry?.rank ?? '—'}
      </Text>

      <ScrollView style={styles.scroll}>
        {topEntries.map((entry) => {
          const medal = getRankMedal(entry.rank);
          return (
            <View
              key={`${entry.code}-${entry.rank}`}
              style={[
                styles.row,
                entry.isPlayer && styles.rowPlayer,
                entry.rank <= 3 && styles.rowTop,
              ]}
            >
              <View style={[styles.rankBadge, { backgroundColor: `${medal.color}20`, borderColor: medal.color }]}>
                <Text style={[styles.rankText, { color: medal.color }]}>
                  {entry.rank}
                </Text>
              </View>
              <View style={styles.nameCol}>
                <Text
                  style={[styles.name, entry.isPlayer && styles.namePlayer]}
                  numberOfLines={1}
                >
                  {entry.name}
                </Text>
                <Text style={styles.code}>{formatFriendCode(entry.code)}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreText}>{formatScore(entry.score)}</Text>
                <View style={styles.srRow}>
                  <GameIcon name="star" size={8} color={COLORS.accent} />
                  <Text style={styles.srText}>{entry.skillRating} SR</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.footer}>Resets every Monday</Text>
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
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    maxHeight: 380,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: RADII.sm,
    marginBottom: 4,
    gap: 10,
    backgroundColor: COLORS.surfaceLight,
  },
  rowPlayer: {
    backgroundColor: `${COLORS.accent}15`,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  rowTop: {
    backgroundColor: `${COLORS.accentGold}10`,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '900',
  },
  nameCol: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  namePlayer: {
    color: COLORS.accent,
  },
  code: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  scoreCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.accentGold,
    fontVariant: ['tabular-nums'],
  },
  srRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  srText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  footer: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.5,
  },
});
