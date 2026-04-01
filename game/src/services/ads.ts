/**
 * Ad management service for Color Block Blast.
 * Wraps react-native-google-mobile-ads with frequency capping and ad-free detection.
 * Falls back gracefully when ads fail to load.
 */

import { usePlayerStore } from '../store/playerStore';

// Lazy-load the ads SDK to avoid crashes if not configured
let MobileAds: typeof import('react-native-google-mobile-ads').default | null = null;
let RewardedAd: typeof import('react-native-google-mobile-ads').RewardedAd | null = null;
let InterstitialAd: typeof import('react-native-google-mobile-ads').InterstitialAd | null = null;
let AdEventType: typeof import('react-native-google-mobile-ads').AdEventType | null = null;
let RewardedAdEventType: typeof import('react-native-google-mobile-ads').RewardedAdEventType | null = null;

let sdkInitialized = false;

try {
  const ads = require('react-native-google-mobile-ads');
  MobileAds = ads.default;
  RewardedAd = ads.RewardedAd;
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
  RewardedAdEventType = ads.RewardedAdEventType;
} catch {
  // SDK not available — ads will be disabled
}

// Ad unit IDs (env vars with test ID fallbacks)
const REWARDED_AD_ID =
  process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID ?? 'ca-app-pub-3940256099942544/5224354917';
const INTERSTITIAL_AD_ID =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? 'ca-app-pub-3940256099942544/1033173712';

// Frequency caps
const MAX_REWARDED_PER_HOUR = 5;
const INTERSTITIAL_EVERY_N_LEVELS = 3;
const MIN_INTERSTITIAL_INTERVAL_MS = 120_000; // 2 minutes

let rewardedCount = 0;
let rewardedResetTime = Date.now() + 3600_000;
let lastInterstitialTime = 0;
let levelsCompletedSinceAd = 0;

/** Initialize the Mobile Ads SDK. Call once at app startup. */
export async function initializeAds(): Promise<void> {
  if (sdkInitialized || !MobileAds) return;
  try {
    await MobileAds().initialize();
    sdkInitialized = true;
  } catch {
    // Initialization failed — ads stay disabled
  }
}

/** Check if ads should be shown (respects ad-free purchase) */
export function shouldShowAds(): boolean {
  return !usePlayerStore.getState().adFree;
}

/** Track level completion for interstitial pacing */
export function onLevelCompleted(): boolean {
  if (!shouldShowAds()) return false;

  levelsCompletedSinceAd++;
  const now = Date.now();

  if (
    levelsCompletedSinceAd >= INTERSTITIAL_EVERY_N_LEVELS &&
    now - lastInterstitialTime >= MIN_INTERSTITIAL_INTERVAL_MS
  ) {
    levelsCompletedSinceAd = 0;
    lastInterstitialTime = now;
    return true; // Show interstitial
  }

  return false;
}

/** Check if a rewarded ad can be shown (frequency cap) */
export function canShowRewarded(): boolean {
  if (!shouldShowAds()) return false;

  const now = Date.now();
  if (now > rewardedResetTime) {
    rewardedCount = 0;
    rewardedResetTime = now + 3600_000;
  }

  return rewardedCount < MAX_REWARDED_PER_HOUR;
}

/** Record that a rewarded ad was shown */
export function onRewardedShown(): void {
  rewardedCount++;
}

/**
 * Show a rewarded ad. Returns true if the user earned the reward.
 * Returns false if the ad failed to load or user dismissed early.
 */
export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!RewardedAd || !AdEventType || !RewardedAdEventType || !sdkInitialized) {
      resolve(false);
      return;
    }

    const ad = RewardedAd.createForAdRequest(REWARDED_AD_ID);
    let earned = false;

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      ad.show();
    });

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earned = true;
        onRewardedShown();
      }
    );

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      cleanup();
      resolve(earned);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      cleanup();
      resolve(false);
    });

    function cleanup() {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    }

    ad.load();
  });
}

/**
 * Show an interstitial ad. Returns true if shown successfully.
 */
export function showInterstitialAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!InterstitialAd || !AdEventType || !sdkInitialized) {
      resolve(false);
      return;
    }

    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID);

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      ad.show();
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      cleanup();
      resolve(true);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      cleanup();
      resolve(false);
    });

    function cleanup() {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    }

    ad.load();
  });
}

/** Get ad unit IDs */
export function getAdIds() {
  return {
    rewarded: REWARDED_AD_ID,
    interstitial: INTERSTITIAL_AD_ID,
  };
}

/**
 * Reward types that can be granted from watching an ad.
 */
export type AdRewardType = 'coins' | 'extraLife' | 'powerup';

export interface AdReward {
  type: AdRewardType;
  amount: number;
}

/** Standard ad rewards */
export const AD_REWARDS: Record<string, AdReward> = {
  coins: { type: 'coins', amount: 25 },
  extraLife: { type: 'extraLife', amount: 1 },
  powerup: { type: 'powerup', amount: 1 },
};
