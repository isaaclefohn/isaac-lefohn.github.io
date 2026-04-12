/**
 * Local leaderboards.
 * Since this is a local-first game, leaderboards are generated
 * deterministically using the player's seed and skill rating,
 * creating the feel of competing while staying offline.
 */

import { generateFriendCode } from '../social/FriendSystem';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  code: string;
  score: number;
  skillRating: number;
  isPlayer: boolean;
}

const BOT_NAMES = [
  'BlockMaster', 'PuzzleAce', 'ComboKing', 'StarChaser', 'GemHunter',
  'RainbowX', 'NinjaBlock', 'QuickDrop', 'LineGuru', 'TetraPro',
  'ColorWizard', 'GridLord', 'SparkleBot', 'PixelKing', 'MegaClear',
  'PrismPlayer', 'ZenMaster', 'FlashClear', 'ArtisanBlock', 'ElitePuzzle',
  'TurboBlast', 'MysticGrid', 'CrystalAce', 'NeonNinja', 'VoltClear',
];

/** Seeded pseudo-random */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a weekly leaderboard based on player's skill rating.
 * Uses week-based seed so rankings feel fresh each week.
 */
export function generateWeeklyLeaderboard(params: {
  playerName: string;
  playerCode: string;
  playerScore: number;
  playerSR: number;
  weekSeed: number;
}): LeaderboardEntry[] {
  const { playerName, playerCode, playerScore, playerSR, weekSeed } = params;
  const rng = mulberry32(weekSeed);

  const entries: LeaderboardEntry[] = [];

  // Generate 19 bot entries with scores scattered around player's score
  for (let i = 0; i < 19; i++) {
    const botName = BOT_NAMES[Math.floor(rng() * BOT_NAMES.length)];
    const suffix = Math.floor(rng() * 999);
    const name = `${botName}${suffix}`;
    const code = generateFriendCode(name, Math.floor(rng() * 100000));

    // Scores range from 0.3x to 2x player score, biased slightly
    const multiplier = 0.3 + rng() * 1.7;
    const score = Math.max(1, Math.round(playerScore * multiplier));
    const srVariance = (rng() - 0.5) * 200;
    const sr = Math.max(0, Math.round(playerSR + srVariance));

    entries.push({
      rank: 0,
      name,
      code,
      score,
      skillRating: sr,
      isPlayer: false,
    });
  }

  // Add player entry
  entries.push({
    rank: 0,
    name: playerName,
    code: playerCode,
    score: playerScore,
    skillRating: playerSR,
    isPlayer: true,
  });

  // Sort by score descending, assign ranks
  entries.sort((a, b) => b.score - a.score);
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}

/** Get the current week seed (changes every Monday) */
export function getCurrentWeekSeed(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(days / 7);
  return now.getFullYear() * 100 + weekNumber;
}

/** Get medal tier for a given rank */
export function getRankMedal(rank: number): { color: string; label: string } {
  if (rank === 1) return { color: '#FACC15', label: '1st' };
  if (rank === 2) return { color: '#C0C0C0', label: '2nd' };
  if (rank === 3) return { color: '#CD7F32', label: '3rd' };
  if (rank <= 10) return { color: '#60A5FA', label: `${rank}th` };
  return { color: '#94A3B8', label: `${rank}th` };
}

/** Calculate rewards based on final rank */
export function getLeaderboardRewards(rank: number): { coins: number; gems: number } {
  if (rank === 1) return { coins: 1000, gems: 30 };
  if (rank === 2) return { coins: 600, gems: 20 };
  if (rank === 3) return { coins: 400, gems: 15 };
  if (rank <= 5) return { coins: 250, gems: 10 };
  if (rank <= 10) return { coins: 150, gems: 5 };
  if (rank <= 20) return { coins: 75, gems: 2 };
  return { coins: 25, gems: 0 };
}
