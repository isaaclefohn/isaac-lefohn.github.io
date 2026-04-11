/**
 * Combo chain scoring system.
 * Rewards consecutive line clears with escalating multipliers.
 * The "chain" resets when a piece is placed without clearing any lines.
 *
 * Chain levels:
 *   2x combo: 1.5x score multiplier
 *   3x combo: 2.0x
 *   4x combo: 2.5x
 *   5x combo: 3.0x (FEVER mode)
 *   6x+ combo: 3.5x
 *
 * Chain bonuses stack with other multipliers (events, etc.)
 */

export interface ComboChainState {
  chain: number;
  multiplier: number;
  label: string;
  color: string;
  isFever: boolean;
}

export const COMBO_THRESHOLDS: { minChain: number; multiplier: number; label: string; color: string }[] = [
  { minChain: 2, multiplier: 1.5, label: 'Nice!', color: '#4ADE80' },
  { minChain: 3, multiplier: 2.0, label: 'Great!', color: '#60A5FA' },
  { minChain: 4, multiplier: 2.5, label: 'Amazing!', color: '#C084FC' },
  { minChain: 5, multiplier: 3.0, label: 'FEVER!', color: '#FACC15' },
  { minChain: 6, multiplier: 3.5, label: 'UNSTOPPABLE!', color: '#FF4500' },
];

/** Get the current combo chain state */
export function getComboChainState(chain: number): ComboChainState {
  if (chain < 2) {
    return { chain, multiplier: 1, label: '', color: '', isFever: false };
  }

  // Find highest matching threshold
  let matched = COMBO_THRESHOLDS[0];
  for (const threshold of COMBO_THRESHOLDS) {
    if (chain >= threshold.minChain) {
      matched = threshold;
    }
  }

  return {
    chain,
    multiplier: matched.multiplier,
    label: matched.label,
    color: matched.color,
    isFever: chain >= 5,
  };
}

/** Calculate bonus points from a combo chain */
export function getComboBonus(baseScore: number, chain: number): number {
  const state = getComboChainState(chain);
  if (state.multiplier <= 1) return 0;
  return Math.round(baseScore * (state.multiplier - 1));
}

/** Get XP bonus for maintaining a long combo */
export function getComboXPBonus(chain: number): number {
  if (chain < 3) return 0;
  return Math.min(chain * 5, 50); // 15 to 50 XP bonus
}
