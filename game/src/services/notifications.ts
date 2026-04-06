/**
 * Local push notification service for daily rewards and streak reminders.
 * Uses expo-notifications for scheduling.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Request notification permissions (iOS requires explicit permission) */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/** Schedule a daily reward reminder ~22 hours from now */
export async function scheduleDailyRewardReminder(): Promise<void> {
  // Cancel any existing daily reward notifications first
  await cancelDailyRewardReminder();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your daily reward is ready!',
      body: 'Come back and claim your coins and gems 💎',
      sound: true,
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 22 * 60 * 60, // 22 hours
      repeats: false,
    },
  });
}

/** Schedule a streak reminder for players with active streaks */
export async function scheduleStreakReminder(streakDays: number): Promise<void> {
  await cancelStreakReminder();

  if (streakDays < 2) return; // Only remind if streak is worth protecting

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Don't lose your ${streakDays}-day streak!`,
      body: 'Play a quick game to keep it going 🔥',
      sound: true,
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 20 * 60 * 60, // 20 hours (earlier than daily reward)
      repeats: false,
    },
  });
}

/** Cancel pending daily reward notification */
export async function cancelDailyRewardReminder(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.title?.includes('daily reward')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/** Cancel pending streak notification */
export async function cancelStreakReminder(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.title?.includes('streak')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/** Clear badge count */
export async function clearBadge(): Promise<void> {
  if (Platform.OS === 'ios') {
    await Notifications.setBadgeCountAsync(0);
  }
}
