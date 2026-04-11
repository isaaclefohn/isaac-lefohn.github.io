/**
 * Bonus round system.
 * After certain milestones, players get a quick bonus round with
 * special conditions for extra rewards.
 *
 * Types:
 * - ColorRush: Board filled with mostly one color, clear as many as possible in 30s
 * - GoldFrenzy: Every clear gives 3x coins for 5 moves
 * - StarShower: Rapid 3-piece levels, get 3 stars on each for bonuses
 * - PowerSurge: Free unlimited power-ups for 3 moves
 */

export type BonusRoundType = 'color_rush' | 'gold_frenzy' | 'star_shower' | 'power_surge';

export interface BonusRoundConfig {
  type: BonusRoundType;
  name: string;
  description: string;
  icon: string;
  color: string;
  durationMoves: number;
  coinMultiplier: number;
  baseReward: number;
}

export const BONUS_ROUNDS: Record<BonusRoundType, BonusRoundConfig> = {
  color_rush: {
    type: 'color_rush',
    name: 'Color Rush',
    description: 'Clear as many same-color blocks as you can!',
    icon: 'palette',
    color: '#C084FC',
    durationMoves: 8,
    coinMultiplier: 2,
    baseReward: 50,
  },
  gold_frenzy: {
    type: 'gold_frenzy',
    name: 'Gold Frenzy',
    description: 'Every clear gives triple coins!',
    icon: 'coin',
    color: '#FACC15',
    durationMoves: 5,
    coinMultiplier: 3,
    baseReward: 75,
  },
  star_shower: {
    type: 'star_shower',
    name: 'Star Shower',
    description: 'Score big in a rapid-fire round!',
    icon: 'star',
    color: '#4ADE80',
    durationMoves: 10,
    coinMultiplier: 1.5,
    baseReward: 40,
  },
  power_surge: {
    type: 'power_surge',
    name: 'Power Surge',
    description: 'Unlimited power-ups for a few moves!',
    icon: 'lightning',
    color: '#60A5FA',
    durationMoves: 3,
    coinMultiplier: 2,
    baseReward: 60,
  },
};

const BONUS_ROUND_TYPES: BonusRoundType[] = ['color_rush', 'gold_frenzy', 'star_shower', 'power_surge'];

/**
 * Check if a bonus round should trigger.
 * Triggers every 15 levels (15, 30, 45...) and not on boss levels.
 */
export function shouldTriggerBonusRound(level: number): boolean {
  if (level <= 0) return false;
  if (level % 25 === 0) return false; // Skip boss levels
  return level % 15 === 0;
}

/** Get which bonus round to show for a given level */
export function getBonusRoundForLevel(level: number): BonusRoundConfig {
  const index = Math.floor(level / 15) % BONUS_ROUND_TYPES.length;
  return BONUS_ROUNDS[BONUS_ROUND_TYPES[index]];
}

/** Calculate bonus round reward based on performance */
export function calculateBonusReward(
  config: BonusRoundConfig,
  linesCleared: number,
  scoreEarned: number,
): { coins: number; gems: number } {
  const baseCoins = config.baseReward;
  const performanceBonus = Math.round(linesCleared * 5 * config.coinMultiplier);
  const scoreBonus = Math.round((scoreEarned / 100) * config.coinMultiplier);

  const totalCoins = baseCoins + performanceBonus + scoreBonus;
  const gems = linesCleared >= 5 ? 2 : linesCleared >= 3 ? 1 : 0;

  return { coins: totalCoins, gems };
}
