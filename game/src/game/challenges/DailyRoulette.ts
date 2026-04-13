/**
 * Daily Challenge Roulette.
 * Each day the player can spin a roulette wheel for a bonus challenge
 * modifier (e.g., double coins, free power-up). The spin is free but
 * can only be done once per day. Results rotate through a weighted
 * pool seeded by the date.
 */

export type RouletteRewardKind =
  | 'double_coins'
  | 'bonus_coins'
  | 'bonus_gems'
  | 'power_bomb'
  | 'power_row'
  | 'power_color'
  | 'extra_life'
  | 'xp_boost';

export interface RouletteReward {
  kind: RouletteRewardKind;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Relative weight for selection */
  weight: number;
  /** Reward payload */
  payload: {
    coins?: number;
    gems?: number;
    bomb?: number;
    rowClear?: number;
    colorClear?: number;
    lives?: number;
    /** Boost duration in ms (for temporary boosts) */
    boostDurationMs?: number;
  };
}

export const ROULETTE_REWARDS: RouletteReward[] = [
  {
    kind: 'bonus_coins',
    name: 'Coin Rain',
    description: '250 coins',
    icon: 'coin',
    color: '#FBBF24',
    weight: 25,
    payload: { coins: 250 },
  },
  {
    kind: 'power_bomb',
    name: 'Boom!',
    description: '2 bombs',
    icon: 'bomb',
    color: '#F87171',
    weight: 20,
    payload: { bomb: 2 },
  },
  {
    kind: 'power_row',
    name: 'Row Buster',
    description: '1 row clear',
    icon: 'lightning',
    color: '#60A5FA',
    weight: 18,
    payload: { rowClear: 1 },
  },
  {
    kind: 'bonus_gems',
    name: 'Gem Burst',
    description: '10 gems',
    icon: 'gem',
    color: '#A78BFA',
    weight: 15,
    payload: { gems: 10 },
  },
  {
    kind: 'power_color',
    name: 'Rainbow',
    description: '1 color clear',
    icon: 'palette',
    color: '#EC4899',
    weight: 10,
    payload: { colorClear: 1 },
  },
  {
    kind: 'double_coins',
    name: 'Double Time',
    description: '30 min 2x coins',
    icon: 'sparkle',
    color: '#34D399',
    weight: 7,
    payload: { boostDurationMs: 30 * 60 * 1000 },
  },
  {
    kind: 'xp_boost',
    name: 'XP Surge',
    description: '30 min 2x XP',
    icon: 'star',
    color: '#FACC15',
    weight: 5,
    payload: { boostDurationMs: 30 * 60 * 1000 },
  },
];

/** Hash a YYYY-MM-DD string into a 32-bit integer for seeding */
function hashDate(date: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a roulette reward based on today's seeded weighted roll */
export function getTodaysRouletteReward(date: string): RouletteReward {
  const rng = mulberry32(hashDate(date));
  const totalWeight = ROULETTE_REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let roll = rng() * totalWeight;
  for (const reward of ROULETTE_REWARDS) {
    roll -= reward.weight;
    if (roll <= 0) return reward;
  }
  return ROULETTE_REWARDS[0];
}

/** Returns true if the player has already spun today */
export function hasSpunToday(lastSpin: string | null, today: string): boolean {
  return lastSpin === today;
}
