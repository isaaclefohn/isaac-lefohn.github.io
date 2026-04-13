/**
 * Mystery Shop.
 * A rotating shop of random premium offers that refreshes every 4 hours.
 * Items are seeded by time bucket, so all players see the same offers
 * simultaneously. Deals include coin packs, power-up bundles, and rare items.
 */

export type MysteryItemKind =
  | 'coin_pack'
  | 'gem_pack'
  | 'power_bundle'
  | 'mystery_box'
  | 'energy_refill'
  | 'vip_day';

export interface MysteryItem {
  id: string;
  kind: MysteryItemKind;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Base cost in coins (overridden if currency = 'gems') */
  cost: number;
  currency: 'coins' | 'gems';
  /** Savings %, purely for display */
  discount: number;
  /** Rewards when purchased */
  reward: {
    coins?: number;
    gems?: number;
    bomb?: number;
    rowClear?: number;
    colorClear?: number;
    vipDurationMs?: number;
  };
}

/** Refresh the shop every 4 hours */
export const MYSTERY_SHOP_REFRESH_MS = 4 * 60 * 60 * 1000;

/** Pool of possible items the shop can roll */
const MYSTERY_POOL: MysteryItem[] = [
  {
    id: 'coin_small',
    kind: 'coin_pack',
    name: 'Coin Pouch',
    description: '+500 coins',
    icon: 'coin',
    color: '#FBBF24',
    cost: 20,
    currency: 'gems',
    discount: 40,
    reward: { coins: 500 },
  },
  {
    id: 'coin_large',
    kind: 'coin_pack',
    name: 'Coin Vault',
    description: '+2,000 coins',
    icon: 'coin',
    color: '#F59E0B',
    cost: 60,
    currency: 'gems',
    discount: 50,
    reward: { coins: 2000 },
  },
  {
    id: 'gem_mini',
    kind: 'gem_pack',
    name: 'Gem Handful',
    description: '+25 gems',
    icon: 'gem',
    color: '#A78BFA',
    cost: 1500,
    currency: 'coins',
    discount: 35,
    reward: { gems: 25 },
  },
  {
    id: 'power_trio',
    kind: 'power_bundle',
    name: 'Power Trio',
    description: '2 of each power-up',
    icon: 'bomb',
    color: '#F87171',
    cost: 800,
    currency: 'coins',
    discount: 45,
    reward: { bomb: 2, rowClear: 2, colorClear: 2 },
  },
  {
    id: 'bomb_stash',
    kind: 'power_bundle',
    name: 'Bomb Stash',
    description: '5 bombs, 1 row clear',
    icon: 'bomb',
    color: '#EF4444',
    cost: 30,
    currency: 'gems',
    discount: 50,
    reward: { bomb: 5, rowClear: 1 },
  },
  {
    id: 'color_cache',
    kind: 'power_bundle',
    name: 'Color Cache',
    description: '3 color clears',
    icon: 'palette',
    color: '#EC4899',
    cost: 40,
    currency: 'gems',
    discount: 40,
    reward: { colorClear: 3 },
  },
  {
    id: 'mystery_box_small',
    kind: 'mystery_box',
    name: 'Small Mystery Box',
    description: 'Random goodies',
    icon: 'gift',
    color: '#34D399',
    cost: 500,
    currency: 'coins',
    discount: 30,
    reward: { coins: 200, gems: 5, bomb: 1 },
  },
  {
    id: 'mystery_box_large',
    kind: 'mystery_box',
    name: 'Grand Mystery Box',
    description: 'Jackpot bundle',
    icon: 'gift',
    color: '#10B981',
    cost: 100,
    currency: 'gems',
    discount: 55,
    reward: { coins: 1500, gems: 20, bomb: 3, rowClear: 2, colorClear: 1 },
  },
  {
    id: 'vip_one_day',
    kind: 'vip_day',
    name: 'VIP Day Pass',
    description: '24 hours of VIP',
    icon: 'crown',
    color: '#FACC15',
    cost: 25,
    currency: 'gems',
    discount: 30,
    reward: { vipDurationMs: 24 * 60 * 60 * 1000 },
  },
];

/** Deterministic xorshift-style hash for shuffling */
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

/** Returns a 4-hour time bucket seed (unique per refresh interval) */
export function getCurrentBucketSeed(now: number = Date.now()): number {
  return Math.floor(now / MYSTERY_SHOP_REFRESH_MS);
}

/** Generate the 4 items in the current rotation */
export function getMysteryShopItems(now: number = Date.now()): MysteryItem[] {
  const seed = getCurrentBucketSeed(now);
  const rng = mulberry32(seed * 7919 + 13);

  // Fisher-Yates on a copy
  const pool = [...MYSTERY_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}

/** Milliseconds until the next shop refresh */
export function getShopRefreshCountdown(now: number = Date.now()): number {
  const bucket = getCurrentBucketSeed(now);
  const nextBucketStart = (bucket + 1) * MYSTERY_SHOP_REFRESH_MS;
  return Math.max(0, nextBucketStart - now);
}

/** Format a countdown in ms to "Hh Mm" */
export function formatCountdown(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return `${hours}h ${mins}m`;
}
