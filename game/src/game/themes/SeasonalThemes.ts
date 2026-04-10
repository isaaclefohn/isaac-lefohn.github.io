/**
 * Seasonal theme rotation system.
 * Automatically applies themed color palettes based on the current date.
 * Players see seasonal decorations and color shifts without downloading updates.
 */

export interface SeasonalTheme {
  id: string;
  name: string;
  /** Accent color override */
  accent: string;
  /** Gold/highlight color override */
  gold: string;
  /** Block color palette override (7 colors) */
  blocks: string[];
  /** Background tint overlay (subtle) */
  backgroundTint: string;
  /** Icon name for display */
  icon: string;
}

/** Date range for a season (month/day based, repeats yearly) */
interface SeasonWindow {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  theme: SeasonalTheme;
}

const SEASONAL_THEMES: SeasonWindow[] = [
  // Valentine's Day (Feb 1 - Feb 15)
  {
    startMonth: 2, startDay: 1,
    endMonth: 2, endDay: 15,
    theme: {
      id: 'valentines',
      name: "Valentine's",
      accent: '#FF4D8D',
      gold: '#FF69B4',
      blocks: ['#FF4D8D', '#FF69B4', '#E91E63', '#F06292', '#FF80AB', '#CE93D8', '#FF5252'],
      backgroundTint: 'rgba(255, 77, 141, 0.03)',
      icon: 'heart',
    },
  },
  // St. Patrick's Day (Mar 10 - Mar 20)
  {
    startMonth: 3, startDay: 10,
    endMonth: 3, endDay: 20,
    theme: {
      id: 'stpatricks',
      name: "St. Patrick's",
      accent: '#00C853',
      gold: '#76FF03',
      blocks: ['#00C853', '#00E676', '#69F0AE', '#4CAF50', '#81C784', '#A5D6A7', '#66BB6A'],
      backgroundTint: 'rgba(0, 200, 83, 0.03)',
      icon: 'sparkle',
    },
  },
  // Spring (Mar 20 - May 31)
  {
    startMonth: 3, startDay: 20,
    endMonth: 5, endDay: 31,
    theme: {
      id: 'spring',
      name: 'Spring Bloom',
      accent: '#FF6F91',
      gold: '#FFD166',
      blocks: ['#FF6F91', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFDAC1', '#B5EAD7'],
      backgroundTint: 'rgba(255, 111, 145, 0.02)',
      icon: 'sparkle',
    },
  },
  // Summer (Jun 1 - Aug 31)
  {
    startMonth: 6, startDay: 1,
    endMonth: 8, endDay: 31,
    theme: {
      id: 'summer',
      name: 'Summer Vibes',
      accent: '#FF6B2B',
      gold: '#FFD700',
      blocks: ['#FF6B2B', '#00CED1', '#FFD700', '#FF4500', '#20B2AA', '#FFA07A', '#87CEEB'],
      backgroundTint: 'rgba(255, 107, 43, 0.02)',
      icon: 'fire',
    },
  },
  // Halloween (Oct 15 - Nov 2)
  {
    startMonth: 10, startDay: 15,
    endMonth: 11, endDay: 2,
    theme: {
      id: 'halloween',
      name: 'Spooky Season',
      accent: '#FF6600',
      gold: '#9B59B6',
      blocks: ['#FF6600', '#9B59B6', '#2ECC40', '#E74C3C', '#F39C12', '#8E44AD', '#1ABC9C'],
      backgroundTint: 'rgba(155, 89, 182, 0.03)',
      icon: 'sparkle',
    },
  },
  // Holiday Season (Dec 1 - Jan 5)
  {
    startMonth: 12, startDay: 1,
    endMonth: 1, endDay: 5,
    theme: {
      id: 'holiday',
      name: 'Holiday Spirit',
      accent: '#C41E3A',
      gold: '#FFD700',
      blocks: ['#C41E3A', '#228B22', '#FFD700', '#FF6347', '#00CED1', '#FF69B4', '#FFFFFF'],
      backgroundTint: 'rgba(196, 30, 58, 0.03)',
      icon: 'star',
    },
  },
];

/** Check if a date falls within a season window (handles year-wrap for holidays) */
function isInWindow(date: Date, window: SeasonWindow): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateVal = month * 100 + day;

  const startVal = window.startMonth * 100 + window.startDay;
  const endVal = window.endMonth * 100 + window.endDay;

  // Handle year-wrapping (e.g., Dec 1 - Jan 5)
  if (startVal > endVal) {
    return dateVal >= startVal || dateVal <= endVal;
  }

  return dateVal >= startVal && dateVal <= endVal;
}

/** Get the currently active seasonal theme, or null for default */
export function getActiveSeasonalTheme(now: Date = new Date()): SeasonalTheme | null {
  for (const window of SEASONAL_THEMES) {
    if (isInWindow(now, window)) {
      return window.theme;
    }
  }
  return null;
}

/** Get all seasonal themes (for settings/preview) */
export function getAllSeasonalThemes(): SeasonalTheme[] {
  return SEASONAL_THEMES.map(w => w.theme);
}

/** Get the name of the current season */
export function getCurrentSeasonName(now: Date = new Date()): string {
  const theme = getActiveSeasonalTheme(now);
  return theme?.name ?? 'Classic';
}
