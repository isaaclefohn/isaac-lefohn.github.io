/**
 * VIP / Club membership system.
 * Premium monthly-style membership that grants daily perks, bonus
 * rewards, and exclusive UI flair. Activated via an IAP or promo.
 */

export interface VIPPerk {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const VIP_PERKS: VIPPerk[] = [
  {
    id: 'daily_coins',
    label: '+200 Daily Coins',
    description: 'Collect extra coins every day',
    icon: 'coin',
  },
  {
    id: 'daily_gems',
    label: '+5 Daily Gems',
    description: 'Collect bonus gems every day',
    icon: 'gem',
  },
  {
    id: 'xp_boost',
    label: '+50% XP Boost',
    description: 'Level up your battle pass faster',
    icon: 'lightning',
  },
  {
    id: 'coin_boost',
    label: '+25% Coin Rewards',
    description: 'All level coin rewards increased',
    icon: 'coin',
  },
  {
    id: 'extra_lives',
    label: '+2 Lives',
    description: 'Maximum lives increased to 7',
    icon: 'fire',
  },
  {
    id: 'ad_free',
    label: 'Ad Free',
    description: 'Remove all banner and interstitial ads',
    icon: 'shield',
  },
  {
    id: 'exclusive_frame',
    label: 'VIP Avatar Frame',
    description: 'Show off your premium status',
    icon: 'crown',
  },
];

/** VIP subscription durations */
export const VIP_DURATIONS = {
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

/** Check whether VIP is currently active */
export function isVIPActive(vipUntil: number | null, now: number = Date.now()): boolean {
  return vipUntil !== null && vipUntil > now;
}

/** Time remaining in days/hours for display */
export function getVIPTimeRemaining(vipUntil: number | null, now: number = Date.now()): { days: number; hours: number } | null {
  if (!isVIPActive(vipUntil, now) || vipUntil === null) return null;
  const diffMs = vipUntil - now;
  return {
    days: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
    hours: Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
  };
}

/** Apply VIP multiplier to coin rewards when active */
export function getVIPCoinMultiplier(vipUntil: number | null): number {
  return isVIPActive(vipUntil) ? 1.25 : 1.0;
}

/** Apply VIP multiplier to XP when active */
export function getVIPXPMultiplier(vipUntil: number | null): number {
  return isVIPActive(vipUntil) ? 1.5 : 1.0;
}

/** Daily bonus for VIP members */
export function getVIPDailyBonus(): { coins: number; gems: number } {
  return { coins: 200, gems: 5 };
}

/** Can the player claim today's VIP bonus? */
export function canClaimVIPDaily(
  vipUntil: number | null,
  lastClaimedDate: string | null,
  today: string,
): boolean {
  if (!isVIPActive(vipUntil)) return false;
  return lastClaimedDate !== today;
}
