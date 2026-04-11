/**
 * Monthly login calendar with progressive daily rewards.
 * Players check in each day to claim rewards from a 28-day calendar.
 * Missing days skip ahead — no backfilling, but streak bonus if consecutive.
 *
 * Every 7th day is a "big reward" day.
 * Day 28 gives a premium reward (gems + rare power-up combo).
 */

export interface CalendarDay {
  day: number;
  coins: number;
  gems: number;
  powerUp?: 'bomb' | 'rowClear' | 'colorClear';
  powerUpCount?: number;
  isBigDay: boolean;
  isGrandFinale: boolean;
}

/** Generate the 28-day login calendar */
export function getLoginCalendar(): CalendarDay[] {
  const calendar: CalendarDay[] = [];

  for (let day = 1; day <= 28; day++) {
    const isBigDay = day % 7 === 0;
    const isGrandFinale = day === 28;

    let coins = 10 + Math.floor(day / 3) * 5;
    let gems = 0;
    let powerUp: CalendarDay['powerUp'] = undefined;
    let powerUpCount = 0;

    if (isBigDay) {
      // Big days: 7, 14, 21
      coins = day * 5;
      gems = Math.floor(day / 7) * 3;
      if (day >= 14) {
        powerUp = day === 14 ? 'bomb' : 'rowClear';
        powerUpCount = Math.floor(day / 14);
      }
    }

    if (isGrandFinale) {
      // Day 28: Grand prize
      coins = 250;
      gems = 15;
      powerUp = 'colorClear';
      powerUpCount = 3;
    }

    calendar.push({
      day,
      coins,
      gems,
      powerUp,
      powerUpCount,
      isBigDay,
      isGrandFinale,
    });
  }

  return calendar;
}

/** Check if a login calendar day can be claimed */
export function canClaimCalendarDay(
  calendarDay: number,
  lastClaimedDay: number,
  lastClaimedMonth: string | null,
): boolean {
  const currentMonth = getCurrentMonthId();
  // Reset to day 1 if new month
  if (lastClaimedMonth !== currentMonth) return true;
  // Can claim next day
  return calendarDay > lastClaimedDay;
}

/** Get current month identifier (YYYY-MM) */
export function getCurrentMonthId(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Get the next claimable day */
export function getNextClaimableDay(
  lastClaimedDay: number,
  lastClaimedMonth: string | null,
): number {
  const currentMonth = getCurrentMonthId();
  if (lastClaimedMonth !== currentMonth) return 1;
  return Math.min(lastClaimedDay + 1, 28);
}
