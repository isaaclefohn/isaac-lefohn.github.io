/**
 * Level replay reward system.
 * Encourages replaying levels for higher mastery by awarding bonus coins
 * when a player improves their score on an already-completed level.
 *
 * Rewards are based on:
 * 1. Score improvement percentage
 * 2. Star improvement (going from 1→2 or 2→3 stars)
 * 3. Mastery rank improvement
 */

import { getMasteryRank, MasteryRank } from '../systems/MasterySystem';

export interface ReplayReward {
  coins: number;
  reason: string;
}

const MASTERY_ORDER: MasteryRank[] = ['none', 'bronze', 'silver', 'gold', 'diamond', 'master'];

/** Coins awarded when reaching a new mastery rank on replay */
const MASTERY_UP_REWARDS: Partial<Record<MasteryRank, number>> = {
  bronze: 5,
  silver: 10,
  gold: 20,
  diamond: 40,
  master: 75,
};

/** Coins awarded for star improvement on replay */
const STAR_IMPROVEMENT_REWARDS: Record<number, number> = {
  1: 5,   // 0→1 or going from lower stars
  2: 10,  // getting 2 stars
  3: 20,  // getting 3 stars
};

/**
 * Calculate replay rewards when replaying an already-completed level.
 * Returns null if no improvement was made.
 */
export function calculateReplayReward(params: {
  newScore: number;
  previousBestScore: number;
  newStars: number;
  previousBestStars: number;
  threeStarThreshold: number;
}): ReplayReward | null {
  const { newScore, previousBestScore, newStars, previousBestStars, threeStarThreshold } = params;

  // Only reward if the player actually improved
  if (newScore <= previousBestScore && newStars <= previousBestStars) return null;

  let totalCoins = 0;
  const reasons: string[] = [];

  // Star improvement bonus
  if (newStars > previousBestStars) {
    const starBonus = STAR_IMPROVEMENT_REWARDS[newStars] ?? 0;
    if (starBonus > 0) {
      totalCoins += starBonus;
      reasons.push(`${newStars}-star upgrade`);
    }
  }

  // Mastery rank improvement bonus
  if (threeStarThreshold > 0) {
    const prevMastery = getMasteryRank(previousBestScore, threeStarThreshold);
    const newMastery = getMasteryRank(newScore, threeStarThreshold);
    const prevIdx = MASTERY_ORDER.indexOf(prevMastery);
    const newIdx = MASTERY_ORDER.indexOf(newMastery);
    if (newIdx > prevIdx) {
      const masteryBonus = MASTERY_UP_REWARDS[newMastery] ?? 0;
      if (masteryBonus > 0) {
        totalCoins += masteryBonus;
        reasons.push(`${newMastery} mastery`);
      }
    }
  }

  // Score improvement percentage bonus (small bonus for beating personal best)
  if (newScore > previousBestScore && previousBestScore > 0) {
    const improvementPercent = ((newScore - previousBestScore) / previousBestScore) * 100;
    if (improvementPercent >= 10) {
      const scoreBonus = Math.min(Math.round(improvementPercent / 5), 25);
      totalCoins += scoreBonus;
      reasons.push('new high score');
    }
  }

  if (totalCoins <= 0) return null;

  return {
    coins: totalCoins,
    reason: reasons.join(' + '),
  };
}
