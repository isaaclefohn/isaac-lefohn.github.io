/**
 * Block Mastery system.
 * Each block color gains "mastery" XP as the player places it. Hitting
 * mastery thresholds unlocks passive perks like small coin bonuses for
 * clearing lines containing that color. Rewards collection and long
 * play sessions.
 */

export type BlockColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink';

export interface BlockMasteryTier {
  level: number;
  xpRequired: number;
  coinBonusPct: number;
  label: string;
}

export const MASTERY_TIERS: BlockMasteryTier[] = [
  { level: 0, xpRequired: 0, coinBonusPct: 0, label: 'Novice' },
  { level: 1, xpRequired: 100, coinBonusPct: 2, label: 'Apprentice' },
  { level: 2, xpRequired: 300, coinBonusPct: 4, label: 'Skilled' },
  { level: 3, xpRequired: 700, coinBonusPct: 6, label: 'Expert' },
  { level: 4, xpRequired: 1500, coinBonusPct: 9, label: 'Master' },
  { level: 5, xpRequired: 3000, coinBonusPct: 12, label: 'Grandmaster' },
];

export const BLOCK_COLORS: BlockColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

export const BLOCK_COLOR_META: Record<BlockColor, { hex: string; name: string }> = {
  red: { hex: '#F87171', name: 'Ruby' },
  orange: { hex: '#FB923C', name: 'Amber' },
  yellow: { hex: '#FACC15', name: 'Citrine' },
  green: { hex: '#4ADE80', name: 'Emerald' },
  blue: { hex: '#60A5FA', name: 'Sapphire' },
  purple: { hex: '#C084FC', name: 'Amethyst' },
  pink: { hex: '#F472B6', name: 'Rose' },
};

/** Return the current mastery tier for a given XP amount */
export function getMasteryTier(xp: number): BlockMasteryTier {
  let current = MASTERY_TIERS[0];
  for (const tier of MASTERY_TIERS) {
    if (xp >= tier.xpRequired) current = tier;
  }
  return current;
}

/** Get the next tier after the current one (or null if maxed) */
export function getNextMasteryTier(xp: number): BlockMasteryTier | null {
  const current = getMasteryTier(xp);
  if (current.level >= MASTERY_TIERS[MASTERY_TIERS.length - 1].level) return null;
  return MASTERY_TIERS[current.level + 1];
}

/** Progress (0-1) from current tier to next */
export function getMasteryProgress(xp: number): number {
  const current = getMasteryTier(xp);
  const next = getNextMasteryTier(xp);
  if (!next) return 1;
  const span = next.xpRequired - current.xpRequired;
  return Math.min(1, (xp - current.xpRequired) / span);
}

/** Sum of all mastery-derived coin bonus percentages (capped at +50%) */
export function getTotalMasteryBonus(
  mastery: Record<BlockColor, number>,
): number {
  let total = 0;
  for (const color of BLOCK_COLORS) {
    total += getMasteryTier(mastery[color] ?? 0).coinBonusPct;
  }
  return Math.min(50, total);
}

/** Returns the global coin multiplier derived from mastery (e.g. 1.25) */
export function getMasteryCoinMultiplier(
  mastery: Record<BlockColor, number>,
): number {
  return 1 + getTotalMasteryBonus(mastery) / 100;
}
