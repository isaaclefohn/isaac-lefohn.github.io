/**
 * Limited-time event system.
 * Defines score multiplier events, XP boost weekends, etc.
 * Events are date-driven — no server needed. A/B testable via device ID hash.
 */

export type EventType = 'score_multiplier' | 'xp_boost' | 'coin_rush' | 'power_up_sale';

export interface LiveEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  /** Multiplier applied (e.g., 2 for 2x) */
  multiplier: number;
  /** Icon name for display */
  icon: string;
  /** Banner color */
  color: string;
  /** Start time (ISO string) */
  startDate: string;
  /** End time (ISO string) */
  endDate: string;
}

/**
 * Recurring event schedule.
 * Events repeat on a predictable cycle so players can anticipate them.
 * Weekend events: Fri 6pm - Sun 11:59pm (local time)
 * Midweek events: Wed 12am - Wed 11:59pm (local time)
 */
const EVENT_SCHEDULE: LiveEvent[] = [
  {
    id: 'double_score_weekend',
    name: '2x Score Weekend',
    description: 'All level scores are doubled!',
    type: 'score_multiplier',
    multiplier: 2,
    icon: 'star',
    color: '#FACC15',
    startDate: '', // dynamically computed
    endDate: '',
  },
  {
    id: 'xp_boost_midweek',
    name: 'XP Rush Wednesday',
    description: 'Earn 50% more Battle Pass XP!',
    type: 'xp_boost',
    multiplier: 1.5,
    icon: 'lightning',
    color: '#A855F7',
    startDate: '',
    endDate: '',
  },
  {
    id: 'coin_rush_weekend',
    name: 'Coin Rush',
    description: 'Earn 2x coins from all levels!',
    type: 'coin_rush',
    multiplier: 2,
    icon: 'coin',
    color: '#22C55E',
    startDate: '',
    endDate: '',
  },
];

/** Check if a recurring weekend event is active (Friday 6pm - Sunday 11:59pm local) */
function isWeekendEventActive(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const hour = now.getHours();

  if (day === 5 && hour >= 18) return true; // Friday 6pm+
  if (day === 6) return true; // All Saturday
  if (day === 0) return true; // All Sunday
  return false;
}

/** Check if midweek event is active (Wednesday all day) */
function isMidweekEventActive(): boolean {
  const now = new Date();
  return now.getDay() === 3; // Wednesday
}

/** Get which week number of the month it is (1-based) */
function getWeekOfMonth(): number {
  const now = new Date();
  return Math.ceil(now.getDate() / 7);
}

/** Get all currently active events */
export function getActiveEvents(): LiveEvent[] {
  const active: LiveEvent[] = [];
  const weekNum = getWeekOfMonth();

  // Weekend events alternate between score multiplier and coin rush
  if (isWeekendEventActive()) {
    const weekendEvent = weekNum % 2 === 1
      ? EVENT_SCHEDULE[0]  // 2x Score Weekend (odd weeks)
      : EVENT_SCHEDULE[2]; // Coin Rush (even weeks)
    active.push(weekendEvent);
  }

  // Midweek XP boost every Wednesday
  if (isMidweekEventActive()) {
    active.push(EVENT_SCHEDULE[1]);
  }

  return active;
}

/** Get the score multiplier from active events (multiplicative) */
export function getScoreMultiplier(): number {
  const events = getActiveEvents();
  return events
    .filter(e => e.type === 'score_multiplier')
    .reduce((mult, e) => mult * e.multiplier, 1);
}

/** Get the XP multiplier from active events */
export function getXPMultiplier(): number {
  const events = getActiveEvents();
  return events
    .filter(e => e.type === 'xp_boost')
    .reduce((mult, e) => mult * e.multiplier, 1);
}

/** Get the coin multiplier from active events */
export function getCoinMultiplier(): number {
  const events = getActiveEvents();
  return events
    .filter(e => e.type === 'coin_rush')
    .reduce((mult, e) => mult * e.multiplier, 1);
}

/** Check if any event is currently active */
export function hasActiveEvent(): boolean {
  return getActiveEvents().length > 0;
}
