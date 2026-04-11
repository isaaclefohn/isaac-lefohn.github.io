/**
 * Offline progress / idle reward system.
 * Awards coins to players based on time away from the game.
 * Encourages daily returns by providing a "while you were away" bonus.
 *
 * Earnings scale with player level (passive income feel).
 * Capped at 8 hours to prevent exploit-feeling huge payouts.
 */

export interface OfflineReward {
  coins: number;
  minutesAway: number;
  hoursAway: number;
  message: string;
}

/** Minimum minutes away before offline reward triggers */
const MIN_AWAY_MINUTES = 30;

/** Maximum hours that count toward offline earnings */
const MAX_AWAY_HOURS = 8;

/** Base coins earned per hour offline */
const BASE_COINS_PER_HOUR = 5;

/** Additional coins per hour per 10 levels completed */
const LEVEL_BONUS_PER_10 = 2;

/**
 * Calculate offline reward based on time away and player level.
 * Returns null if player hasn't been away long enough.
 */
export function calculateOfflineReward(
  lastPlayTimestamp: number,
  nowTimestamp: number,
  highestLevel: number,
): OfflineReward | null {
  const minutesAway = Math.floor((nowTimestamp - lastPlayTimestamp) / (1000 * 60));

  if (minutesAway < MIN_AWAY_MINUTES) return null;

  const hoursAway = Math.min(minutesAway / 60, MAX_AWAY_HOURS);

  // Scale earnings: base + level bonus
  const levelBonus = Math.floor(highestLevel / 10) * LEVEL_BONUS_PER_10;
  const coinsPerHour = BASE_COINS_PER_HOUR + levelBonus;
  const totalCoins = Math.max(1, Math.round(coinsPerHour * hoursAway));

  const wholeHours = Math.floor(hoursAway);
  const message = wholeHours >= 1
    ? `You earned ${totalCoins} coins while away for ${wholeHours}h!`
    : `You earned ${totalCoins} coins while away for ${minutesAway}m!`;

  return {
    coins: totalCoins,
    minutesAway,
    hoursAway: wholeHours,
    message,
  };
}
