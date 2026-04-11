/**
 * Power-Up Upgrade system.
 * Players can spend coins/gems to permanently upgrade their power-ups.
 * Each power-up has 5 levels, improving its effectiveness.
 *
 * Bomb: radius 1 → 2 → 2(+diag) → 3 → 3(+diag)
 * Row Clear: 1 row → 2 rows → 3 rows → 1 row+col → 2 rows+cols
 * Color Clear: 1 color → 1 color+bonus → 2 colors → 2+bonus → all+bonus
 */

import { PowerUpType } from './PowerUpManager';

export interface UpgradeLevel {
  level: number;
  name: string;
  description: string;
  coinCost: number;
  gemCost: number;
  effect: string;
}

export interface PowerUpUpgradeConfig {
  type: PowerUpType;
  displayName: string;
  upgrades: UpgradeLevel[];
}

export const POWER_UP_UPGRADES: Record<PowerUpType, PowerUpUpgradeConfig> = {
  bomb: {
    type: 'bomb',
    displayName: 'Bomb',
    upgrades: [
      { level: 1, name: 'Bomb I', description: 'Clears a 3x3 area', coinCost: 0, gemCost: 0, effect: '3x3' },
      { level: 2, name: 'Bomb II', description: 'Clears a 5x5 area', coinCost: 500, gemCost: 5, effect: '5x5' },
      { level: 3, name: 'Bomb III', description: '5x5 + diagonal blast', coinCost: 1200, gemCost: 12, effect: '5x5+diag' },
      { level: 4, name: 'Mega Bomb', description: 'Clears a 7x7 area', coinCost: 3000, gemCost: 25, effect: '7x7' },
      { level: 5, name: 'Ultra Bomb', description: '7x7 + score bonus', coinCost: 6000, gemCost: 50, effect: '7x7+bonus' },
    ],
  },
  rowClear: {
    type: 'rowClear',
    displayName: 'Row Clear',
    upgrades: [
      { level: 1, name: 'Row Clear I', description: 'Clears 1 row', coinCost: 0, gemCost: 0, effect: '1row' },
      { level: 2, name: 'Row Clear II', description: 'Clears 2 rows', coinCost: 400, gemCost: 4, effect: '2rows' },
      { level: 3, name: 'Row Clear III', description: 'Clears 3 rows', coinCost: 1000, gemCost: 10, effect: '3rows' },
      { level: 4, name: 'Cross Clear', description: 'Clears 1 row + 1 column', coinCost: 2500, gemCost: 20, effect: 'cross' },
      { level: 5, name: 'Cross Blast', description: '2 rows + 2 columns', coinCost: 5000, gemCost: 45, effect: 'doublecross' },
    ],
  },
  colorClear: {
    type: 'colorClear',
    displayName: 'Color Clear',
    upgrades: [
      { level: 1, name: 'Color Clear I', description: 'Removes 1 color', coinCost: 0, gemCost: 0, effect: '1color' },
      { level: 2, name: 'Color Clear II', description: '1 color + 50 bonus pts', coinCost: 600, gemCost: 6, effect: '1color+bonus' },
      { level: 3, name: 'Dual Clear', description: 'Removes 2 colors', coinCost: 1500, gemCost: 15, effect: '2colors' },
      { level: 4, name: 'Dual Clear+', description: '2 colors + 100 bonus pts', coinCost: 3500, gemCost: 30, effect: '2colors+bonus' },
      { level: 5, name: 'Spectrum Blast', description: 'Removes all + 200 pts', coinCost: 7000, gemCost: 60, effect: 'all+bonus' },
    ],
  },
};

/** Get the current upgrade info for a power-up type */
export function getUpgradeInfo(type: PowerUpType, currentLevel: number): {
  current: UpgradeLevel;
  next: UpgradeLevel | null;
  maxLevel: number;
} {
  const config = POWER_UP_UPGRADES[type];
  const clampedLevel = Math.max(1, Math.min(currentLevel, config.upgrades.length));
  const current = config.upgrades[clampedLevel - 1];
  const next = clampedLevel < config.upgrades.length ? config.upgrades[clampedLevel] : null;
  return { current, next, maxLevel: config.upgrades.length };
}

/** Check if player can afford the next upgrade */
export function canAffordUpgrade(
  type: PowerUpType,
  currentLevel: number,
  coins: number,
  gems: number,
): boolean {
  const { next } = getUpgradeInfo(type, currentLevel);
  if (!next) return false;
  return coins >= next.coinCost && gems >= next.gemCost;
}
