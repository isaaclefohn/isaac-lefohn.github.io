/**
 * Starter Pack offer.
 * A one-time limited offer shown to new players. Typically bundled at
 * a heavy discount (e.g., 80% value) to bootstrap spending habits and
 * dramatically improve D1 retention and LTV. The pack unlocks after
 * the player finishes level 3 (so they've seen core gameplay) and
 * disappears once claimed or after 72 hours from first unlock.
 */

export interface StarterPackContents {
  coins: number;
  gems: number;
  bomb: number;
  rowClear: number;
  colorClear: number;
  /** Normal price (in gems or dollars) for reference, creating anchor effect */
  normalValue: number;
  /** Actual price in gems */
  actualPrice: number;
}

export const STARTER_PACK: StarterPackContents = {
  coins: 5000,
  gems: 100,
  bomb: 5,
  rowClear: 3,
  colorClear: 3,
  normalValue: 500, // "$4.99 value"
  actualPrice: 60, // Pay with 60 gems or IAP
};

export const STARTER_PACK_UNLOCK_LEVEL = 3;
export const STARTER_PACK_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours

/** Returns true if the starter pack is currently visible to the player */
export function isStarterPackAvailable(
  unlockedAt: number | null,
  claimed: boolean,
  highestLevel: number,
  now: number = Date.now(),
): boolean {
  if (claimed) return false;
  if (highestLevel < STARTER_PACK_UNLOCK_LEVEL) return false;
  if (unlockedAt === null) return true; // First eligibility
  return now - unlockedAt < STARTER_PACK_DURATION_MS;
}

/** Milliseconds until the starter pack expires */
export function getStarterPackTimeRemaining(
  unlockedAt: number | null,
  now: number = Date.now(),
): number {
  if (unlockedAt === null) return STARTER_PACK_DURATION_MS;
  return Math.max(0, STARTER_PACK_DURATION_MS - (now - unlockedAt));
}
