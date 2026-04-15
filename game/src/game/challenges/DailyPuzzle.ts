/**
 * Daily Puzzle — one shared seed per calendar day.
 *
 * Every player in the world sees the exact same piece sequence, on the
 * exact same grid, targeting the same score. The run ends when the
 * player can't place any of their current pieces (classic "stuck"
 * failure), at which point their score is locked in and the next
 * attempt isn't available until midnight local time. Great for a daily
 * habit loop and a weekly leaderboard race.
 *
 * The config is marked levelNumber = -2 so the rest of the engine can
 * distinguish it from regular levels (positive), endless (0), and the
 * weekly challenge (-1).
 */

import { LevelConfig } from '../engine/GameLoop';
import { PIECE_POOLS } from '../engine/Piece';
import { hashSeed } from '../../utils/seededRandom';

export const DAILY_PUZZLE_LEVEL_NUMBER = -2;

/** Grid size for the daily puzzle — slightly larger than the 8x8 standard
 *  for more breathing room on a run-until-stuck format. */
const DAILY_GRID_SIZE = 8;

/** Hard-coded score targets for the three star tiers. Tuned to feel
 *  reachable but aspirational; a pro player can routinely 3-star,
 *  while a new player should land 1★ on their first few daily runs. */
const DAILY_STAR_THRESHOLDS: [number, number, number] = [1500, 4000, 8000];

/** Return today's daily puzzle id in YYYY-MM-DD form (local timezone).
 *  Two players in different timezones can legitimately see different
 *  puzzles on the same calendar moment — by design: the daily puzzle
 *  refreshes at local midnight so it fits into each player's routine. */
export function getDailyPuzzleId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Turn a puzzle id into a stable 32-bit seed. */
export function getDailyPuzzleSeed(id: string): number {
  // Parse YYYY-MM-DD and fold into a single integer, then hash to
  // spread the bits so nearby days produce very different piece
  // sequences.
  const [y, m, d] = id.split('-').map(n => parseInt(n, 10));
  const folded = y * 10000 + m * 100 + d;
  return hashSeed(folded, 0xC0DE_D0D0 | 0);
}

/** Build a LevelConfig for today's daily puzzle. */
export function getDailyPuzzleConfig(date: Date = new Date()): LevelConfig {
  const id = getDailyPuzzleId(date);
  const seed = getDailyPuzzleSeed(id);
  return {
    levelNumber: DAILY_PUZZLE_LEVEL_NUMBER,
    gridSize: DAILY_GRID_SIZE,
    objective: { type: 'score', target: DAILY_STAR_THRESHOLDS[2] },
    starThresholds: DAILY_STAR_THRESHOLDS,
    // Use the "medium + hard" piece mix so every shape in the library
    // (including the unorthodox pentominoes) is in rotation.
    piecePool: [...PIECE_POOLS.medium, ...PIECE_POOLS.hard],
    seed,
  };
}

/** Human-readable label for UI — "Daily Puzzle · Apr 15". */
export function getDailyPuzzleLabel(date: Date = new Date()): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/** Reward tuning for completing today's daily run (by star count). */
export const DAILY_COIN_REWARDS: Record<0 | 1 | 2 | 3, number> = {
  0: 25,   // just for showing up
  1: 75,
  2: 150,
  3: 300,
};
export const DAILY_GEM_REWARD_3_STAR = 3;
