/**
 * Weekly Challenge system.
 * Every week, all players get the same deterministic puzzle board via shared seed.
 * Compete for the highest score on identical boards.
 * Rotates every Monday at 00:00 UTC.
 */

import { LevelConfig } from '../engine/GameLoop';
import { PIECE_POOLS, PieceType } from '../engine/Piece';
import { hashSeed } from '../../utils/seededRandom';

/** Get ISO week number for a date */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Get the Monday start of the current ISO week */
function getWeekStart(date: Date): Date {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d;
}

/** Unique week identifier: "2026-W15" */
export function getCurrentWeekId(now: Date = new Date()): string {
  const week = getISOWeek(now);
  return `${now.getUTCFullYear()}-W${week.toString().padStart(2, '0')}`;
}

/** Milliseconds until the next weekly reset (Monday 00:00 UTC) */
export function getTimeUntilReset(now: Date = new Date()): number {
  const start = getWeekStart(now);
  start.setUTCDate(start.getUTCDate() + 7);
  return start.getTime() - now.getTime();
}

/** Format remaining time as "Xd Xh" */
export function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) return `${days}d ${remainingHours}h`;
  if (remainingHours > 0) return `${remainingHours}h`;
  return '<1h';
}

/** Difficulty rotates weekly: Easy → Medium → Hard → Expert → repeat */
const WEEKLY_DIFFICULTIES: Array<{
  label: string;
  gridSize: number;
  pool: PieceType[];
  scoreTarget: number;
  stars: [number, number, number];
}> = [
  {
    label: 'Easy',
    gridSize: 8,
    pool: PIECE_POOLS.easy,
    scoreTarget: 800,
    stars: [600, 1000, 1500],
  },
  {
    label: 'Medium',
    gridSize: 8,
    pool: PIECE_POOLS.medium,
    scoreTarget: 1500,
    stars: [1200, 2000, 3000],
  },
  {
    label: 'Hard',
    gridSize: 8,
    pool: PIECE_POOLS.hard,
    scoreTarget: 2500,
    stars: [2000, 3500, 5000],
  },
  {
    label: 'Expert',
    gridSize: 10,
    pool: PIECE_POOLS.extreme,
    scoreTarget: 4000,
    stars: [3500, 5500, 8000],
  },
];

export interface WeeklyChallengeInfo {
  weekId: string;
  difficulty: string;
  gridSize: number;
  scoreTarget: number;
  seed: number;
  timeRemaining: number;
}

/** Get the current weekly challenge info */
export function getWeeklyChallengeInfo(now: Date = new Date()): WeeklyChallengeInfo {
  const weekId = getCurrentWeekId(now);
  const week = getISOWeek(now);
  const diffIndex = week % WEEKLY_DIFFICULTIES.length;
  const diff = WEEKLY_DIFFICULTIES[diffIndex];
  const seed = hashSeed(week, now.getUTCFullYear() * 100);

  return {
    weekId,
    difficulty: diff.label,
    gridSize: diff.gridSize,
    scoreTarget: diff.scoreTarget,
    seed,
    timeRemaining: getTimeUntilReset(now),
  };
}

/** Generate a LevelConfig for the current weekly challenge */
export function getWeeklyChallengeConfig(now: Date = new Date()): LevelConfig {
  const week = getISOWeek(now);
  const diffIndex = week % WEEKLY_DIFFICULTIES.length;
  const diff = WEEKLY_DIFFICULTIES[diffIndex];
  const seed = hashSeed(week, now.getUTCFullYear() * 100);

  return {
    levelNumber: -1, // Negative = weekly challenge (not a regular level)
    gridSize: diff.gridSize,
    objective: { type: 'score', target: diff.scoreTarget },
    piecePool: diff.pool,
    starThresholds: diff.stars,
    seed,
  };
}

/** Coin rewards for weekly challenge stars */
export const WEEKLY_COIN_REWARDS = {
  1: 30,
  2: 75,
  3: 150,
} as const;

/** Gem bonus for 3-star weekly completion */
export const WEEKLY_GEM_BONUS = 5;
