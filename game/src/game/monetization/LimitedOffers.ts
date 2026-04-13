/**
 * Limited-time flash offers.
 * Rotating high-value offers that appear for short windows (2-4 hours)
 * with urgency timers. Proven to convert casual players to paying users
 * by creating FOMO and a clear value anchor.
 *
 * Offers rotate based on a time bucket so all players see the same deal
 * at the same time — this makes them feel like real events.
 */

export type FlashOfferKind =
  | 'coin_mega'
  | 'gem_rush'
  | 'power_fiesta'
  | 'lifesaver'
  | 'master_bundle'
  | 'weekend_special';

export interface FlashOffer {
  id: string;
  kind: FlashOfferKind;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  /** Display discount (percentage) */
  discount: number;
  /** Price in gems for display */
  priceGems: number;
  /** "Original" price for strike-through display */
  originalPriceGems: number;
  /** Offer duration in ms */
  durationMs: number;
  /** Reward payload */
  reward: {
    coins?: number;
    gems?: number;
    bomb?: number;
    rowClear?: number;
    colorClear?: number;
    livesRefill?: boolean;
    vipDurationMs?: number;
  };
}

export const FLASH_OFFERS: FlashOffer[] = [
  {
    id: 'coin_mega',
    kind: 'coin_mega',
    name: 'Mega Coin Blast',
    description: 'Massive coin payout',
    icon: 'coin',
    accentColor: '#FBBF24',
    discount: 70,
    priceGems: 45,
    originalPriceGems: 150,
    durationMs: 3 * 60 * 60 * 1000, // 3h
    reward: { coins: 8000 },
  },
  {
    id: 'gem_rush',
    kind: 'gem_rush',
    name: 'Gem Rush',
    description: 'Double gems + bonus',
    icon: 'gem',
    accentColor: '#A78BFA',
    discount: 60,
    priceGems: 80,
    originalPriceGems: 200,
    durationMs: 4 * 60 * 60 * 1000,
    reward: { gems: 180, coins: 500 },
  },
  {
    id: 'power_fiesta',
    kind: 'power_fiesta',
    name: 'Power Fiesta',
    description: '5 of every power-up',
    icon: 'bomb',
    accentColor: '#F87171',
    discount: 65,
    priceGems: 55,
    originalPriceGems: 155,
    durationMs: 3 * 60 * 60 * 1000,
    reward: { bomb: 5, rowClear: 5, colorClear: 5 },
  },
  {
    id: 'lifesaver',
    kind: 'lifesaver',
    name: 'Lifesaver Pack',
    description: 'Full lives + continues',
    icon: 'shield',
    accentColor: '#EF4444',
    discount: 50,
    priceGems: 25,
    originalPriceGems: 50,
    durationMs: 2 * 60 * 60 * 1000,
    reward: { livesRefill: true, bomb: 2, rowClear: 2 },
  },
  {
    id: 'master_bundle',
    kind: 'master_bundle',
    name: 'Master Bundle',
    description: 'Everything pack',
    icon: 'crown',
    accentColor: '#FACC15',
    discount: 75,
    priceGems: 120,
    originalPriceGems: 475,
    durationMs: 4 * 60 * 60 * 1000,
    reward: {
      coins: 5000,
      gems: 75,
      bomb: 3,
      rowClear: 3,
      colorClear: 3,
      vipDurationMs: 7 * 24 * 60 * 60 * 1000,
    },
  },
  {
    id: 'weekend_special',
    kind: 'weekend_special',
    name: 'Weekend Special',
    description: 'VIP week trial',
    icon: 'sparkle',
    accentColor: '#34D399',
    discount: 55,
    priceGems: 45,
    originalPriceGems: 100,
    durationMs: 4 * 60 * 60 * 1000,
    reward: { vipDurationMs: 7 * 24 * 60 * 60 * 1000, coins: 1000 },
  },
];

/** Flash offer bucket — a new offer rotates in every 4 hours */
export const FLASH_BUCKET_MS = 4 * 60 * 60 * 1000;

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

/** Get the current rotating flash offer */
export function getCurrentFlashOffer(now: number = Date.now()): FlashOffer {
  const bucket = Math.floor(now / FLASH_BUCKET_MS);
  const rng = mulberry32(bucket * 2654435761);
  const idx = Math.floor(rng() * FLASH_OFFERS.length);
  return FLASH_OFFERS[idx];
}

/** Milliseconds until the current flash offer expires and a new one rotates in */
export function getFlashOfferCountdown(now: number = Date.now()): number {
  const bucket = Math.floor(now / FLASH_BUCKET_MS);
  return Math.max(0, (bucket + 1) * FLASH_BUCKET_MS - now);
}

export function getCurrentFlashBucket(now: number = Date.now()): number {
  return Math.floor(now / FLASH_BUCKET_MS);
}
